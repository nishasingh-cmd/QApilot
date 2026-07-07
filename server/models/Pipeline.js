import mongoose from "mongoose";

const pipelineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true
    },
    triggerEvent: {
      type: String,
      enum: ["push", "pull_request", "manual"],
      default: "push"
    },
    stages: {
      type: [String],
      default: ["Install Dependencies", "Run Tests", "Build Project", "Deploy"]
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

pipelineSchema.index({ repositoryId: 1 });

export default mongoose.model("Pipeline", pipelineSchema);
