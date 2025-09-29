import connectDB from "@/lib/dbconfig";
import User from "@/models/user";
import Room from "@/models/room";
import jwt from "jsonwebtoken";

export async function POST(request) {
  await connectDB();
  try {
    const { email, name, role, roomId } = await request.json();

    if (!email || !role) {
      return Response.json({ success: false, error: "Email and role are required" }, { status: 400 });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const inferredName = name || email.split('@')[0];
      user = await User.create({ email, name: inferredName, role });
    } else if (role && user.role !== role) {
      // Keep initial role if already set; simple approach
    }

    let assignedRoomId = roomId || null;
    if (assignedRoomId) {
      const room = await Room.findOne({ roomId: assignedRoomId });
      if (!room) {
        return Response.json({ success: false, error: "Room not found" }, { status: 404 });
      }
    }

    const token = jwt.sign(
      {
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


