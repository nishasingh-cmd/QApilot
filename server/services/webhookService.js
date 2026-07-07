import crypto from "crypto";
import WebhookEvent from "../models/WebhookEvent.js";
import Repository from "../models/Repository.js";
import RepositoryActivity from "../models/RepositoryActivity.js";
import RepositorySetting from "../models/RepositorySetting.js";
import Scan from "../models/Scan.js";
import { runScan } from "./scanEngine.js";
import { syncUserRepositories } from "./repositorySyncEngine.js";
import { createNotification } from "./notificationService.js";
import { generateReportFromScan } from "./reportEngine.js";

import { dispatchJob } from "./jobDispatcher.js";

/**
 * Validates the HMAC X-Hub-Signature-256 header.
 */
export const verifyWebhookSignature = (req) => {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return false;

  const secret = process.env.GITHUB_WEBHOOK_SECRET || "qapilot-webhook-secret-key";
  const hmac = crypto.createHmac("sha256", secret);
  
  // Use timing safe equals on string digest
  const payload = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  const digest = "sha256=" + hmac.update(payload).digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "utf8"),
      Buffer.from(digest, "utf8")
    );
  } catch (err) {
    return false;
  }
};

/**
 * Parses repository name details from webhook payloads.
 */
const getRepoFullName = (payload) => {
  if (payload.repository) {
    return payload.repository.full_name;
  }
  return "";
};

/**
 * Main webhook processing entry point.
 */
export const processWebhook = async (githubEvent, deliveryId, payload) => {
  // 1. Prevent duplicate processing
  const existing = await WebhookEvent.findOne({ deliveryId });
  if (existing) {
    console.log(`Webhook delivery ID ${deliveryId} already logged. Ignoring.`);
    return;
  }

  // 2. Resolve Repository & User context
  const fullName = getRepoFullName(payload);
  const repo = await Repository.findOne({ $or: [{ fullName }, { name: payload.repository?.name }] });
  
  const userId = repo ? repo.userId : null;
  const repositoryId = repo ? repo._id : null;

  // 3. Create WebhookEvent entry
  const eventDoc = await WebhookEvent.create({
    repositoryId,
    userId,
    githubEvent,
    deliveryId,
    payload,
    processingStatus: "pending"
  });

  // 4. Run pipeline asynchronously
  // Start processing in the background and release execution
  setImmediate(async () => {
    try {
      eventDoc.processingStatus = "processing";
      await eventDoc.save();

      if (!repo) {
        throw new Error(`Repository ${fullName || "unknown"} not synced or connected in QAPilot.`);
      }

      // Parse payload details
      let branch = "main";
      let commitSha = "";
      let author = "git";
      let commitMessage = "GitHub event update";

      if (githubEvent === "push") {
        branch = payload.ref ? payload.ref.replace("refs/heads/", "") : "main";
        commitSha = payload.after || "";
        author = payload.pusher ? payload.pusher.name : "unknown";
        commitMessage = payload.head_commit ? payload.head_commit.message : "Triggered codebase push";
      } else if (githubEvent === "pull_request") {
        branch = payload.pull_request?.head?.ref || "main";
        commitSha = payload.pull_request?.head?.sha || "";
        author = payload.pull_request?.user?.login || "unknown";
        commitMessage = `PR #${payload.number}: ${payload.pull_request?.title || "Update PR"}`;
      } else if (githubEvent === "release") {
        branch = "main";
        commitSha = payload.release?.tag_name || "";
        author = payload.sender?.login || "git";
        commitMessage = `Release published: ${payload.release?.name || "New Release"}`;
      } else if (githubEvent === "create" || githubEvent === "delete") {
        branch = payload.ref || "main";
        author = payload.sender?.login || "git";
        commitMessage = `Branch/Tag event action: ${githubEvent}`;
      }

      // Update WebhookEvent parse details
      eventDoc.branch = branch;
      eventDoc.commitSha = commitSha;
      eventDoc.author = author;

      // 5. Trigger Repository Synchronization via Job Dispatcher
      await dispatchJob("repository", "sync-repositories", { userId, repositoryId: repo._id });

      // 6. Fetch Settings
      let settings = await RepositorySetting.findOne({ repositoryId: repo._id });
      if (!settings) {
        settings = await RepositorySetting.create({ repositoryId: repo._id, userId });
      }

      let triggeredScan = null;

      // Check if auto-scanning is enabled
      const shouldScan = settings.autoScan && (
        (githubEvent === "push" && settings.scanOnPush) ||
        (githubEvent === "pull_request" && settings.scanOnPullRequest)
      );

      if (shouldScan) {
        // Enqueue notifications for Push or PR event received
        if (settings.enableNotifications) {
          await dispatchJob("notification", "push-notification", {
            userId,
            notificationData: {
              type: "system_alert",
              title: githubEvent === "push" ? "Push event received" : "Pull request opened",
              message: `GitHub update event on '${repo.name}' (branch: ${branch}) by ${author}.`,
              repository: repo.name,
              severity: "info"
            }
          });
        }

        // Initialize scan
        const scan = await Scan.create({
          repoId: repo._id,
          userId,
          branch,
          status: "running"
        });

        triggeredScan = scan._id;

        if (settings.enableNotifications) {
          await dispatchJob("notification", "scan-started-notification", {
            userId,
            notificationData: {
              type: "scan_started",
              title: "Automatic scan started",
              message: `Background scan initialized on repository '${repo.name}' (branch: ${branch}).`,
              repository: repo.name,
              severity: "info"
            }
          });
        }

        // Enqueue Scan Job execution
        await dispatchJob("scan", "run-scan", { repoId: repo._id, scanId: scan._id, userId });
        
        // Enqueue Analytics refresh job
        await dispatchJob("analytics", "refresh-analytics", { userId });
      }

      // 7. Write RepositoryActivity Log
      await RepositoryActivity.create({
        event: githubEvent,
        repository: repo.name,
        branch,
        commit: commitMessage,
        author,
        status: "success",
        triggeredScan
      });

      eventDoc.processingStatus = "completed";
      eventDoc.processed = true;
      eventDoc.completedAt = new Date();
      await eventDoc.save();

    } catch (err) {
      console.error(`Error processing background webhook delivery:`, err.message);
      eventDoc.processingStatus = "failed";
      eventDoc.errorMessage = err.message;
      eventDoc.completedAt = new Date();
      await eventDoc.save();

      // Log failed activity
      if (repo) {
        await RepositoryActivity.create({
          event: githubEvent,
          repository: repo.name,
          branch: "main",
          commit: `Failed to process webhook event: ${err.message}`,
          author: "git",
          status: "failed"
        });
      }
    }
  });
};

export default {
  verifyWebhookSignature,
  processWebhook
};
