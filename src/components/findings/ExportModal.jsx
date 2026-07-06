import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, FileCode2, TableProperties } from 'lucide-react';
import { useFindings } from '../../context/FindingsContext';

const FORMATS = [
  { id: 'pdf',      label: 'PDF Report',        icon: FileText,       desc: 'Full formatted report with charts and summary', color: 'text-red-400' },
  { id: 'csv',      label: 'CSV Spreadsheet',   icon: TableProperties, desc: 'Tabular data for Excel or Google Sheets',       color: 'text-emerald-400' },
  { id: 'json',     label: 'JSON Data',          icon: FileCode2,      desc: 'Raw JSON for API integration or processing',   color: 'text-amber-400' },
  { id: 'markdown', label: 'Markdown Report',    icon: FileText,       desc: 'Formatted Markdown for GitHub, Notion, Docs',  color: 'text-brand-blue' },
];

export function ExportModal() {
  const { exportModalOpen, setExportModalOpen, exportLoading, triggerExport, selectedIds } = useFindings();

  return (
    <AnimatePresence>
      {exportModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExportModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            aria-modal="true"
            role="dialog"
            aria-label="Export findings"
          >
            <div className="w-full max-w-md bg-[#0b0e14] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-base font-bold text-white">Export Findings</h2>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    {selectedIds.length > 0 ? `Exporting ${selectedIds.length} selected findings` : 'Exporting all filtered findings'}
                  </p>
                </div>
                <button onClick={() => setExportModalOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-brand-text-secondary hover:text-white transition-all" aria-label="Close export modal">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Format grid */}
              <div className="p-5 grid grid-cols-2 gap-3">
                {FORMATS.map(({ id, label, icon: Icon, desc, color }) => (
                  <button
                    key={id}
                    disabled={exportLoading}
                    onClick={() => triggerExport(id)}
                    className="group text-left p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.14] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">{label}</p>
                    <p className="text-[10px] text-brand-text-secondary mt-1 leading-tight">{desc}</p>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 pb-5">
                <button onClick={() => setExportModalOpen(false)} className="w-full py-2.5 rounded-xl text-xs font-bold text-brand-text-secondary hover:text-white border border-white/[0.06] hover:border-white/[0.12] transition-all">
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
