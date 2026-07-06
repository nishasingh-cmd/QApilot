import React from 'react';

export function CodePreview({ code, highlightLines = [], lineNumber: startLine = 1 }) {
  if (!code) return null;
  const lines = code.split('\n');

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#09090f]">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
        <span className="w-3 h-3 rounded-full bg-red-500/60" />
        <span className="w-3 h-3 rounded-full bg-amber-500/60" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
        <span className="ml-2 text-[11px] text-brand-text-secondary font-mono">code-preview</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[12px] font-mono">
          <tbody>
            {lines.map((line, i) => {
              const lineNum = startLine + i;
              const isHighlighted = highlightLines.includes(i + 1);
              return (
                <tr
                  key={i}
                  className={`${isHighlighted ? 'bg-red-500/[0.06] border-l-2 border-red-400' : ''}`}
                >
                  <td className="select-none text-right pr-4 pl-4 py-0.5 text-brand-text-secondary/50 w-[3rem] border-r border-white/[0.04] align-top">
                    {lineNum}
                  </td>
                  <td className="pl-4 pr-4 py-0.5 whitespace-pre text-[#c9d1d9] align-top">
                    <span dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Minimal tokenizer for display purposes only */
function syntaxHighlight(line) {
  return line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Keywords
    .replace(/\b(const|let|var|function|async|await|return|import|from|export|default|class|extends|new|if|else|for|of|in|true|false|null|undefined|throw|try|catch)\b/g,
      '<span style="color:#FF79C6">$1</span>')
    // Strings
    .replace(/(`[^`]*`|'[^']*'|"[^"]*")/g, '<span style="color:#A3E635">$1</span>')
    // Comments
    .replace(/(\/\/.*)/g, '<span style="color:#6B7280">$1</span>')
    // Numbers
    .replace(/\b(\d+)\b/g, '<span style="color:#BD93F9">$1</span>');
}
