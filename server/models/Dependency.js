import mongoose from "mongoose";

const dependencySchema = new mongoose.Schema(
  {
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    currentVersion: {
      type: String,
      required: true
    },
    latestVersion: {
      type: String,
      default: ""
    },
    packageManager: {
      type: String,
      default: "npm"
    },
    type: {
      type: String,
      enum: ["production", "dev"],
      default: "production"
    },
    license: {
      type: String,
      default: "Unknown"
    },
    homepage: {
      type: String,
      default: ""
    },
    repositoryUrl: {
      type: String,
      default: ""
    },
    publishedAt: {
      type: Date
    },
    isOutdated: {
      type: Boolean,
      default: false
    },
    riskLevel: {
      type: String,
      enum: ["none", "low", "medium", "high", "critical"],
      default: "none"
    },
    knownVulnerabilities: [
      {
        cveId: { type: String, required: true },
        severity: { type: String, required: true }, // e.g. critical, high, medium, low
        description: { type: String, default: "" },
        affectedVersion: { type: String, default: "" },
        fixedVersion: { type: String, default: "" },
        referenceUrl: { type: String, default: "" }
      }
    ],
    recommendedVersion: {
      type: String,
      default: ""
    },
    lastChecked: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Unique package name per repository to prevent duplications
dependencySchema.index({ repositoryId: 1, name: 1 }, { unique: true });

export default mongoose.model("Dependency", dependencySchema);
