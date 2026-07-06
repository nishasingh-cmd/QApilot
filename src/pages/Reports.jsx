import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReports } from '../context/ReportsContext';
import { ReportsTable } from '../components/reports/ReportsTable';
import { ReportCard } from '../components/reports/ReportCard';
import { ReportPreview } from '../components/reports/ReportPreview';
import { ComparisonView } from '../components/reports/ComparisonView';
import { RepositoryHealthSummary } from '../components/reports/RepositoryHealthSummary';
import { ExportCenter } from '../components/reports/ExportCenter';
import { ShareReportModal } from '../components/reports/ShareReportModal';
import { FileText, Plus, GitFork, AlertTriangle, CheckCircle2, ChevronRight, BarChart3, TrendingUp, Sparkles, Loader2 } from 'lucide-react';

const REPOS = ['qapilot-web', 'dashboard-ui', 'mobile-app', 'backend-api', 'design-system', 'analytics-engine'];
const BRANCHES = ['main', 'develop', 'release-2.0', 'fix-login-flow', 'feat/dashboard-v2'];

export function Reports() {
  const {
    reports,
    metrics,
    summary,
    loading,
    error,
    selectedIds,
    clearSelections,
    triggerCompare,
    compareMode,
    generateReport,
    generationLoading,
  } = useReports();

  const [repoSelect, setRepoSelect] = useState(REPOS[0]);
  const [branchSelect, setBranchSelect] = useState(BRANCHES[0]);
  const [showGenModal, setShowGenModal] = useState(false);

  if (loading && reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Retrieving quality reports index...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-400 font-semibold border border-red-500/20 bg-red-500/10 rounded-xl">
        {error}
      </div>
    );
  }

  const handleGenerate = async () => {
    await generateReport(repoSelect, branchSelect);
    setShowGenModal(false);
  };

  const metricCards = [
    { label: 'Reports Generated', value: metrics.generated, icon: FileText, color: 'text-white', bg: 'bg-white/5' },
    { label: 'Latest Report Score', value: `${metrics.latestScore}%`, icon: Sparkles, color: 'text-brand-blue', bg: 'bg-brand-blue/10 border-brand-blue/20' },
    { label: 'Average Quality Score', value: `${metrics.avgScore}%`, icon: TrendingUp, color: 'text-brand-cyan', bg: 'bg-brand-cyan/10 border-brand-cyan/20' },
    { label: 'Open Critical Issues', value: metrics.criticalOpen, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { label: 'Resolved Findings', value: metrics.resolved, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Exports This Month', value: metrics.exportsThisMonth, icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-24 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-text-secondary text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <span>Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">AI Reports</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">AI Reports</h1>
          <p className="text-xs text-brand-text-secondary mt-1">
            Generate comprehensive engineering quality reports for repositories, branches and scans.
          </p>
        </div>
        <button
          onClick={() => setShowGenModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold transition-all shadow-lg shadow-brand-blue/20 shrink-0 animate-pulse"
        >
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className={`p-4 rounded-xl border border-white/[0.06] flex flex-col justify-between min-h-[96px] glass-card ${m.bg}`}
            >
              <div className="flex items-center justify-between gap-2.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-text-secondary/70 leading-tight">
                  {m.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
              </div>
              <div className={`text-xl font-black font-mono tracking-tight mt-2 ${m.color}`}>
                {m.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Health scorecards split */}
      <RepositoryHealthSummary summary={summary} />

      {/* Main Reports list / Compare mode block */}
      <div className="glass-card p-5 rounded-2xl border border-white/[0.08] relative">
        <AnimatePresence mode="wait">
          {compareMode ? (
            <ComparisonView />
          ) : (
            <div className="space-y-4">
              {/* Header List controller */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Quality Audit Logs</h3>
                {selectedIds.length === 2 ? (
                  <button
                    onClick={triggerCompare}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-cyan/15 hover:bg-brand-cyan/25 text-brand-cyan border border-brand-cyan/20 text-[11px] font-bold transition-all shadow-md shadow-brand-cyan/10"
                  >
                    Compare Selected ({selectedIds.length})
                  </button>
                ) : (
                  <span className="text-[10px] text-brand-text-secondary font-mono leading-none">
                    Select 2 reports to compare
                  </span>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <ReportsTable />
              </div>

              {/* Mobile Card Grid View */}
              <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-3">
                {reports.map((r) => (
                  <ReportCard key={r.id} report={r} />
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Preview Drawer */}
      <ReportPreview />

      {/* Share Modal Dialog */}
      <ShareReportModal />

      {/* Export modal dialog */}
      <ExportCenter />

      {/* Generation configuration Modal */}
      <AnimatePresence>
        {showGenModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !generationLoading && setShowGenModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 px-4"
            >
              <div className="w-full max-w-sm bg-[#0b0e14] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">Generate AI Quality Report</h3>
                  <p className="text-[10px] text-brand-text-secondary mt-1">Configure workspace references to build your index.</p>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-brand-text-secondary uppercase tracking-wider">Repository</label>
                    <select
                      value={repoSelect}
                      onChange={(e) => setRepoSelect(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.08] text-xs text-white p-2.5 rounded-xl outline-none"
                    >
                      {REPOS.map((r) => (
                        <option key={r} value={r} className="bg-[#0b0e14]">{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-brand-text-secondary uppercase tracking-wider">Branch</label>
                    <select
                      value={branchSelect}
                      onChange={(e) => setBranchSelect(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.08] text-xs text-white p-2.5 rounded-xl outline-none"
                    >
                      {BRANCHES.map((b) => (
                        <option key={b} value={b} className="bg-[#0b0e14]">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    disabled={generationLoading}
                    onClick={() => setShowGenModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-brand-text-secondary hover:text-white border border-white/[0.06] hover:border-white/[0.12] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={generationLoading}
                    onClick={handleGenerate}
                    className="flex-1 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-1.5"
                  >
                    {generationLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating
                      </>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
export default Reports;
