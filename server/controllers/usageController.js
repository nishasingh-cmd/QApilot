import UsageRecord from "../models/UsageRecord.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import Repository from "../models/Repository.js";
import Scan from "../models/Scan.js";
import Report from "../models/Report.js";
import Deployment from "../models/Deployment.js";
import { ensureSubscriptionAndUsage } from "../middleware/limitMiddleware.js";

/**
 * Fetch and dynamically compile active usage records.
 */
export const getUsage = async (req, res) => {
  try {
    const { usage, workspace } = await ensureSubscriptionAndUsage(req.user._id);

    // 1. Recalculate totals dynamically to correct any gaps
    const reposCount = await Repository.countDocuments({ userId: req.user._id });
    const membersCount = await WorkspaceMember.countDocuments({ workspaceId: workspace._id });
    const scansCount = await Scan.countDocuments({ repoId: { $in: workspace.repositories } });
    const reportsCount = await Report.countDocuments({ repoId: { $in: workspace.repositories } });
    const deploysCount = await Deployment.countDocuments({ repositoryId: { $in: workspace.repositories } });

    usage.repositoriesUsed = reposCount;
    usage.scansUsed = scansCount;
    usage.reportsGenerated = reportsCount;
    usage.deployments = deploysCount;
    await usage.save();

    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getUsage
};
