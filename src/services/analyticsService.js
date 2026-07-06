/**
 * Mock analytics service for QAPilot.
 * Resolves async mock Promises mimicking API traffic.
 */

import {
  MOCK_OVERVIEW_METRICS,
  MOCK_TRENDS_7D,
  MOCK_TRENDS_30D,
  MOCK_TRENDS_90D,
  MOCK_TRENDS_12M,
  MOCK_SEVERITY_DATA,
  MOCK_CATEGORY_DATA,
  MOCK_REPO_FINDINGS,
  MOCK_TEAM_FINDINGS,
  MOCK_REPO_HEALTH,
  MOCK_AI_PERFORMANCE,
  MOCK_TEAM_PRODUCTIVITY,
  MOCK_EXECUTIVE_SUMMARY,
} from '../data/analytics';

export const analyticsService = {
  getOverview: () =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          metrics: { ...MOCK_OVERVIEW_METRICS },
          summary: { ...MOCK_EXECUTIVE_SUMMARY },
        });
      }, 500)
    ),

  getQualityTrends: (timeframe) =>
    new Promise((resolve) =>
      setTimeout(() => {
        let trends = MOCK_TRENDS_30D;
        if (timeframe === '7d') trends = MOCK_TRENDS_7D;
        else if (timeframe === '90d') trends = MOCK_TRENDS_90D;
        else if (timeframe === '12m') trends = MOCK_TRENDS_12M;

        resolve([...trends]);
      }, 600)
    ),

  getRepositoryHealth: () =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve([...MOCK_REPO_HEALTH]);
      }, 400)
    ),

  getTeamMetrics: () =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          productivity: [...MOCK_TEAM_PRODUCTIVITY],
          findings: [...MOCK_TEAM_FINDINGS],
        });
      }, 500)
    ),

  getAIAnalytics: () =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          performance: { ...MOCK_AI_PERFORMANCE },
          severity: [...MOCK_SEVERITY_DATA],
          category: [...MOCK_CATEGORY_DATA],
          repoDistribution: [...MOCK_REPO_FINDINGS],
        });
      }, 500)
    ),

  exportAnalytics: (format) =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve({ success: true, format, timestamp: new Date().toISOString() });
      }, 800)
    ),
};

export default analyticsService;
