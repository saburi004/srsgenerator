import connectDB from "@/lib/dbconfig";
import SrsDocument from "@/models/srs";
import Room from "@/models/room";
import User from "@/models/user";

// POST - Create a new SRS document
export async function POST(request) {
  await connectDB();

  try {
    const { roomId, content, title = "New SRS Document" } = await request.json();
    
    console.log("POST SRS - Room ID:", roomId, "Title:", title);
    
    if (!roomId || !content) {
      return Response.json({ 
        success: false, 
        error: "Room ID and content are required" 
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
      console.log("User from token:", { userEmail, userName });
    } catch (error) {
      return Response.json({ 
        success: false, 
        error: "Invalid token" 
      }, { status: 401 });
    }

    // Find room
    const room = await Room.findOne({ roomId });
    if (!room) {
      return Response.json({ 
        success: false, 
        error: "Room not found" 
      }, { status: 404 });
    }

    // Find or create user
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        name: userName,
        email: userEmail,
        role: 'client'
      });
      console.log("Created new user:", user.email);
    } else {
      console.log("Found existing user:", user.email);
    }

    // Create SRS document
    const srsDocument = await SrsDocument.create({
      title,
      versions: [{
        version: 1,
        content: content,
        author: user._id,
        createdAt: new Date()
      }],
      room: room._id,
      createdBy: user._id
    });

    console.log("Created SRS document:", srsDocument._id);

    // Add SRS document to room
    room.srsDocuments.push(srsDocument._id);
    await room.save();

    console.log("Updated room with SRS document");

    // Return response WITHOUT nested population
    // Just return the basic document and let the client handle author info
    const responseDoc = {
      _id: srsDocument._id,
      title: srsDocument.title,
      versions: srsDocument.versions.map(version => ({
        version: version.version,
        content: version.content,
        author: {
          name: user.name,
          email: user.email
        },
        changes: version.changes,
        createdAt: version.createdAt
      })),
      room: room._id,
      createdBy: {
        name: user.name,
        email: user.email
      },
      createdAt: srsDocument.createdAt,
      updatedAt: srsDocument.updatedAt
    };

    return Response.json({ 
      success: true, 
      srsDocument: responseDoc 
    }, { status: 201 });

  } catch (error) {
    console.error("POST SRS Error Details:", error);
    return Response.json({ 
      success: false, 
      error: error.message
    }, { status: 500 });
  }
}

// Handle other methods for /api/srs
export async function GET() {
  return Response.json({ 
    success: false, 
    error: "Use /api/srs/[roomId] to get SRS documents" 
  }, { status: 405 });
}