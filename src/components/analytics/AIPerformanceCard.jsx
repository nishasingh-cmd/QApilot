import React from 'react';
import { Shield, Sparkles, AlertCircle, Clock, CheckCircle } from 'lucide-react';

export function AIPerformanceCard({ performance }) {
  if (!performance) return null;

  const cards = [
    {
      title: 'AI Detection Accuracy',
      value: `${performance.accuracy}%`,
      desc: 'Confidence match rating verified by engineers.',
      icon: Shield,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'False Positive Rate',
      value: `${performance.falsePositiveRate}%`,
      desc: 'Findings classified as false alarms.',
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
    },
    {
      title: 'Suggested Fix Acceptance',
      value: `${performance.acceptanceRate}%`,
      desc: 'Fix recommendations accepted or auto-committed.',
      icon: CheckCircle,
      color: 'text-brand-blue',
      bg: 'bg-brand-blue/10 border-brand-blue/20',
    },
    {
      title: 'Average Scan Duration',
      value: performance.avgScanDuration,
      desc: 'Average execution timing per codebase check.',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className={`p-4 rounded-xl border flex gap-4 glass-card ${c.bg}`}
          >
            <div className={`p-2.5 rounded-lg border border-white/[0.05] h-10 w-10 flex items-center justify-center shrink-0 ${c.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-text-secondary/70">
                {c.title}
              </span>
              <p className="text-xl font-black text-white font-mono mt-1 leading-none">{c.value}</p>
              <p className="text-[10px] text-brand-text-secondary/60 mt-1.5 leading-snug">
                {c.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default AIPerformanceCard;
