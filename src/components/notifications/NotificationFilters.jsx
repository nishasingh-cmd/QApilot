import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const FILTERS = [
  { id: 'all',        label: 'All Activity' },
  { id: 'unread',     label: 'Unread Only' },
  { id: 'critical',   label: 'Critical Alert' },
  { id: 'scans',      label: 'Scans' },
  { id: 'findings',   label: 'AI Findings' },
  { id: 'reports',    label: 'AI Reports' },
  { id: 'repos',      label: 'Repositories' },
];

export function NotificationFilters({ activeFilter, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 select-none">
      <div className="flex items-center gap-1.5 text-[10px] text-brand-text-secondary font-bold uppercase tracking-wider mr-1">
        <SlidersHorizontal className="w-3 h-3" />
        Filter By:
      </div>
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onChange(f.id)}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                isActive
                  ? 'bg-white/[0.04] text-white border-white/[0.12]'
                  : 'bg-transparent text-brand-text-secondary border-white/[0.04] hover:text-white hover:border-white/[0.1]'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default NotificationFilters;
