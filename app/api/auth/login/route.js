import connectDB from "@/lib/dbconfig";
import User from "@/models/user";
import Room from "@/models/room";
import jwt from "jsonwebtoken";

export async function POST(request) {
  await connectDB();
  try {
    const { email, name, role, roomId } = await request.json();

    if (!email) {
      return Response.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    // Find existing user or create with sensible defaults
    let user = await User.findOne({ email });
    if (!user) {
      const inferredName = name || email.split('@')[0];
      const resolvedRole = role || 'client';
      user = await User.create({ email, name: inferredName, role: resolvedRole });
    } else if (role && user.role !== role) {
      // Keep existing role; do not overwrite silently
    }

    // Optionally attach the user to a room if provided
    let assignedRoomId = roomId || null;
    if (assignedRoomId) {
      const room = await Room.findOne({ roomId: assignedRoomId });
      if (!room) {
        return Response.json({ success: false, error: "Room not found" }, { status: 404 });
      }

      // Add membership based on user's role if not already present
      const isClient = room.clients.some(id => id.equals(user._id));
      const isDeveloper = room.developers.some(id => id.equals(user._id));
      const isManager = room.manager && room.manager.equals(user._id);

      if (!isClient && !isDeveloper && !isManager) {
        if (user.role === 'client') {
          room.clients.push(user._id);
          await room.save();
        } else if (user.role === 'developer') {
          room.developers.push(user._id);
          await room.save();
        } else if (user.role === 'manager') {
          // Ensure this user becomes the manager for this room
          room.manager = user._id;
          await room.save();
        }
      }
    }

    const token = jwt.sign(
      {
        userId: String(user._id),
        email: user.email,
        name: user.name || email.split('@')[0],
        role: user.role,
        roomId: assignedRoomId || undefined,
      },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    return Response.json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}


