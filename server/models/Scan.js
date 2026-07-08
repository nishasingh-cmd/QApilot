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
        recommendation: { type: String, required: true },
        
        // Extended structured fields for AST engine
        title: { type: String, default: "" },
        category: { type: String, default: "" },
        confidence: { type: String, default: "medium" },
        line: { type: Number, default: 1 },
        column: { type: Number, default: 1 },
        ruleId: { type: String, default: "" },
        codeSnippet: { type: String, default: "" }
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
    },
    
    // AST Analysis scoring metrics
    complexity: {
      type: Number,
      default: 0
    },
    technicalDebt: {
      type: Number,
      default: 0 // In minutes
    },
    maintainabilityIndex: {
      type: Number,
      default: 0 // 0 - 100
    },
    duplicatedLines: {
      type: Number,
      default: 0
    },
    codeSmells: {
      type: Number,
      default: 0
    },
    overallGrade: {
      type: String,
      default: "A"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Scan", scanSchema);
