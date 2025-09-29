import connectDB from "@/lib/dbconfig";
import Room from "@/models/room";
import User from "@/models/user";

export async function POST(request) {
  await connectDB();

  try {
    const { managerEmail } = await request.json();

    if (!managerEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "Manager email is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique room ID
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Find or create manager user
    let manager = await User.findOne({ email: managerEmail });
    if (!manager) {
      manager = await User.create({ 
        email: managerEmail, 
        name: managerEmail.split('@')[0],
        role: 'manager'
      });
    }

    // Create room with manager ObjectId
    const room = await Room.create({ 
      roomId, 
      manager: manager._id 
    });

    // Populate the manager details in response
    const populatedRoom = await Room.findById(room._id).populate('manager');

    return new Response(
      JSON.stringify({ success: true, room: populatedRoom }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating room:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle other methods
export async function GET() {
  return new Response(
    JSON.stringify({ success: false, error: "Method not allowed" }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
}