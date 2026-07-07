import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { createNotification } from "../services/notificationService.js";
import Job from "../models/Job.js";

/**
 * Creates dynamic system alerts and notification items.
 */
export const processNotificationJob = async (data, updateProgress) => {
  const { userId, notificationData } = data;
  await updateProgress(50);

  const notif = await createNotification(userId, notificationData);
  await updateProgress(100);

  return notif;
};

// Initialize BullMQ Worker if connection is active
if (connection) {
  const worker = new Worker(
    "notification",
    async (job) => {
      console.log(`BullMQ Worker processing notification job: ${job.id}`);
      const jobDoc = await Job.findOne({ jobId: job.id });
      if (jobDoc) {
        jobDoc.status = "processing";
        jobDoc.startedAt = new Date();
        await jobDoc.save();
      }

      const result = await processNotificationJob(job.data, async (progress) => {
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
    console.error(`BullMQ notification worker failed job ${job?.id}:`, err.message);
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
