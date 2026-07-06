import User from "../models/User.js";
import { syncUserRepositories } from "./repositorySyncEngine.js";

/**
 * Background scheduler job executing repository synchronization periodically for all GitHub users.
 */
let intervalTimer = null;

export const startSyncScheduler = (intervalMinutes = 5) => {
  if (intervalTimer) return;

  const intervalMs = intervalMinutes * 60 * 1000;
  console.log(`Repository Sync Scheduler initialized. Running every ${intervalMinutes} minutes. 🕒`);

  intervalTimer = setInterval(async () => {
    console.log("Auto-sync background job started... 🔄");
    try {
      // Find all users who have authorized GitHub
      const users = await User.find({ githubId: { $ne: null } });
      
      for (const user of users) {
        try {
          console.log(`Syncing repositories for user: ${user.name} (${user.email})...`);
          await syncUserRepositories(user._id);
        } catch (err) {
          console.error(`Auto-sync failed for user ${user.name}:`, err.message);
        }
      }
      console.log("Auto-sync background job completed successfully. ✅");
    } catch (error) {
      console.error("Auto-sync background job encountered an error:", error);
    }
  }, intervalMs);
};

export const stopSyncScheduler = () => {
  if (intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
    console.log("Repository Sync Scheduler stopped. 🛑");
  }
};

export default { startSyncScheduler, stopSyncScheduler };
