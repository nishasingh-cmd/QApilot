import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

export function ScanFilters({
  filterRepo,
  setFilterRepo,
  filterStatus,
  setFilterStatus,
  filterBranch,
  setFilterBranch,
  filterTime,
  setFilterTime,
  onReset,
  repositories = [],
  mode = 'simulator'
}) {
  const staticRepos = ['all', 'qapilot-web', 'dashboard-ui', 'mobile-app', 'backend-api', 'design-system', 'analytics-engine'];
  const statuses = ['all', 'success', 'failed'];
  const branches = ['all', 'main', 'develop', 'release-2.0'];
  const ranges = [
    { id: 'all', label: 'All Time' },
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/[0.015] border border-white/[0.05] mb-6">
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
        <div className="flex items-center gap-1.5 text-xs text-white font-bold uppercase tracking-wider">
          <SlidersHorizontal className="w-3.5 h-3.5 text-brand-blue" />
          Filter Runs
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] text-brand-text-secondary hover:text-white transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Repo Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Repository</label>
          <select
            value={filterRepo}
            onChange={(e) => setFilterRepo(e.target.value)}
            className="w-full bg-[#0b0e14] border border-white/[0.08] hover:border-white/[0.15] text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all cursor-pointer font-medium"
          >
            {mode === 'live' && repositories.length > 0 ? (
              <>
                <option value="all">All Repositories</option>
                {repositories.map((r) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </>
            ) : (
              staticRepos.map((r) => (
                <option key={r} value={r}>
                  {r === 'all' ? 'All Repositories' : r}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-[#0b0e14] border border-white/[0.08] hover:border-white/[0.15] text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all cursor-pointer font-medium"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Branch</label>
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="w-full bg-[#0b0e14] border border-white/[0.08] hover:border-white/[0.15] text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all cursor-pointer font-medium"
          >
            {branches.map((b) => (
              <option key={b} value={b}>
                {b === 'all' ? 'All Branches' : b}
              </option>
            ))}
          </select>
        </div>

        {/* Time range Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Time Range</label>
          <select
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            className="w-full bg-[#0b0e14] border border-white/[0.08] hover:border-white/[0.15] text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all cursor-pointer font-medium"
          >
            {ranges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
export default ScanFilters;
