import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import Scan from "../models/Scan.js";
import { runScan } from "../services/scanEngine.js";
import { createNotification } from "../services/notificationService.js";
import { generateReportFromScan } from "../services/reportEngine.js";
import RepositorySetting from "../models/RepositorySetting.js";
import Repository from "../models/Repository.js";
import Job from "../models/Job.js";

/**
 * Executes a codebase scan and updates database logs.
 */
export const processScanJob = async (data, updateProgress) => {
  const { repoId, scanId, userId } = data;
  await updateProgress(15);

  const scan = await Scan.findById(scanId);
  if (!scan) throw new Error("Scan record not found in database");

  const repo = await Repository.findById(repoId);
  if (!repo) throw new Error("Repository not connected");

  // Fetch Settings
  let settings = await RepositorySetting.findOne({ repositoryId: repoId });
  if (!settings) {
    settings = await RepositorySetting.create({ repositoryId: repoId, userId });
  }

  // Execute scan
  const startTime = Date.now();
  const result = await runScan(repoId, scanId, userId);
  const elapsed = Math.round((Date.now() - startTime) / 1000) || 1;

  scan.scores = result.scores;
  scan.findings = result.findings;
  scan.status = "success";
  scan.elapsedTime = elapsed;
  await scan.save();
  await updateProgress(70);

  if (settings.enableNotifications) {
    await createNotification(userId, {
      type: "scan_completed",
      title: "Scan completed",
      message: `Automatic codebase scan finished on '${repo.name}' with Quality index: ${result.scores.qualityScore}%.`,
      repository: repo.name,
      severity: "success"
    });

    const criticals = result.findings.filter((f) => f.severity === "critical");
    for (const f of criticals) {
      await createNotification(userId, {
        type: "critical_finding",
        title: "Critical finding detected",
        message: `Critical vulnerability '${f.title}' detected in '${repo.name}' (file: ${f.file.split('/').pop()}).`,
        repository: repo.name,
        severity: "critical"
      });
    }
  }

  // Generate reports
  if (settings.generateReport) {
    await generateReportFromScan(scanId, userId);
    if (settings.enableNotifications) {
      await createNotification(userId, {
        type: "scan_completed",
        title: "AI report generated",
        message: `Automated PDF reporting generated for scan execution.`,
        repository: repo.name,
        severity: "success"
      });
    }
  }

  await updateProgress(100);
  return result;
};

// Initialize BullMQ Worker if connection is active
if (connection) {
  const worker = new Worker(
    "scan",
    async (job) => {
      console.log(`BullMQ Worker processing scan job: ${job.id}`);
      const jobDoc = await Job.findOne({ jobId: job.id });
      if (jobDoc) {
        jobDoc.status = "processing";
        jobDoc.startedAt = new Date();
        await jobDoc.save();
      }

      const result = await processScanJob(job.data, async (progress) => {
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
    { connection, concurrency: 5 }
  );

  worker.on("failed", async (job, err) => {
    console.error(`BullMQ scan worker failed job ${job?.id}:`, err.message);
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
