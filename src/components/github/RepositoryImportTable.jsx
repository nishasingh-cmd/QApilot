import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, GitBranch, Lock, Globe, Search, ArrowRight, Check } from 'lucide-react';

export function RepositoryImportTable({
  availableRepos,
  selectedRepoIds,
  onToggleRepo,
  onToggleSelectAll,
  onImport,
  loading,
}) {
  const [search, setSearch] = useState('');

  const filtered = availableRepos.filter((repo) => {
    const term = search.toLowerCase();
    return (
      repo.name.toLowerCase().includes(term) ||
      repo.owner.toLowerCase().includes(term) ||
      (repo.language && repo.language.toLowerCase().includes(term))
    );
  });

  const allSelected = filtered.length > 0 && filtered.every((r) => selectedRepoIds.includes(r.id));
  const noneSelected = selectedRepoIds.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto rounded-3xl bg-white/[0.01] border border-white/[0.05] p-6 backdrop-blur-md relative my-6"
    >
      {/* Header and Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-extrabold text-white tracking-tight">Select Repositories</h3>
          <p className="text-[12px] text-brand-text-secondary mt-0.5">
            Choose which GitHub repositories you want to connect to QAPilot.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={onImport}
          disabled={noneSelected || loading}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border select-none ${
            noneSelected
              ? 'bg-white/[0.02] text-brand-text-secondary/40 border-white/[0.04] cursor-not-allowed'
              : 'bg-brand-blue hover:bg-brand-blue-hover text-white border-white/[0.08] hover:shadow-lg hover:shadow-brand-blue/20'
          }`}
        >
          {loading ? 'Importing...' : `Import Selected (${selectedRepoIds.length})`}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Local Filter Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-brand-text-secondary">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter available GitHub repositories..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/[0.06] text-white text-[13px] rounded-xl placeholder-brand-text-secondary focus:outline-none focus:border-brand-blue/50 transition-all font-medium"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-white/[0.05] rounded-2xl bg-white/[0.005]">
        <table className="w-full border-collapse text-left text-xs text-brand-text-secondary">
          <thead>
            <tr className="border-b border-white/[0.05] bg-white/[0.01]">
              <th className="py-3 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onToggleSelectAll(filtered)}
                  className="rounded border-white/[0.15] bg-transparent text-brand-blue focus:ring-brand-blue/50 cursor-pointer w-4 h-4"
                  aria-label="Select all repositories"
                />
              </th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Repository</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Visibility</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Language</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Stars</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((repo) => {
                const isSelected = selectedRepoIds.includes(repo.id);
                return (
                  <tr
                    key={repo.id}
                    onClick={() => onToggleRepo(repo.id)}
                    className={`border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer select-none ${
                      isSelected ? 'bg-brand-blue/[0.02]' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleRepo(repo.id)}
                        className="rounded border-white/[0.15] bg-transparent text-brand-blue focus:ring-brand-blue/50 cursor-pointer w-4 h-4"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white text-[13px]">{repo.name}</span>
                        <span className="text-[11px] text-brand-text-secondary/80 mt-0.5">{repo.owner}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/[0.05] bg-white/[0.02] text-[10px] font-medium font-mono uppercase">
                        {repo.visibility === 'private' ? (
                          <Lock className="w-3 h-3 text-amber-400" />
                        ) : (
                          <Globe className="w-3 h-3 text-emerald-400" />
                        )}
                        {repo.visibility}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">{repo.language || '—'}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-white">{repo.stars}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-10 text-center text-brand-text-secondary">
                  No GitHub repositories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
export default RepositoryImportTable;
