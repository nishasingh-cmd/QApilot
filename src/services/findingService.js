import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const findingService = {
  /**
   * Fetches findings matching filters from the database.
   */
  getFindings: async (params = {}) => {
    const res = await axios.get(`${API_BASE}/findings`, {
      params,
      withCredentials: true
    });
    return res.data || [];
  },

  /**
   * Fetches details of a specific finding.
   */
  getFindingDetails: async (id) => {
    const res = await axios.get(`${API_BASE}/findings/${id}`, { withCredentials: true });
    return res.data;
  },

  /**
   * Resolves a finding.
   */
  resolveFinding: async (id) => {
    const res = await axios.patch(`${API_BASE}/findings/${id}/resolve`, {}, { withCredentials: true });
    return res.data;
  },

  /**
   * Ignores a finding.
   */
  ignoreFinding: async (id) => {
    const res = await axios.patch(`${API_BASE}/findings/${id}/ignore`, {}, { withCredentials: true });
    return res.data;
  },

  /**
   * Assigns a finding to a developer.
   */
  assignFinding: async (id, assignee) => {
    const res = await axios.patch(
      `${API_BASE}/findings/${id}/assign`,
      { assignee },
      { withCredentials: true }
    );
    return res.data;
  },

  /**
   * Executes a bulk update action on selected findings.
   */
  bulkActions: async (ids, action, assignee) => {
    const res = await axios.post(
      `${API_BASE}/findings/bulk`,
      { ids, action, assignee },
      { withCredentials: true }
    );
    return res.data;
  },

  /**
   * Generates and triggers downloads for exported findings files.
   */
  exportFindings: async (ids, format) => {
    const res = await axios.get(`${API_BASE}/findings`, { withCredentials: true });
    const list = res.data || [];
    const toExport = list.filter((f) => ids.includes(f.id));

    let content = '';
    let mimeType = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(toExport, null, 2);
      mimeType = 'application/json';
    } else {
      // CSV Export
      const headers = ['ID', 'Title', 'Repository', 'Branch', 'File', 'Line', 'Severity', 'Category', 'Status', 'Confidence'];
      const rows = toExport.map((f) => [
        f.id,
        `"${f.title.replace(/"/g, '""')}"`,
        f.repo,
        f.branch,
        f.file,
        f.lineNumber,
        f.severity,
        f.category,
        f.status,
        f.confidence
      ]);
      content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `findings-export-${Date.now()}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  }
};

export default findingService;
