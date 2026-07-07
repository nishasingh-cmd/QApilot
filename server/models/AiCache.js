import mongoose from "mongoose";

const aiCacheSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    provider: {
      type: String,
      default: "unknown"
    },
    model: {
      type: String,
      default: "default"
    },
    tokensUsed: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

aiCacheSchema.index({ key: 1 }, { unique: true });

export default mongoose.model("AiCache", aiCacheSchema);
