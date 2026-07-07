import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAnalyticsOverview,
  getAnalyticsTrends,
  getAnalyticsRepositories,
  getAnalyticsTeam,
  getAnalyticsAI,
  getAnalyticsExecutiveSummary,
  exportAnalyticsData
} from "../controllers/analyticsController.js";

const router = express.Router();

// Apply JWT verification protect to all endpoints
router.get("/overview", protect, getAnalyticsOverview);
router.get("/trends", protect, getAnalyticsTrends);
router.get("/repositories", protect, getAnalyticsRepositories);
router.get("/team", protect, getAnalyticsTeam);
router.get("/ai", protect, getAnalyticsAI);
router.get("/executive-summary", protect, getAnalyticsExecutiveSummary);
router.get("/export", protect, exportAnalyticsData);

export default router;
