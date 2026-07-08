import traverse from "@babel/traverse";

/**
 * Scans React codebase AST to identify components anti-patterns.
 * Identifies missing JSX keys in maps, missing dependency arrays, potential infinite hook loops, and anonymous exports.
 */
export const analyzeReact = (ast, filepath, code) => {
  const findings = [];
  const codeLines = code.split("\n");

  const getSnippet = (startLine, endLine) => {
    return codeLines.slice(Math.max(0, startLine - 1), Math.min(codeLines.length, endLine)).join("\n");
  };

  // Helper to check if a JSX element has a "key" attribute
  const hasKeyAttribute = (jsxElement) => {
    if (jsxElement.type !== "JSXElement") return true; // not an element or already nested
    
    // Self-closing elements or regular opening elements
    const openingEl = jsxElement.openingElement;
    if (!openingEl) return true;

    return openingEl.attributes.some(attr => 
      attr.type === "JSXAttribute" && attr.name?.name === "key"
    );
  };

  traverse.default(ast, {
    // 1. Missing keys in list maps
    CallExpression(path) {
      const { node } = path;
      const isMapCall = node.callee.type === "MemberExpression" && node.callee.property?.name === "map";
      if (!isMapCall || node.arguments.length === 0) return;

      const callback = node.arguments[0];
      const isFunction = ["ArrowFunctionExpression", "FunctionExpression"].includes(callback.type);
      if (!isFunction) return;

      // Locate returned elements within map
      const checkReturnedNode = (retNode) => {
        if (retNode && retNode.type === "JSXElement" && !hasKeyAttribute(retNode)) {
          findings.push({
            title: "React Missing List Key",
            severity: "warning",
            category: "react",
            confidence: "high",
            file: filepath,
            line: retNode.loc?.start.line || node.loc?.start.line || 1,
            column: (retNode.loc?.start.column || 0) + 1,
            ruleId: "react-missing-key",
            recommendation: "Provide a unique 'key' attribute to the top-level element returned inside the map() statement (e.g. <div key={item.id}>).",
            codeSnippet: getSnippet(retNode.loc?.start.line || 1, retNode.loc?.end.line || 1),
            message: "JSX element returned from list map() operation is missing a 'key' prop."
          });
        }
      };

      if (callback.body.type === "JSXElement") {
        // Implicit arrow return: () => <div />
        checkReturnedNode(callback.body);
      } else if (callback.body.type === "BlockStatement") {
        // Explicit return in block: () => { return <div /> }
        path.traverse({
          ReturnStatement(retPath) {
            // Ensure we are in the immediate child context function
            let parentFunc = retPath.parentPath;
            while (parentFunc && parentFunc !== path) {
              if (["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(parentFunc.node.type)) {
                return; // skipped: belongs to nested function
              }
              parentFunc = parentFunc.parentPath;
            }
            checkReturnedNode(retPath.node.argument);
          }
        });
      }
    },

    // 2. Missing dependency arrays in hooks
    CallExpression(path) {
      const { node } = path;
      const hookName = node.callee.name || "";
      const isHook = ["useEffect", "useMemo", "useCallback"].includes(hookName);

      if (isHook) {
        if (node.arguments.length === 1) {
          findings.push({
            title: "React Missing Hook Dependency Array",
            severity: "warning",
            category: "react",
            confidence: "high",
            file: filepath,
            line: node.loc?.start.line || 1,
            column: (node.loc?.start.column || 0) + 1,
            ruleId: "react-missing-dep-array",
            recommendation: `Provide a dependency array (even if empty, i.e., []) to limit execution. Calls to "${hookName}" without dependencies trigger updates on every single render.`,
            codeSnippet: getSnippet(node.loc?.start.line || 1, node.loc?.end.line || 1),
            message: `Hook "${hookName}" is missing a dependency array parameter.`
          });
        }

        // 3. Infinite useEffect Loops
        if (hookName === "useEffect" && node.arguments.length >= 2) {
          const callback = node.arguments[0];
          const depsArray = node.arguments[1];

          if (depsArray.type === "ArrayExpression") {
            const depsList = depsArray.elements
              .filter(el => el && el.type === "Identifier")
              .map(el => el.name);

            if (depsList.length > 0) {
              path.traverse({
                CallExpression(childPath) {
                  const setterName = childPath.node.callee.name || "";
                  // Standard React useState state setter: starts with 'set'
                  if (setterName.startsWith("set") && setterName.length > 3) {
                    const stateVar = setterName.slice(3).toLowerCase();
                    // If dependency matches the updated state variable
                    const matchedDep = depsList.find(d => d.toLowerCase() === stateVar);
                    if (matchedDep) {
                      findings.push({
                        title: "Potential React Infinite Loop",
                        severity: "critical",
                        category: "react",
                        confidence: "medium",
                        file: filepath,
                        line: childPath.node.loc?.start.line || node.loc?.start.line || 1,
                        column: (childPath.node.loc?.start.column || 0) + 1,
                        ruleId: "react-infinite-loop",
                        recommendation: `Do not update a state variable (${matchedDep}) directly inside useEffect if that same state variable is in the dependency list. Use helper triggers or conditional checks.`,
                        codeSnippet: getSnippet(childPath.node.loc?.start.line || 1, childPath.node.loc?.end.line || 1),
                        message: `State setter "${setterName}" is triggered inside useEffect depending on "${matchedDep}", introducing an infinite re-render loop.`
                      });
                    }
                  }
                }
              });
            }
          }
        }
      }
    },

    // 4. Anonymous default components
    ExportDefaultDeclaration(path) {
      const { node } = path;
      const dec = node.declaration;
      const isAnonymous = dec.type === "ArrowFunctionExpression" || 
                          (dec.type === "FunctionDeclaration" && !dec.id);

      // Check if it returns JSX elements (making it a component)
      let returnsJsx = false;
      if (isAnonymous) {
        if (dec.type === "ArrowFunctionExpression" && dec.body.type === "JSXElement") {
          returnsJsx = true;
        } else {
          path.traverse({
            ReturnStatement(retPath) {
              if (retPath.node.argument?.type === "JSXElement") {
                returnsJsx = true;
              }
            }
          });
        }
      }

      if (returnsJsx) {
        findings.push({
          title: "React Anonymous Component Export",
          severity: "info",
          category: "react",
          confidence: "high",
          file: filepath,
          line: node.loc?.start.line || 1,
          column: (node.loc?.start.column || 0) + 1,
          ruleId: "react-anonymous-component",
          recommendation: "Name the component function (e.g. export default function DashboardComponent() { ... }) to improve stack-trace debugging and React DevTools diagnostics.",
          codeSnippet: getSnippet(node.loc?.start.line || 1, Math.min(node.loc?.start.line + 4, node.loc?.end.line || 1)),
          message: "Component is exported anonymously as default declaration."
        });
      }
    }
  });

  // 5. Large components warning
  if (code.includes("<") && codeLines.length > 300) {
    findings.push({
      title: "Huge React Component File",
      severity: "warning",
      category: "react",
      confidence: "high",
      file: filepath,
      line: 1,
      column: 1,
      ruleId: "react-huge-file",
      recommendation: "Split this component file into smaller, granular subcomponents or custom React hooks to improve readability.",
      codeSnippet: codeLines.slice(0, 5).join("\n"),
      message: `Component file is ${codeLines.length} lines long (maximum recommended size is 300 lines).`
    });
  }

  return findings;
};

export default { analyzeReact };
