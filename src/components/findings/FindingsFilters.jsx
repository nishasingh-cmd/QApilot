import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';
import axios from 'axios';

const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low', 'info'];
const CATEGORIES = ['all', 'security', 'performance', 'accessibility', 'testing', 'code-quality', 'best-practices', 'maintainability'];
const STATUSES = ['all', 'open', 'investigating', 'in-progress', 'resolved', 'ignored'];
const ASSIGNEES = ['all', 'Nisha Singh', 'Alex Chen', 'Maria Lopez', 'Tom Wright', 'Priya Patel', 'Unassigned'];
const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'highest_severity', label: 'Highest Severity' },
  { id: 'highest_confidence', label: 'Highest Confidence' },
  { id: 'repo_name', label: 'Repository Name' },
];

function Select({ value, onChange, options, getLabel }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-white/[0.01] border border-white/[0.08] hover:border-white/[0.15] text-white text-xs rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-brand-blue/50 transition-all cursor-pointer font-medium min-w-[120px]"
      >
        {options.map((o) => (
          <option key={typeof o === 'string' ? o : o.id} value={typeof o === 'string' ? o : o.id} className="bg-[#0b0e14]">
            {getLabel ? getLabel(o) : (typeof o === 'string' ? (o === 'all' ? 'All' : o) : o.label)}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-brand-text-secondary">
        <ChevronDown className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

export function FindingsFilters({
  searchQuery, setSearchQuery,
  filterRepo, setFilterRepo,
  filterSeverity, setFilterSeverity,
  filterCategory, setFilterCategory,
  filterStatus, setFilterStatus,
  filterAssignee, setFilterAssignee,
  sortBy, setSortBy,
  onReset,
  totalVisible,
}) {
  const [REPOS, setREPOS] = useState(['all']);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/repositories', { withCredentials: true });
        if (res.data && res.data.length > 0) {
          setREPOS(['all', ...res.data.map((r) => r.name)]);
        }
      } catch (err) {
        console.warn("Failed to retrieve live repos for findings filter", err.message);
      }
    };
    fetchRepos();
  }, []);
  return (
    <div className="space-y-3 mb-5">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-brand-text-secondary">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search findings by title, repository, or file..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/[0.08] text-white text-[13px] rounded-xl placeholder-brand-text-secondary focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-brand-text-secondary font-semibold hidden sm:block">Sort:</span>
          <Select value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
          <button onClick={onReset} className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/[0.06] text-brand-text-secondary hover:text-white transition-all" aria-label="Reset filters">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter chips row */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1 text-[10px] text-brand-text-secondary font-bold uppercase tracking-wider">
          <SlidersHorizontal className="w-3 h-3" />
          Filters:
        </div>
        <Select value={filterRepo} onChange={setFilterRepo} options={REPOS} getLabel={(o) => o === 'all' ? 'All Repos' : o} />
        <Select value={filterSeverity} onChange={setFilterSeverity} options={SEVERITIES} getLabel={(o) => o === 'all' ? 'All Severities' : o.charAt(0).toUpperCase() + o.slice(1)} />
        <Select value={filterCategory} onChange={setFilterCategory} options={CATEGORIES} getLabel={(o) => o === 'all' ? 'All Categories' : o.charAt(0).toUpperCase() + o.slice(1).replace(/-/g, ' ')} />
        <Select value={filterStatus} onChange={setFilterStatus} options={STATUSES} getLabel={(o) => o === 'all' ? 'All Statuses' : o.charAt(0).toUpperCase() + o.slice(1).replace(/-/g, ' ')} />
        <Select value={filterAssignee} onChange={setFilterAssignee} options={ASSIGNEES} getLabel={(o) => o === 'all' ? 'All Assignees' : o} />

        <span className="ml-auto text-[11px] text-brand-text-secondary font-mono">
          {totalVisible} results
        </span>
      </div>
    </div>
  );
}
