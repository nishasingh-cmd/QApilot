import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema(
  {
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    githubEvent: {
      type: String,
      required: true
    },
    deliveryId: {
      type: String,
      required: true,
      unique: true
    },
    branch: {
      type: String
    },
    commitSha: {
      type: String
    },
    author: {
      type: String
    },
    payload: {
      type: mongoose.Schema.Types.Mixed
    },
    processed: {
      type: Boolean,
      default: false
    },
    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    },
    receivedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    errorMessage: {
      type: String
    }
  },
  { timestamps: true }
);

webhookEventSchema.index({ deliveryId: 1 }, { unique: true });
webhookEventSchema.index({ repositoryId: 1 });
webhookEventSchema.index({ userId: 1 });
webhookEventSchema.index({ processingStatus: 1 });

export default mongoose.model("WebhookEvent", webhookEventSchema);
