import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { RepositoryRow } from './RepositoryRow';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export function RepositoryModal({ isOpen, onClose, availableRepos, onConnectRepo }) {
  const [search, setSearch] = useState('');
  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap / focus search input on open
  const searchInputRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const filteredRepos = availableRepos.filter((repo) => {
    const term = search.toLowerCase();
    return (
      repo.name.toLowerCase().includes(term) ||
      repo.owner.toLowerCase().includes(term) ||
      repo.language.toLowerCase().includes(term)
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-2xl max-h-[85vh] md:max-h-[80vh] flex flex-col rounded-3xl bg-[#0b0e14]/90 border border-white/[0.08] shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="connect-repo-title"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-white/[0.06] flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white">
                  <GithubIcon />
                </div>
                <div>
                  <h3 id="connect-repo-title" className="text-[16px] font-extrabold text-white tracking-tight">
                    Connect a Repository
                  </h3>
                  <p className="text-[12px] text-brand-text-secondary mt-0.5">
                    Select a GitHub repository to monitor and analyze.
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-white/[0.04] text-brand-text-secondary hover:text-white transition-all"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Local Repository Search */}
            <div className="p-6 py-4 border-b border-white/[0.04]">
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-brand-text-secondary">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search GitHub repositories..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.01] border border-white/[0.06] text-white text-[13px] rounded-xl placeholder-brand-text-secondary focus:outline-none focus:border-brand-blue/50 transition-all"
                />
              </div>
            </div>

            {/* Repository List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {filteredRepos.length > 0 ? (
                filteredRepos.map((repo) => (
                  <RepositoryRow
                    key={repo.id}
                    repo={repo}
                    onConnect={onConnectRepo}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-brand-text-secondary text-xs">
                  No repositories match your search query.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
