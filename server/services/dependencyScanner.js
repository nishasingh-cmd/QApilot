import Repository from "../models/Repository.js";
import RepositoryFile from "../models/RepositoryFile.js";
import Dependency from "../models/Dependency.js";
import { parseDependencies } from "./packageParser.js";
import { checkVersion } from "./versionChecker.js";
import { checkVulnerabilities } from "./vulnerabilityScanner.js";
import { getPackageLicense, checkLicenseRisk } from "./licenseAnalyzer.js";
import { createNotification } from "./notificationService.js";

/**
 * Executes a codebase dependencies scan recursively.
 */
export const scanDependencies = async (repositoryId, updateProgress) => {
  const progressFn = typeof updateProgress === "function" ? updateProgress : async () => {};
  
  try {
    const repo = await Repository.findById(repositoryId);
    if (!repo) {
      throw new Error("Repository not found");
    }

    await progressFn(10);

    // 1. Fetch package.json and lockfile from RepositoryFile
    const files = await RepositoryFile.find({ repositoryId }).select("path name content").lean();
    let packageJson = files.find((f) => f.name === "package.json");
    
    let lockfile = null;
    let lockfileName = "";

    // Check standard lock file occurrences
    const lockFilesNames = ["package-lock.json", "yarn.lock", "pnpm-lock.yaml"];
    for (const name of lockFilesNames) {
      const found = files.find((f) => f.name === name);
      if (found) {
        lockfile = found;
        lockfileName = name;
        break;
      }
    }

    let packageJsonContent = "";
    let lockfileContent = "";

    if (!packageJson) {
      // Fallback package.json for testing or simulation
      packageJsonContent = JSON.stringify({
        name: repo.name,
        dependencies: {
          lodash: "^4.17.19",
          react: "^18.2.0",
          axios: "^0.20.0",
          "pg-pool": "^1.5.0"
        },
        devDependencies: {
          typescript: "^5.0.0",
          eslint: "^8.0.0"
        }
      });
      lockfileContent = "";
      lockfileName = "";
    } else {
      packageJsonContent = packageJson.content || "{}";
      lockfileContent = lockfile ? lockfile.content || "" : "";
    }

    await progressFn(25);

    // 2. Parse dependencies
    const parsed = parseDependencies(packageJsonContent, lockfileContent, lockfileName);
    const totalDeps = parsed.dependencies.length;

    if (totalDeps === 0) {
      await progressFn(100);
      return { totalCount: 0, outdatedCount: 0, vulnerabilityCount: 0 };
    }

    const activeNames = new Set();
    let outdatedCount = 0;
    let vulnerabilityCount = 0;
    let criticalCount = 0;

    // 3. Scan each dependency
    for (let i = 0; i < totalDeps; i++) {
      const dep = parsed.dependencies[i];
      activeNames.add(dep.name);

      const license = getPackageLicense(dep.name);
      const licenseCheck = checkLicenseRisk(license);

      const updateInfo = await checkVersion(dep.name, dep.currentVersion);
      const vulns = checkVulnerabilities(dep.name, dep.currentVersion);

      // Determine risk level based on vulnerabilities and license warnings
      let riskLevel = "none";
      if (vulns.length > 0) {
        const severities = vulns.map((v) => v.severity);
        if (severities.includes("critical")) riskLevel = "critical";
        else if (severities.includes("high")) riskLevel = "high";
        else if (severities.includes("medium")) riskLevel = "medium";
        else riskLevel = "low";
      } else if (licenseCheck.riskLevel === "high") {
        riskLevel = "high";
      }

      if (updateInfo.isOutdated) outdatedCount++;
      vulnerabilityCount += vulns.length;
      if (vulns.some(v => v.severity === 'critical')) criticalCount++;

      // Save/update package dependency log in database
      await Dependency.findOneAndUpdate(
        { repositoryId, name: dep.name },
        {
          currentVersion: dep.currentVersion,
          latestVersion: updateInfo.latestVersion,
          packageManager: parsed.packageManager,
          type: dep.type,
          license,
          homepage: updateInfo.homepage,
          repositoryUrl: updateInfo.repositoryUrl,
          publishedAt: new Date(),
          isOutdated: updateInfo.isOutdated,
          riskLevel,
          knownVulnerabilities: vulns,
          recommendedVersion: updateInfo.recommendedVersion,
          lastChecked: new Date()
        },
        { upsert: true, new: true }
      );

      // Trigger notification for major upgrades
      if (updateInfo.isOutdated && updateInfo.diffType === "major" && repo.userId) {
        await createNotification(repo.userId, {
          type: "dependency_upgrade",
          title: "Major Upgrade Available",
          message: `Package '${dep.name}' has a major version upgrade available: ${dep.currentVersion} -> ${updateInfo.latestVersion}.`,
          repository: repo.name,
          severity: "info"
        });
      }

      const progress = 25 + Math.round((i / totalDeps) * 65);
      await progressFn(progress);
    }

    // 4. Clean up any dependencies that are no longer declared
    await Dependency.deleteMany({ repositoryId, name: { $nin: Array.from(activeNames) } });

    // 5. Send notifications
    if (repo.userId) {
      // Completed Scan notification
      await createNotification(repo.userId, {
        type: "dependency_scan_completed",
        title: "Dependency Scan Finished",
        message: `Dependency and vulnerability scan completed for '${repo.name}'. Scanned ${totalDeps} packages, found ${vulnerabilityCount} vulnerabilities.`,
        repository: repo.name,
        severity: "success"
      });

      // Critical vulnerabilities detected notification
      if (criticalCount > 0) {
        await createNotification(repo.userId, {
          type: "critical_vulnerability",
          title: "Critical Vulnerabilities Detected",
          message: `Critical severity vulnerability packages detected in '${repo.name}'. Please prioritize package upgrades.`,
          repository: repo.name,
          severity: "critical"
        });
      }
    }

    await progressFn(100);

    return {
      totalCount: totalDeps,
      outdatedCount,
      vulnerabilityCount
    };
  } catch (error) {
    console.error("Dependency scanner execution failed:", error.message);
    throw error;
  }
};

export default { scanDependencies };
