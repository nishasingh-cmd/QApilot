import React from 'react';
import { User } from 'lucide-react';

export function TeamLeaderboard({ members }) {
  if (!members) return null;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.01]">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">
            <th className="py-3 px-4 w-12 text-center">Rank</th>
            <th className="py-3 px-4">Developer</th>
            <th className="py-3 px-4 text-center">Assigned</th>
            <th className="py-3 px-4 text-center">Resolved</th>
            <th className="py-3 px-4 text-center">Avg Resolution Time</th>
            <th className="py-3 px-4 text-right">Contribution Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {members.map((m, idx) => {
            const isTop3 = idx < 3;
            const rankColors = [
              'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
              'text-slate-300 bg-slate-500/10 border-slate-500/20',
              'text-amber-600 bg-amber-700/10 border-amber-700/20',
            ];

            return (
              <tr key={m.developer} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 text-center">
                  {isTop3 ? (
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full border text-xs font-black ${rankColors[idx]}`}>
                      {idx + 1}
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-brand-text-secondary/60 font-semibold">{idx + 1}</span>
                  )}
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-[11px] font-black text-brand-blue font-sans">
                      {m.developer.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-xs font-bold text-white leading-none">{m.developer}</span>
                  </div>
                </td>

                <td className="py-3 px-4 text-center text-xs font-mono text-brand-text-secondary">
                  {m.assigned}
                </td>

                <td className="py-3 px-4 text-center text-xs font-mono text-white font-semibold">
                  {m.resolved}
                </td>

                <td className="py-3 px-4 text-center text-xs font-mono text-brand-text-secondary">
                  {m.avgResolutionTime}
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="text-xs font-extrabold font-mono text-emerald-400">
                      {m.contributionScore}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default TeamLeaderboard;
