import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireWorkspaceAccess } from "../middleware/roleMiddleware.js";
import { getUsage } from "../controllers/usageController.js";

const router = express.Router();

router.get("/", protect, requireWorkspaceAccess, getUsage);

export default router;
