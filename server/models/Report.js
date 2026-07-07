import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    repoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true
    },
    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scan",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    repo: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      required: true
    },
    generatedBy: {
      type: String,
      required: true
    },
    overallScore: {
      type: Number,
      required: true
    },
    categoryScores: {
      quality: { type: Number, default: 0 },
      security: { type: Number, default: 0 },
      performance: { type: Number, default: 0 },
      maintainability: { type: Number, default: 0 },
      coverage: { type: Number, default: 0 },
      accessibility: { type: Number, default: 0 },
      confidence: { type: Number, default: 0 }
    },
    findingsSummary: {
      critical: { type: Number, default: 0 },
      high: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      low: { type: Number, default: 0 },
      resolved: { type: Number, default: 0 },
      ignored: { type: Number, default: 0 }
    },
    aiSummary: {
      type: String,
      required: true
    },
    recommendations: {
      priorityActions: [String],
      architecture: [String],
      testing: [String],
      security: [String],
      performance: [String]
    },
    timeline: [
      {
        type: { type: String, required: true }, // e.g., 'Created', 'Shared', 'Exported'
        user: { type: String, required: true },
        date: { type: String, required: true }
      }
    ],
    status: {
      type: String,
      enum: ["ready", "processing", "failed"],
      default: "ready"
    },
    version: {
      type: String,
      default: "v1.0"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
