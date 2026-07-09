import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createReview,
  getReviews,
  getReviewById,
  deleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/", protect, getReviews);
router.get("/:id", protect, getReviewById);
router.delete("/:id", protect, deleteReview);

export default router;
