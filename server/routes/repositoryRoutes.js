import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Repository from "../models/Repository.js";
import { getUserRepositories } from "../services/repositoryService.js";
import { syncUserRepositories } from "../services/repositorySyncEngine.js";
import { computeRepoMetrics } from "../services/repoMetricsService.js";

const router = express.Router();

// GET ALL USER REPOS
router.get("/", protect, async (req, res) => {
  try {
    const repos = await getUserRepositories(req.user._id);
    res.json(repos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET DASHBOARD OVERVIEW STATS
router.get("/overview", protect, async (req, res) => {
  try {
    const repos = await Repository.find({ userId: req.user._id });
    
    const totalRepositories = repos.length;
    const activeRepositories = repos.filter((r) => r.healthScore >= 70).length; // Health >= 70 is deemed active/healthy

    const totalHealth = repos.reduce((sum, r) => sum + (r.healthScore || 0), 0);
    const healthScoreAverage = totalRepositories > 0 
      ? Math.round(totalHealth / totalRepositories) 
      : 0;

    const recentlyUpdated = [...repos]
      .sort((a, b) => new Date(b.updatedAt || b.lastSyncedAt || 0) - new Date(a.updatedAt || a.lastSyncedAt || 0))
      .slice(0, 4)
      .map((r) => ({
        id: r._id,
        name: r.name,
        fullName: r.fullName,
        healthScore: r.healthScore,
        language: r.language || "Javascript",
        updatedAt: r.updatedAt || r.lastSyncedAt
      }));

    res.json({
      totalRepositories,
      activeRepositories,
      healthScoreAverage,
      recentlyUpdated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TRIGGER MANUAL SYNC
router.get("/sync", protect, async (req, res) => {
  try {
    const synced = await syncUserRepositories(req.user._id);
    res.json({
      message: "Repositories synced successfully",
      repositories: synced
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET COMPUTED METRICS
router.get("/metrics/:id", protect, async (req, res) => {
  try {
    const repo = await Repository.findOne({ _id: req.params.id, userId: req.user._id });
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const metrics = computeRepoMetrics(repo);
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
