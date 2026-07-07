import mongoose from "mongoose";
import { connection as redisConnection } from "../config/redis.js";
import Job from "../models/Job.js";

/**
 * GET /api/health
 * General system info — memory, uptime, Node version.
 */
export const getHealth = async (req, res) => {
  try {
    const memory = process.memoryUsage();
    res.json({
      status: "healthy",
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`
      },
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/health/database
 * MongoDB connection status.
 */
export const getDatabaseHealth = async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const statesMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
    res.json({
      status: state === 1 ? "healthy" : "unhealthy",
      connectionState: statesMap[state] || "unknown",
      databaseName: mongoose.connection.name || "QApilot"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/health/redis
 * ioredis client connection status.
 */
export const getRedisHealth = async (req, res) => {
  try {
    const redisState = redisConnection ? redisConnection.status : "not_configured";
    res.json({
      status: redisState === "ready" ? "healthy" : "offline",
      redisState
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/health/workers
 * BullMQ job queue statistics from the Job collection.
 */
export const getWorkersHealth = async (req, res) => {
  try {
    const [activeJobs, pendingJobs, failedJobs, completedJobs] = await Promise.all([
      Job.countDocuments({ status: "processing" }),
      Job.countDocuments({ status: "pending" }),
      Job.countDocuments({ status: "failed" }),
      Job.countDocuments({ status: "completed" })
    ]);
    res.json({
      status: "healthy",
      statistics: { active: activeJobs, pending: pendingJobs, failed: failedJobs, completed: completedJobs }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/health/live
 * Kubernetes/Docker liveness probe — process is alive.
 */
export const getLiveness = (req, res) => {
  res.status(200).json({ alive: true, timestamp: new Date() });
};

/**
 * GET /api/health/ready
 * Kubernetes/Docker readiness probe — all critical dependencies connected.
 */
export const getReadiness = async (req, res) => {
  const checks = {
    database: false,
    redis: false
  };

  // MongoDB check
  checks.database = mongoose.connection.readyState === 1;

  // Redis check (optional dependency — degraded mode allowed)
  checks.redis = redisConnection ? redisConnection.status === "ready" : true;

  const ready = checks.database; // Only MongoDB is required for readiness
  res.status(ready ? 200 : 503).json({
    ready,
    checks,
    timestamp: new Date()
  });
};

export default { getHealth, getDatabaseHealth, getRedisHealth, getWorkersHealth, getLiveness, getReadiness };
