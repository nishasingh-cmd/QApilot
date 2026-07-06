import React from 'react';
import { GitBranch, Clock, ArrowRight, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const SCANS_DATA = [
  {
    id: 'SCN-108',
    repo: 'qapilot-landing',
    branch: 'main',
    status: 'success',
    duration: '42s',
    score: '98',
    time: '5m ago'
  },
  {
    id: 'SCN-107',
    repo: 'acme-dashboard',
    branch: 'feat/auth-v2',
    status: 'warning',
    duration: '1m 12s',
    score: '84',
    time: '23m ago'
  },
  {
    id: 'SCN-106',
    repo: 'pilot-backend',
    branch: 'main',
    status: 'danger',
    duration: '18s',
    score: '42',
    time: '1h ago'
  },
  {
    id: 'SCN-105',
    repo: 'qapilot-landing',
    branch: 'release-1.0',
    status: 'success',
    duration: '55s',
    score: '96',
    time: '4h ago'
  },
];

export function RecentScansTable() {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-md shadow-xl overflow-hidden select-none">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[13.5px] font-bold text-white tracking-wide">Recent AI Scans</h3>
          <p className="text-[11px] text-brand-text-secondary">Audit history across active workspace repositories</p>
        </div>
        <Link 
          to="/dashboard/scans" 
          className="text-[11px] font-bold text-brand-blue hover:text-brand-cyan hover:underline transition-colors focus-visible:outline-none"
        >
          View all scans
        </Link>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.04] text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">
              <th className="py-2.5 px-3">Repository</th>
              <th className="py-2.5 px-3">Branch</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Duration</th>
              <th className="py-2.5 px-3 text-center">Score</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03] text-[12.5px] text-brand-text-secondary">
            {SCANS_DATA.map((scan) => (
              <tr 
                key={scan.id}
                className="hover:bg-white/[0.01] transition-colors duration-150 group"
              >
                {/* Repository details */}
                <td className="py-3 px-3 font-semibold text-white">
                  <div className="flex flex-col">
                    <span>{scan.repo}</span>
                    <span className="text-[9.5px] text-brand-text-muted font-mono mt-0.5">{scan.id}</span>
                  </div>
                </td>

                {/* Branch name */}
                <td className="py-3 px-3 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5 text-brand-text-secondary">
                    <GitBranch size={12} className="text-brand-text-muted" />
                    <span className="truncate max-w-[100px]">{scan.branch}</span>
                  </div>
                </td>

                {/* Status badges */}
                <td className="py-3 px-3">
                  {scan.status === 'success' && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold text-brand-success bg-brand-success/5 border-brand-success/15 select-none">
                      <CheckCircle2 size={10} />
                      Passed
                    </span>
                  )}
                  {scan.status === 'warning' && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold text-brand-warning bg-brand-warning/5 border-brand-warning/15 select-none">
                      <AlertCircle size={10} />
                      Warning
                    </span>
                  )}
                  {scan.status === 'danger' && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold text-brand-danger bg-brand-danger/5 border-brand-danger/15 select-none">
                      <XCircle size={10} />
                      Failed
                    </span>
                  )}
                </td>

                {/* Duration indicator */}
                <td className="py-3 px-3 text-brand-text-secondary">
                  <div className="flex items-center gap-1.5 font-mono text-[11.5px]">
                    <Clock size={12} className="text-brand-text-muted" />
                    <span>{scan.duration}</span>
                  </div>
                </td>

                {/* Quality Score display */}
                <td className="py-3 px-3 text-center">
                  <span 
                    className={cn(
                      "inline-block px-2 py-0.5 rounded font-mono text-[12px] font-extrabold",
                      scan.score >= 90 
                        ? 'text-brand-success bg-brand-success/10' 
                        : scan.score >= 70 
                        ? 'text-brand-warning bg-brand-warning/10' 
                        : 'text-brand-danger bg-brand-danger/10'
                    )}
                  >
                    {scan.score}
                  </span>
                </td>

                {/* Actions Trigger links */}
                <td className="py-3 px-3 text-right">
                  <Link
                    to={`/dashboard/scans`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-brand-blue/10 hover:border-brand-blue/20 hover:text-white transition-all text-[11px] font-bold"
                  >
                    <span>View details</span>
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
