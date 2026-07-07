import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    repositories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repository"
      }
    ],
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

workspaceSchema.index({ organizationId: 1 });

export default mongoose.model("Workspace", workspaceSchema);
