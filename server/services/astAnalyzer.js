import traverse from "@babel/traverse";
import { parseCode } from "./astParser.js";
import { analyzeComplexity } from "./complexityAnalyzer.js";
import { analyzeSecurity } from "./securityAnalyzer.js";
import { analyzeReact } from "./reactAnalyzer.js";

/**
 * Runs complete AST static analysis checks on a given source code file.
 * Returns aggregated findings and codebase quality metrics.
 */
export const analyzeFile = (code, filepath) => {
  const findings = [];
  const fileMetrics = {
    complexity: 1,
    nestingDepth: 0,
    longMethods: 0,
    largeClasses: 0,
    codeSmells: 0,
    technicalDebt: 0
  };

  try {
    // 1. Parse source code to AST representation
    const ast = parseCode(code, filepath);
    const codeLines = code.split("\n");

    const getSnippet = (startLine, endLine) => {
      return codeLines.slice(Math.max(0, startLine - 1), Math.min(codeLines.length, endLine)).join("\n");
    };

    // 2. Traverses for unused bindings, unreachable code, and missing try-catch wrappers
    traverse.default(ast, {
      
      // A. Unused Scope variables and imports
      Program(path) {
        // Look up all bindings in program and nested lexical blocks
        const checkUnused = (scope) => {
          for (const [name, binding] of Object.entries(scope.bindings)) {
            // Ignore React default imports and variables starting with underscore
            if (name === "React" || name.startsWith("_")) continue;

            if (!binding.referenced) {
              const node = binding.identifier;
              const isImport = ["ImportSpecifier", "ImportDefaultSpecifier", "ImportNamespaceSpecifier"].includes(binding.path.node.type);

              if (isImport) {
                findings.push({
                  title: "Unused Import Statement",
                  severity: "info",
                  category: "style",
                  confidence: "high",
                  file: filepath,
                  line: node.loc?.start.line || 1,
                  column: (node.loc?.start.column || 0) + 1,
                  ruleId: "no-unused-imports",
                  recommendation: `Remove the unused import "${name}" to clean up file references.`,
                  codeSnippet: getSnippet(node.loc?.start.line || 1, node.loc?.end.line || 1),
                  message: `Import "${name}" is declared but never referenced in this scope.`
                });
              } else if (binding.path.node.type === "VariableDeclarator" || binding.path.node.type === "FunctionDeclaration") {
                findings.push({
                  title: "Unused Local Variable",
                  severity: "warning",
                  category: "maintainability",
                  confidence: "high",
                  file: filepath,
                  line: node.loc?.start.line || 1,
                  column: (node.loc?.start.column || 0) + 1,
                  ruleId: "no-unused-vars",
                  recommendation: `Remove the unused declaration "${name}" or declare it inside code logic.`,
                  codeSnippet: getSnippet(node.loc?.start.line || 1, node.loc?.end.line || 1),
                  message: `Local variable "${name}" is defined but never used.`
                });
              }
            }
          }
        };

        path.traverse({
          Scope(scopePath) {
            checkUnused(scopePath.scope);
          }
        });
        checkUnused(path.scope);
      },

      // B. Unreachable Code statements
      BlockStatement(path) {
        const { node } = path;
        let terminatorIndex = -1;

        // Detect statement index that stops flow execution
        for (let i = 0; i < node.body.length; i++) {
          const stmt = node.body[i];
          if (["ReturnStatement", "ThrowStatement", "BreakStatement", "ContinueStatement"].includes(stmt.type)) {
            terminatorIndex = i;
            break;
          }
        }

        // If there are statement blocks trailing the return/throw index
        if (terminatorIndex !== -1 && terminatorIndex < node.body.length - 1) {
          const unreachableNode = node.body[terminatorIndex + 1];
          findings.push({
            title: "Unreachable Code Detected",
            severity: "warning",
            category: "maintainability",
            confidence: "high",
            file: filepath,
            line: unreachableNode.loc?.start.line || 1,
            column: (unreachableNode.loc?.start.column || 0) + 1,
            ruleId: "unreachable-code",
            recommendation: "Remove or adjust code blocks trailing return statements as they are dead code and will never be evaluated.",
            codeSnippet: getSnippet(unreachableNode.loc?.start.line || 1, node.body[node.body.length - 1].loc?.end.line || 1),
            message: "Statements found trailing control flow return or throw declarations."
          });
        }
      },

      // C. Missing try/catch wrappers in async await expressions
      AwaitExpression(path) {
        const { node } = path;
        let inTry = false;
        let curr = path.parentPath;

        // Trace parents up to function scope to check if caught
        while (curr) {
          if (curr.node.type === "TryStatement") {
            inTry = true;
            break;
          }
          if (["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(curr.node.type)) {
            break;
          }
          curr = curr.parentPath;
        }

        if (!inTry) {
          findings.push({
            title: "Async Call Missing try/catch Error Handling",
            severity: "warning",
            category: "error-handling",
            confidence: "medium",
            file: filepath,
            line: node.loc?.start.line || 1,
            column: (node.loc?.start.column || 0) + 1,
            ruleId: "async-missing-catch",
            recommendation: "Wrap the await block inside a try/catch construct, or return a Promise call catching errors dynamically.",
            codeSnippet: getSnippet(node.loc?.start.line || 1, node.loc?.end.line || 1),
            message: "Await expression lacks try/catch protection, which may result in unhandled promise rejections."
          });
        }
      }
    });

    // 3. Invoke specialized analyzers
    const complexityResult = analyzeComplexity(ast, filepath, code);
    findings.push(...complexityResult.findings);
    
    // Assign complexity values
    fileMetrics.complexity = complexityResult.metrics.cyclomaticComplexity;
    fileMetrics.nestingDepth = complexityResult.metrics.maxNestingDepth;
    fileMetrics.longMethods = complexityResult.metrics.longMethodsCount;
    fileMetrics.largeClasses = complexityResult.metrics.largeClassesCount;

    const securityFindings = analyzeSecurity(ast, filepath, code);
    findings.push(...securityFindings);

    const isReact = filepath.toLowerCase().endsWith(".jsx") || 
                    filepath.toLowerCase().endsWith(".tsx") || 
                    code.includes("react") || 
                    code.includes("import ") && code.includes(" from 'react'");
                    
    if (isReact) {
      const reactFindings = analyzeReact(ast, filepath, code);
      findings.push(...reactFindings);
    }

    // 4. Calculate Code Smells & Technical Debt metrics
    // Rules weight logic: Critical = 30min, Warning = 15min, Info/Style = 5min
    let debtMinutes = 0;
    let smellsCount = 0;

    findings.forEach((f) => {
      smellsCount += 1;
      if (f.severity === "critical") {
        debtMinutes += 30;
      } else if (f.severity === "warning") {
        debtMinutes += 15;
      } else {
        debtMinutes += 5;
      }
    });

    fileMetrics.codeSmells = smellsCount;
    fileMetrics.technicalDebt = debtMinutes;

  } catch (error) {
    console.warn(`AST Parse failure for file [${filepath}]:`, error.message);
    // Graceful fallback for non-parsed assets or syntax flaws
    findings.push({
      title: "Syntax Parse Warning",
      severity: "info",
      category: "style",
      confidence: "high",
      file: filepath,
      line: 1,
      column: 1,
      ruleId: "syntax-error",
      recommendation: "Verify code syntax compiles correctly.",
      codeSnippet: code.split("\n").slice(0, 3).join("\n"),
      message: `Syntax parser encountered issues: ${error.message}`
    });
  }

  return { findings, metrics: fileMetrics };
};

export default { analyzeFile };
