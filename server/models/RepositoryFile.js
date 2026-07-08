import mongoose from "mongoose";

const repositoryFileSchema = new mongoose.Schema(
  {
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
      index: true
    },
    path: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    extension: {
      type: String,
      default: ""
    },
    sha: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      default: ""
    },
    language: {
      type: String,
      default: ""
    },
    lastCommit: {
      type: String,
      default: ""
    },
    lastSynced: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Prevent duplicate paths within the same repository
repositoryFileSchema.index({ repositoryId: 1, path: 1 }, { unique: true });

export default mongoose.model("RepositoryFile", repositoryFileSchema);
