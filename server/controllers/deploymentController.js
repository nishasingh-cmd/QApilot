import Deployment from "../models/Deployment.js";
import DeploymentEnvironment from "../models/DeploymentEnvironment.js";
import DeploymentLog from "../models/DeploymentLog.js";
import Repository from "../models/Repository.js";
import { dispatchJob } from "../services/jobDispatcher.js";

/**
 * Fetch list of deployments. Seeds environments if none exist.
 */
export const getDeployments = async (req, res) => {
  try {
    const { repositoryId } = req.query;
    if (!repositoryId) {
      const list = await Deployment.find({})
        .populate("repositoryId")
        .populate("environmentId")
        .sort({ createdAt: -1 })
        .limit(100);
      return res.json(list);
    }

    // Seed default environments if none exist for this repository
    const envCount = await DeploymentEnvironment.countDocuments({ repositoryId });
    if (envCount === 0) {
      await DeploymentEnvironment.create([
        { name: "development", repositoryId, branch: "dev", url: "" },
        { name: "staging", repositoryId, branch: "staging", url: "" },
        { name: "production", repositoryId, branch: "main", url: "" }
      ]);
    }

    const list = await Deployment.find({ repositoryId })
      .populate("repositoryId")
      .populate("environmentId")
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single deployment.
 */
export const getDeploymentById = async (req, res) => {
  try {
    const doc = await Deployment.findById(req.params.id)
      .populate("repositoryId")
      .populate("environmentId");
    if (!doc) {
      return res.status(404).json({ message: "Deployment not found." });
    }
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch logs for a deployment.
 */
export const getDeploymentLogs = async (req, res) => {
  try {
    const logs = await DeploymentLog.find({ deploymentId: req.params.id }).sort({ timestamp: 1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Trigger new manual deployment.
 */
export const createDeployment = async (req, res) => {
  try {
    const { repositoryId, environmentId, branch, commitSha, commitMessage } = req.body;
    if (!repositoryId || !environmentId) {
      return res.status(400).json({ message: "Missing repositoryId or environmentId parameters." });
    }

    const workflowId = `wf-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const doc = await Deployment.create({
      repositoryId,
      environmentId,
      branch: branch || "main",
      commitSha: commitSha || "a1b2c3d4",
      commitMessage: commitMessage || "Trigger manual deploy",
      triggeredBy: req.user._id,
      workflowId,
      status: "queued"
    });

    // Enqueue deploy job
    await dispatchJob("deployment", "start-deployment", {
      deploymentId: doc._id,
      userId: req.user._id
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Re-start a queued or failed deployment.
 */
export const startDeployment = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Deployment.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Deployment not found." });
    }

    doc.status = "queued";
    await doc.save();

    await dispatchJob("deployment", "start-deployment", {
      deploymentId: doc._id,
      userId: req.user._id
    });

    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Rollback failed deployments.
 */
export const rollbackDeployment = async (req, res) => {
  try {
    const { id } = req.params; // Target deployment we want to revert to
    const target = await Deployment.findById(id);
    if (!target) {
      return res.status(404).json({ message: "Target deployment to revert to not found." });
    }

    const workflowId = `wf-rollback-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Create a new deployment referencing the target
    const doc = await Deployment.create({
      repositoryId: target.repositoryId,
      environmentId: target.environmentId,
      branch: target.branch,
      commitSha: target.commitSha,
      commitMessage: `Rollback deploy from workflow [${target.workflowId}]`,
      triggeredBy: req.user._id,
      workflowId,
      rollbackFrom: target._id,
      status: "queued"
    });

    // Enqueue
    await dispatchJob("deployment", "start-deployment", {
      deploymentId: doc._id,
      userId: req.user._id
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getDeployments,
  getDeploymentById,
  getDeploymentLogs,
  createDeployment,
  startDeployment,
  rollbackDeployment
};
