import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    monthlyPrice: {
      type: Number,
      required: true
    },
    yearlyPrice: {
      type: Number,
      required: true
    },
    repositoryLimit: {
      type: Number,
      default: 5
    },
    memberLimit: {
      type: Number,
      default: 3
    },
    scanLimit: {
      type: Number,
      default: 10
    },
    aiCredits: {
      type: Number,
      default: 20
    },
    deploymentLimit: {
      type: Number,
      default: 5
    },
    reportLimit: {
      type: Number,
      default: 5
    },
    analyticsFeatures: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

planSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("Plan", planSchema);
