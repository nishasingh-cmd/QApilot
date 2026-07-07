import express from "express";
import { getHealth, getDatabaseHealth, getRedisHealth, getWorkersHealth } from "../controllers/healthController.js";

const router = express.Router();

router.get("/", getHealth);
router.get("/database", getDatabaseHealth);
router.get("/redis", getRedisHealth);
router.get("/workers", getWorkersHealth);

export default router;
