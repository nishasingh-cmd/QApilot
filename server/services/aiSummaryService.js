/**
 * Rule-Based AI Summary Service for QAPilot.
 * Analyzes findings and metric scores to formulate executive summaries, risk levels, and suggestions.
 */
export const generateAiSummary = (scan, repo) => {
  const findings = scan.findings || [];
  const scores = scan.scores || {};
  const qualityScore = scores.qualityScore || 0;

  // Determine Risk Level
  let riskLevel = "low";
  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const warningCount = findings.filter((f) => f.severity === "warning" || f.severity === "high").length;
  const infoCount = findings.filter((f) => f.severity === "info" || f.severity === "low").length;

  if (criticalCount > 0) {
    riskLevel = "critical";
  } else if (warningCount > 3) {
    riskLevel = "high";
  } else if (warningCount > 0) {
    riskLevel = "medium";
  }

  // Determine Recommendation Level
  let recommendationLevel = "low";
  if (qualityScore < 70) {
    recommendationLevel = "high";
  } else if (qualityScore < 85) {
    recommendationLevel = "medium";
  }

  // Aggregate Findings Types
  const securityIssues = findings.filter((f) => f.type === "security");
  const performanceIssues = findings.filter((f) => f.type === "performance");
  const maintainabilityIssues = findings.filter((f) => f.type === "maintainability" || f.type === "style");
  const coverageIssues = findings.filter((f) => f.type === "coverage");

  // Priority Actions
  const priorityActions = [];
  if (criticalCount > 0) {
    priorityActions.push("Resolve critical security issues immediately to avoid environment exposure or code injection.");
  }
  if (coverageIssues.length > 0) {
    priorityActions.push("Set up automated test coverage tools and establish a minimum 80% coverage check gate.");
  }
  if (warningCount > 2) {
    priorityActions.push("Refactor oversized modules or components containing excessive complexity warning flags.");
  }
  if (priorityActions.length === 0) {
    priorityActions.push("Establish routine security and performance compliance checks on main branch merges.");
    priorityActions.push("Enable automated repository scanning hooks for code review checks.");
  }

  // Architecture Suggestions
  const architecture = [];
  if (maintainabilityIssues.length > 0) {
    maintainabilityIssues.forEach((issue) => {
      architecture.push(`Refactor [${issue.file}]: ${issue.message}. Suggestion: ${issue.recommendation}`);
    });
  } else {
    architecture.push("Keep codebase modular and separate business logic from routing layers.");
    architecture.push("Ensure components maintain a single responsibility standard.");
  }

  // Testing Improvements
  const testing = [];
  if (coverageIssues.length > 0) {
    coverageIssues.forEach((issue) => {
      testing.push(`Address tests coverage gap in [${issue.file}]: ${issue.message}. Suggestion: ${issue.recommendation}`);
    });
  } else {
    testing.push("Introduce unit tests matching folder structure for newly committed functions.");
    testing.push("Leverage snapshot testing tools for key dashboard and UI widgets.");
  }

  // Security Recommendations
  const security = [];
  if (securityIssues.length > 0) {
    securityIssues.forEach((issue) => {
      security.push(`Mitigate threat in [${issue.file}]: ${issue.message}. Suggestion: ${issue.recommendation}`);
    });
  } else {
    security.push("Regularly scan project configuration files for exposed API credentials or environment keys.");
    security.push("Establish strict input verification validation before feeding variables into application queries.");
  }

  // Performance Suggestions
  const performance = [];
  if (performanceIssues.length > 0) {
    performanceIssues.forEach((issue) => {
      performance.push(`Optimize [${issue.file}]: ${issue.message}. Suggestion: ${issue.recommendation}`);
    });
  } else {
    performance.push("Implement code splitting/lazy loading modules to minimize resource size overhead.");
    performance.push("Eliminate console logging statements and configure persistent backend logger dependencies.");
  }

  // Executive Summary text
  let executiveSummary = `Quality analysis completed for repository '${repo.name}' on branch '${scan.branch || "main"}'. The codebase has achieved an overall quality score of ${qualityScore}%. `;
  if (criticalCount > 0) {
    executiveSummary += `WARNING: The analysis flagged ${criticalCount} critical security vulnerability which requires immediate attention. `;
  } else if (warningCount > 0) {
    executiveSummary += `The analysis identified ${warningCount} warnings related to code health and test coverage. `;
  } else {
    executiveSummary += `No critical issues or warnings were flagged. The code base aligns with general standard styles and architecture guidelines. `;
  }
  executiveSummary += `Recommendation: The quality index score is ${qualityScore >= 90 ? "Excellent" : qualityScore >= 80 ? "Good" : "Needs Attention"}. Actions listed below should be incorporated.`;

  // AI Insights list (combining general recommendations)
  const aiInsights = [
    `Risk analysis assessment is deemed ${riskLevel.toUpperCase()}.`,
    `Recommendation priority level is ${recommendationLevel.toUpperCase()}.`,
    ...priorityActions.slice(0, 2),
    ...securityIssues.map((s) => `Security warning in ${s.file}: ${s.message}`),
    ...coverageIssues.map((c) => `Coverage check: ${c.message}`)
  ];

  return {
    executiveSummary,
    riskLevel,
    recommendationLevel,
    priorityActions,
    architecture: architecture.slice(0, 5),
    testing: testing.slice(0, 5),
    security: security.slice(0, 5),
    performance: performance.slice(0, 5),
    aiInsights
  };
};

export default { generateAiSummary };
