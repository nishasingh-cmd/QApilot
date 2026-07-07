import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { acceptInvitation, rejectInvitation } from "../controllers/invitationController.js";

const router = express.Router();

router.post("/accept", protect, acceptInvitation);
router.post("/reject", protect, rejectInvitation);

export default router;
