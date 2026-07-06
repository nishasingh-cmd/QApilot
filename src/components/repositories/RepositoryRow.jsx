import React, { useState } from 'react';
import { GitBranch, Star, Lock, Globe, Check, Loader2 } from 'lucide-react';

export function RepositoryRow({ repo, onConnect }) {
  const [status, setStatus] = useState('idle'); // idle | connecting | connected

  const handleConnect = async () => {
    setStatus('connecting');
    // Simulate API connection delay
    setTimeout(() => {
      setStatus('connected');
      if (onConnect) {
        onConnect(repo);
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] transition-all">
      {/* Repo Details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[11px] text-brand-text-secondary font-mono">{repo.owner}</span>
          <span className="text-white font-mono text-[13px] font-bold">/</span>
          <h4 className="text-[13px] font-extrabold text-white truncate tracking-tight">{repo.name}</h4>
          
          {/* Visibility badge */}
          <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-brand-text-secondary border border-white/[0.04] font-bold uppercase tracking-wider">
            {repo.visibility === 'private' ? (
              <Lock className="w-2.5 h-2.5 text-amber-400" />
            ) : (
              <Globe className="w-2.5 h-2.5 text-emerald-400" />
            )}
            {repo.visibility}
          </span>
        </div>

        {/* Branch / Language / Stars line */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-brand-text-secondary font-medium">
          {repo.language && (
            <span className="flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-brand-blue" />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px]">
            <GitBranch className="w-3.5 h-3.5" />
            {repo.branch}
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <Star className="w-3.5 h-3.5 text-amber-400/80 fill-amber-400/20" />
            {repo.stars}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full sm:w-auto">
        <button
          onClick={handleConnect}
          disabled={status !== 'idle'}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border select-none ${
            status === 'connected'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default'
              : status === 'connecting'
              ? 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue cursor-wait'
              : 'bg-white/[0.03] hover:bg-white/[0.08] text-white border-white/[0.06]'
          }`}
        >
          {status === 'connecting' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {status === 'connected' && <Check className="w-3.5 h-3.5" />}
          {status === 'connected' ? 'Connected' : status === 'connecting' ? 'Connecting' : 'Connect'}
        </button>
      </div>
    </div>
  );
}
