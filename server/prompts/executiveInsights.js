/**
 * Prompt template for calculating workspace executive insights.
 */
export const generateExecutiveInsightsPrompt = (analyticsData) => {
  return `You are a Lead Technical Architect. Analyze the overall engineering metrics of the workspace and output a strictly structured JSON object.

Workspace Statistics:
- Connected Repositories: ${analyticsData.repoCount}
- Overall Quality Score: ${analyticsData.overallScore}%
- Open Findings: ${analyticsData.openFindingsCount}
- Test Coverage: ${analyticsData.coverage}%
- Critical Issues: ${analyticsData.criticalCount}

The response must be a single valid JSON block containing:
{
  "healthAssessment": "Summary of overall workspace engineering health assessment.",
  "qualityTrends": "Observation on quality stability trends over time across repos.",
  "productivityObservations": "Comments on codebase contributions, review bottlenecks, or team observation ratings.",
  "riskPredictions": "Predictive warnings regarding future tech debt, legacy maintenance, or security vulnerability risks."
}

Do not wrap the JSON output inside backticks. Return raw JSON only.`;
};

export default generateExecutiveInsightsPrompt;
