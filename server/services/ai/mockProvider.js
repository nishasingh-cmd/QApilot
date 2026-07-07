/**
 * Mock LLM provider fallback yielding clean, structured JSON schemas.
 */
export const generateMockResponse = async (prompt) => {
  console.log("Mock AI Provider called. Parsing prompt type...");
  
  if (prompt.includes("whatItIs") || prompt.includes("Finding Details:")) {
    // Return finding explanation
    return JSON.stringify({
      whatItIs: "Potential vulnerability where unchecked input flows directly to execution sinks or system APIs.",
      whyItMatters: "Code injection and unauthorized control flow manipulation are high risk security issues.",
      securityImpact: "Allows execution of arbitrary logic, data leakage, and system compromise.",
      recommendedFix: "Sanitize and validate inputs. Avoid direct concatenations into sensitive queries or shell commands.",
      codeImprovement: "// Refactored implementation:\nconst secureInput = validator.escape(userInput);\nqueryPool.execute('SELECT * FROM users WHERE id = ?', [secureInput]);",
      estimatedEffort: "Low",
      riskLevel: "High"
    });
  }

  if (prompt.includes("executiveSummary") || prompt.includes("Scan metrics:")) {
    // Return report summary
    return JSON.stringify({
      executiveSummary: "The latest scan completed with an overall score of 88%. While clean, minor vulnerability triggers were flagged inside data validation scripts.",
      qualityOverview: "Solid engineering standards with 84% test coverage. Standard formatting and linters passed.",
      keyRisks: [
        "Unsanitized input in query controller lines",
        "Legacy JWT token configurations"
      ],
      positiveHighlights: [
        "High test coverage parameters",
        "No hardcoded password configurations in environment files"
      ],
      weeklyRecommendations: "Standardize data verification utility layers across all push/pull endpoints.",
      priorityActionPlan: [
        "Migrate custom JSON query handlers to database prepared states.",
        "Update repository dependencies to resolve prototype pollution warning."
      ]
    });
  }

  if (prompt.includes("healthAssessment") || prompt.includes("Workspace Statistics:")) {
    // Return executive insights
    return JSON.stringify({
      healthAssessment: "The workspace is in excellent condition, averaging 85%+ quality metrics.",
      qualityTrends: "Stability metrics have improved steadily over the past week as teams addressed outstanding bugs.",
      productivityObservations: "Pushes and PR scoring are highly active. Remediations are closing 40% faster than sync delays.",
      riskPredictions: "High dependency churn represents the primary threat vector. Run routine audits."
    });
  }

  // Fallback for Chat Assistant
  return `### QAPilot AI Assistant Reply
I analyzed your codebase sync state:
1. **Repository Health**: Average score is currently high.
2. **Security**: We recommend parameterized DB calls.
3. **Action Items**: Secure raw query calls.

How else can I assist you with your repositories today?`;
};

export default { generateMockResponse };
