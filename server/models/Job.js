import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    queue: {
      type: String,
      required: true
    },
    jobId: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    },
    progress: {
      type: Number,
      default: 0
    },
    startedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    failedReason: {
      type: String
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository"
    },
    data: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

jobSchema.index({ jobId: 1 }, { unique: true });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });

export default mongoose.model("Job", jobSchema);
