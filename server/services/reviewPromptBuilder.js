/**
 * Prompt builder service for Code Review.
 * Generates structured prompts for static code reviews using AI.
 */
export const buildReviewPrompt = (filename, filepath, language, content) => {
  return `You are a Principal Engineering Lead and Senior DevSecOps Architect.
Analyze the following source code file and generate a production-ready, highly actionable code review report.

File Information:
- File Name: ${filename}
- File Path: ${filepath}
- Programming Language: ${language || "Unknown"}

Source Code Content:
\`\`\`
${content}
\`\`\`

Perform a comprehensive analysis of the code covering the following aspects:
1. Code Quality Review: Syntactic sanity, code smells, duplication.
2. Security Review: Vulnerabilities, injection risks, hardcoded secrets, unsafe library usage, insecure dependencies.
3. Performance Review: Unnecessary complexity, memory leaks, slow queries, poor loop constructs.
4. Maintainability Review: Coupling, modularity, readability, technical debt.
5. Best Practices: Language-specific idioms, style guides, lint issues.
6. Readability Review: Clarity of names, comments, structural hierarchy.
7. Architecture Review: Proper design patterns, separation of concerns.
8. Testing Suggestions: Edge cases to cover, unit test strategies.

Output your analysis as a SINGLE, STRICTLY COMPLIANT JSON object. Do not include markdown code block wrappers (like \`\`\`json) or extra text. Output only raw JSON.

JSON Structure:
{
  "summary": "A concise executive summary highlighting code quality, key strengths, and highest-risk areas.",
  "overallScore": 85, 
  "securityScore": 90,
  "performanceScore": 80,
  "maintainabilityScore": 85,
  "readabilityScore": 90,
  "comments": [
    {
      "line": 12,
      "severity": "critical",
      "category": "security",
      "title": "SQL Injection vulnerability",
      "description": "User inputs are interpolated directly into the database query, allowing arbitrary SQL execution.",
      "recommendation": "Use query parameters or ORM query builders to pass inputs safely.",
      "suggestedCode": "db.query('SELECT * FROM users WHERE id = ?', [userId]);",
      "confidence": "high"
    }
  ]
}

Formatting Rules:
- The "comments" array elements must target specific line numbers (1-indexed integers) of the source code.
- "severity" must be exactly one of: "info", "warning", "critical".
- "category" must be exactly one of: "quality", "security", "performance", "maintainability", "readability", "architecture", "testing", "best_practices".
- "confidence" must be exactly one of: "low", "medium", "high".
- "suggestedCode" should offer clean, drop-in replacement snippets. Leave blank if not applicable.
- Scores must be integers between 0 and 100.
`;
};

export default { buildReviewPrompt };
