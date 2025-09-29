import mongoose from "mongoose";

const ProjectStatusSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    progressPercent: { type: Number, min: 0, max: 100 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.ProjectStatus ||
  mongoose.model("ProjectStatus", ProjectStatusSchema);
