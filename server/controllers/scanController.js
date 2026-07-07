import Scan from "../models/Scan.js";
import Repository from "../models/Repository.js";
import { dispatchJob } from "../services/jobDispatcher.js";

// TRIGGER SCAN
export const triggerScan = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { branch } = req.body;

    const repo = await Repository.findOne({ _id: repoId, userId: req.user._id });
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    // 1. Create scan entry in 'running' state
    const scan = await Scan.create({
      repoId,
      userId: req.user._id,
      branch: branch || repo.defaultBranch || "main",
      status: "running",
      elapsedTime: 0
    });

    // Enqueue Scan execution job
    await dispatchJob("scan", "run-scan", { repoId, scanId: scan._id, userId: req.user._id });

    // Enqueue system alert notifications
    await dispatchJob("notification", "scan-started-notification", {
      userId: req.user._id,
      notificationData: {
        type: "scan_started",
        title: "AI scan initiated",
        message: `Automatic code analysis started on '${repo.name}' (branch: ${scan.branch}).`,
        repository: repo.name,
        severity: "info",
        metadata: { scanId: scan._id }
      }
    });

    res.status(201).json(scan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SCAN HISTORY FOR REPO
export const getHistory = async (req, res) => {
  try {
    const { repoId } = req.params;

    const repo = await Repository.findOne({ _id: repoId, userId: req.user._id });
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const scans = await Scan.find({ repoId }).sort({ createdAt: -1 });
    res.json(scans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE SCAN RESULT OUTCOME
export const getResult = async (req, res) => {
  try {
    const { scanId } = req.params;

    const scan = await Scan.findOne({ _id: scanId, userId: req.user._id }).populate("repoId");
    if (!scan) {
      return res.status(404).json({ message: "Scan result not found" });
    }

    res.json(scan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { triggerScan, getHistory, getResult };
