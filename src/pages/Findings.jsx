import React from 'react';
import { motion } from 'framer-motion';
import { useFindings } from '../context/FindingsContext';
import { FindingsFilters } from '../components/findings/FindingsFilters';
import { FindingsTable } from '../components/findings/FindingsTable';
import { FindingCard } from '../components/findings/FindingCard';
import { FindingDrawer } from '../components/findings/FindingDrawer';
import { BulkActionBar } from '../components/findings/BulkActionBar';
import { ExportModal } from '../components/findings/ExportModal';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, GitFork, ChevronRight, Loader2, Download } from 'lucide-react';

export function Findings() {
  const {
    filteredFindings,
    metrics,
    loading,
    error,
    selectedIds,
    bulkResolve,
    bulkIgnore,
    bulkAssign,
    clearSelection,
    setExportModalOpen,
    searchQuery, setSearchQuery,
    filterRepo, setFilterRepo,
    filterSeverity, setFilterSeverity,
    filterCategory, setFilterCategory,
    filterStatus, setFilterStatus,
    filterAssignee, setFilterAssignee,
    sortBy, setSortBy,
    resetFilters,
  } = useFindings();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Analyzing repositories findings...</span>
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

  const metricCards = [
    { label: 'Total Findings', value: metrics.total, icon: AlertTriangle, color: 'text-white', bg: 'bg-white/5' },
    { label: 'Critical Issues', value: metrics.critical, icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { label: 'High Priority', value: metrics.high, icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { label: 'Resolved', value: metrics.resolved, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Avg Resolution Time', value: metrics.avgResolutionTime, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Repositories Impacted', value: metrics.reposImpacted, icon: GitFork, color: 'text-brand-blue', bg: 'bg-brand-blue/10 border-brand-blue/20' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-24">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-text-secondary text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <span>Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">AI Findings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">AI Findings</h1>
          <p className="text-xs text-brand-text-secondary mt-1">
            Review every issue detected across your repositories and prioritize fixes using AI-powered insights.
          </p>
        </div>
        <button
          onClick={() => setExportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold transition-all shadow-lg shadow-brand-blue/20"
        >
          <Download className="w-4 h-4" />
          Export Findings
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metricCards.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-xl border border-white/[0.06] flex flex-col justify-between min-h-[100px] glass-card ${m.bg}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-text-secondary/70 leading-tight">
                  {m.label}
                </span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight mt-2 ${m.color}`}>
                {m.value}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters & Main List */}
      <div className="glass-card p-5 rounded-2xl border border-white/[0.08] relative">
        <FindingsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterRepo={filterRepo}
          setFilterRepo={setFilterRepo}
          filterSeverity={filterSeverity}
          setFilterSeverity={setFilterSeverity}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterAssignee={filterAssignee}
          setFilterAssignee={setFilterAssignee}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onReset={resetFilters}
          totalVisible={filteredFindings.length}
        />

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <FindingsTable />
        </div>

        {/* Mobile/Tablet Card Grid View */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFindings.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-brand-text-secondary font-medium">
              No findings match the current filters.
            </div>
          ) : (
            filteredFindings.map((f) => (
              <FindingCard key={f.id} finding={f} />
            ))
          )}
        </div>
      </div>

      {/* Drawer */}
      <FindingDrawer />

      {/* Bulk actions */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClear={clearSelection}
        onAssign={bulkAssign}
        onResolve={bulkResolve}
        onIgnore={bulkIgnore}
        onExport={() => setExportModalOpen(true)}
      />

      {/* Export Modal */}
      <ExportModal />
    </div>
  );
}
export default Findings;
