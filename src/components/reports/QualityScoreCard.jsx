import React from 'react';

const Dial = ({ label, value, color }) => {
  const r = 24, cx = 32, cy = 32;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={cx} cy={cy} r={r}
            fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="4.5"
          />
          <circle
            cx={cx} cy={cy} r={r}
            fill="none" stroke={color} strokeWidth="4.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black font-mono text-white">
          {value}%
        </div>
      </div>
      <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-text-secondary/70 text-center leading-tight">
        {label}
      </span>
    </div>
  );
};

export function QualityScoreCard({ metrics }) {
  if (!metrics) return null;

  const dials = [
    { label: 'Coverage', value: metrics.coverage, color: '#4FD1FF' },
    { label: 'Security', value: metrics.security, color: '#f87171' },
    { label: 'Performance', value: metrics.performance, color: '#fb923c' },
    { label: 'Maintainability', value: metrics.maintainability, color: '#a855f7' },
    { label: 'Accessibility', value: metrics.accessibility, color: '#10b981' },
    { label: 'AI Confidence', value: metrics.confidence, color: '#4F8CFF' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {dials.map((d) => (
        <Dial key={d.label} label={d.label} value={d.value} color={d.color} />
      ))}
    </div>
  );
}
export default QualityScoreCard;
