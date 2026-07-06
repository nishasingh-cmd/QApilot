import React from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

export function RepositoryFilters({
  activeFilter,
  setActiveFilter,
  sortBy,
  setSortBy,
}) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'healthy', label: 'Healthy' },
    { id: 'scanning', label: 'Scanning' },
    { id: 'attention', label: 'Needs Attention' },
    { id: 'public', label: 'Public' },
    { id: 'private', label: 'Private' },
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest Connected' },
    { id: 'oldest', label: 'Oldest Connected' },
    { id: 'highest_score', label: 'Highest Score' },
    { id: 'lowest_score', label: 'Lowest Score' },
    { id: 'most_issues', label: 'Most Issues' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between py-2 border-b border-white/[0.06] mb-6">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activeFilter === filter.id
                ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue shadow-lg shadow-brand-blue/5'
                : 'bg-transparent border-transparent text-brand-text-secondary hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Sort options */}
      <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
        <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Sort by:</span>
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] text-white text-xs rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all cursor-pointer font-medium"
          >
            {sortOptions.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-[#0b0e14] text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-brand-text-secondary">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
