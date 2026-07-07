import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { chatAssistant, getChatHistory, clearChatHistory } from "../controllers/assistantController.js";

const router = express.Router();

// Apply JWT verification middleware to secure assistant access
router.post("/chat", protect, chatAssistant);
router.get("/history", protect, getChatHistory);
router.delete("/history", protect, clearChatHistory);

export default router;
