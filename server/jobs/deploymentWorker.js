import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { executePipeline } from "../services/deploymentEngine.js";
import Job from "../models/Job.js";

/**
 * Triggered background execution handler for pipeline deployments.
 */
export const processDeploymentJob = async (data, updateProgress) => {
  const { deploymentId, userId } = data;
  await updateProgress(10);

  // Execute the multi-stage deployment sim execution
  await executePipeline(deploymentId, userId);
  
  await updateProgress(100);
  return { success: true };
};

// Initialize BullMQ Worker if connection is active
if (connection) {
  const worker = new Worker(
    "deployment",
    async (job) => {
      console.log(`BullMQ Worker processing deployment job: ${job.id}`);
      const jobDoc = await Job.findOne({ jobId: job.id });
      if (jobDoc) {
        jobDoc.status = "processing";
        jobDoc.startedAt = new Date();
        await jobDoc.save();
      }

      const result = await processDeploymentJob(job.data, async (progress) => {
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
    console.error(`BullMQ deployment worker failed job ${job?.id}:`, err.message);
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
export default { processDeploymentJob };
