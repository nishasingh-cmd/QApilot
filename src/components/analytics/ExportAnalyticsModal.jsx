import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, FileCode2, TableProperties, Image } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

const FORMATS = [
  { id: 'pdf',  label: 'PDF Executive Report', icon: FileText,        desc: 'Comprehensive charts, trends and summaries', color: 'text-red-400' },
  { id: 'csv',  label: 'CSV Data Sheet',       icon: TableProperties,  desc: 'Detailed quality log files for spreadsheet audits', color: 'text-emerald-400' },
  { id: 'json', label: 'JSON Dataset',         icon: FileCode2,       desc: 'Full raw metrics payload for integration parsing', color: 'text-amber-400' },
  { id: 'png',  label: 'PNG Dashboard Snapshot',icon: Image,           desc: 'Image preview snapshot of current chart panels', color: 'text-brand-blue' },
];

export function ExportAnalyticsModal() {
  const { exportOpen, setExportOpen, exportLoading, triggerExport, timeframe } = useAnalytics();

  return (
    <AnimatePresence>
      {exportOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExportOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Export Analytics Dashboard"
          >
            <div className="w-full max-w-md bg-[#0b0e14] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden select-none">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-base font-bold text-white">Export Analytics</h2>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Generate quality reports using the active timeframe: <span className="font-mono text-white font-bold">{timeframe.toUpperCase()}</span>
                  </p>
                </div>
                <button
                  onClick={() => setExportOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-brand-text-secondary hover:text-white transition-all"
                  aria-label="Close export dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid */}
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
                    <p className="text-[10px] text-brand-text-secondary mt-1.5 leading-snug">{desc}</p>
                  </button>
                ))}
              </div>

              {/* Cancel Button */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => setExportOpen(false)}
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
export default ExportAnalyticsModal;
