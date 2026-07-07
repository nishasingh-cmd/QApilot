import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getRepositorySettings, updateRepositorySettings } from "../controllers/settingController.js";

const router = express.Router();

import RepositoryActivity from "../models/RepositoryActivity.js";

// Apply JWT verification middleware to secure Settings configuration
router.get("/activity/logs", protect, async (req, res) => {
  try {
    const list = await RepositoryActivity.find({}).sort({ timestamp: -1 }).limit(100);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:repoId/settings", protect, getRepositorySettings);
router.patch("/:repoId/settings", protect, updateRepositorySettings);

export default router;
