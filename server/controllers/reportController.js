import Report from "../models/Report.js";
import Scan from "../models/Scan.js";
import Repository from "../models/Repository.js";
import { generateReportFromScan } from "../services/reportEngine.js";
import { exportToJson, exportToPdfReady, exportToCsv } from "../services/exportService.js";
import { createNotification } from "../services/notificationService.js";

// Helper to format report response for both frontend UI needs and prompt format guidelines
const formatReportResponse = (r) => {
  if (!r) return null;

  const generatedAtFormatted = r.createdAt ? new Date(r.createdAt).toLocaleString() : "Just now";

  const riskVal = r.findingsSummary.critical > 0 
    ? "critical" 
    : r.findingsSummary.medium > 3 
      ? "high" 
      : r.findingsSummary.medium > 0 
        ? "medium" 
        : "low";

  const recLevel = r.overallScore < 70 
    ? "high" 
    : r.overallScore < 85 
      ? "medium" 
      : "low";

  // Nested blocks requested by prompt
  const summaryObj = {
    overallScore: r.overallScore,
    riskLevel: riskVal,
    recommendationLevel: recLevel,
    text: r.aiSummary // to pass safely to ExecutiveSummaryCard
  };

  const metricsObj = {
    quality: r.categoryScores?.quality || r.overallScore || 0,
    security: r.categoryScores?.security || 0,
    performance: r.categoryScores?.performance || 0,
    maintainability: r.categoryScores?.maintainability || 0,
    coverage: r.categoryScores?.coverage || 0,
    accessibility: r.categoryScores?.accessibility || 0,
    confidence: r.categoryScores?.confidence || 0
  };

  const findingsObj = {
    critical: r.findingsSummary?.critical || 0,
    high: r.findingsSummary?.high || 0,
    medium: r.findingsSummary?.medium || 0,
    low: r.findingsSummary?.low || 0,
    resolved: r.findingsSummary?.resolved || 0,
    ignored: r.findingsSummary?.ignored || 0
  };

  const aiInsights = [
    `Risk assessment is deemed ${riskVal.toUpperCase()}.`,
    `Recommendation priority is ${recLevel.toUpperCase()}.`,
    ...(r.recommendations?.priorityActions || []).slice(0, 2)
  ];

  return {
    id: r._id.toString(),
    _id: r._id,
    name: r.name,
    repo: r.repo,
    branch: r.branch,
    generatedBy: r.generatedBy,
    generatedAt: generatedAtFormatted,
    qualityScore: r.overallScore,
    status: r.status,
    version: r.version,
    metrics: metricsObj,
    findings: findingsObj,
    summary: summaryObj, // matches prompt expected block type (object)
    recommendations: r.recommendations,
    timeline: r.timeline || [],
    createdAt: r.createdAt,

    // Standalone parameters to double ensure backward compatibility
    aiSummary: r.aiSummary,
    findingsSummary: findingsObj,
    aiInsights: aiInsights
  };
};

// 1. GENERATE REPORT FROM SCAN ID
export const generateReport = async (req, res) => {
  try {
    const { scanId } = req.params;

    const scan = await Scan.findOne({ _id: scanId, userId: req.user._id });
    if (!scan) {
      return res.status(404).json({ message: "Scan execution not found" });
    }

    if (scan.status !== "success") {
      return res.status(400).json({ message: "Cannot generate report for unsuccessful scans" });
    }

    const report = await generateReportFromScan(scanId, req.user._id);

    await createNotification(req.user._id, {
      type: "report_ready",
      title: "Quality report ready",
      message: `Executive quality audit report generated for '${report.repo}' (version ${report.version}).`,
      repository: report.repo,
      severity: "success",
      metadata: { reportId: report._id }
    });

    res.status(201).json(formatReportResponse(report));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. GET USER REPORTS LIST
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(reports.map(formatReportResponse));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. GET SINGLE REPORT BY ID
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findOne({ _id: id, userId: req.user._id });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(formatReportResponse(report));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. COMPARE REPORTS
export const compareReports = async (req, res) => {
  try {
    const { reportId1, reportId2, id1, id2 } = req.body;
    const baseId = reportId1 || id1;
    const targetId = reportId2 || id2;

    if (!baseId || !targetId) {
      return res.status(400).json({ message: "Both base and target report IDs are required" });
    }

    const reportA = await Report.findOne({ _id: baseId, userId: req.user._id });
    const reportB = await Report.findOne({ _id: targetId, userId: req.user._id });

    if (!reportA || !reportB) {
      return res.status(404).json({ message: "One or both reports not found" });
    }

    const diff = {
      quality: reportB.overallScore - reportA.overallScore,
      coverage: (reportB.categoryScores?.coverage || 0) - (reportA.categoryScores?.coverage || 0),
      security: (reportB.categoryScores?.security || 0) - (reportA.categoryScores?.security || 0),
      performance: (reportB.categoryScores?.performance || 0) - (reportA.categoryScores?.performance || 0),
      findings: 
        ((reportB.findingsSummary?.critical || 0) + (reportB.findingsSummary?.high || 0)) -
        ((reportA.findingsSummary?.critical || 0) + (reportA.findingsSummary?.high || 0))
    };

    res.json({
      reportA: formatReportResponse(reportA),
      reportB: formatReportResponse(reportB),
      diff
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. EXPORT REPORT DATA
export const exportReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.query;

    const report = await Report.findOne({ _id: id, userId: req.user._id });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Update report's timeline audit log
    report.timeline.unshift({
      type: "Exported",
      user: req.user.name || "User",
      date: new Date().toLocaleString()
    });
    await report.save();

    const formattedReport = formatReportResponse(report);

    if (format === "csv") {
      const scan = await Scan.findById(report.scanId);
      const csvData = exportToCsv(formattedReport, scan);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=report-${id}.csv`);
      return res.send(csvData);
    }

    if (format === "pdf") {
      const pdfReadyData = exportToPdfReady(formattedReport);
      return res.json(pdfReadyData);
    }

    // Default to JSON
    const jsonData = exportToJson(formattedReport);
    res.json(jsonData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. SHARE REPORT (TIMELINE AUDITING)
export const shareReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, recipient } = req.body;

    const report = await Report.findOne({ _id: id, userId: req.user._id });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Add timeline share event
    report.timeline.unshift({
      type: "Shared",
      user: req.user.name || "User",
      date: new Date().toLocaleString()
    });
    await report.save();

    res.json({
      success: true,
      message: `Report shared on ${platform || "email"} with ${recipient || "team"}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  generateReport,
  getReports,
  getReportById,
  compareReports,
  exportReport,
  shareReport
};
