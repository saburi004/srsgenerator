import connectDB from "@/lib/dbconfig";
import ProjectStatus from "@/models/project";
import Room from "@/models/room";
import User from "@/models/user";

export async function POST(request) {
  await connectDB();
  try {
    const { roomId, progressPercent, comment } = await request.json();
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ success: false, error: "Authorization token required" }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    let userEmail;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userEmail = payload.email;
    } catch (e) {
      return Response.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    if (!roomId || typeof progressPercent !== 'number') {
      return Response.json({ success: false, error: "roomId and progressPercent are required" }, { status: 400 });
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      return Response.json({ success: false, error: "Room not found" }, { status: 404 });
    }
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const statusDoc = await ProjectStatus.create({
      room: room._id,
      updatedBy: user._id,
      progressPercent,
      comment: comment || "",
    });

    room.statusUpdates.push(statusDoc._id);
    await room.save();

    const populated = await ProjectStatus.findById(statusDoc._id).populate('updatedBy');
    return Response.json({ success: true, status: populated }, { status: 201 });
  } catch (error) {
    console.error('Project-status POST error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    if (!roomId) {
      return Response.json({ success: false, error: "roomId is required" }, { status: 400 });
    }
    const room = await Room.findOne({ roomId });
    if (!room) {
      return Response.json({ success: false, error: "Room not found" }, { status: 404 });
    }
    const statuses = await ProjectStatus.find({ room: room._id }).populate('updatedBy').sort({ createdAt: -1 });
    return Response.json({ success: true, statuses });
  } catch (error) {
    console.error('Project-status GET error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}


