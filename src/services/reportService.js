/**
 * Mock AI Report Service.
 * Resolves async promises representing API endpoints.
 */

import { MOCK_REPORTS } from '../data/reports';

let localReports = [...MOCK_REPORTS];

export const reportService = {
  getReports: () =>
    new Promise((resolve) => setTimeout(() => resolve([...localReports]), 500)),

  getReport: (id) =>
    new Promise((resolve, reject) =>
      setTimeout(() => {
        const found = localReports.find((r) => r.id === id);
        if (found) resolve({ ...found });
        else reject(new Error(`Report ${id} not found`));
      }, 400)
    ),

  generateReport: (repo, branch) =>
    new Promise((resolve) =>
      setTimeout(() => {
        const newReport = {
          id: `rep-${String(localReports.length + 1).padStart(3, '0')}`,
          name: `Quality Report: ${repo} [${branch}] v1.0`,
          repo,
          branch,
          generatedBy: 'Nisha Singh',
          generatedAt: 'Just now',
          qualityScore: Math.round(75 + Math.random() * 20),
          status: 'ready',
          version: 'v1.0',
          metrics: {
            coverage: Math.round(70 + Math.random() * 20),
            security: Math.round(75 + Math.random() * 15),
            performance: Math.round(80 + Math.random() * 15),
            maintainability: Math.round(82 + Math.random() * 10),
            accessibility: Math.round(72 + Math.random() * 18),
            confidence: Math.round(92 + Math.random() * 6),
          },
          findings: {
            critical: Math.round(Math.random() * 3),
            high: Math.round(Math.random() * 5),
            medium: Math.round(5 + Math.random() * 15),
            low: Math.round(4 + Math.random() * 12),
            resolved: 0,
            ignored: 0,
          },
          summary: 'Newly generated quality audit report following code validation sweep.',
          recommendations: {
            priorityActions: ['Establish automated CI rules.', 'Configure code coverage checkers.'],
            architecture: ['Review modular hook separations.'],
            testing: ['Setup Jest integrations.'],
            security: ['Sanitize process environment credentials.'],
            performance: ['Minimize bundle dimensions.'],
          },
          timeline: [
            { type: 'Created', user: 'Nisha Singh', date: 'Just now' },
          ],
        };
        localReports = [newReport, ...localReports];
        resolve(newReport);
      }, 1500)
    ),

  compareReports: (id1, id2) =>
    new Promise((resolve, reject) =>
      setTimeout(() => {
        const r1 = localReports.find((r) => r.id === id1);
        const r2 = localReports.find((r) => r.id === id2);
        if (r1 && r2) {
          resolve({
            reportA: r1,
            reportB: r2,
            diff: {
              quality: r2.qualityScore - r1.qualityScore,
              coverage: r2.metrics.coverage - r1.metrics.coverage,
              security: r2.metrics.security - r1.metrics.security,
              performance: r2.metrics.performance - r1.metrics.performance,
              findings:
                (r2.findings.critical + r2.findings.high) -
                (r1.findings.critical + r1.findings.high),
            },
          });
        } else {
          reject(new Error('One or both reports not found for comparison.'));
        }
      }, 600)
    ),

  shareReport: (id, platform, recipient) =>
    new Promise((resolve) =>
      setTimeout(() => {
        // Appends "Shared" event to the report's timeline
        localReports = localReports.map((r) => {
          if (r.id === id) {
            const updatedTimeline = [
              { type: 'Shared', user: 'Nisha Singh', date: 'Just now' },
              ...r.timeline,
            ];
            return { ...r, timeline: updatedTimeline };
          }
          return r;
        });
        resolve({ success: true, platform, recipient });
      }, 500)
    ),

  exportReport: (id, format) =>
    new Promise((resolve) =>
      setTimeout(() => {
        // Appends "Exported" event to report's timeline
        localReports = localReports.map((r) => {
          if (r.id === id) {
            const updatedTimeline = [
              { type: 'Exported', user: 'Nisha Singh', date: 'Just now' },
              ...r.timeline,
            ];
            return { ...r, timeline: updatedTimeline };
          }
          return r;
        });
        resolve({ success: true, format, downloadUrl: `https://qapilot.io/exports/${id}.${format}` });
      }, 800)
    ),
};

export default reportService;
