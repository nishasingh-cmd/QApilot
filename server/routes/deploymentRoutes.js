import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getDeployments,
  getDeploymentById,
  getDeploymentLogs,
  createDeployment,
  startDeployment,
  rollbackDeployment
} from "../controllers/deploymentController.js";

const router = express.Router();

router.get("/", protect, getDeployments);
router.post("/", protect, createDeployment);
router.get("/:id", protect, getDeploymentById);
router.post("/:id/start", protect, startDeployment);
router.post("/:id/rollback", protect, rollbackDeployment);
router.get("/:id/logs", protect, getDeploymentLogs);

export default router;
