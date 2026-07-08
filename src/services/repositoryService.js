/**
 * Repository integration service.
 * Connects the frontend to the QAPilot backend for database integrations,
 * configurations, and recursive file synchronizations.
 */
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const repositoryService = {
  /**
   * Simulates importing selected repositories into user workspace.
   * Kept for local UI integrations.
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
   * Simulates saving project scan configuration profiles.
   */
  saveConfiguration: (config) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, savedConfig: { ...config, updatedAt: new Date().toISOString() } });
      }, 1000);
    });
  },

  /**
   * Enqueues a background files sync job for a connected repository.
   */
  syncFiles: async (id) => {
    const res = await axios.post(`${API_BASE}/repositories/${id}/sync-files`, {}, { withCredentials: true });
    return res.data;
  },

  /**
   * Retrieves the complete files metadata listing and summaries for a repository.
   */
  getFiles: async (id) => {
    const res = await axios.get(`${API_BASE}/repositories/${id}/files`, { withCredentials: true });
    return res.data;
  },

  /**
   * Retrieves the complete metadata and content of a specific file.
   */
  getFileContent: async (id, fileId) => {
    const res = await axios.get(`${API_BASE}/repositories/${id}/file/${fileId}`, { withCredentials: true });
    return res.data;
  }
};

export default repositoryService;
