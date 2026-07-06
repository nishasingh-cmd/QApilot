import React from 'react';
import { Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function RepositorySearch({ searchQuery, setSearchQuery, onConnectClick }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-4">
      {/* Search Input Container */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-brand-text-secondary">
          <Search className="w-4 h-4" />
        </div>
        <motion.input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, owner, or language..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/[0.08] text-white text-[13px] rounded-xl placeholder-brand-text-secondary focus:outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium"
          whileFocus={{ scale: 1.005, borderColor: 'rgba(79, 140, 255, 0.4)' }}
        />
      </div>

      {/* Primary Action Button */}
      <button
        onClick={onConnectClick}
        className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand-blue/20 select-none border border-white/[0.08]"
      >
        <Plus className="w-4 h-4" />
        Connect Repository
      </button>
    </div>
  );
}
