import React from 'react';
import { Play, Flame, ShieldAlert, Layers } from 'lucide-react';

export function ScanQueueTable({ queue }) {
  return (
    <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.005]">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Upcoming Queue</h4>
        <span className="text-[10px] bg-white/[0.04] px-2 py-0.5 rounded text-brand-text-secondary font-mono">
          {queue.length} Pending
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs text-brand-text-secondary">
          <thead>
            <tr className="border-b border-white/[0.05] bg-white/[0.005]">
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Repository</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Priority</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Queued Time</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Expected Start</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {queue.length > 0 ? (
              queue.map((item) => {
                let priorityColor = 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                if (item.priority === 'high') {
                  priorityColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                }

                return (
                  <tr
                    key={item.id}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-white">{item.repoName}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wide ${priorityColor}`}>
                        {item.priority === 'high' ? (
                          <Flame className="w-2.5 h-2.5" />
                        ) : (
                          <Layers className="w-2.5 h-2.5" />
                        )}
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{item.queuedTime}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-white">{item.expectedStart}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[10px] font-semibold text-brand-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-text-secondary" />
                        Queued
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-brand-text-secondary">
                  Scan queue is currently empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ScanQueueTable;
