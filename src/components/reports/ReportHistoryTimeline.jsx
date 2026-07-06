import React from 'react';
import { PlusCircle, Edit2, Share2, Download, Eye, Calendar } from 'lucide-react';

const ICON_MAP = {
  Created:  { icon: PlusCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  Updated:  { icon: Edit2,       color: 'text-brand-blue',  bg: 'bg-brand-blue/10 border-brand-blue/20' },
  Shared:   { icon: Share2,      color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20' },
  Exported: { icon: Download,    color: 'text-brand-cyan',  bg: 'bg-brand-cyan/10 border-brand-cyan/20' },
  Viewed:   { icon: Eye,         color: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20' },
};

export function ReportHistoryTimeline({ timeline }) {
  if (!timeline) return null;

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="w-4 h-4 text-brand-text-secondary" />
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-text-secondary">Report Activity Audit Trail</h3>
      </div>

      <div className="relative pl-5 space-y-4">
        {/* Timeline connector bar */}
        <div className="absolute top-1 bottom-1 left-2.5 w-0.5 bg-white/[0.04]" />

        {timeline.map((event, idx) => {
          const cfg = ICON_MAP[event.type] || ICON_MAP.Viewed;
          const EventIcon = cfg.icon;

          return (
            <div key={idx} className="relative flex gap-3.5 items-start">
              {/* Dot icon */}
              <div className={`absolute -left-5 w-5.5 h-5.5 rounded-full border flex items-center justify-center bg-[#07090F] ${cfg.color} ${cfg.bg}`}>
                <EventIcon className="w-3 h-3" />
              </div>

              {/* Event card details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2.5">
                  <span className="text-xs font-bold text-white leading-none">{event.type}</span>
                  <span className="text-[10px] text-brand-text-secondary font-mono leading-none">{event.date}</span>
                </div>
                <p className="text-[10px] text-brand-text-secondary/70 mt-1">
                  Triggered by <span className="font-semibold text-brand-text-secondary">{event.user}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default ReportHistoryTimeline;
