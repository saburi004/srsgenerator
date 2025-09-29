import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  developers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  srsDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: "SrsDocument" }],
  statusUpdates: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProjectStatus" }]
}, { timestamps: true });

// Check if model already exists to prevent OverwriteModelError
const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);

export default Room;