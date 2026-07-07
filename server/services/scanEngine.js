import { runRules } from "./ruleEngine.js";
import Repository from "../models/Repository.js";
import { generateFindings } from "./findingGenerator.js";

/**
 * Generates a mock file tree matching repository configuration to execute static rules on.
 */
const generateMockFileTree = (repo) => {
  const lang = repo.language || "Javascript";
  
  // Seed file lists
  const files = [
    {
      name: "package.json",
      path: "package.json",
      content: JSON.stringify({ dependencies: { express: "^4.18.2" } })
    },
    {
      name: "index.js",
      path: "src/index.js",
      lineCount: 120,
      content: "const express = require('express');\nconsole.log('App starting...');"
    },
    {
      name: "authController.js",
      path: "src/controllers/authController.js",
      lineCount: 350, // Triggers maintainability size warning (>300 lines)
      content: "exports.login = (req, res) => {\n  const userToken = req.body.token;\n  eval(userToken);\n};" // Triggers security critical warning (eval)
    }
  ];

  // Randomize mock files slightly depending on repository name to make findings dynamic and unique per repository
  const nameSum = repo.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  if (nameSum % 2 === 0) {
    files.push({
      name: "README.md",
      path: "README.md",
      content: "# Project Readme"
    });
  }
  if (nameSum % 3 === 0) {
    files.push({
      name: "auth.test.js",
      path: "tests/auth.test.js",
      content: "describe('Login tests', () => {});"
    });
  }

  return files;
};

/**
 * Scan Engine entry point.
 */
export const runScan = async (repoId, scanId, userId) => {
  const repo = await Repository.findById(repoId);
  if (!repo) {
    throw new Error("Repository not found in database");
  }

  // 1. Generate simulated codebase file tree
  const files = generateMockFileTree(repo);

  // 2. Execute rule validations
  const findings = runRules(repo, files);

  // 3. Compute metric scores based on issues found
  let qualityDeduction = 0;
  let securityDeduction = 0;
  let performanceDeduction = 0;
  let maintainabilityDeduction = 0;

  for (const finding of findings) {
    const deduction = finding.severity === "critical" ? 20 : finding.severity === "warning" ? 10 : 4;

    if (finding.type === "security") {
      securityDeduction += deduction;
    } else if (finding.type === "performance") {
      performanceDeduction += deduction;
    } else if (finding.type === "maintainability") {
      maintainabilityDeduction += deduction;
    }
    
    // Everything affects overall quality score
    qualityDeduction += Math.round(deduction / 1.5);
  }

  const qualityScore = Math.max(30, Math.min(100, 100 - qualityDeduction));
  const securityScore = Math.max(30, Math.min(100, 100 - securityDeduction));
  const performanceScore = Math.max(30, Math.min(100, 100 - performanceDeduction));
  const maintainabilityScore = Math.max(30, Math.min(100, 100 - maintainabilityDeduction));

  // 4. Generate persistent finding documents in MongoDB
  let savedDocs = [];
  if (scanId && userId) {
    savedDocs = await generateFindings(findings, repoId, scanId, userId);
  }

  // 5. Compile findings counts summary
  const summary = {
    critical: savedDocs.filter(f => f.severity === "critical").length,
    high: savedDocs.filter(f => f.severity === "high").length,
    medium: savedDocs.filter(f => f.severity === "medium").length,
    low: savedDocs.filter(f => f.severity === "low").length
  };

  return {
    scores: {
      qualityScore,
      securityScore,
      performanceScore,
      maintainabilityScore
    },
    findings: savedDocs,
    findingsSummary: summary
  };
};

export default { runScan };
