import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { syncUserRepositories } from "../services/repositorySyncEngine.js";
import Job from "../models/Job.js";

/**
 * Synchronize repository configuration from the GitHub API.
 */
export const processRepositoryJob = async (data, updateProgress) => {
  const { userId } = data;
  await updateProgress(20);

  const synced = await syncUserRepositories(userId);
  await updateProgress(100);

  return synced;
};

// Initialize BullMQ Worker if connection is active
if (connection) {
  const worker = new Worker(
    "repository",
    async (job) => {
      console.log(`BullMQ Worker processing repository sync job: ${job.id}`);
      const jobDoc = await Job.findOne({ jobId: job.id });
      if (jobDoc) {
        jobDoc.status = "processing";
        jobDoc.startedAt = new Date();
        await jobDoc.save();
      }

      const result = await processRepositoryJob(job.data, async (progress) => {
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
    console.error(`BullMQ repository sync worker failed job ${job?.id}:`, err.message);
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
