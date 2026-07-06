import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Clock, AlertTriangle, Play, Ban } from 'lucide-react';
import { ScanProgress } from './ScanProgress';

export function ScanCard({ scan, onCancel }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="p-5 rounded-2xl bg-white/[0.015] border border-white/[0.06] backdrop-blur-md relative overflow-hidden hover:border-white/[0.12] transition-colors"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <span className="text-[10px] text-brand-text-secondary font-mono tracking-wide uppercase">{scan.owner}</span>
          <h4 className="text-[14px] font-extrabold text-white tracking-tight mt-0.5">{scan.repoName}</h4>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-brand-text-secondary font-mono bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/[0.04]">
              <GitBranch className="w-3 h-3 text-brand-blue" />
              {scan.branch}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
              {scan.currentStage}
            </span>
          </div>
        </div>

        <button
          onClick={() => onCancel && onCancel(scan.id)}
          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/30 transition-all"
          aria-label="Cancel scan run"
        >
          <Ban className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mt-5">
        <div className="flex items-center justify-between text-xs text-brand-text-secondary">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Elapsed: {scan.elapsedTime}
          </span>
          <span className="font-mono text-white font-extrabold">{scan.progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${scan.progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-brand-blue"
          />
        </div>
      </div>

      {/* Steps Execution */}
      <ScanProgress stages={scan.stages} />
    </motion.div>
  );
}
export default ScanCard;
