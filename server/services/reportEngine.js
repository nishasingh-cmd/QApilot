import Scan from "../models/Scan.js";
import Repository from "../models/Repository.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import Finding from "../models/Finding.js";
import { generateAiSummary } from "./aiSummaryService.js";

/**
 * Generates an Enterprise Report based on a successful scan execution.
 */
export const generateReportFromScan = async (scanId, userId) => {
  // 1. Fetch scan result
  const scan = await Scan.findById(scanId);
  if (!scan) {
    throw new Error("Target quality scan not found in database");
  }

  // 2. Fetch repository
  const repo = await Repository.findById(scan.repoId);
  if (!repo) {
    throw new Error("Associated scan repository not found");
  }

  // 3. Fetch user
  const user = await User.findById(userId);
  const userName = user ? user.name : "System Auditor";

  // 4. Query findings from database
  const databaseFindings = await Finding.find({ scanId }).lean();

  const critical = databaseFindings.filter((f) => f.severity === "critical").length;
  const high = databaseFindings.filter((f) => f.severity === "high").length;
  const medium = databaseFindings.filter((f) => f.severity === "medium").length;
  const low = databaseFindings.filter((f) => f.severity === "low").length;
  const info = databaseFindings.filter((f) => f.severity === "info").length;

  const findingsSummary = {
    critical,
    high,
    medium,
    low: low + info,
    resolved: databaseFindings.filter((f) => f.status === "resolved").length,
    ignored: databaseFindings.filter((f) => f.status === "ignored").length
  };

  // 5. Generate rule-based summaries and lists
  const scanWithDbFindings = { ...scan.toObject(), findings: databaseFindings };
  const aiAnalysis = generateAiSummary(scanWithDbFindings, repo);

  // 6. Build category scores
  const categoryScores = {
    quality: scan.scores?.qualityScore || 0,
    security: scan.scores?.securityScore || 0,
    performance: scan.scores?.performanceScore || 0,
    maintainability: scan.scores?.maintainabilityScore || 0,
    coverage: scan.findings.some(f => f.type === "coverage") ? 55 : 90, // mock/simulated coverage
    accessibility: 88, // mock/simulated accessibility
    confidence: 96 // mock/simulated confidence
  };

  // 7. Get previous reports for repository to count version increment
  const previousCount = await Report.countDocuments({ repoId: repo._id });
  const reportVersion = `v1.${previousCount}`;

  // 8. Create the Report document
  const report = await Report.create({
    repoId: repo._id,
    scanId: scan._id,
    userId: user ? user._id : userId,
    name: `Quality Report: ${repo.name} [${scan.branch}] v1.${previousCount}`,
    repo: repo.name,
    branch: scan.branch || "main",
    generatedBy: userName,
    overallScore: scan.scores?.qualityScore || 0,
    categoryScores,
    findingsSummary,
    aiSummary: aiAnalysis.executiveSummary,
    recommendations: {
      priorityActions: aiAnalysis.priorityActions,
      architecture: aiAnalysis.architecture,
      testing: aiAnalysis.testing,
      security: aiAnalysis.security,
      performance: aiAnalysis.performance
    },
    timeline: [
      {
        type: "Created",
        user: userName,
        date: new Date().toLocaleString()
      }
    ],
    status: "ready",
    version: reportVersion
  });

  return report;
};

export default { generateReportFromScan };
