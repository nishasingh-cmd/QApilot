import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireWorkspaceAccess } from "../middleware/roleMiddleware.js";
import {
  getPlans,
  getSubscription,
  changePlan,
  cancelSubscription
} from "../controllers/billingController.js";

const router = express.Router();

router.get("/plans", protect, getPlans);
router.get("/subscription", protect, requireWorkspaceAccess, getSubscription);
router.patch("/change-plan", protect, requireWorkspaceAccess, changePlan);
router.post("/cancel", protect, requireWorkspaceAccess, cancelSubscription);

export default router;
