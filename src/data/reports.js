/**
 * Mock data for Phase 7.2 — AI Report Generator.
 * 50 reports across multiple repositories with scorecards, recommendations, timelines, and comparisons.
 */

const REPOS = ['qapilot-web', 'dashboard-ui', 'mobile-app', 'backend-api', 'design-system', 'analytics-engine'];
const BRANCHES = ['main', 'develop', 'release-2.0', 'fix-login-flow', 'feat/dashboard-v2'];
const GENERATORS = ['Nisha Singh', 'Alex Chen', 'Maria Lopez', 'Tom Wright', 'Priya Patel', 'AI Scheduler'];
const STATUSES = ['ready', 'processing', 'failed'];

const EXECUTIVE_SUMMARIES = [
  'Critical vulnerabilities resolved in authentication layer. Overall code coverage increased by 4.2% following the integration of additional unit tests.',
  'Performance regression detected in SQL query resolver. Highly recommend caching query configurations on client endpoints to improve roundtrip times.',
  'Accessibility violations reduced by 85% with the addition of standardized ARIA tags. Security standards are standing strong at SOC2 compliance.',
  'Security scan flagged exposed API key variables. Codebase maintenance index is stable but require immediate secret sanitization processes.',
  'Excellent test metrics achieved during release candidate build. Security checks resolved 100% cleanly. Deploy ready.',
];

const ACTIONS = [
  'Add rate-limiter middleware (e.g. express-rate-limit) to authenticate POST endpoints.',
  'Revoke exposed AWS secret key in processes.env and bind credentials to KMS values.',
  'Refactor React component hook lists to dispose window resize listeners on unmounting.',
  'Establish 80% minimum statement check bounds on CI pipelines to enforce check coverages.',
  'Migrate legacy class rendering layout to standard functional hooks components.',
];

const ARCHITECTURES = [
  'Decouple heavy analytic transform functions into independent microservices to lower CPU spikes.',
  'Move state declarations up to context wrappers to avoid heavy nested component redraws.',
  'Introduce a redis layer caching user endpoint metrics to reduce SQL query timings.',
  'Extract styles definition arrays into common token configurations to enforce theme consistency.',
];

const TIMELINE_TYPES = ['Created', 'Updated', 'Shared', 'Exported', 'Viewed'];

let idCounter = 1;

export const MOCK_REPORTS = Array.from({ length: 50 }, (_, i) => {
  const repo = REPOS[i % REPOS.length];
  const branch = BRANCHES[i % BRANCHES.length];
  const generatedBy = GENERATORS[i % GENERATORS.length];
  const status = i === 12 ? 'processing' : i === 27 ? 'failed' : 'ready';
  const daysAgo = Math.floor(Math.random() * 60) + 1;
  const generatedAt = `${daysAgo}d ago`;

  const qualityScore = status === 'failed' ? 0 : Math.round(72 + (i % 25) + (Math.random() - 0.5) * 3);
  const coverage = status === 'failed' ? 0 : Math.round(65 + (i % 28));
  const security = status === 'failed' ? 0 : Math.round(75 + (i % 20));
  const performance = status === 'failed' ? 0 : Math.round(80 + (i % 18));
  const maintainability = status === 'failed' ? 0 : Math.round(82 + (i % 15));
  const accessibility = status === 'failed' ? 0 : Math.round(70 + (i % 25));
  const confidence = status === 'failed' ? 0 : Math.round(92 + (i % 7));

  const critical = status === 'failed' ? 0 : Math.round(Math.max(0, 5 - (i % 4)));
  const high = status === 'failed' ? 0 : Math.round(Math.max(1, 10 - (i % 6)));
  const medium = status === 'failed' ? 0 : Math.round(15 + (i % 15));
  const low = status === 'failed' ? 0 : Math.round(12 + (i % 12));
  const resolved = status === 'failed' ? 0 : Math.round(8 + (i % 10));
  const ignored = status === 'failed' ? 0 : Math.round(2 + (i % 5));

  return {
    id: `rep-${String(idCounter++).padStart(3, '0')}`,
    name: `Quality Report: ${repo} [${branch}] v${(1.0 + (i * 0.1)).toFixed(1)}`,
    repo,
    branch,
    generatedBy,
    generatedAt,
    qualityScore,
    status,
    version: `v${(1.0 + (i * 0.1)).toFixed(1)}`,
    metrics: {
      coverage,
      security,
      performance,
      maintainability,
      accessibility,
      confidence,
    },
    findings: {
      critical,
      high,
      medium,
      low,
      resolved,
      ignored,
    },
    summary: EXECUTIVE_SUMMARIES[i % EXECUTIVE_SUMMARIES.length],
    recommendations: {
      priorityActions: ACTIONS.slice(i % 3, (i % 3) + 2),
      architecture: ARCHITECTURES.slice(i % 2, (i % 2) + 2),
      testing: ['Add unit check integrations targeting auth reducers.', 'Ensure code mock fixtures represent error ranges.'],
      security: ['Perform npm audit checks daily.', 'Set SSL credentials enforcing TLS1.3 checks.'],
      performance: ['Minify build assets during webpack pipeline.', 'Compress asset bundles using gzip algorithms.'],
    },
    timeline: Array.from({ length: 4 }, (_, idx) => {
      const timeDaysAgo = daysAgo + idx;
      return {
        type: TIMELINE_TYPES[idx % TIMELINE_TYPES.length],
        user: GENERATORS[(i + idx) % GENERATORS.length],
        date: `${timeDaysAgo}d ago`,
      };
    }),
  };
});

export const MOCK_REPORTS_METRICS = {
  generated: 50,
  latestScore: 89,
  avgScore: 82.5,
  criticalOpen: 12,
  resolved: 245,
  exportsThisMonth: 128,
};

export const MOCK_REPORTS_SUMMARY = {
  mostImproved: 'qapilot-web (+14% Quality Index)',
  highestRisk: 'mobile-app (12 Open Critical violations)',
  mostStable: 'design-system (98% Maintainability Rating)',
  mostActive: 'backend-api (45 Scans processed this week)',
};
