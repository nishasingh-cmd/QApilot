import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["Owner", "Admin", "Developer", "Viewer"],
      default: "Developer"
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

workspaceMemberSchema.index({ workspaceId: 1 });
workspaceMemberSchema.index({ userId: 1 });
workspaceMemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

export default mongoose.model("WorkspaceMember", workspaceMemberSchema);
