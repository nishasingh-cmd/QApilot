import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    },
    role: {
      type: String,
      enum: ["Admin", "Developer", "Viewer"],
      default: "Developer"
    },
    inviteToken: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    accepted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

invitationSchema.index({ inviteToken: 1 }, { unique: true });
invitationSchema.index({ email: 1 });

export default mongoose.model("Invitation", invitationSchema);
