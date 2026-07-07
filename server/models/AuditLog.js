import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      required: true
    },
    target: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String,
      default: "127.0.0.1"
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ timestamp: -1 });

export default mongoose.model("AuditLog", auditLogSchema);
