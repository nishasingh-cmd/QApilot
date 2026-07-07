import Scan from "../models/Scan.js";
import Repository from "../models/Repository.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
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

  // 4. Calculate findings counters
  const critical = scan.findings.filter((f) => f.severity === "critical").length;
  const warning = scan.findings.filter((f) => f.severity === "warning" || f.severity === "high").length;
  const info = scan.findings.filter((f) => f.severity === "info" || f.severity === "low").length;

  const findingsSummary = {
    critical,
    high: 0, // Rule engine produces warning/critical/info
    medium: warning,
    low: info,
    resolved: 0,
    ignored: 0
  };

  // 5. Generate rule-based summaries and lists
  const aiAnalysis = generateAiSummary(scan, repo);

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
