import React from 'react';

const CATEGORY_CONFIG = {
  security:        { label: 'Security',        bg: 'bg-red-500/10 border-red-500/20 text-red-400' },
  performance:     { label: 'Performance',     bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  accessibility:   { label: 'Accessibility',   bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
  testing:         { label: 'Testing',         bg: 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue' },
  'code-quality':  { label: 'Code Quality',    bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' },
  'best-practices':{ label: 'Best Practices',  bg: 'bg-teal-500/10 border-teal-500/20 text-teal-400' },
  maintainability: { label: 'Maintainability', bg: 'bg-slate-500/10 border-slate-500/20 text-slate-400' },
};

export function CategoryBadge({ category }) {
  const cfg = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG['code-quality'];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
}
