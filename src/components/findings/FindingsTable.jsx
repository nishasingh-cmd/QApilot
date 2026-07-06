import React from 'react';
import { motion } from 'framer-motion';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { useFindings } from '../../context/FindingsContext';
import { ArrowRight, Eye, Check, EyeOff, User, GitBranch } from 'lucide-react';

export function FindingsTable() {
  const {
    filteredFindings,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    openDrawer,
    resolveOne,
    ignoreOne,
  } = useFindings();

  const visibleIds = filteredFindings.map((f) => f.id);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const someSelected = visibleIds.some((id) => selectedIds.includes(id)) && !allSelected;

  // Handler for indeterminacy
  const setIndeterminate = (el) => {
    if (el) {
      el.indeterminate = someSelected;
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.01]">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.02]">
            <th className="py-3 px-4 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                ref={setIndeterminate}
                onChange={() => toggleSelectAll(visibleIds)}
                className="rounded border-white/[0.15] bg-white/[0.02] text-brand-blue focus:ring-brand-blue/30 w-3.5 h-3.5 cursor-pointer"
              />
            </th>
            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Issue Title</th>
            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Repository</th>
            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Branch</th>
            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">File</th>
            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Severity</th>
            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Category</th>
            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Status</th>
            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary text-right">Confidence</th>
            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Detected At</th>
            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Assignee</th>
            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {filteredFindings.length === 0 ? (
            <tr>
              <td colSpan="12" className="py-12 text-center text-xs text-brand-text-secondary font-medium">
                No findings match the current filters.
              </td>
            </tr>
          ) : (
            filteredFindings.map((f, idx) => {
              const isSelected = selectedIds.includes(f.id);
              const fileName = f.file.split('/').pop();
              const confidenceColor = f.confidence >= 90 ? 'text-emerald-400' : f.confidence >= 70 ? 'text-amber-400' : 'text-red-400';
              const fileTitleAttr = `${f.file}:${f.lineNumber}`;

              return (
                <motion.tr
                  key={f.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.015, 0.3) }}
                  className={`hover:bg-white/[0.03] transition-all cursor-pointer group ${
                    isSelected ? 'bg-brand-blue/[0.015]' : ''
                  }`}
                  onClick={() => openDrawer(f)}
                >
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(f.id)}
                      className="rounded border-white/[0.15] bg-white/[0.02] text-brand-blue focus:ring-brand-blue/30 w-3.5 h-3.5 cursor-pointer"
                    />
                  </td>

                  <td className="py-3.5 px-4 max-w-[240px]">
                    <div className="font-bold text-xs text-white group-hover:text-brand-blue transition-colors truncate">
                      {f.title}
                    </div>
                    <div className="text-[10px] text-brand-text-secondary truncate mt-0.5">
                      {f.description}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs font-semibold text-white/90">
                    <span className="font-mono">{f.repo}</span>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-brand-text-secondary">
                    <div className="flex items-center gap-1 font-mono">
                      <GitBranch className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate max-w-[90px]">{f.branch}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-brand-text-secondary font-mono">
                    <div className="truncate max-w-[140px]" title={fileTitleAttr}>
                      {fileName}:{f.lineNumber}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <SeverityBadge severity={f.severity} />
                  </td>

                  <td className="py-3.5 px-4">
                    <CategoryBadge category={f.category} />
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={f.status} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className={`text-xs font-extrabold font-mono ${confidenceColor}`}>
                      {f.confidence}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-brand-text-secondary font-mono">
                    {f.detectedAt}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-brand-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-brand-text-secondary/70 flex-shrink-0" />
                      <span className="truncate max-w-[90px]">{f.assignee}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openDrawer(f)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.06] text-brand-text-secondary hover:text-white transition-all"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => resolveOne(f.id)}
                        disabled={f.status === 'resolved'}
                        className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-brand-text-secondary hover:text-emerald-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mark resolved"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => ignoreOne(f.id)}
                        disabled={f.status === 'ignored'}
                        className="p-1.5 rounded-lg hover:bg-white/[0.06] text-brand-text-secondary hover:text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Ignore"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
