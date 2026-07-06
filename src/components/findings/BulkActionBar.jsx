import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserCheck, CheckCircle2, EyeOff, Download, X, ChevronDown } from 'lucide-react';

const ASSIGNEES = ['Nisha Singh', 'Alex Chen', 'Maria Lopez', 'Tom Wright', 'Priya Patel'];

export function BulkActionBar({ selectedCount, onAssign, onResolve, onIgnore, onExport, onClear }) {
  const [assignOpen, setAssignOpen] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0d1018]/95 border border-brand-blue/30 shadow-2xl shadow-brand-blue/10 backdrop-blur-xl"
      >
        <span className="text-xs font-extrabold text-white bg-brand-blue/20 px-2.5 py-0.5 rounded-full border border-brand-blue/30">
          {selectedCount} selected
        </span>

        {/* Assign dropdown */}
        <div className="relative">
          <button
            onClick={() => setAssignOpen(!assignOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] text-xs font-bold transition-all"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Assign
            <ChevronDown className="w-3 h-3 text-brand-text-secondary" />
          </button>
          {assignOpen && (
            <div className="absolute bottom-full mb-2 left-0 min-w-[160px] bg-[#0d1018] border border-white/[0.08] rounded-xl shadow-xl overflow-hidden z-50">
              {ASSIGNEES.map((a) => (
                <button
                  key={a}
                  onClick={() => { onAssign(a); setAssignOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-white hover:bg-white/[0.06] transition-colors font-medium"
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onResolve}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Resolve
        </button>

        <button
          onClick={onIgnore}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] text-xs font-bold transition-all"
        >
          <EyeOff className="w-3.5 h-3.5" />
          Ignore
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] text-xs font-bold transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>

        <button
          onClick={onClear}
          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-brand-text-secondary hover:text-white transition-all"
          aria-label="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
