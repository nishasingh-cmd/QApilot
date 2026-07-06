/**
 * Mock GitHub integration service.
 * Exposes asynchronous functions returning Promise objects with realistic delays.
 * Will be replaced by actual GitHub OAuth and REST API integration in future phases.
 */

import { AVAILABLE_REPOS } from '../data/repositories';

// Simple in-memory persistence for demo connection status
let isConnected = false;

export const githubService = {
  /**
   * Simulates OAuth connection authorization flow
   */
  connect: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Randomly simulate success (90% rate) or failure (10% rate)
        if (Math.random() > 0.1) {
          isConnected = true;
          resolve({ success: true, user: 'github-user-qapilot', avatar: 'https://avatars.githubusercontent.com/u/9919?v=4' });
        } else {
          reject(new Error('GitHub Authorization request timed out. Please try again.'));
        }
      }, 1500);
    });
  },

  /**
   * Simulates disconnect/revoke OAuth token
   */
  disconnect: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        isConnected = false;
        resolve({ success: true });
      }, 800);
    });
  },

  /**
   * Simulates fetching user's available repositories from GitHub API
   */
  fetchRepositories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return cloned array of available repos
        resolve([...AVAILABLE_REPOS]);
      }, 1200);
    });
  },
};
export default githubService;
