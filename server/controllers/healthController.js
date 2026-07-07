import mongoose from "mongoose";
import { connection as redisConnection } from "../config/redis.js";
import Job from "../models/Job.js";

/**
 * Global health info diagnostics check.
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
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * MongoDB connection status check.
 */
export const getDatabaseHealth = async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const statesMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };

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
 * Redis client status check.
 */
export const getRedisHealth = async (req, res) => {
  try {
    const redisState = redisConnection ? redisConnection.status : "not_configured";
    const active = redisState === "ready";
    res.json({
      status: active ? "healthy" : "offline",
      redisState
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * BullMQ worker queue statistics from Job collection.
 */
export const getWorkersHealth = async (req, res) => {
  try {
    const activeJobs = await Job.countDocuments({ status: "processing" });
    const pendingJobs = await Job.countDocuments({ status: "pending" });
    const failedJobs = await Job.countDocuments({ status: "failed" });
    const completedJobs = await Job.countDocuments({ status: "completed" });

    res.json({
      status: "healthy",
      statistics: {
        active: activeJobs,
        pending: pendingJobs,
        failed: failedJobs,
        completed: completedJobs
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getHealth,
  getDatabaseHealth,
  getRedisHealth,
  getWorkersHealth
};
