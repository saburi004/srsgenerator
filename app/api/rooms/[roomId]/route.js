// pages/api/rooms/[roomId]/route.js
import connectDB from "@/lib/dbconfig";
import Room from "@/models/room";

export default async function handler(req, res) {
  await connectDB();

  const { roomId } = req.query;

  if (req.method === "GET") {
    try {
      const room = await Room.findOne({ roomId })
        .populate('clients')
        .populate('developers')
        .populate('srsDocuments')
        .populate('statusUpdates')
        .populate({
          path: 'srsDocuments',
          populate: {
            path: 'versions.author',
            model: 'User'
          }
        });

      if (!room) {
        return res.status(404).json({ success: false, error: "Room not found" });
      }

      res.status(200).json({ success: true, room });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}