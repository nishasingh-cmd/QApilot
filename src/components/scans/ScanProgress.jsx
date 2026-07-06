import React from 'react';
import { Check, Play } from 'lucide-react';

export function ScanProgress({ stages }) {
  return (
    <div className="flex flex-col gap-3 py-4 border-t border-white/[0.04] mt-4">
      <h5 className="text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary mb-1">Execution Steps</h5>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {stages.map((stage) => {
          let dotColor = 'border-white/[0.08] bg-transparent';
          let textColor = 'text-brand-text-secondary';
          let badge = null;

          if (stage.status === 'completed') {
            dotColor = 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
            textColor = 'text-white';
            badge = <Check className="w-2.5 h-2.5" />;
          } else if (stage.status === 'active') {
            dotColor = 'bg-brand-blue/20 border-brand-blue/30 text-brand-blue animate-pulse';
            textColor = 'text-brand-blue font-bold';
            badge = <Play className="w-2 h-2 fill-current" />;
          }

          return (
            <div
              key={stage.name}
              className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.005] border border-white/[0.03]"
            >
              <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 text-[10px] ${dotColor}`}>
                {badge}
              </div>
              <span className={`text-[11px] truncate leading-none ${textColor}`}>{stage.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default ScanProgress;
