import mongoose from "mongoose";

const findingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true
    },
    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scan",
      required: true
    },
    branch: {
      type: String,
      default: "main"
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true // e.g., 'security', 'performance', 'accessibility', 'maintainability', 'code_quality', 'best_practices', 'testing'
    },
    severity: {
      type: String,
      enum: ["critical", "high", "medium", "low", "info"],
      default: "medium"
    },
    confidence: {
      type: Number,
      default: 90
    },
    status: {
      type: String,
      enum: ["open", "resolved", "ignored"],
      default: "open"
    },
    file: {
      type: String,
      required: true
    },
    line: {
      type: Number,
      default: 1
    },
    codeSnippet: {
      type: String,
      default: ""
    },
    aiExplanation: {
      type: String,
      default: ""
    },
    recommendation: {
      type: String,
      default: ""
    },
    effort: {
      type: String,
      default: "30 mins"
    },
    impact: {
      type: String,
      default: "medium"
    },
    resolvedAt: {
      type: Date
    },
    assignedTo: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Optimize search queries
findingSchema.index({ userId: 1 });
findingSchema.index({ repositoryId: 1 });
findingSchema.index({ scanId: 1 });
findingSchema.index({ status: 1 });
findingSchema.index({ severity: 1 });
findingSchema.index({ category: 1 });

export default mongoose.model("Finding", findingSchema);
