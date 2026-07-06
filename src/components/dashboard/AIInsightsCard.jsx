import React from 'react';
import { AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';

export function AIInsightsCard() {
  return (
    <div className="relative flex flex-col gap-4.5 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-md shadow-xl overflow-hidden select-none">
      {/* Decorative neon backlights */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/10 rounded-full blur-xl pointer-events-none" 
      />

      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        <Sparkles size={16} className="text-brand-cyan" />
        <h3 className="text-[13.5px] font-bold text-white tracking-wide">AI Recommendation</h3>
      </div>

      {/* Main Insight Details */}
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">Top detected issue</span>
          <div className="flex items-start gap-2 text-[12.5px] font-semibold text-white leading-relaxed">
            <AlertCircle size={15} className="text-brand-danger shrink-0 mt-0.5" />
            <span>Missing CSRF token protection on payment API submission endpoints.</span>
          </div>
        </div>

        {/* Code block suggestions */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">Recommended Fix</span>
          <div className="relative p-3.5 rounded-xl border border-white/[0.05] bg-black/40 font-mono text-[11px] leading-relaxed text-brand-text-secondary overflow-x-auto">
            <span className="text-brand-blue">// Fix: Mount CSRF protection middleware</span>
            <br />
            <span className="text-white">app.use(csrfProtection);</span>
            <br />
            <span className="text-white">app.post(</span>
            <span className="text-brand-cyan">"/api/checkout"</span>
            <span className="text-white">, csrfCheck, handler);</span>
          </div>
        </div>

        {/* Badges metadata block */}
        <div className="grid grid-cols-2 gap-3 mt-1.5">
          <div className="flex flex-col gap-1 p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-text-muted">Risk level</span>
            <span className="text-[11px] font-extrabold uppercase text-brand-danger tracking-wider mt-0.5">
              High Severity
            </span>
          </div>
          <div className="flex flex-col gap-1 p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-text-muted">Confidence score</span>
            <span className="text-[11px] font-extrabold text-brand-success tracking-wide mt-0.5">
              96.2% Sure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
