import Scan from "../models/Scan.js";
import Repository from "../models/Repository.js";
import { runScan } from "../services/scanEngine.js";

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

    // 2. Perform static analysis scan asynchronously to prevent route timeouts
    // (Simulate brief calculation delay to match real world operations)
    setTimeout(async () => {
      const startTime = Date.now();
      try {
        const result = await runScan(repoId);
        const elapsedSeconds = Math.round((Date.now() - startTime) / 1000) || 1;

        // Update Scan record
        scan.scores = result.scores;
        scan.findings = result.findings;
        scan.status = "success";
        scan.elapsedTime = elapsedSeconds;
        await scan.save();

        // Sync back to Repository's healthScore
        repo.healthScore = result.scores.qualityScore;
        await repo.save();

        console.log(`Scan completed successfully for ${repo.name}. Quality Score: ${result.scores.qualityScore}% ✅`);
      } catch (scanErr) {
        console.error(`Background scan failed for ${repo.name}:`, scanErr.message);
        scan.status = "failed";
        await scan.save();
      }
    }, 2500);

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
