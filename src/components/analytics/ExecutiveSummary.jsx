import React from 'react';
import { Trophy, AlertOctagon, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

export function ExecutiveSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="glass-card rounded-2xl border border-white/[0.08] p-6 space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
        <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-brand-blue to-brand-cyan" />
        <h3 className="text-sm font-bold text-white tracking-wide">Executive Summary & Recommendations</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left column: Repositories & Risk info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Top Performing Repository</p>
              <h4 className="text-xs font-bold text-white mt-1">{summary.topPerformingRepo}</h4>
              <p className="text-[10px] text-brand-text-secondary mt-0.5">Health rating is standing at {summary.topPerformingRepoScore}% score.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/[0.03] border border-red-500/10">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide">Repository Requiring Attention</p>
              <h4 className="text-xs font-bold text-white mt-1">{summary.repoRequiringAttention}</h4>
              <p className="text-[10px] text-brand-text-secondary mt-0.5">Health score dropped to {summary.repoRequiringAttentionScore}% this week.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-orange-500/[0.03] border border-orange-500/10">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wide">Highest Risk Area</p>
              <h4 className="text-xs font-bold text-white mt-1 truncate max-w-[260px]">{summary.highestRiskArea}</h4>
              <p className="text-[10px] text-brand-text-secondary mt-0.5">Vulnerabilities triggered during recent build scans.</p>
            </div>
          </div>
        </div>

        {/* Right column: Weekly action & AI highlight */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/[0.015] border border-white/[0.06] h-full flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-brand-blue">
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Weekly Recommendation</span>
              </div>
              <p className="text-[12px] text-brand-text-secondary leading-relaxed">
                {summary.weeklyRecommendation}
              </p>
            </div>

            <div className="pt-3.5 border-t border-white/[0.04] flex gap-3">
              <Sparkles className="w-4.5 h-4.5 text-brand-cyan shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider">AI Insight Highlight</span>
                <p className="text-[11px] text-brand-text-secondary/80 mt-1 leading-normal">
                  {summary.aiHighlights}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ExecutiveSummary;
