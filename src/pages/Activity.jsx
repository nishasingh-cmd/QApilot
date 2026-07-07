import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Terminal, GitPullRequest, GitFork, HelpCircle, Loader2, ChevronRight, RefreshCw, GitBranch, ShieldCheck, AlertCircle } from 'lucide-react';

export function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActivityLogs = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await axios.get('http://localhost:5000/api/repositories/activity/logs', { withCredentials: true });
      if (res.data) {
        setActivities(res.data);
      }
    } catch (err) {
      console.error('Failed to load repository activities:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 1. Initial Load & Polling every 15 seconds
  useEffect(() => {
    fetchActivityLogs();
    const interval = setInterval(() => {
      fetchActivityLogs();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (event) => {
    switch (event) {
      case 'push':
        return <GitFork className="w-4 h-4 text-brand-blue" />;
      case 'pull_request':
        return <GitPullRequest className="w-4 h-4 text-purple-400" />;
      case 'sync':
        return <RefreshCw className="w-4 h-4 text-emerald-400" />;
      case 'release':
        return <Terminal className="w-4 h-4 text-amber-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-brand-text-secondary" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            Processed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-brand-text-secondary bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
            <Loader2 className="w-3 h-3 animate-spin" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Retrieving workspace activity logs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-24 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-text-secondary text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <span>Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Activity Log</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Recent Repository Activity</h1>
          <p className="text-xs text-brand-text-secondary mt-1">
            Real-time auditable stream of webhook pushes, pull requests, branch additions, and automated scan completions.
          </p>
        </div>

        <button
          onClick={() => fetchActivityLogs(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] text-white text-xs font-bold transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Syncing...' : 'Refresh Logs'}
        </button>
      </div>

      {/* Main Table view */}
      <div className="glass-card rounded-2xl border border-white/[0.08] p-5 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.01] text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">
                <th className="py-3 px-4 w-28">Event</th>
                <th className="py-3 px-4">Repository</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Commit / Event Details</th>
                <th className="py-3 px-4 w-40">Author</th>
                <th className="py-3 px-4 w-44">Timestamp</th>
                <th className="py-3 px-4 w-36 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-xs text-brand-text-secondary font-medium">
                    No webhook activities or scans recorded. Connect GitHub webhooks to populate.
                  </td>
                </tr>
              ) : (
                activities.map((a, idx) => (
                  <motion.tr
                    key={a._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.015, 0.3) }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-white/[0.04] border border-white/[0.05]">
                          {getEventIcon(a.event)}
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                          {a.event.replace('_', ' ')}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-xs text-white">
                      {a.repository}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-brand-text-secondary">
                      <div className="flex items-center gap-1 font-mono">
                        <GitBranch className="w-3.5 h-3.5 shrink-0" />
                        <span>{a.branch}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-white font-medium max-w-[320px] truncate">
                      {a.commit || 'GitHub trigger event processed'}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-brand-text-secondary">
                      {a.author}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-brand-text-secondary font-mono">
                      {new Date(a.timestamp || a.createdAt).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(a.status)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Activity;
