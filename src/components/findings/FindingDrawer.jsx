import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, GitBranch, GitCommitHorizontal, FileCode2, MapPin,
  CheckCircle2, EyeOff, ExternalLink, Shield, Zap, ChevronRight,
} from 'lucide-react';
import { useFindings } from '../../context/FindingsContext';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { AIAnalysisCard } from './AIAnalysisCard';
import { SuggestedFixCard } from './SuggestedFixCard';
import { CodePreview } from './CodePreview';
import { RelatedFindings } from './RelatedFindings';

const ConfidenceArc = ({ value }) => {
  const r = 30, cx = 40, cy = 42;
  const circumference = Math.PI * r; // half circle arc
  const dashOffset = circumference * (1 - value / 100);
  const color = value >= 90 ? '#4ade80' : value >= 70 ? '#fb923c' : '#f87171';

  return (
    <svg width="80" height="50" viewBox="0 0 80 50">
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="#ffffff10" strokeWidth="6"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="13" fontWeight="800">
        {value}%
      </text>
    </svg>
  );
};

const MetaPill = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
    <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-3.5 h-3.5 text-brand-text-secondary" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary/60">{label}</p>
      <p className="text-[12px] text-white font-semibold font-mono truncate mt-0.5">{value}</p>
    </div>
  </div>
);

export function FindingDrawer() {
  const { drawerOpen, closeDrawer, selectedFinding: f, resolveOne, ignoreOne } = useFindings();

  // Trap focus and close on Escape
  useEffect(() => {
    if (!drawerOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') closeDrawer(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [drawerOpen, closeDrawer]);

  // Lock scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <AnimatePresence>
      {drawerOpen && f && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`Finding: ${f.title}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-full z-50 flex flex-col
                       w-full sm:w-[540px] lg:w-[620px]
                       bg-[#0a0c12] border-l border-white/[0.08] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-white/[0.06] flex-shrink-0">
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <SeverityBadge severity={f.severity} />
                  <StatusBadge status={f.status} />
                  <CategoryBadge category={f.category} />
                </div>
                <h2 className="text-[15px] font-bold text-white leading-snug">{f.title}</h2>
                <p className="text-[11px] text-brand-text-secondary mt-1">{f.description}</p>
              </div>
              <button
                onClick={closeDrawer}
                className="flex-shrink-0 p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white transition-all"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Confidence arc + action buttons */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-4 flex-shrink-0 flex-wrap">
              <div className="flex flex-col items-center">
                <ConfidenceArc value={f.confidence} />
                <span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-wider mt-0.5">Confidence</span>
              </div>
              <div className="flex-1 flex flex-wrap gap-2">
                <button
                  onClick={() => resolveOne(f.id)}
                  disabled={f.status === 'resolved'}
                  className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {f.status === 'resolved' ? 'Resolved' : 'Mark Resolved'}
                </button>
                <button
                  onClick={() => ignoreOne(f.id)}
                  disabled={f.status === 'ignored'}
                  className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Ignore
                </button>
                <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] text-xs font-bold transition-all">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in GitHub
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-2">
                <MetaPill icon={GitBranch}         label="Repository" value={f.repo} />
                <MetaPill icon={GitBranch}         label="Branch"     value={f.branch} />
                <MetaPill icon={GitCommitHorizontal} label="Commit SHA" value={f.commit} />
                <MetaPill icon={FileCode2}          label="File"      value={f.file.split('/').pop()} />
                <MetaPill icon={MapPin}             label="Line"      value={`Line ${f.lineNumber}`} />
                <MetaPill icon={Zap}                label="Detected"  value={f.detectedAt} />
              </div>

              {/* AI Analysis */}
              <AIAnalysisCard finding={f} />

              {/* Suggested Fix */}
              <SuggestedFixCard finding={f} />

              {/* Code Preview */}
              {f.codeSnippet && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-orange-400" />
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-text-secondary">Code Preview</h3>
                  </div>
                  <CodePreview
                    code={f.codeSnippet}
                    highlightLines={f.highlightLines}
                    lineNumber={Math.max(1, f.lineNumber - 2)}
                  />
                </div>
              )}

              {/* Related Findings */}
              <RelatedFindings finding={f} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
