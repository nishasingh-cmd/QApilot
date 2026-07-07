import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace
} from "../controllers/workspaceController.js";

const router = express.Router();

router.get("/", protect, getWorkspaces);
router.post("/", protect, createWorkspace);
router.patch("/:id", protect, updateWorkspace);
router.delete("/:id", protect, deleteWorkspace);

export default router;
