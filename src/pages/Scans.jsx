import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScans } from '../context/ScanContext';
import { ScanMetricCard } from '../components/scans/ScanMetricCard';
import { ScanCard } from '../components/scans/ScanCard';
import { ScanQueueTable } from '../components/scans/ScanQueueTable';
import { ScanHistoryTable } from '../components/scans/ScanHistoryTable';
import { QualitySummary } from '../components/scans/QualitySummary';
import { LiveScanLog } from '../components/scans/LiveScanLog';
import { ScanFilters } from '../components/scans/ScanFilters';
import {
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Clock,
  Plus,
  Compass,
} from 'lucide-react';

export function Scans() {
  const {
    metrics,
    activeScans,
    history,
    queue,
    scorecard,
    loading,
    error,
    filterRepo,
    setFilterRepo,
    filterStatus,
    setFilterStatus,
    filterBranch,
    setFilterBranch,
    filterTime,
    setFilterTime,
    triggerStartScan,
    triggerCancelScan,
    triggerRetryScan,
    resetFilters,
  } = useScans();

  const [isNewScanOpen, setIsNewScanOpen] = useState(false);
  const [repoSelect, setRepoSelect] = useState('qapilot-web');
  const [branchSelect, setBranchSelect] = useState('main');

  const handleStartScan = (e) => {
    e.preventDefault();
    triggerStartScan(repoSelect, branchSelect);
    setIsNewScanOpen(false);
  };

  // Filter history list based on client filter selection
  const filteredHistory = history.filter((run) => {
    if (filterRepo !== 'all' && run.repoName !== filterRepo) return false;
    if (filterStatus !== 'all' && run.status !== filterStatus) return false;
    if (filterBranch !== 'all' && run.branch !== filterBranch) return false;
    // Basic mock time filter logic
    if (filterTime === '24h' && !run.completedAt.includes('min') && !run.completedAt.includes('now')) return false;
    if (filterTime === '7d' && run.completedAt.includes('days') && parseInt(run.completedAt) > 7) return false;
    return true;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Scans</h1>
          <p className="text-[13px] text-brand-text-secondary mt-1">
            Monitor every repository scan, review quality metrics and inspect detected issues.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsNewScanOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-brand-blue/20 border border-white/[0.08]"
          >
            <Plus className="w-4 h-4" />
            Start New Scan
          </button>
          <a
            href="#history"
            className="px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            Scan History
          </a>
        </div>
      </div>

      {/* Start New Scan Popover / Dialog Modal */}
      <AnimatePresence>
        {isNewScanOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsNewScanOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl bg-[#0b0e14]/90 border border-white/[0.08] p-6 shadow-2xl overflow-hidden"
            >
              <h3 className="text-base font-extrabold text-white tracking-tight mb-4">Trigger AI Quality Scan</h3>
              <form onSubmit={handleStartScan} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-brand-text-secondary">Select Repository</label>
                  <select
                    value={repoSelect}
                    onChange={(e) => setRepoSelect(e.target.value)}
                    className="w-full bg-[#07090f] border border-white/[0.08] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  >
                    <option value="qapilot-web">qapilot-web</option>
                    <option value="dashboard-ui">dashboard-ui</option>
                    <option value="mobile-app">mobile-app</option>
                    <option value="backend-api">backend-api</option>
                    <option value="analytics-engine">analytics-engine</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-brand-text-secondary">Target Branch</label>
                  <input
                    type="text"
                    value={branchSelect}
                    onChange={(e) => setBranchSelect(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/[0.01] border border-white/[0.08] text-white text-[13px] rounded-xl focus:outline-none focus:border-brand-blue/50 font-mono"
                    placeholder="e.g. main"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewScanOpen(false)}
                    className="flex-1 py-2 text-center rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-center rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold border border-white/[0.08] transition-all"
                  >
                    Launch Scan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Metrics Overview Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <ScanMetricCard label="Total Scans" value={metrics.totalScans} icon={Zap} color="text-brand-blue bg-brand-blue/10 border-brand-blue/20" delay={0} />
        <ScanMetricCard label="Running" value={activeScans.length} icon={Activity} color="text-brand-blue bg-brand-blue/10 border-brand-blue/20 animate-pulse" delay={0.05} />
        <ScanMetricCard label="Completed" value={metrics.completedScans} icon={CheckCircle2} color="text-emerald-400 bg-emerald-500/10 border-emerald-500/20" delay={0.1} />
        <ScanMetricCard label="Failed" value={metrics.failedScans} icon={AlertTriangle} color="text-red-400 bg-red-500/10 border-red-500/20" delay={0.15} />
        <ScanMetricCard label="Avg Quality" value={`${metrics.avgQualityScore}%`} icon={Compass} color="text-cyan-400 bg-cyan-500/10 border-cyan-500/20" delay={0.2} />
        <ScanMetricCard label="Avg Scan Time" value={metrics.avgScanTime} icon={Clock} color="text-brand-blue bg-brand-blue/10 border-brand-blue/20" delay={0.25} />
      </div>

      {/* Main Grid: Active Scans & Quality scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Active Scans panel */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            Active Runs ({activeScans.length})
          </h3>
          {activeScans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {activeScans.map((scan) => (
                  <ScanCard
                    key={scan.id}
                    scan={scan}
                    onCancel={triggerCancelScan}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-brand-text-secondary rounded-2xl bg-white/[0.01] border border-white/[0.04]">
              No AI scans are currently running. Click "Start New Scan" to begin.
            </div>
          )}
        </div>

        {/* Live log streaming terminal */}
        <div className="lg:col-span-1">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Live Stream Log</h3>
          <LiveScanLog isActive={activeScans.length > 0} />
        </div>
      </div>

      {/* Quality Summary scorecard */}
      <div className="mb-6">
        <QualitySummary scorecard={scorecard} />
      </div>

      {/* Queue & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6" id="history">
        {/* Queue panel */}
        <div className="lg:col-span-1">
          <ScanQueueTable queue={queue} />
        </div>

        {/* History panel with search-filters */}
        <div className="lg:col-span-2 space-y-4">
          <ScanFilters
            filterRepo={filterRepo}
            setFilterRepo={setFilterRepo}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterBranch={filterBranch}
            setFilterBranch={setFilterBranch}
            filterTime={filterTime}
            setFilterTime={setFilterTime}
            onReset={resetFilters}
          />
          <ScanHistoryTable
            history={filteredHistory}
            onRetry={triggerRetryScan}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
export default Scans;
