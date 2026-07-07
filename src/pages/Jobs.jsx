import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, RefreshCcw, CheckCircle, AlertTriangle, Play, ChevronRight, Loader2, BarChart2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

export function Jobs() {
  const { addToast } = useNotifications();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState({});

  const fetchJobs = async (isManual = false) => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', { withCredentials: true });
      if (res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to retrieve background jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Poll background jobs status every 5 seconds
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(() => {
      fetchJobs();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRetry = async (jobId) => {
    setRetrying((prev) => ({ ...prev, [jobId]: true }));
    try {
      await axios.post(`http://localhost:5000/api/jobs/${jobId}/retry`, {}, { withCredentials: true });
      addToast('Job Retry Initiated', 'success', 'Background worker task scheduled for re-execution.');
      fetchJobs();
    } catch (err) {
      console.error(err);
      addToast('Retry Failed', 'error', 'Unable to schedule job re-execution.');
    } finally {
      setRetrying((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertTriangle className="w-3 h-3" />
            Failed
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/5 border border-white/10 text-brand-text-secondary">
            Pending
          </span>
        );
    }
  };

  const calculateDuration = (started, completed) => {
    if (!started) return 'N/A';
    const end = completed ? new Date(completed) : new Date();
    const duration = Math.max(0, Math.round((end - new Date(started)) / 1000));
    return `${duration}s`;
  };

  const counts = {
    running: jobs.filter((j) => j.status === 'processing' || j.status === 'pending').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Connecting to background job server...</span>
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
            <span className="text-white">Background Jobs</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Queue Monitor & Workers</h1>
          <p className="text-xs text-brand-text-secondary mt-1">
            Real-time visual monitoring system for BullMQ Redis clusters, worker concurrency, and failed task processing.
          </p>
        </div>

        <button
          onClick={() => fetchJobs(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] text-white text-xs font-bold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Stats
        </button>
      </div>

      {/* Grid Stats counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-brand-text-secondary">Running Tasks</span>
            <h3 className="text-2xl font-black text-white mt-1">{counts.running}</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-brand-blue/15 flex items-center justify-center text-brand-blue">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-brand-text-secondary">Completed</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{counts.completed}</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-brand-text-secondary">Failed Tasks</span>
            <h3 className="text-2xl font-black text-red-400 mt-1">{counts.failed}</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Jobs listing */}
      <div className="glass-card rounded-2xl border border-white/[0.08] p-5 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.01] text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">
                <th className="py-3 px-4">Queue Name</th>
                <th className="py-3 px-4">Job ID</th>
                <th className="py-3 px-4 w-48">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4 w-28 text-center">Duration</th>
                <th className="py-3 px-4">Details / Errors</th>
                <th className="py-3 px-4 w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-xs text-brand-text-secondary font-medium">
                    No active background jobs logged in queue database.
                  </td>
                </tr>
              ) : (
                jobs.map((j, idx) => (
                  <motion.tr
                    key={j._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.015, 0.3) }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-white/[0.03] border border-white/[0.05] text-brand-blue">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                          {j.queue}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-brand-text-secondary">
                      {j.jobId}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(j.status)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 max-w-[200px]">
                        <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              j.status === 'failed' ? 'bg-red-400' : 'bg-brand-blue animate-pulse'
                            }`}
                            style={{ width: `${j.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-white font-bold">{j.progress || 0}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center text-xs text-brand-text-secondary font-mono">
                      {calculateDuration(j.startedAt || j.createdAt, j.completedAt)}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-medium max-w-[250px] truncate">
                      {j.status === 'failed' ? (
                        <span className="text-red-400 font-semibold" title={j.failedReason}>
                          {j.failedReason}
                        </span>
                      ) : (
                        <span className="text-brand-text-secondary">
                          Created: {new Date(j.createdAt).toLocaleTimeString()}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {j.status === 'failed' ? (
                        <button
                          onClick={() => handleRetry(j.jobId)}
                          disabled={retrying[j.jobId]}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue/90 text-white text-[10px] font-bold uppercase transition-all shadow-md shadow-brand-blue/10 cursor-pointer disabled:opacity-50"
                        >
                          {retrying[j.jobId] ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                          Retry
                        </button>
                      ) : (
                        <span className="text-[10px] text-brand-text-muted font-bold tracking-wide uppercase">-</span>
                      )}
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

export default Jobs;
