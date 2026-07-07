import express from "express";
import {
  getHealth,
  getDatabaseHealth,
  getRedisHealth,
  getWorkersHealth,
  getLiveness,
  getReadiness
} from "../controllers/healthController.js";

const router = express.Router();

router.get("/", getHealth);
router.get("/database", getDatabaseHealth);
router.get("/redis", getRedisHealth);
router.get("/workers", getWorkersHealth);
router.get("/live", getLiveness);    // Docker HEALTHCHECK / liveness probe
router.get("/ready", getReadiness);  // Readiness probe — all deps connected

export default router;
