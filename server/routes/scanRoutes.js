import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { triggerScan, getHistory, getResult } from "../controllers/scanController.js";

const router = express.Router();

router.post("/run/:repoId", protect, triggerScan);
router.get("/history/:repoId", protect, getHistory);
router.get("/result/:scanId", protect, getResult);

export default router;
