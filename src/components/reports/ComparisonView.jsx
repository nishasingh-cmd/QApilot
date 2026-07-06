import React from 'react';
import { motion } from 'framer-motion';
import { useReports } from '../../context/ReportsContext';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, GitBranch } from 'lucide-react';

export function ComparisonView() {
  const { comparisonData, clearSelections } = useReports();
  if (!comparisonData) return null;

  const { reportA: rA, reportB: rB, diff } = comparisonData;

  const diffBadge = (val, pct = true) => {
    if (val === 0) return <span className="text-brand-text-secondary/50 font-mono">--</span>;
    const isPos = val > 0;
    const formatted = `${isPos ? '+' : ''}${val}${pct ? '%' : ''}`;
    const colorClass = isPos ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20';
    const Icon = isPos ? ArrowUpRight : ArrowDownRight;

    return (
      <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded border text-[10px] font-mono font-bold leading-none ${colorClass}`}>
        <Icon className="w-3 h-3" />
        {formatted}
      </span>
    );
  };

  const getTotalFindings = (r) =>
    r.findings.critical + r.findings.high + r.findings.medium + r.findings.low;

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Back Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={clearSelections}
            className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/[0.06] text-brand-text-secondary hover:text-white transition-all"
            aria-label="Back to reports list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Report Comparison View</h3>
            <p className="text-[10px] text-brand-text-secondary mt-0.5">Comparing v{rA.version} against v{rB.version}</p>
          </div>
        </div>
      </div>

      {/* Overview Metadata Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] space-y-2">
          <span className="text-[10px] font-bold text-brand-text-secondary/60 uppercase tracking-wider">Report A (Baseline)</span>
          <h4 className="text-xs font-bold text-white leading-snug">{rA.name}</h4>
          <p className="text-[11px] text-brand-text-secondary/70 font-mono leading-none">{rA.repo} • {rA.branch}</p>
        </div>
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] space-y-2">
          <span className="text-[10px] font-bold text-brand-text-secondary/60 uppercase tracking-wider">Report B (Target)</span>
          <h4 className="text-xs font-bold text-white leading-snug">{rB.name}</h4>
          <p className="text-[11px] text-brand-text-secondary/70 font-mono leading-none">{rB.repo} • {rB.branch}</p>
        </div>
      </div>

      {/* Comparisons score grid */}
      <div className="glass-card rounded-2xl border border-white/[0.08] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">
              <th className="py-3.5 px-5">Quality Vector</th>
              <th className="py-3.5 px-5 text-center">Baseline (A)</th>
              <th className="py-3.5 px-5 text-center">Target (B)</th>
              <th className="py-3.5 px-5 text-right">Variance Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {/* Quality score row */}
            <tr>
              <td className="py-4 px-5 font-bold text-white">Overall Quality Score</td>
              <td className="py-4 px-5 text-center font-mono font-bold text-white">{rA.qualityScore}%</td>
              <td className="py-4 px-5 text-center font-mono font-bold text-white">{rB.qualityScore}%</td>
              <td className="py-4 px-5 text-right">{diffBadge(diff.quality)}</td>
            </tr>

            {/* Coverage row */}
            <tr>
              <td className="py-4 px-5 font-bold text-white">Code Coverage</td>
              <td className="py-4 px-5 text-center font-mono text-brand-text-secondary">{rA.metrics.coverage}%</td>
              <td className="py-4 px-5 text-center font-mono text-brand-text-secondary">{rB.metrics.coverage}%</td>
              <td className="py-4 px-5 text-right">{diffBadge(diff.coverage)}</td>
            </tr>

            {/* Security score */}
            <tr>
              <td className="py-4 px-5 font-bold text-white">Security Rating</td>
              <td className="py-4 px-5 text-center font-mono text-brand-text-secondary">{rA.metrics.security}%</td>
              <td className="py-4 px-5 text-center font-mono text-brand-text-secondary">{rB.metrics.security}%</td>
              <td className="py-4 px-5 text-right">{diffBadge(diff.security)}</td>
            </tr>

            {/* Performance score */}
            <tr>
              <td className="py-4 px-5 font-bold text-white">Performance Score</td>
              <td className="py-4 px-5 text-center font-mono text-brand-text-secondary">{rA.metrics.performance}%</td>
              <td className="py-4 px-5 text-center font-mono text-brand-text-secondary">{rB.metrics.performance}%</td>
              <td className="py-4 px-5 text-right">{diffBadge(diff.performance)}</td>
            </tr>

            {/* Finding Count */}
            <tr>
              <td className="py-4 px-5 font-bold text-white">Total Findings (Critical + High)</td>
              <td className="py-4 px-5 text-center font-mono text-brand-text-secondary">{rA.findings.critical + rA.findings.high}</td>
              <td className="py-4 px-5 text-center font-mono text-brand-text-secondary">{rB.findings.critical + rB.findings.high}</td>
              <td className="py-4 px-5 text-right">{diffBadge(diff.findings, false)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ComparisonView;
