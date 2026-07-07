import mongoose from "mongoose";

const repositorySettingSchema = new mongoose.Schema(
  {
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    autoScan: {
      type: Boolean,
      default: true
    },
    scanOnPush: {
      type: Boolean,
      default: true
    },
    scanOnPullRequest: {
      type: Boolean,
      default: true
    },
    generateReport: {
      type: Boolean,
      default: false
    },
    enableNotifications: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

repositorySettingSchema.index({ repositoryId: 1 }, { unique: true });
repositorySettingSchema.index({ userId: 1 });

export default mongoose.model("RepositorySetting", repositorySettingSchema);
