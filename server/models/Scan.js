import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    repoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    branch: {
      type: String,
      default: "main"
    },
    scores: {
      qualityScore: { type: Number, default: 0 },
      securityScore: { type: Number, default: 0 },
      performanceScore: { type: Number, default: 0 },
      maintainabilityScore: { type: Number, default: 0 }
    },
    findings: [
      {
        type: { type: String, required: true }, // e.g., 'security', 'style', 'performance'
        severity: { type: String, required: true }, // e.g., 'critical', 'warning', 'info'
        file: { type: String, required: true },
        message: { type: String, required: true },
        recommendation: { type: String, required: true }
      }
    ],
    status: {
      type: String,
      enum: ["running", "success", "failed"],
      default: "running"
    },
    elapsedTime: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Scan", scanSchema);
