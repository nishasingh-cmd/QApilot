import { isRedisAvailable, connection } from "../config/redis.js";
import Job from "../models/Job.js";

// Import workers logic directly to run fallbacks inline
import { processScanJob } from "../jobs/scanWorker.js";
import { processRepositoryJob } from "../jobs/repositoryWorker.js";
import { processAnalyticsJob } from "../jobs/analyticsWorker.js";
import { processReportJob } from "../jobs/reportWorker.js";
import { processNotificationJob } from "../jobs/notificationWorker.js";

// Mapping inline workers
const processJobMap = {
  scan: processScanJob,
  repository: processRepositoryJob,
  analytics: processAnalyticsJob,
  report: processReportJob,
  notification: processNotificationJob
};

/**
 * Dispatches a task to BullMQ or falls back to inline setImmediate execution.
 */
export const dispatchJob = async (queueName, jobName, data) => {
  const jobId = `${queueName}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  // 1. Create tracking document in database
  const jobDoc = await Job.create({
    queue: queueName,
    jobId,
    status: "pending",
    userId: data.userId || null,
    repositoryId: data.repositoryId || null,
    data
  });

  if (isRedisAvailable && connection) {
    try {
      // Dynamically import queues to avoid circular dependencies
      const { default: queue } = await import(`../queues/${queueName}Queue.js`);
      if (queue) {
        await queue.add(jobName, data, {
          jobId,
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000
          }
        });
        console.log(`Enqueued BullMQ job: ${jobId}`);
        return jobDoc;
      }
    } catch (err) {
      console.warn(`Failed to enqueue job ${jobId} in BullMQ, falling back inline:`, err.message);
    }
  }

  // Fallback in-memory runner
  console.log(`Executing background job inline: ${jobId}`);
  setImmediate(async () => {
    jobDoc.status = "processing";
    jobDoc.startedAt = new Date();
    await jobDoc.save();

    try {
      const runner = processJobMap[queueName];
      if (!runner) {
        throw new Error(`No inline runner defined for queue: ${queueName}`);
      }

      const result = await runner(data, async (progress) => {
        jobDoc.progress = progress;
        await jobDoc.save();
      });

      jobDoc.status = "completed";
      jobDoc.progress = 100;
      jobDoc.completedAt = new Date();
      await jobDoc.save();
    } catch (err) {
      console.error(`Failed inline job ${jobId}:`, err.message);
      jobDoc.status = "failed";
      jobDoc.failedReason = err.message;
      jobDoc.completedAt = new Date();
      await jobDoc.save();
    }
  });

  return jobDoc;
};

export default { dispatchJob };
