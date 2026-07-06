import React from 'react';

const STATUS_CONFIG = {
  open:          { label: 'Open',          bg: 'bg-white/[0.04] border-white/[0.08] text-white', dot: 'bg-white/60' },
  investigating: { label: 'Investigating', bg: 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue', dot: 'bg-brand-blue animate-pulse' },
  'in-progress': { label: 'In Progress',   bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400', dot: 'bg-amber-400' },
  resolved:      { label: 'Resolved',      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', dot: 'bg-emerald-400' },
  ignored:       { label: 'Ignored',       bg: 'bg-slate-500/10 border-slate-500/20 text-slate-500', dot: 'bg-slate-500' },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
