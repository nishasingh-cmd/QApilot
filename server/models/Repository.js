import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
  {
    githubId: Number,
    name: String,
    fullName: String,
    private: Boolean,
    htmlUrl: String,
    description: String,
    language: String,
    defaultBranch: String,

    owner: {
      login: String,
      avatarUrl: String
    },

    healthScore: {
      type: Number,
      default: 0
    },

    lastSyncedAt: Date,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Repository", repositorySchema);
