import React, { useState } from 'react';
import { AlertCircle, Cpu, Hammer, ShieldAlert, Zap, ChevronDown, ChevronUp } from 'lucide-react';

const RECOMMENDATION_SECTIONS = [
  { key: 'priorityActions', label: 'Priority Actions', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { key: 'architecture',    label: 'Architecture Suggestions', icon: Cpu, color: 'text-brand-blue', bg: 'bg-brand-blue/10 border-brand-blue/20' },
  { key: 'testing',         label: 'Testing Improvements', icon: Hammer, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { key: 'security',        label: 'Security Recommendations', icon: ShieldAlert, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { key: 'performance',     label: 'Performance Suggestions', icon: Zap, color: 'text-brand-cyan', bg: 'bg-brand-cyan/10 border-brand-cyan/20' },
];

export function AIRecommendations({ recommendations }) {
  if (!recommendations) return null;
  const [expanded, setExpanded] = useState({
    priorityActions: true,
    architecture: false,
    testing: false,
    security: false,
    performance: false,
  });

  const toggle = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-brand-blue to-brand-cyan" />
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-text-secondary">AI Quality Recommendations</h3>
      </div>

      <div className="space-y-2">
        {RECOMMENDATION_SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const items = recommendations[sec.key] || [];
          const isExpanded = expanded[sec.key];

          return (
            <div key={sec.key} className="glass-card rounded-xl border border-white/[0.08] overflow-hidden">
              <button
                onClick={() => toggle(sec.key)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.01] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${sec.color} ${sec.bg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">{sec.label}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-brand-text-secondary" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-brand-text-secondary" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1.5 border-t border-white/[0.04] bg-white/[0.005]">
                  <ul className="space-y-2.5">
                    {items.length === 0 ? (
                      <li className="text-xs text-brand-text-secondary/60">No recommendations in this section.</li>
                    ) : (
                      items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-brand-text-secondary leading-relaxed">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${sec.color}`} style={{ backgroundColor: 'currentColor' }} />
                          <span>{item}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default AIRecommendations;
