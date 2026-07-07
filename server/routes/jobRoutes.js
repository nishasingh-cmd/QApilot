import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getJobs, retryJob } from "../controllers/jobController.js";

const router = express.Router();

router.get("/", protect, getJobs);
router.post("/:id/retry", protect, retryJob);

export default router;
