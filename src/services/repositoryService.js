/**
 * Mock repository integration service.
 * Simulates importing repositories and saving configuration profiles with realistic delays.
 * Will be replaced by real API calls to the QAPilot backend in future phases.
 */

export const repositoryService = {
  /**
   * Simulates importing selected repositories into user workspace
   */
  importRepositories: (repos) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const imported = repos.map((repo) => ({
          ...repo,
          id: `repo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          fullName: `${repo.owner}/${repo.name}`,
          lastScan: 'Never scanned',
          status: 'healthy',
          healthScore: 100,
          openIssues: 0,
          aiCoverage: 100,
          deploymentStatus: 'queued',
          recentActivity: 'Repository successfully connected via GitHub Integration Wizard',
          createdAt: new Date().toISOString().split('T')[0],
        }));
        resolve(imported);
      }, 1500);
    });
  },

  /**
   * Simulates saving project scan configuration profiles
   */
  saveConfiguration: (config) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, savedConfig: { ...config, updatedAt: new Date().toISOString() } });
      }, 1000);
    });
  },
};
export default repositoryService;
