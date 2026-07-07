/**
 * Generate security and code audit prompt templates for findings.
 */
export const generateFindingExplanationPrompt = (finding) => {
  return `You are an elite Senior DevSecOps and Security Engineer. Analyze this codebase finding and output a strictly structured JSON object.

Finding Details:
- Title: ${finding.title}
- Category: ${finding.category}
- Severity: ${finding.severity}
- File: ${finding.file}:${finding.line}
- Snippet:
\`\`\`
${finding.codeSnippet || ""}
\`\`\`

The response must be a single valid JSON block containing:
{
  "whatItIs": "Explain what the issue is in detail.",
  "whyItMatters": "Explain why this code issue matters to business security, scalability, and performance.",
  "securityImpact": "Assess security or performance impact of leaving this vulnerability unpatched.",
  "recommendedFix": "Step-by-step description of the patching solution.",
  "codeImprovement": "Provide a complete improved refactored snippet of the code.",
  "estimatedEffort": "Low/Medium/High",
  "riskLevel": "Low/Medium/High/Critical"
}

Do not wrap the JSON output inside backticks (e.g., \`\`\`json). Return raw JSON only.`;
};

export default generateFindingExplanationPrompt;
