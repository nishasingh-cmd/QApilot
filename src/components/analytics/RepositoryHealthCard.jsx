import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export function RepositoryHealthCard({ repos }) {
  if (!repos) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((r, idx) => {
        const isUp = r.trend === 'up';
        const isDown = r.trend === 'down';
        const scoreColor = r.healthScore >= 90 ? 'text-emerald-400' : r.healthScore >= 80 ? 'text-amber-400' : 'text-red-400';
        const scoreBg = r.healthScore >= 90 ? 'bg-emerald-500/10 border-emerald-500/20' : r.healthScore >= 80 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20';

        return (
          <motion.div
            key={r.repo}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            whileHover={{ y: -2, borderColor: 'rgba(255, 255, 255, 0.12)' }}
            className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.015] flex flex-col justify-between gap-4 transition-all duration-200"
          >
            {/* Header info */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs font-black text-white font-mono truncate max-w-[150px]">{r.repo}</h4>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-brand-text-secondary">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
                  <span>Scan: {r.lastScan}</span>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-mono font-black text-xs ${scoreColor} ${scoreBg}`}>
                {r.healthScore}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/[0.04] text-[11px]">
              <div>
                <p className="text-brand-text-secondary/60 font-bold uppercase tracking-wider text-[9px]">Code Coverage</p>
                <p className="text-white font-semibold font-mono mt-0.5">{r.coverage}%</p>
              </div>
              <div>
                <p className="text-brand-text-secondary/60 font-bold uppercase tracking-wider text-[9px]">Open Findings</p>
                <p className="text-white font-semibold font-mono mt-0.5">{r.openFindings}</p>
              </div>
            </div>

            {/* Trend status */}
            <div className="flex items-center justify-between mt-1 text-[10px]">
              <span className="text-brand-text-secondary/60 font-bold uppercase tracking-wider text-[9px]">Health Trend</span>
              {isUp && (
                <span className="flex items-center gap-1 text-emerald-400 font-extrabold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Improving
                </span>
              )}
              {isDown && (
                <span className="flex items-center gap-1 text-red-400 font-extrabold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Declining
                </span>
              )}
              {!isUp && !isDown && (
                <span className="text-brand-text-secondary font-extrabold font-mono">
                  Stable
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
export default RepositoryHealthCard;
