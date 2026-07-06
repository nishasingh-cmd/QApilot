import React from 'react';
import { Lightbulb, ListChecks, Clock, ArrowUpCircle } from 'lucide-react';

export function SuggestedFixCard({ finding }) {
  if (!finding) return null;
  const { fix, fixSteps, effort, improvement } = finding;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-teal-400" />
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-text-secondary">Suggested Fix</h3>
      </div>

      {/* Main fix */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-400">Explanation</span>
        </div>
        <p className="text-[12px] text-brand-text-secondary leading-relaxed">{fix}</p>
      </div>

      {/* Steps */}
      {fixSteps?.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
              <ListChecks className="w-3.5 h-3.5 text-brand-blue" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wide text-brand-blue">Implementation Steps</span>
          </div>
          <ol className="space-y-2">
            {fixSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[12px] text-brand-text-secondary">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Meta row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">Estimated Effort</span>
          </div>
          <p className="text-[12px] text-white font-semibold">{effort}</p>
        </div>
        <div className="glass-card rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowUpCircle className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Expected Improvement</span>
          </div>
          <p className="text-[12px] text-white font-semibold">{improvement}</p>
        </div>
      </div>
    </div>
  );
}
