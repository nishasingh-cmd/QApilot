import mongoose from "mongoose";

const codeReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
      index: true
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepositoryFile",
      required: true,
      index: true
    },
    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scan",
      index: true
    },
    reviewType: {
      type: String,
      default: "full"
    },
    provider: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed"],
      default: "queued",
      index: true
    },
    summary: {
      type: String,
      default: ""
    },
    overallScore: {
      type: Number,
      default: 0
    },
    securityScore: {
      type: Number,
      default: 0
    },
    performanceScore: {
      type: Number,
      default: 0
    },
    maintainabilityScore: {
      type: Number,
      default: 0
    },
    readabilityScore: {
      type: Number,
      default: 0
    },
    comments: [
      {
        line: { type: Number, required: true },
        severity: { type: String, enum: ["info", "warning", "critical"], required: true },
        category: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        recommendation: { type: String, required: true },
        suggestedCode: { type: String, default: "" },
        confidence: { type: String, enum: ["low", "medium", "high"], default: "medium" }
      }
    ],
    error: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("CodeReview", codeReviewSchema);
