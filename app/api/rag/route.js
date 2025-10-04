
import { NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const qdrant = new QdrantClient({ url: process.env.QDRANT_URL || "http://localhost:6333" });

// Simple embedding function
function generateEmbedding(text) {
  const embedding = new Array(384).fill(0);
  const words = text.toLowerCase().split(/\s+/);
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z0-9]/g, '');
    if (cleanWord.length < 2) return;
    
    let hash = 0;
    for (let i = 0; i < cleanWord.length; i++) {
      hash = ((hash << 5) - hash) + cleanWord.charCodeAt(i);
      hash = hash & hash;
    }
    
    for (let i = 0; i < 3; i++) {
      const modifiedHash = (hash * (i + 1)) % 384;
      const index = Math.abs(modifiedHash) % 384;
      embedding[index] += 0.05;
    }
  });
  
  const textLength = text.length;
  const wordCount = words.length;
  
  embedding[0] = Math.min(textLength / 1000, 1.0);
  embedding[1] = Math.min(wordCount / 200, 1.0);
  
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    return embedding.map(val => val / magnitude);
  }
  
  return Array.from({ length: 384 }, () => (Math.random() - 0.5) * 2);
}

async function ensureCollectionExists(roomId) {
  const collectionName = `srs_${roomId}`;
  
  try {
    await qdrant.getCollection(collectionName);
    console.log(`Collection ${collectionName} already exists`);
  } catch (error) {
    await qdrant.createCollection(collectionName, {
      vectors: { 
        size: 384, 
        distance: "Cosine" 
      }
    });
    console.log(`Created collection ${collectionName}`);
  }
}

async function indexDocuments(srsDocuments, roomId) {
  const collectionName = `srs_${roomId}`;
  
  // Check if documents are already indexed
  try {
    const collectionInfo = await qdrant.getCollection(collectionName);
    if (collectionInfo.points_count > 0) {
      console.log(`Documents already indexed for room ${roomId}`);
      return true;
    }
  } catch (error) {
    console.error("Error checking collection:", error);
  }

  console.log(`Indexing ${srsDocuments.length} documents for room ${roomId}`);
  
  const points = [];
  let pointId = 1;

  for (const doc of srsDocuments) {
    if (!doc.versions || doc.versions.length === 0) {
      console.log(`Document ${doc._id} has no versions, skipping`);
      continue;
    }
    
    const latestVersion = doc.versions[doc.versions.length - 1];
    const content = latestVersion?.content;
    
    if (!content || content.trim().length === 0) {
      console.log(`Document ${doc._id} has empty content, skipping`);
      continue;
    }
    
    try {
      console.log(`Generating embedding for document: ${doc._id}`);
      
      // Use the ENTIRE document content as one chunk
      const embedding = generateEmbedding(content);
      
      const validEmbedding = embedding.map(val => 
        typeof val === 'number' && isFinite(val) ? val : 0
      );
      
      points.push({
        id: pointId++,
        vector: validEmbedding,
        payload: {
          content: content, // Full content, no truncation
          documentId: doc._id?.toString() || 'unknown',
          version: latestVersion.version || 1,
          createdAt: latestVersion.createdAt || new Date().toISOString(),
          title: doc.title || "SRS Document"
        }
      });
      
    } catch (error) {
      console.error(`Error processing document ${doc._id}:`, error);
    }
  }

  console.log(`Generated ${points.length} valid points for indexing`);

  if (points.length > 0) {
    try {
      await qdrant.upsert(collectionName, {
        wait: true,
        points: points
      });
      
      console.log(`Successfully indexed ${points.length} documents for room ${roomId}`);
      return true;
    } catch (error) {
      console.error("Error upserting documents:", error);
      return false;
    }
  } else {
    console.log("No valid points to index");
    return false;
  }
}

async function searchSimilarDocuments(query, roomId, k = 3) {
  const collectionName = `srs_${roomId}`;
  
  try {
    const queryEmbedding = generateEmbedding(query);
    
    // Remove score threshold to get ALL documents
    const searchResult = await qdrant.search(collectionName, {
      vector: queryEmbedding,
      limit: k,
      with_payload: true,
      score_threshold: 0.0 // Changed from 0.1 to 0.0 to get all results
    });

    console.log(`Search found ${searchResult.length} results with scores:`, 
      searchResult.map(r => r.score.toFixed(3)));
    
    return searchResult;
  } catch (error) {
    console.error("Error searching similar documents:", error);
    return [];
  }
}

function buildContext(searchResults) {
  if (searchResults.length === 0) {
    return "No SRS documents available.";
  }
  
  // Return the FULL content of all found documents
  return searchResults.map((result, index) => 
    `[Document ${index + 1} - Title: ${result.payload.title}]
${result.payload.content}`
  ).join("\n\n");
}

export async function POST(request) {
  try {
    const { query, roomId } = await request.json();
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token || !roomId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Query is required" },
        { status: 400 }
      );
    }

    console.log(`Processing query: "${query}" for room: ${roomId}`);

    // Step 1: Get SRS documents from MongoDB
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;
    const srsResponse = await fetch(`${baseUrl}/api/srs/room/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!srsResponse.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch SRS documents" },
        { status: srsResponse.status }
      );
    }

    const srsData = await srsResponse.json();
    
    if (!srsData.success || !srsData.srsDocuments || srsData.srsDocuments.length === 0) {
      return NextResponse.json(
        { success: false, message: "No SRS documents found" },
        { status: 404 }
      );
    }

    console.log(`Found ${srsData.srsDocuments.length} SRS documents`);

    // Step 2: Process and index documents
    await ensureCollectionExists(roomId);
    const indexed = await indexDocuments(srsData.srsDocuments, roomId);
    
    if (!indexed) {
      console.log("Document indexing failed, but continuing with search...");
    }

    // Step 3: Search for similar documents
    const searchResults = await searchSimilarDocuments(query, roomId);
    console.log(`Found ${searchResults.length} relevant documents`);

    // Step 4: Build context - using FULL documents
    const context = buildContext(searchResults);

    // Step 5: Query Groq with improved prompt
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an assistant for the Orange Shield email spam detection system. 
Use the following SRS documentation to answer the user's question.

SRS DOCUMENTATION:
${context}

USER QUESTION: ${query}

Please search through the entire SRS documentation above to find the answer. 
Look carefully at all sections including the end of the document for any relevant information.`,
        },
        { role: "user", content: query },
      ],
      temperature: 0.1,
      max_tokens: 1000,
    });

    return NextResponse.json({
      success: true,
      answer: response.choices[0].message.content,
      sources: searchResults.map(result => ({
        content: result.payload.content.substring(0, 300) + '...', // Show more content
        metadata: {
          title: result.payload.title,
          version: result.payload.version,
          score: result.score ? result.score.toFixed(3) : 'N/A'
        }
      }))
    });

  } catch (error) {
    console.error("RAG query error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error" 
      },
      { status: 500 }
    );
  }
}