import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, Clock, RefreshCw, AlertCircle, CheckCircle2, User } from 'lucide-react';

export function ScanHistoryTable({ history, onRetry, loading }) {
  const navigate = useNavigate();
  return (
    <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.005]">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Scan History</h4>
        <span className="text-[10px] bg-white/[0.04] px-2 py-0.5 rounded text-brand-text-secondary font-mono">
          Showing {history.length} Runs
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs text-brand-text-secondary">
          <thead>
            <tr className="border-b border-white/[0.05] bg-white/[0.005]">
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Repository</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Commit</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Branch</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Score</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Duration</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Status</th>
              <th className="py-3 px-4 font-bold text-white uppercase tracking-wider text-[10px]">Completed</th>
              <th className="py-3 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((run) => {
                let scoreColor = 'text-emerald-400';
                if (run.qualityScore < 80 && run.qualityScore >= 70) {
                  scoreColor = 'text-amber-400';
                } else if (run.qualityScore < 70) {
                  scoreColor = 'text-red-400';
                }

                return (
                  <tr
                    key={run.id}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white text-[13px]">{run.repoName}</span>
                        <span className="text-[10px] text-brand-text-secondary/70 mt-0.5">{run.owner}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col max-w-[200px]">
                        <span className="font-mono text-brand-blue font-bold text-[11px]">{run.commit}</span>
                        <span className="text-[10px] truncate text-brand-text-secondary mt-0.5" title={run.commitMessage}>
                          {run.commitMessage}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="inline-flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.04] text-[11px]">
                        <GitBranch className="w-3 h-3 text-brand-blue" />
                        {run.branch}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-mono font-extrabold text-[13px] ${scoreColor}`}>{run.qualityScore}%</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{run.duration}</td>
                    <td className="py-3.5 px-4">
                      {run.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-red-500/20 bg-red-500/10 text-[10px] font-semibold text-red-400">
                          <AlertCircle className="w-3 h-3" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{run.completedAt}</span>
                        <span className="text-[10px] text-brand-text-secondary/70 flex items-center gap-1 mt-0.5">
                          <User className="w-2.5 h-2.5" />
                          {run.triggeredBy}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right flex justify-end items-center gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/scans/${run.id}`)}
                        className="px-2.5 py-1.5 rounded-lg bg-brand-blue hover:bg-[#3d7eff] text-white text-[10.5px] font-bold border border-white/[0.08] transition-all cursor-pointer"
                      >
                        View Results
                      </button>
                      <button
                        onClick={() => onRetry && onRetry(run.id)}
                        disabled={loading}
                        className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.04] transition-all cursor-pointer"
                        aria-label="Retry scan"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="py-10 text-center text-brand-text-secondary">
                  No scan history fits the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ScanHistoryTable;
