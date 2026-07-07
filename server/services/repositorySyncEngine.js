import { getGitHubUserRepos } from "./githubService.js";
import Repository from "../models/Repository.js";
import User from "../models/User.js";
import { createNotification } from "./notificationService.js";

/**
 * Sync engine to fetch latest GitHub repos, compare against DB, and perform an intelligent merge.
 */
export const syncUserRepositories = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.githubId) {
    throw new Error("User has no connected GitHub account");
  }

  // 1. Fetch live repositories from GitHub API
  const liveRepos = await getGitHubUserRepos(user.githubId);

  // 2. Fetch currently stored repositories from database
  const dbRepos = await Repository.find({ userId });
  const dbReposMap = new Map(dbRepos.map((r) => [r.githubId, r]));

  const syncedRepos = [];
  const processedGithubIds = new Set();

  // 3. Compare & Merge
  for (const live of liveRepos) {
    processedGithubIds.add(live.id);
    const existing = dbReposMap.get(live.id);

    if (existing) {
      // Update metadata while keeping healthScore or custom details intact
      existing.name = live.name;
      existing.fullName = live.full_name;
      existing.private = live.private;
      existing.htmlUrl = live.html_url;
      existing.description = live.description;
      existing.language = live.language;
      existing.defaultBranch = live.default_branch;
      existing.archived = live.archived || false;
      existing.owner = {
        login: live.owner.login,
        avatarUrl: live.owner.avatar_url
      };
      existing.lastSyncedAt = new Date();
      await existing.save();
      syncedRepos.push(existing);
    } else {
      // Insert new repository
      const created = await Repository.create({
        githubId: live.id,
        name: live.name,
        fullName: live.full_name,
        private: live.private,
        htmlUrl: live.html_url,
        description: live.description,
        language: live.language,
        defaultBranch: live.default_branch,
        archived: live.archived || false,
        owner: {
          login: live.owner.login,
          avatarUrl: live.owner.avatar_url
        },
        healthScore: Math.floor(75 + (live.id % 20)), // Seed standard initial score
        lastSyncedAt: new Date(),
        userId
      });
      syncedRepos.push(created);
    }
  }

  // 4. Detect deleted repos (present in DB, but not in GitHub anymore)
  let deletedCount = 0;
  for (const dbRepo of dbRepos) {
    if (!processedGithubIds.has(dbRepo.githubId)) {
      await Repository.deleteOne({ _id: dbRepo._id });
      deletedCount++;
      await createNotification(userId, {
        type: "repo_connected",
        title: "Repository Disconnected",
        message: `Repository '${dbRepo.name}' was disconnected and removed from your QAPilot workspace.`,
        repository: dbRepo.name,
        severity: "warning"
      });
    }
  }

  await createNotification(userId, {
    type: "system_alert",
    title: "Repository Sync Finished",
    message: `Intelligent merge finished synchronizing ${syncedRepos.length} repository configurations (removed ${deletedCount} deleted repos).`,
    severity: "success"
  });

  return syncedRepos;
};

export default { syncUserRepositories };
