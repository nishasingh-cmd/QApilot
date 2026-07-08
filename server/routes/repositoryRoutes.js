import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Repository from "../models/Repository.js";
import Finding from "../models/Finding.js";
import RepositoryFile from "../models/RepositoryFile.js";
import { getUserRepositories } from "../services/repositoryService.js";
import { syncUserRepositories } from "../services/repositorySyncEngine.js";
import { computeRepoMetrics } from "../services/repoMetricsService.js";
import { dispatchJob } from "../services/jobDispatcher.js";

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

    // Dynamic metrics from Finding database model
    const openFindings = await Finding.countDocuments({ userId: req.user._id, status: "open" });
    const criticalFindings = await Finding.countDocuments({ userId: req.user._id, status: "open", severity: "critical" });
    const resolvedFindings = await Finding.countDocuments({ userId: req.user._id, status: "resolved" });

    const reposWithIssues = await Finding.distinct("repositoryId", { userId: req.user._id, status: "open" });
    const repositoriesWithIssues = reposWithIssues.length;

    const openFindingsDocs = await Finding.find({ userId: req.user._id, status: "open" }, { severity: 1 }).lean();
    let severitySum = 0;
    const sevMap = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
    openFindingsDocs.forEach((f) => {
      severitySum += (sevMap[f.severity] || 3);
    });
    const averageSeverity = openFindingsDocs.length > 0 
      ? (severitySum / openFindingsDocs.length).toFixed(1) 
      : "0.0";

    res.json({
      totalRepositories,
      activeRepositories,
      healthScoreAverage,
      recentlyUpdated,
      openFindings,
      criticalFindings,
      resolvedFindings,
      repositoriesWithIssues,
      averageSeverity
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

// POST /api/repositories/:id/sync-files
router.post("/:id/sync-files", protect, async (req, res) => {
  try {
    const repo = await Repository.findOne({ _id: req.params.id, userId: req.user._id });
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const job = await dispatchJob("repository", "sync-files", {
      userId: req.user._id,
      repositoryId: repo._id,
      type: "filesync"
    });

    res.json({
      message: "Repository file sync enqueued successfully",
      jobId: job.jobId,
      status: job.status
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/repositories/:id/files
router.get("/:id/files", protect, async (req, res) => {
  try {
    const repo = await Repository.findOne({ _id: req.params.id, userId: req.user._id });
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const files = await RepositoryFile.find({ repositoryId: repo._id }).select("-content").lean();

    const totalFiles = files.length;
    const langMap = {};
    files.forEach((f) => {
      const lang = f.language || "Unknown";
      if (!langMap[lang]) {
        langMap[lang] = { count: 0, size: 0 };
      }
      langMap[lang].count += 1;
      langMap[lang].size += (f.size || 0);
    });

    const languages = Object.keys(langMap).map((name) => ({
      name,
      count: langMap[name].count,
      size: langMap[name].size
    })).sort((a, b) => b.count - a.count);

    const foldersSet = new Set();
    files.forEach((f) => {
      const parts = f.path.split("/");
      if (parts.length > 1) {
        let current = "";
        for (let i = 0; i < parts.length - 1; i++) {
          current = current ? `${current}/${parts[i]}` : parts[i];
          foldersSet.add(current);
        }
      }
    });
    const folders = Array.from(foldersSet).sort();

    const largestFiles = [...files]
      .sort((a, b) => (b.size || 0) - (a.size || 0))
      .slice(0, 5)
      .map((f) => ({
        id: f._id,
        name: f.name,
        path: f.path,
        size: f.size,
        language: f.language
      }));

    const recentChanges = [...files]
      .sort((a, b) => new Date(b.updatedAt || b.lastSynced || 0) - new Date(a.updatedAt || a.lastSynced || 0))
      .slice(0, 5)
      .map((f) => ({
        id: f._id,
        name: f.name,
        path: f.path,
        lastSynced: f.lastSynced || f.updatedAt
      }));

    res.json({
      files: files.map((f) => ({
        id: f._id,
        name: f.name,
        path: f.path,
        extension: f.extension,
        sha: f.sha,
        size: f.size,
        language: f.language,
        lastSynced: f.lastSynced,
        lastCommit: f.lastCommit
      })),
      summary: {
        totalFiles,
        languages,
        folders,
        largestFiles,
        recentChanges,
        syncStatus: repo.syncStatus || "idle",
        syncProgress: repo.syncProgress || 0,
        syncError: repo.syncError || null,
        lastSyncTime: repo.lastSyncedAt || null
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/repositories/:id/file/:fileId
router.get("/:id/file/:fileId", protect, async (req, res) => {
  try {
    const repo = await Repository.findOne({ _id: req.params.id, userId: req.user._id });
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const file = await RepositoryFile.findOne({ _id: req.params.fileId, repositoryId: repo._id });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
