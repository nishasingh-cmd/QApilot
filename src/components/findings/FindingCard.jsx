import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, User, ExternalLink, Calendar, HelpCircle } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { useFindings } from '../../context/FindingsContext';

export function FindingCard({ finding }) {
  const { openDrawer, selectedIds, toggleSelect } = useFindings();
  const isSelected = selectedIds.includes(finding.id);

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className={`glass-card p-4 rounded-xl border transition-all duration-200 text-left flex flex-col justify-between gap-4 cursor-pointer ${
        isSelected ? 'border-brand-blue/40 bg-brand-blue/[0.02]' : 'border-white/[0.08] hover:border-white/[0.15]'
      }`}
      onClick={() => openDrawer(finding)}
    >
      <div className="space-y-2.5">
        {/* Top metadata row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                toggleSelect(finding.id);
              }}
              className="rounded border-white/[0.15] bg-white/[0.02] text-brand-blue focus:ring-brand-blue/30 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-[10px] text-brand-text-secondary font-mono bg-white/[0.04] px-1.5 py-0.5 rounded">
              {finding.id}
            </span>
          </div>
          <SeverityBadge severity={finding.severity} />
        </div>

        {/* Title */}
        <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
          {finding.title}
        </h4>

        {/* File and Repo */}
        <div className="space-y-1">
          <p className="text-[11px] text-brand-text-secondary font-mono truncate">
            {finding.repo} • {finding.branch}
          </p>
          <p className="text-[10px] text-brand-text-secondary/70 font-mono truncate">
            {finding.file}:{finding.lineNumber}
          </p>
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.05] text-[11px] text-brand-text-secondary">
        <div className="flex items-center gap-1.5">
          <CategoryBadge category={finding.category} />
          <StatusBadge status={finding.status} />
        </div>
        <div className="flex items-center gap-1">
          <User className="w-3 h-3 text-brand-text-secondary/70" />
          <span className="truncate max-w-[80px]">{finding.assignee}</span>
        </div>
      </div>
    </motion.div>
  );
}
