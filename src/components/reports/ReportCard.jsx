import React from 'react';
import { motion } from 'framer-motion';
import { FileText, GitBranch, RefreshCw, BarChart2 } from 'lucide-react';
import { useReports } from '../../context/ReportsContext';

export function ReportCard({ report }) {
  const { openPreview, selectedIds, toggleSelect } = useReports();
  const isSelected = selectedIds.includes(report.id);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    if (score >= 80) return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    return 'text-red-400 border-red-500/20 bg-red-500/10';
  };

  const getGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'D';
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -2, borderColor: 'rgba(255, 255, 255, 0.12)' }}
      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 glass-card ${
        isSelected ? 'border-brand-blue/40 bg-brand-blue/[0.02]' : 'border-white/[0.06] hover:border-white/[0.12]'
      }`}
      onClick={() => openPreview(report)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                toggleSelect(report.id);
              }}
              className="rounded border-white/[0.15] bg-white/[0.02] text-brand-blue focus:ring-brand-blue/30 w-3.5 h-3.5 cursor-pointer flex-shrink-0"
            />
            <span className="text-[10px] text-brand-text-secondary font-mono bg-white/[0.04] px-1.5 py-0.5 rounded flex-shrink-0">
              {report.id}
            </span>
          </div>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center border font-mono font-black text-xs ${getScoreColor(report.qualityScore)}`}>
            {getGrade(report.qualityScore)}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 hover:text-brand-blue transition-colors">
          {report.name}
        </h4>

        {/* Details */}
        <div className="space-y-1">
          <p className="text-[11px] text-brand-text-secondary font-mono truncate">
            {report.repo} • {report.branch}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-brand-text-secondary/70">
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Updated: {report.generatedAt}</span>
          </div>
        </div>
      </div>

      {/* Footer Metrics summary */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.05] text-[10px] text-brand-text-secondary">
        <div>
          <span className="font-bold">Coverage: </span>
          <span className="font-semibold font-mono text-white">{report.metrics.coverage}%</span>
        </div>
        <div>
          <span className="font-bold">Score: </span>
          <span className="font-semibold font-mono text-white">{report.qualityScore}%</span>
        </div>
      </div>
    </motion.div>
  );
}
export default ReportCard;
