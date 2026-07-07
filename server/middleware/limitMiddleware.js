import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";
import UsageRecord from "../models/UsageRecord.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import { ensureUserWorkspace } from "./roleMiddleware.js";

/**
 * Helper to seed SaaS pricing plans if they do not exist.
 */
export const ensurePlans = async () => {
  let free = await Plan.findOne({ name: "Free Trial" });
  if (!free) {
    free = await Plan.create({
      name: "Free Trial",
      monthlyPrice: 0,
      yearlyPrice: 0,
      repositoryLimit: 5,
      memberLimit: 3,
      scanLimit: 10,
      aiCredits: 10,
      deploymentLimit: 5,
      reportLimit: 5,
      analyticsFeatures: false
    });
  }

  let pro = await Plan.findOne({ name: "Developer Pro" });
  if (!pro) {
    pro = await Plan.create({
      name: "Developer Pro",
      monthlyPrice: 29,
      yearlyPrice: 290,
      repositoryLimit: 20,
      memberLimit: 10,
      scanLimit: 100,
      aiCredits: 150,
      deploymentLimit: 50,
      reportLimit: 50,
      analyticsFeatures: true
    });
  }

  let ent = await Plan.findOne({ name: "Enterprise Team" });
  if (!ent) {
    ent = await Plan.create({
      name: "Enterprise Team",
      monthlyPrice: 99,
      yearlyPrice: 990,
      repositoryLimit: 100,
      memberLimit: 50,
      scanLimit: 1000,
      aiCredits: 1000,
      deploymentLimit: 500,
      reportLimit: 500,
      analyticsFeatures: true
    });
  }

  return { free, pro, ent };
};

/**
 * Helper to ensure active subscription status and usage ledger document.
 */
export const ensureSubscriptionAndUsage = async (userId) => {
  const { workspace } = await ensureUserWorkspace(userId);
  const orgId = workspace.organizationId;

  const { free } = await ensurePlans();

  let sub = await Subscription.findOne({ organizationId: orgId }).populate("planId");
  if (!sub) {
    sub = await Subscription.create({
      organizationId: orgId,
      planId: free._id,
      billingCycle: "monthly",
      status: "trialing",
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days renewal
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    sub = await sub.populate("planId");
  }

  let usage = await UsageRecord.findOne({ organizationId: orgId });
  if (!usage) {
    usage = await UsageRecord.create({
      organizationId: orgId,
      repositoriesUsed: workspace.repositories?.length || 0,
      scansUsed: 0,
      reportsGenerated: 0,
      aiRequests: 0,
      deployments: 0,
      storageUsed: 0
    });
  }

  return { sub, usage, workspace, orgId };
};

/**
 * Guard middleware verifying user usage metrics.
 */
export const checkLimit = (resource) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { sub, usage, workspace } = await ensureSubscriptionAndUsage(userId);
      const plan = sub.planId;

      if (resource === "repository") {
        if (usage.repositoriesUsed >= plan.repositoryLimit) {
          return res.status(403).json({
            message: `Repository limit reached. Your active plan '${plan.name}' restricts you to a maximum of ${plan.repositoryLimit} repositories. Please upgrade to import more projects.`
          });
        }
      } else if (resource === "scan") {
        if (usage.scansUsed >= plan.scanLimit) {
          return res.status(403).json({
            message: `Monthly scan quota exceeded. Your active plan '${plan.name}' restricts you to a maximum of ${plan.scanLimit} scans. Please upgrade to scan more commits.`
          });
        }
      } else if (resource === "ai") {
        if (usage.aiRequests >= plan.aiCredits) {
          return res.status(403).json({
            message: `AI credit exhausted. Your active plan '${plan.name}' restricts you to a maximum of ${plan.aiCredits} AI Assistant requests. Please upgrade to buy more credits.`
          });
        }
      } else if (resource === "member") {
        const memberCount = await WorkspaceMember.countDocuments({ workspaceId: workspace._id });
        if (memberCount >= plan.memberLimit) {
          return res.status(403).json({
            message: `Team member limit exceeded. Your active plan '${plan.name}' restricts you to a maximum of ${plan.memberLimit} teammates. Please upgrade to invite more developers.`
          });
        }
      } else if (resource === "deployment") {
        if (usage.deployments >= plan.deploymentLimit) {
          return res.status(403).json({
            message: `Deployment limit reached. Your active plan '${plan.name}' restricts you to a maximum of ${plan.deploymentLimit} builds. Please upgrade to trigger more deployments.`
          });
        }
      } else if (resource === "report") {
        if (usage.reportsGenerated >= plan.reportLimit) {
          return res.status(403).json({
            message: `Report limit reached. Your active plan '${plan.name}' restricts you to a maximum of ${plan.reportLimit} downloads. Please upgrade to generate more reports.`
          });
        }
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

export default {
  checkLimit,
  ensurePlans,
  ensureSubscriptionAndUsage
};
