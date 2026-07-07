import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const reportService = {
  getReports: async () => {
    const res = await axios.get(`${API_BASE}/reports`, { withCredentials: true });
    return res.data;
  },

  getReport: async (id) => {
    const res = await axios.get(`${API_BASE}/reports/${id}`, { withCredentials: true });
    return res.data;
  },

  generateReport: async (repoName, branch) => {
    // 1. Fetch repositories to find corresponding ID
    const reposRes = await axios.get(`${API_BASE}/repositories`, { withCredentials: true });
    const repo = reposRes.data.find(
      (r) => r.name === repoName || r.fullName === repoName || r._id === repoName
    );

    if (!repo) {
      throw new Error(`Repository "${repoName}" is not imported in your workspace.`);
    }

    // 2. Query scan history for this repo and branch
    const scansRes = await axios.get(`${API_BASE}/scan/history/${repo._id}`, { withCredentials: true });
    let latestScan = scansRes.data.find((s) => s.status === 'success' && s.branch === branch);

    // 3. If no successful scan exists, trigger a new scan in background and wait for it
    if (!latestScan) {
      const triggerRes = await axios.post(
        `${API_BASE}/scan/run/${repo._id}`,
        { branch: branch || 'main' },
        { withCredentials: true }
      );
      const scanId = triggerRes.data._id;

      // Poll scan status until success or failure
      let attempts = 0;
      while (attempts < 12) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const statusRes = await axios.get(`${API_BASE}/scan/result/${scanId}`, { withCredentials: true });
        
        if (statusRes.data.status === 'success') {
          latestScan = statusRes.data;
          break;
        } else if (statusRes.data.status === 'failed') {
          throw new Error('Automated quality scan failed. Cannot build reports.');
        }
        attempts++;
      }
    }

    if (!latestScan) {
      throw new Error(`No scan results available for branch "${branch}". Please run a scan first.`);
    }

    // 4. Generate report from scan
    const res = await axios.post(`${API_BASE}/reports/generate/${latestScan._id}`, {}, { withCredentials: true });
    return res.data;
  },

  compareReports: async (id1, id2) => {
    const res = await axios.post(`${API_BASE}/reports/compare`, { reportId1: id1, reportId2: id2 }, { withCredentials: true });
    return res.data;
  },

  shareReport: async (id, platform, recipient) => {
    const res = await axios.post(`${API_BASE}/reports/${id}/share`, { platform, recipient }, { withCredentials: true });
    return res.data;
  },

  exportReport: async (id, format) => {
    const res = await axios.get(`${API_BASE}/reports/${id}/export?format=${format}`, {
      withCredentials: true,
      responseType: format === 'pdf' || format === 'json' ? 'json' : 'text'
    });

    let content = res.data;
    let mimeType = 'text/plain';
    
    if (format === 'json' || format === 'pdf') {
      content = JSON.stringify(content, null, 2);
      mimeType = 'application/json';
    } else if (format === 'csv') {
      mimeType = 'text/csv';
    } else if (format === 'markdown') {
      mimeType = 'text/markdown';
    } else if (format === 'html') {
      mimeType = 'text/html';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', `report-${id}.${format === 'pdf' ? 'pdf.json' : format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  }
};

export default reportService;
