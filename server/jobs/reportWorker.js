import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { generateReportFromScan } from "../services/reportEngine.js";
import Job from "../models/Job.js";

/**
 * Compiles dynamic PDF/JSON reports for codebase scans.
 */
export const processReportJob = async (data, updateProgress) => {
  const { scanId, userId } = data;
  await updateProgress(40);

  const report = await generateReportFromScan(scanId, userId);
  await updateProgress(100);

  return report;
};

// Initialize BullMQ Worker if connection is active
if (connection) {
  const worker = new Worker(
    "report",
    async (job) => {
      console.log(`BullMQ Worker processing report job: ${job.id}`);
      const jobDoc = await Job.findOne({ jobId: job.id });
      if (jobDoc) {
        jobDoc.status = "processing";
        jobDoc.startedAt = new Date();
        await jobDoc.save();
      }

      const result = await processReportJob(job.data, async (progress) => {
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
    console.error(`BullMQ report worker failed job ${job?.id}:`, err.message);
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
