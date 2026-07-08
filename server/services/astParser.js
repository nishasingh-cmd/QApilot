import * as parser from "@babel/parser";

/**
 * Parses source code into a Babel AST, supporting JavaScript, TypeScript, JSX, and TSX.
 * Uses errorRecovery: true to gracefully handle syntax glitches.
 */
export const parseCode = (code, filepath = "") => {
  const plugins = [
    "jsx",
    "asyncGenerators",
    "classProperties",
    "classPrivateProperties",
    "classPrivateMethods",
    "decorators-legacy",
    "doExpressions",
    "dynamicImport",
    "exportDefaultFrom",
    "exportNamespaceFrom",
    "functionBind",
    "functionSent",
    "importMeta",
    "logicalAssignment",
    "nullishCoalescingOperator",
    "numericSeparator",
    "objectRestSpread",
    "optionalCatchBinding",
    "optionalChaining",
    "privateIn",
    "regexpModifiers",
    "throwExpressions",
    "topLevelAwait"
  ];

  const lowerPath = filepath.toLowerCase();
  if (lowerPath.endsWith(".ts") || lowerPath.endsWith(".tsx")) {
    plugins.push("typescript");
  } else {
    plugins.push("flow");
  }

  return parser.parse(code, {
    sourceType: "module",
    plugins: plugins,
    errorRecovery: true,
    tokens: true // required for some scope evaluations
  });
};

export default { parseCode };
