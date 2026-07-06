/**
 * Mock analytics data for Phase 7.1 — Analytics & Executive Insights.
 * Datasets for quality trends, category/severity splits, repo health, developer scores, and executive summaries.
 */

// Trend data generator helper
const generateTrendData = (daysCount) => {
  const result = [];
  const baseDate = new Date();
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Add realistic fluctuations
    const wave = Math.sin(i * 0.1) * 2;
    result.push({
      date: dateStr,
      'Quality Score': Math.round(85 + wave + (Math.random() - 0.5) * 2),
      'Code Coverage': Math.round(74 + wave * 0.5 + (Math.random() - 0.5) * 1.5),
      'Test Coverage': Math.round(71 + wave * 0.4 + (Math.random() - 0.5) * 1.2),
      'Maintainability': Math.round(88 + wave * 0.2 + (Math.random() - 0.5) * 0.8),
    });
  }
  return result;
};

export const MOCK_TRENDS_7D = generateTrendData(7);
export const MOCK_TRENDS_30D = generateTrendData(30);
export const MOCK_TRENDS_90D = generateTrendData(90);

// For 12 months, generate monthly intervals
export const MOCK_TRENDS_12M = Array.from({ length: 12 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - (11 - i));
  const monthStr = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  const wave = Math.sin(i * 0.5) * 3;
  return {
    date: monthStr,
    'Quality Score': Math.round(82 + wave + (Math.random() - 0.5) * 3),
    'Code Coverage': Math.round(71 + wave * 0.6 + (Math.random() - 0.5) * 2),
    'Test Coverage': Math.round(68 + wave * 0.5 + (Math.random() - 0.5) * 2),
    'Maintainability': Math.round(86 + wave * 0.3 + (Math.random() - 0.5) * 1.5),
  };
});

// Findings by Severity
export const MOCK_SEVERITY_DATA = [
  { name: 'Critical', value: 8, color: '#f87171' },
  { name: 'High', value: 18, color: '#fb923c' },
  { name: 'Medium', value: 42, color: '#fbbf24' },
  { name: 'Low', value: 38, color: '#38bdf8' },
  { name: 'Info', value: 14, color: '#94a3b8' },
];

// Findings by Category
export const MOCK_CATEGORY_DATA = [
  { name: 'Security', count: 18, color: '#f87171' },
  { name: 'Performance', count: 22, color: '#fb923c' },
  { name: 'Accessibility', count: 15, color: '#c084fc' },
  { name: 'Testing', count: 12, color: '#3b82f6' },
  { name: 'Code Quality', count: 28, color: '#06b6d4' },
  { name: 'Best Practices', count: 15, color: '#14b8a6' },
  { name: 'Maintainability', count: 10, color: '#64748b' },
];

// Findings by Repository
export const MOCK_REPO_FINDINGS = [
  { name: 'qapilot-web', count: 32, open: 21, resolved: 11 },
  { name: 'dashboard-ui', count: 24, open: 14, resolved: 10 },
  { name: 'mobile-app', count: 28, open: 19, resolved: 9 },
  { name: 'backend-api', count: 18, open: 10, resolved: 8 },
  { name: 'design-system', count: 10, open: 4, resolved: 6 },
  { name: 'analytics-engine', count: 10, open: 5, resolved: 5 },
];

// Findings by Team / Department / Stage (We can render findings by stage or team)
export const MOCK_TEAM_FINDINGS = [
  { name: 'Frontend Team', count: 56, open: 35, resolved: 21 },
  { name: 'Backend Team', count: 28, open: 15, resolved: 13 },
  { name: 'Mobile Team', count: 28, open: 19, resolved: 9 },
  { name: 'DevOps / QA', count: 8, open: 4, resolved: 4 },
];

// Repository Health Scorecards
export const MOCK_REPO_HEALTH = [
  {
    repo: 'qapilot-web',
    healthScore: 92,
    coverage: 84.5,
    lastScan: '2 hours ago',
    openFindings: 21,
    trend: 'up', // up = improving (good)
  },
  {
    repo: 'dashboard-ui',
    healthScore: 88,
    coverage: 78.2,
    lastScan: '4 hours ago',
    openFindings: 14,
    trend: 'stable',
  },
  {
    repo: 'mobile-app',
    healthScore: 76,
    coverage: 62.4,
    lastScan: '1 day ago',
    openFindings: 19,
    trend: 'down', // down = declining health
  },
  {
    repo: 'backend-api',
    healthScore: 95,
    coverage: 89.1,
    lastScan: '45 mins ago',
    openFindings: 10,
    trend: 'up',
  },
  {
    repo: 'design-system',
    healthScore: 98,
    coverage: 94.0,
    lastScan: '3 days ago',
    openFindings: 4,
    trend: 'up',
  },
  {
    repo: 'analytics-engine',
    healthScore: 84,
    coverage: 68.9,
    lastScan: '5 hours ago',
    openFindings: 5,
    trend: 'stable',
  },
];

// AI Performance Metrics
export const MOCK_AI_PERFORMANCE = {
  accuracy: 94.8,
  falsePositiveRate: 5.2,
  avgScanDuration: '48 seconds',
  issuesPrevented: 342,
  acceptanceRate: 88.5,
};

// Team Productivity Leaderboard
export const MOCK_TEAM_PRODUCTIVITY = [
  {
    developer: 'Nisha Singh',
    assigned: 15,
    resolved: 12,
    avgResolutionTime: '1.8 days',
    contributionScore: 98,
  },
  {
    developer: 'Alex Chen',
    assigned: 18,
    resolved: 14,
    avgResolutionTime: '2.1 days',
    contributionScore: 95,
  },
  {
    developer: 'Maria Lopez',
    assigned: 12,
    resolved: 9,
    avgResolutionTime: '2.5 days',
    contributionScore: 90,
  },
  {
    developer: 'Tom Wright',
    assigned: 10,
    resolved: 7,
    avgResolutionTime: '3.0 days',
    contributionScore: 84,
  },
  {
    developer: 'Priya Patel',
    assigned: 14,
    resolved: 10,
    avgResolutionTime: '2.4 days',
    contributionScore: 92,
  },
];

// Executive Summary Panel
export const MOCK_EXECUTIVE_SUMMARY = {
  topPerformingRepo: 'design-system',
  topPerformingRepoScore: 98,
  repoRequiringAttention: 'mobile-app',
  repoRequiringAttentionScore: 76,
  highestRiskArea: 'Security Vulnerabilities (Rate Limiting & exposed keys)',
  weeklyRecommendation: 'Review rate limiting implementation on frontend auth and upgrade test coverage on backend APIs.',
  aiHighlights: 'AI automated fixes resolved 34 critical/high tickets, reducing average MTTR by 22% compared to manual analysis.',
};

// Global Overview Metrics
export const MOCK_OVERVIEW_METRICS = {
  qualityScore: 88,
  testCoverage: 74.6,
  openFindings: 73,
  resolvedThisWeek: 45,
  reposMonitored: 6,
  aiAccuracy: 94.8,
};
