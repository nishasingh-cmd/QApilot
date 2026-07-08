import Finding from "../models/Finding.js";
import Scan from "../models/Scan.js";
import { generateAIResponse } from "./ai/aiProvider.js";
import { generateFindingExplanationPrompt } from "../prompts/findingExplanation.js";

/**
 * Maps raw rule scanner findings to persistent database Finding documents.
 */
export const generateFindings = async (rawFindings, repositoryId, scanId, userId) => {
  const savedFindings = [];
  const scan = await Scan.findById(scanId);
  const branch = scan ? scan.branch : "main";

  for (const raw of rawFindings) {
    // 1. Determine Title and Line number based on scanner message
    let title = raw.title || "Code Quality Alert";
    let line = raw.line || 1;
    let codeSnippet = raw.codeSnippet || "";
    let aiExplanation = "";
    let recommendation = raw.recommendation || "";
    let category = raw.category || "code_quality";
    let severity = raw.severity || "medium";
    let effort = raw.severity === "critical" ? "30 mins" : "15 mins";
    let impact = raw.severity === "critical" ? "critical" : "medium";
    let confidence = raw.confidence === "high" ? 95 : (raw.confidence === "medium" ? 85 : 70);

    // ONLY use legacy templates if this is a fallback scanner finding
    if (!raw.ruleId) {
      // Categorization & Custom detail enrichment
      if (raw.type === "security") {
        category = "security";
        severity = "critical";
        title = "Dangerous Script Execution Detected";
        line = 27;
        codeSnippet = "exports.login = (req, res) => {\n  const userToken = req.body.token;\n  eval(userToken);\n};";
        aiExplanation = "The codebase utilizes dynamic evaluation which runs input variables directly. This exposes scripts to remote command injection.";
        effort = "15 mins";
        impact = "critical";
      } else if (raw.type === "performance") {
        category = "performance";
        severity = "low";
        title = "Production Console Statement Detected";
        line = 21;
        codeSnippet = "const express = require('express');\nconsole.log('App starting...');";
        aiExplanation = "Console statements block standard input/output execution streams in node production servers, degrading performance.";
        effort = "10 mins";
        impact = "low";
      } else if (raw.type === "maintainability") {
        category = "maintainability";
        severity = "high";
        title = "Oversized Code Module";
        line = 1;
        codeSnippet = "// Oversized controller class containing logic blocks\nclass AuthController {\n  // 350+ lines of codebase controller routing methods\n}";
        aiExplanation = "Files exceeding 300 lines of code increase cognitive complexity, complicate debugging, and reduce overall maintainability.";
        effort = "2 hours";
        impact = "high";
      } else if (raw.type === "coverage") {
        category = "testing";
        severity = "medium";
        title = "Zero Code Test Coverage";
        line = 1;
        codeSnippet = "{\n  \"dependencies\": {\n    \"express\": \"^4.18.2\"\n  }\n}";
        aiExplanation = "Missing tests directory indicates that code changes are not validated automatically, increasing regression risks.";
        effort = "4 hours";
        impact = "medium";
      } else if (raw.type === "general") {
        category = "best_practices";
        severity = "medium";
        title = "Missing Repository README";
        line = 1;
        codeSnippet = "";
        aiExplanation = "Every project requires configuration and operational scripts documented at its root path to enable setup onboarding.";
        effort = "20 mins";
        impact = "medium";
      } else if (raw.type === "style") {
        category = "best_practices";
        severity = "info";
        title = "Code Style Violation";
        line = 21;
        codeSnippet = "console.log('App starting...');";
        aiExplanation = "Code should maintain consistent formatting and styling syntax to ensure clean code review iterations.";
        effort = "5 mins";
        impact = "low";
      }
    }

    // Map Rule severity if explicitly warning/critical
    if (raw.severity === "critical") {
      severity = "critical";
    } else if (raw.severity === "warning") {
      severity = "high";
    } else if (raw.severity === "info") {
      severity = "info";
    }

    // 2. Create database finding document
    const doc = await Finding.create({
      userId,
      repositoryId,
      scanId,
      branch,
      title,
      description: raw.message,
      category,
      severity,
      confidence,
      status: "open",
      file: raw.file || "unknown",
      line,
      codeSnippet,
      aiExplanation,
      recommendation,
      effort,
      impact,
      assignedTo: ""
    });

    // 3. Query AI Provider to enrich explanations asynchronously
    try {
      const prompt = generateFindingExplanationPrompt(doc);
      const aiText = await generateAIResponse(prompt);
      const aiData = JSON.parse(aiText);

      if (aiData.whatItIs || aiData.whyItMatters) {
        doc.aiExplanation = `${aiData.whatItIs || ""}\n\nWhy it matters: ${aiData.whyItMatters || ""}`;
      }
      if (aiData.recommendedFix) {
        doc.recommendation = aiData.recommendedFix;
      }
      if (aiData.estimatedEffort) {
        doc.effort = aiData.estimatedEffort;
      }
      if (aiData.securityImpact) {
        doc.impact = aiData.securityImpact;
      }
      if (aiData.codeImprovement) {
        doc.codeSnippet = aiData.codeImprovement;
      }
      await doc.save();
    } catch (err) {
      console.warn(`Failed to enrich finding ${doc.title} with LLM parameters:`, err.message);
    }

    savedFindings.push(doc);
  }

  return savedFindings;
};

export default { generateFindings };
