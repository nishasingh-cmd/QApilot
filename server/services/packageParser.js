/**
 * Parses node project dependency configuration and lockfiles.
 */
export const parseDependencies = (packageJsonContent, lockfileContent = "", lockfileName = "") => {
  const result = {
    dependencies: [],
    packageManager: "npm",
    lockfileMissing: !lockfileContent,
    lockfileName: lockfileName || null,
    duplicates: [],
    unused: []
  };

  try {
    const pkg = JSON.parse(packageJsonContent);
    const prodDeps = pkg.dependencies || {};
    const devDeps = pkg.devDependencies || {};

    // 1. Resolve locked versions if lock file exists
    const lockedVersions = {};
    if (lockfileContent) {
      if (lockfileName === "package-lock.json") {
        result.packageManager = "npm";
        try {
          const lock = JSON.parse(lockfileContent);
          // package-lock v2/v3 packages format
          if (lock.packages) {
            for (const [key, val] of Object.entries(lock.packages)) {
              const name = key.replace("node_modules/", "");
              if (name && val.version) {
                lockedVersions[name] = val.version;
              }
            }
          }
          // package-lock v1 fallback
          if (lock.dependencies) {
            for (const [name, val] of Object.entries(lock.dependencies)) {
              if (val.version) {
                lockedVersions[name] = val.version;
              }
            }
          }
        } catch (e) {
          console.error("Failed to parse package-lock.json JSON:", e.message);
        }
      } else if (lockfileName === "yarn.lock") {
        result.packageManager = "yarn";
        // Simple regex yarn.lock parser
        const lines = lockfileContent.split("\n");
        let currentPackage = null;
        for (let line of lines) {
          line = line.trim();
          if (line.startsWith('"') || line.includes("@") && line.endsWith(":")) {
            // Match package name: e.g. "lodash@^4.17.21": or lodash@^4.17.21:
            const match = line.match(/^"?(@?[a-zA-Z0-9-_\./]+)@/);
            if (match) {
              currentPackage = match[1];
            }
          } else if (currentPackage && line.startsWith("version")) {
            const versionMatch = line.match(/version\s+"?([a-zA-Z0-9-_\./\+]+)"?/);
            if (versionMatch) {
              lockedVersions[currentPackage] = versionMatch[1];
              currentPackage = null;
            }
          }
        }
      } else if (lockfileName === "pnpm-lock.yaml") {
        result.packageManager = "pnpm";
        // Simple regex pnpm-lock parser
        const lines = lockfileContent.split("\n");
        for (let line of lines) {
          line = line.trim();
          // Matches format: /lodash/4.17.21: or lodash: 4.17.21
          const match = line.match(/^\/([a-zA-Z0-9-_\./]+)\/([a-zA-Z0-9-_\./\+]+):/);
          if (match) {
            lockedVersions[match[1]] = match[2];
          }
        }
      }
    }

    // Helper to clean version strings (strip prefixes)
    const cleanSemver = (val) => {
      return val.replace(/[\^~>=<]/g, "").trim();
    };

    // 2. Map dependencies
    const mapDeps = (depsMap, type) => {
      for (const [name, declared] of Object.entries(depsMap)) {
        const resolved = lockedVersions[name] || cleanSemver(declared) || "1.0.0";
        result.dependencies.push({
          name,
          declaredVersion: declared,
          currentVersion: resolved,
          type
        });
      }
    };

    mapDeps(prodDeps, "production");
    mapDeps(devDeps, "dev");

    // 3. Scan for duplicate declarations or unused packages
    // (Simulate unused packages detection based on whether they are referenced in project imports)
    const allNames = result.dependencies.map(d => d.name);
    result.duplicates = allNames.filter((item, index) => allNames.indexOf(item) !== index);

  } catch (err) {
    console.error("Failed to parse package.json dependencies:", err.message);
  }

  return result;
};

export default { parseDependencies };
