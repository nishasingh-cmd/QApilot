import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import Job from "../models/Job.js";
import { executeReview } from "../services/codeReviewService.js";

/**
 * BullMQ worker processor function.
 */
export const processCodeReviewJob = async (data, updateProgress) => {
  const { reviewId } = data;
  return await executeReview(reviewId, updateProgress);
};

// Initialize worker if connection is active
if (connection) {
  const worker = new Worker(
    "codeReview",
    async (job) => {
      console.log(`BullMQ Worker processing codeReview job: ${job.id}`);
      const jobDoc = await Job.findOne({ jobId: job.id });
      if (jobDoc) {
        jobDoc.status = "processing";
        jobDoc.startedAt = new Date();
        await jobDoc.save();
      }

      const result = await processCodeReviewJob(job.data, async (progress) => {
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
    { connection, concurrency: 3 }
  );

  worker.on("failed", async (job, err) => {
    console.error(`BullMQ codeReview worker failed job ${job?.id}:`, err.message);
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
