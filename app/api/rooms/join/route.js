// import connectDB from "@/lib/dbconfig";
// import Room from "@/models/room";
// import User from "@/models/user";
// import "@/models/srs";
// import "@/models/project";  

// export async function POST(req) {
//   await connectDB();

//   try {
//     const body = await req.json(); // <-- get body from req
//     const { roomId, userEmail, userType } = body;

//     const room = await Room.findOne({ roomId });
//     if (!room) {
//       return Response.json(
//         { success: false, error: "Room not found" },
//         { status: 404 }
//       );
//     }

//     // Find or create user
//     let user = await User.findOne({ email: userEmail });
//     if (!user) {
//       user = await User.create({
//         email: userEmail,
//         name: userEmail.split("@")[0],
//         role: userType,
//       });
//     }

//     // Check if user is already in the room
//     const isClient = room.clients.includes(user._id);
//     const isDeveloper = room.developers.includes(user._id);

//     if (isClient || isDeveloper) {
//       return Response.json(
//         { success: false, error: "User already in this room" },
//         { status: 400 }
//       );
//     }

//     // Add user based on type
//     if (userType === "client") {
//       room.clients.push(user._id);
//     } else if (userType === "developer") {
//       room.developers.push(user._id);
//     } else {
//       return Response.json(
//         { success: false, error: "Invalid user type" },
//         { status: 400 }
//       );
//     }

//     await room.save();

//     const populatedRoom = await Room.findOne({ roomId })
//       .populate("manager")
//       .populate("clients")
//       .populate("developers")
//       .populate("srsDocuments")
//       .populate("statusUpdates");

//     return Response.json({
//       success: true,
//       room: populatedRoom,
//       message: `Joined room as ${userType}`,
//     });
//   } catch (error) {
//     return Response.json({ success: false, error: error.message }, { status: 500 });
//   }
// }
import connectDB from "@/lib/dbconfig";
import Room from "@/models/room";
import User from "@/models/user";
import "@/models/srs";
import "@/models/project"; // ProjectStatus model
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // ⚠️ set in .env.local

export async function POST(req) {
  await connectDB();

  try {
    const { roomId, userEmail, userType } = await req.json();

    const room = await Room.findOne({ roomId });
    if (!room) {
      return Response.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    // Find or create user
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        email: userEmail,
        name: userEmail.split("@")[0],
        role: userType,
      });
    }

    // Check if user is already in the room
    const isClient = room.clients.includes(user._id);
    const isDeveloper = room.developers.includes(user._id);

    if (isClient || isDeveloper) {
      return Response.json(
        { success: false, error: "User already in this room" },
        { status: 400 }
      );
    }

    // Add user based on type
    if (userType === "client") {
      room.clients.push(user._id);
    } else if (userType === "developer") {
      room.developers.push(user._id);
    } else {
      return Response.json(
        { success: false, error: "Invalid user type" },
        { status: 400 }
      );
    }

    await room.save();

    const populatedRoom = await Room.findOne({ roomId })
      .populate("manager")
      .populate("clients")
      .populate("developers")
      .populate("srsDocuments")
      .populate("statusUpdates");

    // ✅ Generate JWT for session
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        roomId,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return Response.json({
      success: true,
      room: populatedRoom,
      token, // frontend can save this
      message: `Joined room as ${userType}`,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
