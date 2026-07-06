import React from 'react';
import { GitBranch, Trash2, FolderGit2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function RepositorySelector({ selectedRepos, onRemove }) {
  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      <h4 className="text-xs uppercase tracking-wider text-brand-text-secondary font-semibold mb-3">
        Importing {selectedRepos.length} {selectedRepos.length === 1 ? 'Repository' : 'Repositories'}
      </h4>
      <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
        {selectedRepos.map((repo) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue flex-shrink-0">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-white truncate tracking-tight">{repo.name}</p>
                <p className="text-[10px] text-brand-text-secondary truncate mt-0.5">{repo.owner}</p>
              </div>
            </div>
            {onRemove && (
              <button
                onClick={() => onRemove(repo.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-brand-text-secondary hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all"
                aria-label={`Remove ${repo.name} from import selection`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
export default RepositorySelector;
