import React from 'react';

export function RepositoryStatusBadge({ status }) {
  let styles = {
    bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    dot: 'bg-emerald-400',
    label: 'Healthy',
  };

  switch (status?.toLowerCase()) {
    case 'healthy':
    case 'success':
      styles = {
        bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        dot: 'bg-emerald-400',
        label: 'Healthy',
      };
      break;
    case 'scanning':
      styles = {
        bg: 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue',
        dot: 'bg-brand-blue animate-pulse',
        label: 'Scanning',
      };
      break;
    case 'attention':
    case 'attention required':
    case 'needs attention':
      styles = {
        bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        dot: 'bg-amber-400',
        label: 'Needs Attention',
      };
      break;
    case 'offline':
    case 'failed':
      styles = {
        bg: 'bg-red-500/10 border-red-500/20 text-red-400',
        dot: 'bg-red-400',
        label: 'Offline',
      };
      break;
    case 'queued':
      styles = {
        bg: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
        dot: 'bg-slate-400',
        label: 'Queued',
      };
      break;
    default:
      styles = {
        bg: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
        dot: 'bg-slate-400',
        label: status || 'Unknown',
      };
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {styles.label}
    </span>
  );
}
