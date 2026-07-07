import mongoose from "mongoose";

const deploymentSchema = new mongoose.Schema(
  {
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true
    },
    environmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeploymentEnvironment",
      required: true
    },
    branch: {
      type: String,
      required: true
    },
    commitSha: {
      type: String,
      required: true
    },
    commitMessage: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: [
        "queued",
        "installing",
        "testing",
        "building",
        "sec_scan",
        "quality_gate",
        "packaging",
        "deploying",
        "completed",
        "failed"
      ],
      default: "queued"
    },
    duration: {
      type: Number,
      default: 0
    },
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    workflowId: {
      type: String,
      required: true,
      unique: true
    },
    url: {
      type: String,
      default: ""
    },
    rollbackFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deployment"
    }
  },
  { timestamps: true }
);

deploymentSchema.index({ repositoryId: 1 });
deploymentSchema.index({ environmentId: 1 });
deploymentSchema.index({ workflowId: 1 }, { unique: true });
deploymentSchema.index({ createdAt: -1 });

export default mongoose.model("Deployment", deploymentSchema);
