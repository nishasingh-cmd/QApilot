import React from 'react';

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', bg: 'bg-red-500/10 border-red-500/25 text-red-400', dot: 'bg-red-400' },
  high:     { label: 'High',     bg: 'bg-orange-500/10 border-orange-500/25 text-orange-400', dot: 'bg-orange-400' },
  medium:   { label: 'Medium',   bg: 'bg-amber-500/10 border-amber-500/25 text-amber-400', dot: 'bg-amber-400' },
  low:      { label: 'Low',      bg: 'bg-sky-500/10 border-sky-500/25 text-sky-400', dot: 'bg-sky-400' },
  info:     { label: 'Info',     bg: 'bg-slate-500/10 border-slate-500/25 text-slate-400', dot: 'bg-slate-400' },
};

export function SeverityBadge({ severity }) {
  const cfg = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.info;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
