import traverse from "@babel/traverse";

/**
 * Scans the AST for security-related vulnerabilities and code flaws.
 * Identifies eval() usage, hardcoded API keys/passwords, insecure regex (ReDoS), SQL injection and XSS patterns.
 */
export const analyzeSecurity = (ast, filepath, code) => {
  const findings = [];
  const codeLines = code.split("\n");

  const getSnippet = (startLine, endLine) => {
    return codeLines.slice(Math.max(0, startLine - 1), Math.min(codeLines.length, endLine)).join("\n");
  };

  // Helper to test key entropy or secrets formats
  const isLikelyApiKey = (str) => {
    if (typeof str !== "string") return false;
    // OpenAI keys, Google API keys, Generic Bearer/Hex tokens
    const keyPatterns = [
      /sk-[a-zA-Z0-9]{48}/,
      /AIza[a-zA-Z0-9_\\-]{35}/,
      /gho_[a-zA-Z0-9]{36}/
    ];
    if (keyPatterns.some(pattern => pattern.test(str))) return true;
    
    // Entropy check: if length is between 24 and 64 and contains random-looking characters
    if (str.length >= 24 && str.length <= 64) {
      const hasAlphaNum = /^[a-zA-Z0-9=_\-\/]+$/.test(str);
      const uniqueChars = new Set(str).size;
      // High variety of characters indicates random token
      if (hasAlphaNum && uniqueChars > 12) return true;
    }
    return false;
  };

  // Helper to check for insecure regex quantifiers (ReDoS risk)
  const isDangerousRegex = (pattern) => {
    if (typeof pattern !== "string") return false;
    // Check nested quantifiers like (a+)+ or ([a-z]+)*
    const nestedQuantifierPattern = /(\([a-zA-Z0-9_+*-]*\+\)[*+?])|(\([a-zA-Z0-9_+*-]*\*\)[*+?])|([a-zA-Z0-9_+*-]+\+[*+?])/;
    return nestedQuantifierPattern.test(pattern);
  };

  traverse.default(ast, {
    // 1. Detect eval() and new Function() calls
    CallExpression(path) {
      const { node } = path;
      if (node.callee.type === "Identifier" && node.callee.name === "eval") {
        findings.push({
          title: "Dangerous Call: eval()",
          severity: "critical",
          category: "security",
          confidence: "high",
          file: filepath,
          line: node.loc?.start.line || 1,
          column: (node.loc?.start.column || 0) + 1,
          ruleId: "no-eval",
          recommendation: "Avoid using eval() as it exposes applications to arbitrary code execution vulnerabilities. Refactor to use JSON.parse() or static handlers.",
          codeSnippet: getSnippet(node.loc?.start.line || 1, node.loc?.end.line || 1),
          message: "Use of eval() detected, which allows execution of arbitrary strings as code."
        });
      }
    },

    NewExpression(path) {
      const { node } = path;
      if (node.callee.type === "Identifier" && node.callee.name === "Function") {
        findings.push({
          title: "Dangerous Constructor: new Function()",
          severity: "critical",
          category: "security",
          confidence: "high",
          file: filepath,
          line: node.loc?.start.line || 1,
          column: (node.loc?.start.column || 0) + 1,
          ruleId: "no-new-function",
          recommendation: "Avoid creating functions dynamically from string buffers. Refactor into standard lexical declarations.",
          codeSnippet: getSnippet(node.loc?.start.line || 1, node.loc?.end.line || 1),
          message: "Constructor 'new Function()' allows dynamic code evaluation similar to eval()."
        });
      }
    },

    // 2. Scan variable declarations for hardcoded secrets
    VariableDeclarator(path) {
      const { node } = path;
      if (!node.id || !node.init || node.init.type !== "StringLiteral") return;

      const varName = node.id.name?.toLowerCase() || "";
      const valStr = node.init.value;

      const isSecretVar = varName.includes("password") || 
                          varName.includes("passwd") || 
                          varName.includes("secret") || 
                          varName.includes("apikey") || 
                          varName.includes("api_key") ||
                          varName.includes("token");

      if (isSecretVar && valStr) {
        // Skip dummy values or empty values
        const isDummy = ["placeholder", "dummy", "test", "mysecret", "123456", "password", "123"].includes(valStr.toLowerCase());
        
        if (isLikelyApiKey(valStr)) {
          findings.push({
            title: "Hardcoded API Key Detected",
            severity: "critical",
            category: "security",
            confidence: "high",
            file: filepath,
            line: node.loc?.start.line || 1,
            column: (node.loc?.start.column || 0) + 1,
            ruleId: "no-hardcoded-api-key",
            recommendation: "Remove API credentials from repository files. Store them in environment variables (.env) or use secrets management vaults.",
            codeSnippet: getSnippet(node.loc?.start.line || 1, node.loc?.end.line || 1),
            message: `Variable "${node.id.name}" is assigned a string matching standard API key formats.`
          });
        } else if (!isDummy && valStr.length > 5) {
          findings.push({
            title: "Hardcoded Secret/Password",
            severity: "critical",
            category: "security",
            confidence: "medium",
            file: filepath,
            line: node.loc?.start.line || 1,
            column: (node.loc?.start.column || 0) + 1,
            ruleId: "no-hardcoded-secret",
            recommendation: "Remove credential secrets from source code. Utilize dynamic settings or process.env variables.",
            codeSnippet: getSnippet(node.loc?.start.line || 1, node.loc?.end.line || 1),
            message: `Variable "${node.id.name}" appears to store a hardcoded credentials secret.`
          });
        }
      }
    },

    // 3. Scan RegExp configurations for ReDoS vulnerabilities
    RegExpLiteral(path) {
      const { node } = path;
      if (isDangerousRegex(node.pattern)) {
        findings.push({
          title: "Insecure Regular Expression (ReDoS risk)",
          severity: "warning",
          category: "security",
          confidence: "medium",
          file: filepath,
          line: node.loc?.start.line || 1,
          column: (node.loc?.start.column || 0) + 1,
          ruleId: "unsafe-regex",
          recommendation: "Refactor the regular expression to avoid nested quantifiers (e.g. (a+)+ or identical overlaps) which run in exponential time.",
          codeSnippet: getSnippet(node.loc?.start.line || 1, node.loc?.end.line || 1),
          message: `Regular expression pattern /${node.pattern}/ is vulnerable to backtracking Denial of Service (ReDoS).`
        });
      }
    },

    // 4. SQL Injection Patterns: string concatenations inside DB calls
    CallExpression(path) {
      const { node } = path;
      const calleeName = node.callee.name || node.callee.property?.name || "";
      const isDbCall = ["query", "execute", "raw", "runQuery"].includes(calleeName);

      if (isDbCall && node.arguments.length > 0) {
        const arg = node.arguments[0];

        // Check if query is constructed using string concatenation or template literal variables
        const hasConcatenation = arg.type === "BinaryExpression" && arg.operator === "+";
        const hasTemplateVariable = arg.type === "TemplateLiteral" && arg.expressions.length > 0;

        if (hasConcatenation || hasTemplateVariable) {
          // Verify if it looks like SQL
          const queryText = code.substring(arg.start, arg.end).toLowerCase();
          const looksLikeSql = queryText.includes("select ") || queryText.includes("insert ") || queryText.includes("update ") || queryText.includes("delete ");

          if (looksLikeSql) {
            findings.push({
              title: "Potential SQL Injection",
              severity: "critical",
              category: "security",
              confidence: "high",
              file: filepath,
              line: node.loc?.start.line || 1,
              column: (node.loc?.start.column || 0) + 1,
              ruleId: "sql-injection",
              recommendation: "Replace dynamic query construction with parameterized queries or prepared statements (e.g., db.query('SELECT * FROM users WHERE name = ?', [name])).",
              codeSnippet: getSnippet(node.loc?.start.line || 1, node.loc?.end.line || 1),
              message: "Dynamic SQL query construction detected. Direct concatenations are vulnerable to SQL Injection."
            });
          }
        }
      }
    },

    // 5. DOM-based XSS Patterns: raw assignments to innerHTML
    AssignmentExpression(path) {
      const { node } = path;
      if (node.left.type === "MemberExpression" && node.left.property?.name === "innerHTML") {
        // Flag innerHTML assignments that aren't literal values
        if (node.right.type !== "StringLiteral") {
          findings.push({
            title: "DOM Cross-Site Scripting (XSS)",
            severity: "warning",
            category: "security",
            confidence: "medium",
            file: filepath,
            line: node.loc?.start.line || 1,
            column: (node.loc?.start.column || 0) + 1,
            ruleId: "dom-xss",
            recommendation: "Use element.textContent or element.setAttribute() instead of innerHTML to avoid parsing variables as executable HTML blocks.",
            codeSnippet: getSnippet(node.loc?.start.line || 1, node.loc?.end.line || 1),
            message: "Direct assignment to innerHTML detected. Make sure user inputs are sanitised beforehand."
          });
        }
      }
    }
  });

  return findings;
};

export default { analyzeSecurity };
