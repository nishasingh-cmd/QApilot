import mongoose from "mongoose";

const usageRecordSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      unique: true
    },
    repositoriesUsed: {
      type: Number,
      default: 0
    },
    scansUsed: {
      type: Number,
      default: 0
    },
    reportsGenerated: {
      type: Number,
      default: 0
    },
    aiRequests: {
      type: Number,
      default: 0
    },
    deployments: {
      type: Number,
      default: 0
    },
    storageUsed: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

usageRecordSchema.index({ organizationId: 1 }, { unique: true });

export default mongoose.model("UsageRecord", usageRecordSchema);
