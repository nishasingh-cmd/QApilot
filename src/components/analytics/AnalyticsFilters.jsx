import React from 'react';

const OPTIONS = [
  { id: '7d',  label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '12m', label: '12 Months' },
];

export function AnalyticsFilters({ value, onChange }) {
  return (
    <div className="flex bg-white/[0.02] border border-white/[0.06] rounded-xl p-1 select-none">
      {OPTIONS.map((o) => {
        const isActive = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isActive
                ? 'bg-white/[0.04] text-white shadow-sm'
                : 'text-brand-text-secondary hover:text-white'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
export default AnalyticsFilters;
