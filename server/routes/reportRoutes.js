import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  generateReport,
  getReports,
  getReportById,
  compareReports,
  exportReport,
  shareReport
} from "../controllers/reportController.js";

const router = express.Router();

// All routes are protected by auth token verification middleware
router.post("/generate/:scanId", protect, generateReport);
router.get("/", protect, getReports);
router.get("/compare", protect, compareReports); // support GET comparison if requested
router.post("/compare", protect, compareReports); // main endpoint
router.get("/:id", protect, getReportById);
router.get("/:id/export", protect, exportReport);
router.post("/:id/share", protect, shareReport);

export default router;
