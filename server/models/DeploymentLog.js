import mongoose from "mongoose";

const deploymentLogSchema = new mongoose.Schema(
  {
    deploymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deployment",
      required: true
    },
    stage: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ["info", "warn", "error"],
      default: "info"
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

deploymentLogSchema.index({ deploymentId: 1 });
deploymentLogSchema.index({ deploymentId: 1, timestamp: 1 });

export default mongoose.model("DeploymentLog", deploymentLogSchema);
