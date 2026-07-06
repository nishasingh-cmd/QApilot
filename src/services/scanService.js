/**
 * Mock Scan service for automated quality analysis management.
 * Simulates starting, cancelling, retrying, and fetching scan jobs.
 */

import { MOCK_ACTIVE_SCANS, MOCK_HISTORY, MOCK_QUEUE } from '../data/scans';

export const scanService = {
  /**
   * Simulates starting a new scan
   */
  startScan: (repoName, branch) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newScan = {
          id: `scan-active-${Date.now()}`,
          repoName: repoName || 'unnamed-repo',
          owner: 'qapilot',
          branch: branch || 'main',
          elapsedTime: '0s',
          estimatedTime: '1m 20s',
          progress: 0,
          currentStage: 'Preparing',
          stages: [
            { name: 'Preparing', status: 'active' },
            { name: 'Installing Dependencies', status: 'pending' },
            { name: 'Running Tests', status: 'pending' },
            { name: 'Static Analysis', status: 'pending' },
            { name: 'Security Analysis', status: 'pending' },
            { name: 'Generating Report', status: 'pending' },
          ],
        };
        resolve(newScan);
      }, 1000);
    });
  },

  /**
   * Simulates retrieval of currently running scans
   */
  getActiveScans: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_ACTIVE_SCANS]);
      }, 800);
    });
  },

  /**
   * Simulates fetching historical scan records
   */
  getHistory: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_HISTORY]);
      }, 900);
    });
  },

  /**
   * Simulates cancelling an active scan
   */
  cancelScan: (scanId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, scanId });
      }, 600);
    });
  },

  /**
   * Simulates retrying a failed or completed scan
   */
  retryScan: (scanId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, scanId, newScanId: `scan-active-${Date.now()}` });
      }, 800);
    });
  },
};
export default scanService;
