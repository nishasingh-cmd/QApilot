/**
 * Prompt template for compiling dynamic scan executive reports.
 */
export const generateReportSummaryPrompt = (scanData) => {
  return `You are a Principal Engineering Director. Analyze this codebase sync scanning session summary and output a strictly structured JSON object.

Scan metrics:
- Repository: ${scanData.repoName}
- Total Findings: ${scanData.totalFindings}
- Critical Severity: ${scanData.criticalCount}
- High Severity: ${scanData.highCount}
- Medium Severity: ${scanData.mediumCount}
- Quality Score: ${scanData.qualityScore}%

The response must be a single valid JSON block containing:
{
  "executiveSummary": "A concise executive summary paragraph describing the scan outcome and general codebase quality.",
  "qualityOverview": "An overview of code quality trends, test coverage index assessment, and architectural health.",
  "keyRisks": "List of key architectural, performance, or security vulnerability risks detected.",
  "positiveHighlights": "List of positive aspects and best practices identified in the codebase.",
  "weeklyRecommendations": "Actionable guidelines and developer recommendations for the team for this upcoming week.",
  "priorityActionPlan": "Step-by-step priority remediation action items list."
}

Do not wrap the JSON output inside backticks. Return raw JSON only.`;
};

export default generateReportSummaryPrompt;
