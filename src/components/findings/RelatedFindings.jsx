import React from 'react';
import { GitFork, ArrowRight } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';
import { useFindings } from '../../context/FindingsContext';
import { MOCK_FINDINGS } from '../../data/findings';

export function RelatedFindings({ finding }) {
  const { openDrawer } = useFindings();
  if (!finding) return null;

  const related = MOCK_FINDINGS.filter(
    (f) =>
      f.id !== finding.id &&
      (f.category === finding.category || f.severity === finding.severity) &&
      f.repo !== finding.repo
  ).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-4 rounded-full bg-gradient-to-b from-purple-400 to-pink-400" />
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-text-secondary">Related Findings</h3>
      </div>
      <div className="space-y-2">
        {related.map((f) => (
          <button
            key={f.id}
            onClick={() => openDrawer(f)}
            className="w-full text-left group flex items-center gap-3 p-3.5 rounded-xl glass-card hover:border-white/[0.15] transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white font-semibold truncate group-hover:text-brand-blue transition-colors">{f.title}</p>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <GitFork className="w-3 h-3 text-brand-text-secondary" />
                <span className="text-[10px] text-brand-text-secondary font-mono">{f.repo}</span>
                <SeverityBadge severity={f.severity} />
                <StatusBadge status={f.status} />
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-brand-text-secondary group-hover:text-brand-blue transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
