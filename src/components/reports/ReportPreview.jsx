import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, AlertTriangle } from 'lucide-react';
import { useReports } from '../../context/ReportsContext';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { QualityScoreCard } from './QualityScoreCard';
import { AIRecommendations } from './AIRecommendations';
import { ReportHistoryTimeline } from './ReportHistoryTimeline';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip } from 'recharts';

export function ReportPreview() {
  const { previewReport: r, closePreview, setShareReport, setExportReport } = useReports();

  // Escape key triggers close
  useEffect(() => {
    if (!r) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closePreview();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [r, closePreview]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = r ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [r]);

  if (!r) return null;

  const chartData = [
    { name: 'Critical', value: r.findings.critical, color: '#f87171' },
    { name: 'High', value: r.findings.high, color: '#fb923c' },
    { name: 'Medium', value: r.findings.medium, color: '#fbbf24' },
    { name: 'Low', value: r.findings.low, color: '#38bdf8' },
    { name: 'Resolved', value: r.findings.resolved, color: '#10b981' },
    { name: 'Ignored', value: r.findings.ignored, color: '#64748b' },
  ];

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePreview}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Preview Panel drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="relative w-full sm:w-[580px] lg:w-[680px] bg-[#0a0c12] border-l border-white/[0.08] shadow-2xl h-full flex flex-col z-50"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-white/[0.06] flex-shrink-0">
            <div className="flex-1 min-w-0 pr-3">
              <span className="text-[10px] text-brand-text-secondary/60 font-mono font-bold uppercase tracking-wider">Preview Audit Report</span>
              <h2 className="text-[15px] font-black text-white truncate mt-1 leading-snug">{r.name}</h2>
              <p className="text-[11px] text-brand-text-secondary mt-0.5 font-mono">{r.repo} • {r.branch} • Version {r.version}</p>
            </div>
            <button
              onClick={closePreview}
              className="flex-shrink-0 p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white transition-all"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Header row */}
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              {/* Overall Grade badge */}
              <div className="flex items-center gap-2.5">
                <span className={`w-9 h-9 rounded-full flex items-center justify-center border font-mono font-black text-sm ${getScoreColor(r.qualityScore)}`}>
                  {getGrade(r.qualityScore)}
                </span>
                <div>
                  <p className="text-[9px] font-bold text-brand-text-secondary/60 uppercase tracking-wide">Overall Quality</p>
                  <p className="text-xs font-black text-white font-mono mt-0.5">{r.qualityScore}% Score</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setExportReport(r)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] text-xs font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <button
                onClick={() => setShareReport(r)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] text-xs font-bold transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>
          </div>

          {/* Scrollable details content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Executive Summary */}
            <ExecutiveSummaryCard text={r.summary} />

            {/* Scorecard grid dials */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-brand-blue to-brand-cyan" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-text-secondary">Quality Scores</h3>
              </div>
              <QualityScoreCard metrics={r.metrics} />
            </div>

            {/* Findings distribution bar chart */}
            <div className="glass-card rounded-2xl border border-white/[0.08] p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.06]">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Findings Summary</h3>
              </div>
              <div className="w-full h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -35, bottom: 5 }}>
                    <XAxis
                      dataKey="name"
                      stroke="#ffffff30"
                      fontSize={10}
                      fontFamily="monospace"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#ffffff30"
                      fontSize={10}
                      fontFamily="monospace"
                      tickLine={false}
                      axisLine={false}
                      tickCount={4}
                    />
                    <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={28}>
                      {chartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations */}
            <AIRecommendations recommendations={r.recommendations} />

            {/* Timeline activity audit */}
            <ReportHistoryTimeline timeline={r.timeline} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default ReportPreview;
