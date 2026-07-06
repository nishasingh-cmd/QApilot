import React from 'react';
import { AlertTriangle, Zap, TrendingUp, Building2 } from 'lucide-react';

const SECTIONS = [
  { key: 'whyItExists',    label: 'Why It Exists',     icon: AlertTriangle, color: 'text-amber-400',  iconBg: 'bg-amber-500/10 border-amber-500/20' },
  { key: 'impact',         label: 'Possible Impact',   icon: Zap,           color: 'text-red-400',    iconBg: 'bg-red-500/10 border-red-500/20' },
  { key: 'riskAssessment', label: 'Risk Assessment',   icon: TrendingUp,    color: 'text-orange-400', iconBg: 'bg-orange-500/10 border-orange-500/20' },
  { key: 'businessImpact', label: 'Business Impact',   icon: Building2,     color: 'text-purple-400', iconBg: 'bg-purple-500/10 border-purple-500/20' },
];

export function AIAnalysisCard({ finding }) {
  if (!finding) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-4 rounded-full bg-gradient-to-b from-brand-blue to-brand-cyan" />
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-text-secondary">AI Analysis</h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {SECTIONS.map(({ key, label, icon: Icon, color, iconBg }) => (
          <div key={key} className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wide ${color}`}>{label}</span>
            </div>
            <p className="text-[12px] text-brand-text-secondary leading-relaxed">{finding[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
