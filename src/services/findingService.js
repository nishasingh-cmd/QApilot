/**
 * Mock finding service for AI Findings & Bug Intelligence Center.
 * Exposes async functions ready to replace with real backend API calls.
 */

import { MOCK_FINDINGS } from '../data/findings';

let localFindings = [...MOCK_FINDINGS];

export const findingService = {
  getFindings: () =>
    new Promise((resolve) => setTimeout(() => resolve([...localFindings]), 600)),

  getFindingDetails: (id) =>
    new Promise((resolve, reject) =>
      setTimeout(() => {
        const found = localFindings.find((f) => f.id === id);
        if (found) resolve({ ...found });
        else reject(new Error(`Finding ${id} not found`));
      }, 400)
    ),

  resolveFinding: (id) =>
    new Promise((resolve) =>
      setTimeout(() => {
        localFindings = localFindings.map((f) =>
          f.id === id ? { ...f, status: 'resolved' } : f
        );
        resolve({ success: true, id });
      }, 500)
    ),

  assignFinding: (id, assignee) =>
    new Promise((resolve) =>
      setTimeout(() => {
        localFindings = localFindings.map((f) =>
          f.id === id ? { ...f, assignee } : f
        );
        resolve({ success: true, id, assignee });
      }, 400)
    ),

  ignoreFinding: (id) =>
    new Promise((resolve) =>
      setTimeout(() => {
        localFindings = localFindings.map((f) =>
          f.id === id ? { ...f, status: 'ignored' } : f
        );
        resolve({ success: true, id });
      }, 400)
    ),

  exportFindings: (ids, format) =>
    new Promise((resolve) =>
      setTimeout(() => {
        const toExport = localFindings.filter((f) => ids.includes(f.id));
        resolve({ success: true, count: toExport.length, format });
      }, 800)
    ),
};
export default findingService;
