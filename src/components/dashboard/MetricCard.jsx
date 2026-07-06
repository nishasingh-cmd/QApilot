import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export function MetricCard({
  title,
  value,
  description,
  trend,
  trendType = 'up',
  icon: Icon,
  index = 0
}) {
  const isUp = trendType === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.05 }}
      whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.12)' }}
      className="relative flex flex-col gap-3.5 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-md shadow-xl transition-all duration-300 select-none cursor-default"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-text-muted">
          {title}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-brand-blue shrink-0">
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="text-2xl font-extrabold text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span 
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full border shrink-0",
              isUp 
                ? 'text-brand-success bg-brand-success/5 border-brand-success/15'
                : 'text-brand-danger bg-brand-danger/5 border-brand-danger/15'
            )}
          >
            {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            <span>{trend}</span>
          </span>
        )}
      </div>

      <p className="text-[11.5px] text-brand-text-secondary leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
