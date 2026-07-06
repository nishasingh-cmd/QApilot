import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Plus } from 'lucide-react';

export function RepositoryEmptyState({ onConnectClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 rounded-2xl bg-white/[0.01] border border-white/[0.04] backdrop-blur-md text-center max-w-xl mx-auto my-12"
    >
      {/* Decorative Outer Ring with Pulsing Inner Glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-brand-blue/20 blur-xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
          <FolderGit2 className="w-8 h-8" />
        </div>
      </div>

      <h3 className="text-lg font-extrabold text-white tracking-tight">No repositories connected</h3>
      <p className="text-[13px] text-brand-text-secondary leading-relaxed max-w-sm mt-2 mb-6">
        Connect your first GitHub repository to begin automated quality analysis and AI-powered scans.
      </p>

      <button
        onClick={onConnectClick}
        className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-brand-blue/20 border border-white/[0.08]"
      >
        <Plus className="w-4 h-4" />
        Connect Repository
      </button>
    </motion.div>
  );
}
