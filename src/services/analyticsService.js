import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const analyticsService = {
  /**
   * Fetches metrics and executive highlights summary from MERN backend.
   */
  getOverview: async () => {
    const res = await axios.get(`${API_BASE}/analytics/overview`, { withCredentials: true });
    return res.data;
  },

  /**
   * Fetches historical health trends based on selected timeframe filter.
   */
  getQualityTrends: async (timeframe) => {
    const res = await axios.get(`${API_BASE}/analytics/trends`, {
      params: { timeframe },
      withCredentials: true
    });
    return res.data || [];
  },

  /**
   * Fetches list of repositories and health metrics.
   */
  getRepositoryHealth: async () => {
    const res = await axios.get(`${API_BASE}/analytics/repositories`, { withCredentials: true });
    return res.data || [];
  },

  /**
   * Fetches developer productivity rankings leaderboard.
   */
  getTeamMetrics: async () => {
    const res = await axios.get(`${API_BASE}/analytics/team`, { withCredentials: true });
    return res.data;
  },

  /**
   * Fetches AI accuracy metrics, severity distributions, and categories.
   */
  getAIAnalytics: async () => {
    const res = await axios.get(`${API_BASE}/analytics/ai`, { withCredentials: true });
    return res.data;
  },

  /**
   * Downloads exported dashboard analytics report file.
   */
  exportAnalytics: async (format) => {
    const res = await axios.get(`${API_BASE}/analytics/export`, {
      params: { format },
      responseType: 'blob',
      withCredentials: true
    });

    const mime = format === 'json' ? 'application/json' : 'text/csv';
    const blob = new Blob([res.data], { type: mime });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `analytics-dashboard-export-${Date.now()}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  }
};

export default analyticsService;
