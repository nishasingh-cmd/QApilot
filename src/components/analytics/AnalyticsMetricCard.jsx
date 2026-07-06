import React from 'react';
import { motion } from 'framer-motion';

export function AnalyticsMetricCard({ label, value, icon: Icon, colorClass, bgClass, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between min-h-[118px] glass-card ${bgClass}`}
    >
      <div className="flex items-center justify-between gap-2.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-text-secondary/70 leading-tight">
          {label}
        </span>
        <div className={`p-1.5 rounded-lg border border-white/[0.04] bg-white/[0.03] ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${colorClass}`}>
          {value}
        </div>
        {description && (
          <p className="text-[10px] text-brand-text-secondary/60 mt-1 truncate">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
export default AnalyticsMetricCard;
