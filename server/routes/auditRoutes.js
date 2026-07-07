import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireWorkspaceAccess } from "../middleware/roleMiddleware.js";
import { getAuditLogs } from "../controllers/auditController.js";

const router = express.Router();

router.get("/", protect, requireWorkspaceAccess, getAuditLogs);

export default router;
