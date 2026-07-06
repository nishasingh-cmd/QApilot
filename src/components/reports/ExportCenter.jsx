import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, FileCode2, TableProperties, Code } from 'lucide-react';
import { useReports } from '../../context/ReportsContext';

const FORMATS = [
  { id: 'pdf',      label: 'PDF Quality Audit',  icon: FileText,        desc: 'Formatted audit document with graphs', color: 'text-red-400' },
  { id: 'csv',      label: 'CSV Violations List', icon: TableProperties,  desc: 'Tabular findings data sheet',        color: 'text-emerald-400' },
  { id: 'json',     label: 'JSON Payload',        icon: FileCode2,       desc: 'Raw metrics payload data structure',   color: 'text-amber-400' },
  { id: 'markdown', label: 'Markdown Summary',    icon: FileText,        desc: 'Render summary for GitHub Readme/Wiki', color: 'text-brand-blue' },
  { id: 'html',     label: 'HTML Report Page',    icon: Code,            desc: 'Static HTML dashboard page asset',      color: 'text-purple-400' },
];

export function ExportCenter() {
  const { exportReport: r, setExportReport, exportLoading, exportOne } = useReports();

  return (
    <AnimatePresence>
      {r && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExportReport(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Dialog Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Export Quality Report"
          >
            <div className="w-full max-w-md bg-[#0b0e14] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden select-none">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-base font-bold text-white">Export Report</h2>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Generate downloads for: <span className="font-semibold text-white truncate max-w-[200px] inline-block align-bottom">{r.name}</span>
                  </p>
                </div>
                <button
                  onClick={() => setExportReport(null)}
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-brand-text-secondary hover:text-white transition-all"
                  aria-label="Close export dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Formats list grid */}
              <div className="p-5 grid grid-cols-2 gap-3">
                {FORMATS.map(({ id, label, icon: Icon, desc, color }) => (
                  <button
                    key={id}
                    disabled={exportLoading}
                    onClick={() => exportOne(r.id, id)}
                    className="group text-left p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.14] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">{label}</p>
                    <p className="text-[10px] text-brand-text-secondary mt-1.5 leading-snug">{desc}</p>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => setExportReport(null)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-brand-text-secondary hover:text-white border border-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
export default ExportCenter;
