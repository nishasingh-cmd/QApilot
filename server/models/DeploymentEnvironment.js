import mongoose from "mongoose";

const deploymentEnvironmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["production", "staging", "development"]
    },
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true
    },
    url: {
      type: String,
      default: ""
    },
    branch: {
      type: String,
      default: "main"
    },
    autoDeploy: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

deploymentEnvironmentSchema.index({ repositoryId: 1 });
deploymentEnvironmentSchema.index({ repositoryId: 1, name: 1 }, { unique: true });

export default mongoose.model("DeploymentEnvironment", deploymentEnvironmentSchema);
