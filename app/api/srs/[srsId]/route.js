import connectDB from "@/lib/dbconfig";
import SrsDocument from "@/models/srs";
import Room from "@/models/room";
import User from "@/models/user";
import mongoose from "mongoose";

// GET - Get a specific SRS document by ID
export async function GET(request, { params }) {
  await connectDB();

  try {
    const { srsId } = params;
    
    if (!mongoose.Types.ObjectId.isValid(srsId)) {
      return Response.json({
        success: false,
        error: "Invalid SRS ID format",
        hint: "If you are trying to fetch by room, use /api/srs/room/{roomId}"
      }, { status: 400 });
    }
    
    console.log("GET SRS Document ID:", srsId);
    
    if (!srsId) {
      return Response.json({ 
        success: false, 
        error: "SRS Document ID is required" 
      }, { status: 400 });
    }

    // Find the SRS document WITHOUT nested population
    const srsDocument = await SrsDocument.findById(srsId);

    if (!srsDocument) {
      return Response.json({ 
        success: false, 
        error: "SRS document not found" 
      }, { status: 404 });
    }

    // Get createdBy user info
    const createdByUser = await User.findById(srsDocument.createdBy).select('name email');
    
    // Get author info for each version
    const versionsWithAuthors = await Promise.all(
      srsDocument.versions.map(async (version) => {
        const author = await User.findById(version.author).select('name email');
        return {
          version: version.version,
          content: version.content,
          author: {
            name: author?.name || 'Unknown',
            email: author?.email || ''
          },
          changes: version.changes,
          createdAt: version.createdAt
        };
      })
    );

    const responseDoc = {
      _id: srsDocument._id,
      title: srsDocument.title,
      versions: versionsWithAuthors,
      room: srsDocument.room,
      createdBy: {
        name: createdByUser?.name || 'Unknown',
        email: createdByUser?.email || ''
      },
      createdAt: srsDocument.createdAt,
      updatedAt: srsDocument.updatedAt
    };

    return Response.json({ 
      success: true, 
      srsDocument: responseDoc 
    });

  } catch (error) {
    console.error("GET SRS Document Error:", error);
    return Response.json({ 
      success: false, 
      error: error.message
    }, { status: 500 });
  }
}

// PUT - Update a specific SRS document (add new version)
export async function PUT(request, { params }) {
  await connectDB();

  try {
    const { srsId } = params;
    if (!mongoose.Types.ObjectId.isValid(srsId)) {
      return Response.json({
        success: false,
        error: "Invalid SRS ID format",
        hint: "This endpoint requires a Mongo ObjectId. To update by SRS id only."
      }, { status: 400 });
    }
    const { content, changes = "Updated document" } = await request.json();
    
    console.log("UPDATE SRS Document ID:", srsId);
    
    if (!srsId || !content) {
      return Response.json({ 
        success: false, 
        error: "SRS Document ID and content are required" 
      }, { status: 400 });
    }

    // Get token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ 
        success: false, 
        error: "Authorization token required" 
      }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Extract user info from token
    let userEmail, userName;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userEmail = payload.email;
      userName = payload.name || userEmail.split('@')[0];
    } catch (error) {
      return Response.json({ 
        success: false, 
        error: "Invalid token" 
      }, { status: 401 });
    }

    // Find user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return Response.json({ 
        success: false, 
        error: "User not found" 
      }, { status: 404 });
    }

    // Find the SRS document
    const srsDocument = await SrsDocument.findById(srsId);
    if (!srsDocument) {
      return Response.json({ 
        success: false, 
        error: "SRS document not found" 
      }, { status: 404 });
    }

    // Create new version
    const newVersion = {
      version: srsDocument.versions.length + 1,
      content: content,
      author: user._id,
      changes: changes,
      createdAt: new Date()
    };

    // Add new version to the document
    srsDocument.versions.push(newVersion);
    await srsDocument.save();

    // Get updated document
    const updatedDoc = await SrsDocument.findById(srsId);
    const createdByUser = await User.findById(updatedDoc.createdBy).select('name email');

    // Build response with author information
    const versionsWithAuthors = await Promise.all(
      updatedDoc.versions.map(async (version) => {
        const author = await User.findById(version.author).select('name email');
        return {
          version: version.version,
          content: version.content,
          author: {
            name: author?.name || 'Unknown',
            email: author?.email || ''
          },
          changes: version.changes,
          createdAt: version.createdAt
        };
      })
    );

    const responseDoc = {
      _id: updatedDoc._id,
      title: updatedDoc.title,
      versions: versionsWithAuthors,
      room: updatedDoc.room,
      createdBy: {
        name: createdByUser?.name || 'Unknown',
        email: createdByUser?.email || ''
      },
      createdAt: updatedDoc.createdAt,
      updatedAt: updatedDoc.updatedAt
    };

    return Response.json({ 
      success: true, 
      srsDocument: responseDoc 
    });

  } catch (error) {
    console.error("UPDATE SRS Document Error:", error);
    return Response.json({ 
      success: false, 
      error: error.message
    }, { status: 500 });
  }
}