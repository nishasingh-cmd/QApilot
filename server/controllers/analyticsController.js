import {
  getOverview,
  getTrends,
  getRepositoryHealthList,
  getTeamLeaderboardList,
  getAIAnalyticsList
} from "../services/analyticsService.js";

export const getAnalyticsOverview = async (req, res) => {
  try {
    const data = await getOverview(req.user._id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalyticsTrends = async (req, res) => {
  try {
    const { timeframe } = req.query;
    const data = await getTrends(req.user._id, timeframe || "30d");
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalyticsRepositories = async (req, res) => {
  try {
    const data = await getRepositoryHealthList(req.user._id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalyticsTeam = async (req, res) => {
  try {
    const data = await getTeamLeaderboardList(req.user._id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalyticsAI = async (req, res) => {
  try {
    const data = await getAIAnalyticsList(req.user._id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalyticsExecutiveSummary = async (req, res) => {
  try {
    const data = await getOverview(req.user._id);
    res.json(data.summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportAnalyticsData = async (req, res) => {
  try {
    const { format } = req.query;
    const overview = await getOverview(req.user._id);

    let content = "";
    let contentType = "text/plain";
    let filename = `analytics-export-${Date.now()}.${format || "json"}`;

    if (format === "json") {
      content = JSON.stringify(overview, null, 2);
      contentType = "application/json";
    } else {
      // CSV format representation of metrics
      const headers = ["Metric", "Value"];
      const rows = [
        ["Quality Score", `${overview.metrics.qualityScore}%`],
        ["Test Coverage", `${overview.metrics.testCoverage}%`],
        ["Open Findings", overview.metrics.openFindings],
        ["Resolved This Week", overview.metrics.resolvedThisWeek],
        ["Repositories Monitored", overview.metrics.reposMonitored],
        ["AI Accuracy Score", `${overview.metrics.aiAccuracy}%`]
      ];
      content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      contentType = "text/csv";
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAnalyticsOverview,
  getAnalyticsTrends,
  getAnalyticsRepositories,
  getAnalyticsTeam,
  getAnalyticsAI,
  getAnalyticsExecutiveSummary,
  exportAnalyticsData
};
