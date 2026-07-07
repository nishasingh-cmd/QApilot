import express from "express";
import { handleGithubWebhook } from "../controllers/webhookController.js";

const router = express.Router();

// Register the GitHub Webhook listener
router.post("/github", handleGithubWebhook);

export default router;
