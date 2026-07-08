import traverse from "@babel/traverse";

/**
 * Analyzes file complexity metrics and generates maintainability findings.
 * Measures cyclomatic complexity, nesting depth, function length, and class sizes.
 */
export const analyzeComplexity = (ast, filepath, code) => {
  const findings = [];
  const metrics = {
    cyclomaticComplexity: 1, // Base complexity
    maxNestingDepth: 0,
    longMethodsCount: 0,
    largeClassesCount: 0,
    functionCount: 0,
    totalComplexity: 0,
    maxComplexity: 1,
    mostComplexFunction: null
  };

  const codeLines = code.split("\n");

  const getSnippet = (startLine, endLine) => {
    return codeLines.slice(Math.max(0, startLine - 1), Math.min(codeLines.length, endLine)).join("\n");
  };

  traverse.default(ast, {
    // 1. Evaluate Class Sizes
    ClassDeclaration(path) {
      const { node } = path;
      if (node.loc) {
        const lineCount = node.loc.end.line - node.loc.start.line + 1;
        if (lineCount > 300) {
          metrics.largeClassesCount += 1;
          findings.push({
            title: "Large Class Detected",
            severity: "warning",
            category: "maintainability",
            confidence: "high",
            file: filepath,
            line: node.loc.start.line,
            column: node.loc.start.column + 1,
            ruleId: "large-class",
            recommendation: `Refactor the class "${node.id?.name || "Anonymous"}" into smaller, decoupled classes or utilities.`,
            codeSnippet: getSnippet(node.loc.start.line, Math.min(node.loc.start.line + 5, node.loc.end.line)),
            message: `Class "${node.id?.name || "Anonymous"}" is ${lineCount} lines long (maximum recommended size is 300 lines).`
          });
        }
      }
    },

    // 2. Evaluate Function Complexities & Nesting
    "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod|ObjectMethod"(path) {
      const { node } = path;
      if (!node.body || !node.loc) return;

      metrics.functionCount += 1;
      let decisionPoints = 0;
      let maxFunctionNesting = 0;

      // Identify function name
      let funcName = "anonymous";
      if (node.id && node.id.name) {
        funcName = node.id.name;
      } else if (path.parent.type === "VariableDeclarator" && path.parent.id.name) {
        funcName = path.parent.id.name;
      } else if (node.key && node.key.name) {
        funcName = node.key.name;
      }

      // Traverse children within the function body to count decision points and nesting
      path.traverse({
        IfStatement(childPath) {
          decisionPoints += 1;
          checkNesting(childPath);
        },
        ForStatement(childPath) {
          decisionPoints += 1;
          checkNesting(childPath);
        },
        ForInStatement(childPath) {
          decisionPoints += 1;
          checkNesting(childPath);
        },
        ForOfStatement(childPath) {
          decisionPoints += 1;
          checkNesting(childPath);
        },
        WhileStatement(childPath) {
          decisionPoints += 1;
          checkNesting(childPath);
        },
        DoWhileStatement(childPath) {
          decisionPoints += 1;
          checkNesting(childPath);
        },
        CatchClause() {
          decisionPoints += 1;
        },
        ConditionalExpression() {
          decisionPoints += 1;
        },
        LogicalExpression(childPath) {
          if (childPath.node.operator === "&&" || childPath.node.operator === "||" || childPath.node.operator === "??") {
            decisionPoints += 1;
          }
        },
        SwitchCase(childPath) {
          // Exclude default case
          if (childPath.node.test) {
            decisionPoints += 1;
          }
        }
      });

      function checkNesting(childPath) {
        let nesting = 0;
        let curr = childPath.parentPath;
        // Count parents until we hit our parent function
        while (curr && curr !== path) {
          if (["IfStatement", "ForStatement", "ForInStatement", "ForOfStatement", "WhileStatement", "DoWhileStatement", "SwitchStatement"].includes(curr.node.type)) {
            nesting += 1;
          }
          curr = curr.parentPath;
        }
        if (nesting > maxFunctionNesting) {
          maxFunctionNesting = nesting;
        }
      }

      const cyclomaticComplexity = decisionPoints + 1;
      metrics.totalComplexity += cyclomaticComplexity;

      if (cyclomaticComplexity > metrics.maxComplexity) {
        metrics.maxComplexity = cyclomaticComplexity;
        metrics.mostComplexFunction = {
          name: funcName,
          complexity: cyclomaticComplexity,
          file: filepath,
          line: node.loc.start.line
        };
      }

      // Check Cyclomatic Complexity threshold
      if (cyclomaticComplexity > 10) {
        findings.push({
          title: "High Cyclomatic Complexity",
          severity: cyclomaticComplexity > 20 ? "critical" : "warning",
          category: "maintainability",
          confidence: "high",
          file: filepath,
          line: node.loc.start.line,
          column: node.loc.start.column + 1,
          ruleId: "high-cyclomatic-complexity",
          recommendation: `Refactor the function "${funcName}" to split complex nested logic branches into dedicated helper functions.`,
          codeSnippet: getSnippet(node.loc.start.line, Math.min(node.loc.start.line + 6, node.loc.end.line)),
          message: `Function "${funcName}" has a cyclomatic complexity of ${cyclomaticComplexity} (recommended limit is 10).`
        });
      }

      // Check Nesting Depth
      if (maxFunctionNesting > 4) {
        if (maxFunctionNesting > metrics.maxNestingDepth) {
          metrics.maxNestingDepth = maxFunctionNesting;
        }
        findings.push({
          title: "Deep Code Nesting",
          severity: "warning",
          category: "maintainability",
          confidence: "high",
          file: filepath,
          line: node.loc.start.line,
          column: node.loc.start.column + 1,
          ruleId: "deep-nesting",
          recommendation: `Flatten the control flow in "${funcName}" using guard clauses, early returns, or helper extraction.`,
          codeSnippet: getSnippet(node.loc.start.line, Math.min(node.loc.start.line + 6, node.loc.end.line)),
          message: `Function "${funcName}" contains deeply nested blocks up to ${maxFunctionNesting} levels (recommended limit is 4 levels).`
        });
      }

      // 3. Evaluate Method Lengths
      const lineCount = node.loc.end.line - node.loc.start.line + 1;
      if (lineCount > 100) {
        metrics.longMethodsCount += 1;
        findings.push({
          title: "Long Method/Function",
          severity: "warning",
          category: "maintainability",
          confidence: "high",
          file: filepath,
          line: node.loc.start.line,
          column: node.loc.start.column + 1,
          ruleId: "long-method",
          recommendation: `Deconstruct the "${funcName}" function (${lineCount} lines) into smaller single-responsibility functions under 100 lines.`,
          codeSnippet: getSnippet(node.loc.start.line, Math.min(node.loc.start.line + 5, node.loc.end.line)),
          message: `Function "${funcName}" spans ${lineCount} lines (recommended maximum is 100 lines).`
        });
      }
    }
  });

  // Calculate final average complexity
  metrics.cyclomaticComplexity = metrics.functionCount > 0 
    ? Math.round(metrics.totalComplexity / metrics.functionCount) 
    : 1;

  return { findings, metrics };
};

export default { analyzeComplexity };
