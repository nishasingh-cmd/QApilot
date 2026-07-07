import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getPayments, createPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/", protect, getPayments);
router.post("/create", protect, createPayment);

export default router;
