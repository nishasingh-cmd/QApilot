import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Star, Activity, AlertCircle, ShieldAlert, Cpu, Settings, ExternalLink, RefreshCw } from 'lucide-react';
import { RepositoryStatusBadge } from './RepositoryStatusBadge';

export function RepositoryCard({ repo, onView, onScan, onSettings }) {
  // Determine health color style
  let healthColor = 'text-emerald-400';
  let healthBg = 'bg-emerald-500/10 border-emerald-500/20';
  if (repo.healthScore < 80 && repo.healthScore >= 70) {
    healthColor = 'text-amber-400';
    healthBg = 'bg-amber-500/10 border-amber-500/20';
  } else if (repo.healthScore < 70) {
    healthColor = 'text-red-400';
    healthBg = 'bg-red-500/10 border-red-500/20';
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4, borderColor: 'rgba(79, 140, 255, 0.2)' }}
      transition={{ duration: 0.2 }}
      className="relative rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex flex-col justify-between overflow-hidden hover:shadow-2xl hover:shadow-brand-blue/[0.02]"
    >
      {/* Glow highlight effect */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header section */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px] text-brand-text-secondary font-mono tracking-wide">{repo.owner}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-brand-text-secondary uppercase font-bold border border-white/[0.05]">
                {repo.visibility}
              </span>
            </div>
            <h3 className="text-[15px] font-extrabold text-white truncate tracking-tight">{repo.name}</h3>
          </div>
          
          {/* Health Score circle indicator */}
          <div className={`flex flex-col items-center justify-center w-11 h-11 rounded-xl border font-mono ${healthBg}`}>
            <span className={`text-base font-extrabold ${healthColor}`}>{repo.healthScore}</span>
            <span className="text-[7px] text-brand-text-secondary font-bold uppercase tracking-wider -mt-0.5">Score</span>
          </div>
        </div>

        {/* Status badges & branch */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <RepositoryStatusBadge status={repo.status} />
          <div className="inline-flex items-center gap-1 text-[11px] text-brand-text-secondary font-mono bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/[0.04]">
            <GitBranch className="w-3 h-3 text-brand-blue" />
            <span className="truncate max-w-[80px]">{repo.branch}</span>
          </div>
          {repo.language && (
            <span className="text-[11px] text-brand-text-secondary font-medium">
              {repo.language}
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2.5 py-3 border-t border-b border-white/[0.04] mb-4">
          <div className="text-left">
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">AI Coverage</span>
            <span className="text-[13px] font-bold text-white font-mono">{repo.aiCoverage}%</span>
          </div>
          <div className="text-left">
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Issues</span>
            <span className={`text-[13px] font-bold font-mono ${repo.openIssues > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {repo.openIssues}
            </span>
          </div>
          <div className="text-left">
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Deployment</span>
            <span className={`text-[11px] font-bold font-mono uppercase tracking-wide ${
              repo.deploymentStatus === 'success' ? 'text-emerald-400' :
              repo.deploymentStatus === 'failed' ? 'text-red-400' : 'text-amber-400'
            }`}>
              {repo.deploymentStatus}
            </span>
          </div>
        </div>

        {/* Activity feed preview */}
        <div className="flex gap-2 items-start text-xs text-brand-text-secondary mb-5">
          <Activity className="w-3.5 h-3.5 mt-0.5 text-brand-blue flex-shrink-0" />
          <span className="line-clamp-2 leading-relaxed text-[11px] font-medium italic">
            {repo.recentActivity}
          </span>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onView && onView(repo)}
          className="flex-1 py-2 text-center rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/[0.06] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View
        </button>
        <button
          onClick={() => onScan && onScan(repo)}
          disabled={repo.status === 'scanning'}
          className={`flex-1 py-2 text-center rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
            repo.status === 'scanning'
              ? 'bg-brand-blue/5 border-brand-blue/10 text-brand-blue/40 cursor-not-allowed'
              : 'bg-brand-blue hover:bg-brand-blue-hover text-white border-white/[0.08]'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${repo.status === 'scanning' ? 'animate-spin' : ''}`} />
          {repo.status === 'scanning' ? 'Scanning' : 'Scan'}
        </button>
        <button
          onClick={() => onSettings && onSettings(repo)}
          className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] transition-all"
          aria-label="Repository settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
