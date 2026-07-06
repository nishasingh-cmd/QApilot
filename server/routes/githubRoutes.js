import express from "express";
import { githubCallback } from "../controllers/githubController.js";

const router = express.Router();

router.get("/callback", githubCallback);

export default router;
