import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  deleteAllNotifications
} from "../controllers/notificationController.js";

const router = express.Router();

// Apply auth middleware protection to all notification endpoints
router.get("/", protect, getNotifications);
router.patch("/read-all", protect, markAllRead);
router.patch("/:id/read", protect, markRead);
router.delete("/", protect, deleteAllNotifications);
router.delete("/:id", protect, deleteNotification);

export default router;
