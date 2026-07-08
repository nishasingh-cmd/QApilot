import Repository from "../models/Repository.js";
import RepositoryFile from "../models/RepositoryFile.js";
import User from "../models/User.js";
import { decrypt } from "../utils/encryption.js";
import { fetchRepositoryTree, fetchFileContent } from "./githubFileService.js";

/**
 * Recovers the GitHub access token for a user.
 * Tries the encrypted user.githubAccessToken first, and falls back to user.githubId if it represents a token.
 */
const getGithubTokenForUser = (user) => {
  if (user.githubAccessToken) {
    try {
      const decrypted = decrypt(user.githubAccessToken);
      if (decrypted) return decrypted;
    } catch (e) {
      console.error("Failed to decrypt githubAccessToken:", e.message);
    }
  }
  if (user.githubId && String(user.githubId).startsWith("gho_")) {
    return user.githubId;
  }
  return null;
};

/**
 * Checks if a file path should be skipped (e.g. node_modules, build outputs, version control).
 */
const shouldSkip = (path) => {
  const skipPatterns = [
    /^node_modules\//,
    /^dist\//,
    /^build\//,
    /^coverage\//,
    /^\.git\//,
    /\/node_modules\//,
    /\/dist\//,
    /\/build\//,
    /\/coverage\//,
    /\/\.git\//
  ];
  return skipPatterns.some((pattern) => pattern.test(path));
};

/**
 * Resolves the programming language based on file path/extension.
 * Supported file types: README, JS, TS, JSX, TSX, JSON, HTML, CSS, SCSS, Markdown, YAML.
 */
const getLanguage = (path) => {
  const name = path.split("/").pop();
  if (name.toUpperCase() === "README") return "Markdown";
  
  const ext = path.split(".").pop().toLowerCase();
  const langMap = {
    js: "JavaScript",
    ts: "TypeScript",
    jsx: "JavaScript React",
    tsx: "TypeScript React",
    json: "JSON",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    md: "Markdown",
    yaml: "YAML",
    yml: "YAML"
  };
  return langMap[ext] || null;
};

/**
 * Helper to delete files from database that are no longer present in GitHub.
 */
export const deleteRemovedFiles = async (repositoryId, activePaths) => {
  const dbFiles = await RepositoryFile.find({ repositoryId }).select("path");
  let deletedCount = 0;
  for (const dbFile of dbFiles) {
    if (!activePaths.has(dbFile.path)) {
      await RepositoryFile.deleteOne({ _id: dbFile._id });
      deletedCount++;
    }
  }
  return deletedCount;
};

/**
 * Helper to download and save/update changed or new files.
 */
export const updateChangedFiles = async (repositoryId, filesToUpdate, token, ownerName, repoName, updateProgress, startProgressPercent = 20, endProgressPercent = 95) => {
  let downloadedCount = 0;
  const totalToDownload = filesToUpdate.length;

  for (let i = 0; i < totalToDownload; i++) {
    const fileNode = filesToUpdate[i];
    try {
      const content = await fetchFileContent(ownerName, repoName, fileNode.sha, token);
      const language = getLanguage(fileNode.path);
      const name = fileNode.path.split("/").pop();
      const extension = name.includes(".") ? name.split(".").pop() : "";

      await RepositoryFile.findOneAndUpdate(
        { repositoryId, path: fileNode.path },
        {
          name,
          extension,
          sha: fileNode.sha,
          size: fileNode.size,
          content,
          language,
          lastSynced: new Date(),
          lastCommit: ""
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error(`Failed to sync file ${fileNode.path}:`, err.message);
    }

    downloadedCount++;
    if (updateProgress) {
      const currentProgress = startProgressPercent + Math.round((downloadedCount / totalToDownload) * (endProgressPercent - startProgressPercent));
      await updateProgress(currentProgress);
    }
  }
  return downloadedCount;
};

/**
 * Main function to synchronize repository files recursively.
 */
export const syncRepositoryFiles = async (repositoryId, updateProgress) => {
  const progressFn = typeof updateProgress === "function" ? updateProgress : async () => {};
  
  try {
    const repo = await Repository.findById(repositoryId);
    if (!repo) {
      throw new Error("Repository not found");
    }

    const user = await User.findById(repo.userId);
    if (!user) {
      throw new Error("Repository owner not found");
    }

    const token = getGithubTokenForUser(user);
    if (!token) {
      throw new Error("No GitHub access token configured for user");
    }

    repo.syncStatus = "syncing";
    repo.syncProgress = 0;
    repo.syncError = null;
    await repo.save();

    await progressFn(5);

    const ownerName = repo.owner?.login || repo.fullName?.split("/")[0];
    const repoName = repo.name || repo.fullName?.split("/")[1];
    const branch = repo.defaultBranch || "main";

    // 1. Fetch GitHub recursive tree
    const tree = await fetchRepositoryTree(ownerName, repoName, branch, token);
    await progressFn(20);

    // 2. Filter tree files
    const validFiles = tree.filter((node) => {
      if (node.type !== "blob") return false;
      if (shouldSkip(node.path)) return false;
      return getLanguage(node.path) !== null;
    });

    const totalFiles = validFiles.length;
    if (totalFiles === 0) {
      repo.syncStatus = "synced";
      repo.syncProgress = 100;
      repo.lastSyncedAt = new Date();
      await repo.save();
      await progressFn(100);
      return { totalSynced: 0, totalDeleted: 0 };
    }

    // 3. Compare with DB files for incremental sync
    const dbFiles = await RepositoryFile.find({ repositoryId }).select("path sha");
    const dbFilesMap = new Map(dbFiles.map((f) => [f.path, f.sha]));

    const filesToUpdate = [];
    const activePaths = new Set();

    for (const fileNode of validFiles) {
      activePaths.add(fileNode.path);
      const existingSha = dbFilesMap.get(fileNode.path);
      if (!existingSha || existingSha !== fileNode.sha) {
        filesToUpdate.push(fileNode);
      }
    }

    // 4. Download changed/new files
    const syncedCount = await updateChangedFiles(
      repositoryId,
      filesToUpdate,
      token,
      ownerName,
      repoName,
      progressFn,
      20,
      95
    );

    // 5. Delete removed files
    const deletedCount = await deleteRemovedFiles(repositoryId, activePaths);

    // 6. Complete status updates
    repo.syncStatus = "synced";
    repo.syncProgress = 100;
    repo.lastSyncedAt = new Date();
    await repo.save();
    
    await progressFn(100);

    return { totalSynced: syncedCount, totalDeleted: deletedCount };
  } catch (error) {
    console.error(`Repository files sync failed:`, error.message);
    const repo = await Repository.findById(repositoryId);
    if (repo) {
      repo.syncStatus = "failed";
      repo.syncError = error.message;
      await repo.save();
    }
    throw error;
  }
};

export default {
  syncRepositoryFiles,
  updateChangedFiles,
  deleteRemovedFiles
};
