import mongoose from "mongoose";

const repositoryActivitySchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true // push, pull_request, sync, branch_create, branch_delete, release
    },
    repository: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      default: "main"
    },
    commit: {
      type: String,
      default: ""
    },
    author: {
      type: String,
      default: "system"
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    triggeredScan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scan"
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending", "info"],
      default: "success"
    }
  },
  { timestamps: true }
);

repositoryActivitySchema.index({ repository: 1 });
repositoryActivitySchema.index({ timestamp: -1 });

export default mongoose.model("RepositoryActivity", repositoryActivitySchema);
