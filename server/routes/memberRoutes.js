import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireWorkspaceAccess, requirePermission } from "../middleware/roleMiddleware.js";
import {
  getWorkspaceMembers,
  inviteMember,
  updateMemberRole,
  removeMember
} from "../controllers/memberController.js";

const router = express.Router();

// Fetch workspace teammates - requires generic membership access
router.get("/workspaces/:workspaceId/members", protect, requireWorkspaceAccess, getWorkspaceMembers);

// Invite new teammate - requires manageMembers administrative permission
router.post("/workspaces/:workspaceId/invite", protect, requireWorkspaceAccess, requirePermission("manageMembers"), inviteMember);

// Change teammate access roles - requires manageMembers administrative permission
router.patch("/members/:id/role", protect, requireWorkspaceAccess, requirePermission("manageMembers"), updateMemberRole);

// Remove teammate workspace authorization - requires manageMembers administrative permission
router.delete("/members/:id", protect, requireWorkspaceAccess, requirePermission("manageMembers"), removeMember);

export default router;
