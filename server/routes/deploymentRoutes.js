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
import { checkLimit } from "../middleware/limitMiddleware.js";

const router = express.Router();

router.get("/", protect, getDeployments);
router.post("/", protect, checkLimit("deployment"), createDeployment);
router.get("/:id", protect, getDeploymentById);
router.post("/:id/start", protect, checkLimit("deployment"), startDeployment);
router.post("/:id/rollback", protect, checkLimit("deployment"), rollbackDeployment);
router.get("/:id/logs", protect, getDeploymentLogs);

export default router;
