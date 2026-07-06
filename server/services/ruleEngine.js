/**
 * Static Analysis Rule Engine for QAPilot codebase audits.
 * Enforces security, style, performance, and coverage validations on repository files.
 */

export const runRules = (repo, files = []) => {
  const findings = [];

  // General check: Missing README.md
  const hasReadme = files.some(f => f.name.toLowerCase() === 'readme.md');
  if (!hasReadme) {
    findings.push({
      type: 'general',
      severity: 'warning',
      file: 'README.md',
      message: 'Missing repository README file',
      recommendation: 'Create a README.md at the root of the project to document repository setup and setup commands.'
    });
  }

  // General check: Missing tests directory
  const hasTests = files.some(f => f.path.includes('test') || f.path.includes('spec') || f.path.includes('__tests__'));
  if (!hasTests) {
    findings.push({
      type: 'coverage',
      severity: 'warning',
      file: 'package.json',
      message: 'No tests folder found. Core code coverage is 0%',
      recommendation: 'Configure a test framework (jest, mocha, vitest) and write unit tests to achieve at least 80% coverage.'
    });
  }

  // File specific checks based on language / extensions
  for (const file of files) {
    const isJS = file.name.endsWith('.js') || file.name.endsWith('.jsx') || file.name.endsWith('.ts') || file.name.endsWith('.tsx');

    if (isJS) {
      // Rule: Console.log usage
      if (file.content && file.content.includes('console.log')) {
        findings.push({
          type: 'style',
          severity: 'info',
          file: file.path,
          message: 'Console.log statement detected in production code path',
          recommendation: 'Remove debugging console statements or use a dedicated logging framework like winston or pinino.'
        });
      }

      // Rule: Eval usage
      if (file.content && file.content.includes('eval(')) {
        findings.push({
          type: 'security',
          severity: 'critical',
          file: file.path,
          message: 'Dangerous eval() statement found',
          recommendation: 'Avoid using eval() because it exposes scripts to remote command injection hazards. Use JSON.parse or dynamic object indexing instead.'
        });
      }

      // Rule: Oversized file (>300 lines)
      if (file.lineCount && file.lineCount > 300) {
        findings.push({
          type: 'maintainability',
          severity: 'warning',
          file: file.path,
          message: `Oversized codebase file detected (${file.lineCount} lines)`,
          recommendation: 'Refactor this class or module by dividing it into smaller helper files and reusable micro-components.'
        });
      }
    }
  }

  return findings;
};

export default { runRules };
