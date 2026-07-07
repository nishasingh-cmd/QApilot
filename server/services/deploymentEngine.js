import Deployment from "../models/Deployment.js";
import DeploymentLog from "../models/DeploymentLog.js";
import DeploymentEnvironment from "../models/DeploymentEnvironment.js";
import Repository from "../models/Repository.js";
import { createNotification } from "./notificationService.js";

// Stage logs seeding helper
const STAGE_LOGS = {
  queued: [
    { level: "info", message: "Deployment initial request submitted to background job dispatcher." },
    { level: "info", message: "Acquiring CI/CD worker environment instance..." }
  ],
  installing: [
    { level: "info", message: "Running: npm install --frozen-lockfile" },
    { level: "info", message: "Fetched 320 packages from registry cache." },
    { level: "info", message: "Dependencies successfully resolved and installed." }
  ],
  testing: [
    { level: "info", message: "Running test runner: npm test" },
    { level: "info", message: "PASS  src/tests/auth.test.js (8.2s)" },
    { level: "info", message: "PASS  src/tests/sync.test.js (4.1s)" },
    { level: "info", message: "Test execution finished successfully. All 14 checks passed." }
  ],
  building: [
    { level: "info", message: "Running production builder: npm run build" },
    { level: "info", message: "vite v8.1.3 building client environment for production..." },
    { level: "info", message: "transforming modules and rendering chunks..." },
    { level: "info", message: "Build output saved successfully in /dist (486.2kB)." }
  ],
  sec_scan: [
    { level: "info", message: "Triggering AI vulnerability security scan..." },
    { level: "info", message: "Scanning third-party configurations and dependency licenses..." },
    { level: "info", message: "Scan finished: 0 critical vulnerabilities found." }
  ],
  quality_gate: [
    { level: "info", message: "Analyzing quality gate threshold metrics..." },
    { level: "info", message: "Quality score threshold matches gate limit (>= 80%). Gate status: PASSED." }
  ],
  packaging: [
    { level: "info", message: "Packaging build artifacts into target deploy container..." },
    { level: "info", message: "Container image tagged and pushed to secure registry." }
  ],
  deploying: [
    { level: "info", message: "Initiating deploy task pipeline to target hosting cluster..." },
    { level: "info", message: "Routing traffic to new container slot instance..." },
    { level: "info", message: "Health checks passed. Live endpoint verified." }
  ]
};

/**
 * Executes a simulated CI/CD multi-stage deployment build pipeline.
 */
export const executePipeline = async (deploymentId, userId) => {
  const startTime = Date.now();

  const deployment = await Deployment.findById(deploymentId);
  if (!deployment) {
    throw new Error(`Deployment record '${deploymentId}' not found.`);
  }

  const repo = await Repository.findById(deployment.repositoryId);
  const repoName = repo ? repo.name : "unknown-repo";

  const env = await DeploymentEnvironment.findById(deployment.environmentId);
  const envName = env ? env.name : "production";

  // 1. Started Notification
  await createNotification(userId, {
    type: "system_alert",
    title: "Deployment started",
    message: `Deploy pipeline initialized for repository '${repoName}' on '${envName}' environment.`,
    repository: repoName,
    severity: "info"
  });

  const stagesList = [
    "queued",
    "installing",
    "testing",
    "building",
    "sec_scan",
    "quality_gate",
    "packaging",
    "deploying"
  ];

  try {
    for (const stage of stagesList) {
      // Update deployment state
      deployment.status = stage;
      await deployment.save();

      // Write logs for this stage
      const logs = STAGE_LOGS[stage] || [];
      for (const log of logs) {
        await DeploymentLog.create({
          deploymentId,
          stage,
          level: log.level,
          message: log.message
        });
      }

      // Brief delay to simulate action processing (1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Determine completion details
    const totalDuration = Math.round((Date.now() - startTime) / 1000);
    const deployUrl = env && env.url ? env.url : `https://${repoName}-${envName}.qapilot.app`;

    deployment.status = "completed";
    deployment.duration = totalDuration;
    deployment.url = deployUrl;
    await deployment.save();

    // Write final log
    await DeploymentLog.create({
      deploymentId,
      stage: "completed",
      level: "info",
      message: `Deployment pipeline completed successfully in ${totalDuration}s. Live URL: ${deployUrl}`
    });

    // Completed Notification
    await createNotification(userId, {
      type: "system_alert",
      title: deployment.rollbackFrom ? "Rollback completed" : "Deployment completed",
      message: `Deploy v1.0 pipeline finished successfully on '${envName}' in ${totalDuration}s.`,
      repository: repoName,
      severity: "success"
    });

  } catch (err) {
    console.error(`Pipeline run failure on deployment ${deploymentId}:`, err.message);

    const totalDuration = Math.round((Date.now() - startTime) / 1000);
    deployment.status = "failed";
    deployment.duration = totalDuration;
    await deployment.save();

    await DeploymentLog.create({
      deploymentId,
      stage: "failed",
      level: "error",
      message: `Pipeline crashed: ${err.message}`
    });

    // Failed Notification
    await createNotification(userId, {
      type: "system_alert",
      title: "Deployment failed",
      message: `Deploy pipeline crashed on '${envName}' environment: ${err.message}`,
      repository: repoName,
      severity: "critical"
    });
  }
};

export default { executePipeline };
