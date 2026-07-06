import React from 'react';
import { Sparkles, TrendingUp, ShieldAlert, Award, Activity } from 'lucide-react';

export function RepositoryHealthSummary({ summary }) {
  if (!summary) return null;

  const categories = [
    {
      label: 'Most Improved Repository',
      value: summary.mostImproved,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Highest Risk Repository',
      value: summary.highestRisk,
      icon: ShieldAlert,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
    },
    {
      label: 'Most Stable Repository',
      value: summary.mostStable,
      icon: Award,
      color: 'text-brand-blue',
      bg: 'bg-brand-blue/10 border-brand-blue/20',
    },
    {
      label: 'Most Active Repository',
      value: summary.mostActive,
      icon: Activity,
      color: 'text-brand-cyan',
      bg: 'bg-brand-cyan/10 border-brand-cyan/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {categories.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className={`p-4 rounded-xl border flex gap-3.5 glass-card ${c.bg}`}
          >
            <div className={`p-2 rounded-lg border border-white/[0.04] bg-white/[0.03] h-9 w-9 flex items-center justify-center shrink-0 ${c.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-text-secondary/70">
                {c.label}
              </span>
              <p className="text-xs font-bold text-white mt-1 leading-snug truncate">
                {c.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default RepositoryHealthSummary;
