import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserRepositories } from "../services/repositoryService.js";

const router = express.Router();

// GET ALL USER REPOS (REAL DATA)
router.get("/", protect, async (req, res) => {
  try {
    const repos = await getUserRepositories(req.user._id);
    res.json(repos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
