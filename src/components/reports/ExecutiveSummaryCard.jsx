import React from 'react';
import { Sparkles } from 'lucide-react';

export function ExecutiveSummaryCard({ text }) {
  if (!text) return null;
  return (
    <div className="glass-card rounded-2xl border border-white/[0.08] p-5 space-y-4">
      <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.06]">
        <Sparkles className="w-4 h-4 text-brand-blue" />
        <h3 className="text-xs font-black text-white uppercase tracking-wider">Executive Summary</h3>
      </div>
      <p className="text-xs text-brand-text-secondary leading-relaxed font-sans">
        {text}
      </p>
    </div>
  );
}
export default ExecutiveSummaryCard;
