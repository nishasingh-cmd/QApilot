/**
 * Notification service simulating real-time system event updates.
 * Exposes methods to handle read statuses, clearing feeds, and scheduling alerts.
 */

const REPOS = ['qapilot-web', 'dashboard-ui', 'mobile-app', 'backend-api', 'design-system', 'analytics-engine'];
const DEVELOPERS = ['Nisha Singh', 'Alex Chen', 'Maria Lopez', 'Tom Wright', 'Priya Patel'];

const EVENT_TEMPLATES = [
  {
    type: 'scan_started',
    title: 'AI scan initiated',
    desc: (repo) => `Automatic code analysis started on ${repo} (branch: main).`,
  },
  {
    type: 'scan_completed',
    title: 'AI scan completed',
    desc: (repo) => `Code validation complete for ${repo}. Overall score is 92%.`,
  },
  {
    type: 'critical_issue',
    title: 'Critical issue detected',
    desc: (repo) => `Hardcoded API secret token exposed in ${repo}/src/services/api.js.`,
    severity: 'critical',
  },
  {
    type: 'repo_connected',
    title: 'New repository connected',
    desc: (repo) => `GitHub integration synchronized codebase index for ${repo}.`,
  },
  {
    type: 'ai_insight',
    title: 'AI Insight generated',
    desc: (repo) => `Potential memory leak path detected in useEffect lifecycle on ${repo}.`,
    severity: 'high',
  },
  {
    type: 'report_ready',
    title: 'Quality report ready',
    desc: (repo) => `Executive quality audit report generated for ${repo} (version v1.2).`,
  },
  {
    type: 'system_alert',
    title: 'GitHub synchronization complete',
    desc: (repo) => `Successfully parsed webhook event data from GitHub hook.`,
  },
  {
    type: 'deployment_event',
    title: 'CI/CD deployment validation',
    desc: (repo) => `Pipeline metrics match validation rules. Auto-deployed staging environment.`,
    severity: 'info',
  },
];

let idCounter = 1;
let currentNotifications = [
  {
    id: `not-${String(idCounter++).padStart(3, '0')}`,
    type: 'repo_connected',
    title: 'New repository connected',
    description: 'GitHub integration synchronized codebase index for design-system.',
    timestamp: '2 hours ago',
    repo: 'design-system',
    read: false,
  },
  {
    id: `not-${String(idCounter++).padStart(3, '0')}`,
    type: 'critical_issue',
    title: 'Critical issue detected',
    description: 'Hardcoded API secret token exposed in qapilot-web/src/services/api.js.',
    timestamp: '4 hours ago',
    repo: 'qapilot-web',
    severity: 'critical',
    read: false,
  },
  {
    id: `not-${String(idCounter++).padStart(3, '0')}`,
    type: 'scan_completed',
    title: 'AI scan completed',
    description: 'Code validation complete for backend-api. Overall score is 95%.',
    timestamp: '1 day ago',
    repo: 'backend-api',
    read: true,
  },
  {
    id: `not-${String(idCounter++).padStart(3, '0')}`,
    type: 'report_ready',
    title: 'Quality report ready',
    description: 'Executive quality audit report generated for mobile-app (version v1.0).',
    timestamp: '2 days ago',
    repo: 'mobile-app',
    read: true,
  },
];

export const notificationService = {
  getNotifications: () =>
    new Promise((resolve) => setTimeout(() => resolve([...currentNotifications]), 300)),

  generateRandomEvent: () => {
    const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
    const repo = REPOS[Math.floor(Math.random() * REPOS.length)];

    return {
      id: `not-${String(idCounter++).padStart(3, '0')}`,
      type: template.type,
      title: template.title,
      description: template.desc(repo),
      timestamp: 'Just now',
      repo,
      severity: template.severity,
      read: false,
    };
  },

  markAsRead: (id) =>
    new Promise((resolve) => {
      currentNotifications = currentNotifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      resolve({ success: true, id });
    }),

  markAllAsRead: () =>
    new Promise((resolve) => {
      currentNotifications = currentNotifications.map((n) => ({ ...n, read: true }));
      resolve({ success: true });
    }),

  clearNotifications: () =>
    new Promise((resolve) => {
      currentNotifications = [];
      resolve({ success: true });
    }),

  startNotificationStream: (callback, intervalMs = 9000) => {
    const timer = setInterval(() => {
      const newEvent = notificationService.generateRandomEvent();
      // Side effect: prepend to current list so subsequent getNotifications sees it
      currentNotifications = [newEvent, ...currentNotifications];
      callback(newEvent);
    }, intervalMs);

    return () => clearInterval(timer);
  },
};

export default notificationService;
