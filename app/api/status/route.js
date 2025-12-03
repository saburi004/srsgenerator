// pages/api/status/route.js
import connectDB from "@/lib/dbconfig";
// import ProjectStatus from "@/models/projectStatus";
import Room from "@/models/room";
import User from "@/models/user";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { roomId, authorEmail, status, description } = req.body;

    try {
      const room = await Room.findOne({ roomId });
      const author = await User.findOne({ email: authorEmail });

      if (!room) {
        return res.status(404).json({ success: false, error: "Room not found" });
      }

      if (!author) {
        return res.status(404).json({ success: false, error: "Author not found" });
      }

      // Create status update
      const projectStatus = await ProjectStatus.create({
        status,
        description,
        author: author._id,
        room: room._id
      });

      // Add status update to room
      room.statusUpdates.push(projectStatus._id);
      await room.save();

      // Populate the created status
      const populatedStatus = await ProjectStatus.findById(projectStatus._id)
        .populate('author');

      res.status(201).json({ success: true, statusUpdate: populatedStatus });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}