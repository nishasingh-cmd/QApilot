import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getFindings,
  getFindingById,
  updateFinding,
  resolveFinding,
  ignoreFinding,
  assignFinding,
  bulkAction,
  deleteFinding
} from "../controllers/findingController.js";

const router = express.Router();

// Apply protect middleware authentication to all findings endpoints
router.get("/", protect, getFindings);
router.post("/bulk", protect, bulkAction);
router.get("/:id", protect, getFindingById);
router.patch("/:id", protect, updateFinding);
router.patch("/:id/resolve", protect, resolveFinding);
router.patch("/:id/ignore", protect, ignoreFinding);
router.patch("/:id/assign", protect, assignFinding);
router.delete("/:id", protect, deleteFinding);

export default router;
