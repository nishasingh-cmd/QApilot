import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { getOverview } from "../services/analyticsService.js";
import Job from "../models/Job.js";

/**
 * Re-computes engineering metrics and overview analytics.
 */
export const processAnalyticsJob = async (data, updateProgress) => {
  const { userId } = data;
  await updateProgress(30);

  const stats = await getOverview(userId);
  await updateProgress(100);

  return stats;
};

// Initialize BullMQ Worker if connection is active
if (connection) {
  const worker = new Worker(
    "analytics",
    async (job) => {
      console.log(`BullMQ Worker processing analytics job: ${job.id}`);
      const jobDoc = await Job.findOne({ jobId: job.id });
      if (jobDoc) {
        jobDoc.status = "processing";
        jobDoc.startedAt = new Date();
        await jobDoc.save();
      }

      const result = await processAnalyticsJob(job.data, async (progress) => {
        await job.updateProgress(progress);
        if (jobDoc) {
          jobDoc.progress = progress;
          await jobDoc.save();
        }
      });

      if (jobDoc) {
        jobDoc.status = "completed";
        jobDoc.progress = 100;
        jobDoc.completedAt = new Date();
        await jobDoc.save();
      }
      return result;
    },
    { connection }
  );

  worker.on("failed", async (job, err) => {
    console.error(`BullMQ analytics worker failed job ${job?.id}:`, err.message);
    if (job) {
      const jobDoc = await Job.findOne({ jobId: job.id });
      if (jobDoc) {
        jobDoc.status = "failed";
        jobDoc.failedReason = err.message;
        jobDoc.completedAt = new Date();
        await jobDoc.save();
      }
    }
  });
}
