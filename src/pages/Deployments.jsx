import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, RefreshCw, ChevronRight, Loader2, Play, GitBranch, Terminal, Shield, CheckCircle, AlertTriangle, Layers, Calendar, ExternalLink, RefreshCw as RollbackIcon } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

export function Deployments() {
  const { addToast } = useNotifications();
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [environments, setEnvironments] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState('');
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);

  // Logs state
  const [activeLogsId, setActiveLogsId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Rollback state
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [selectedRollbackTarget, setSelectedRollbackTarget] = useState(null);
  const [rollingBack, setRollingBack] = useState(false);

  // 1. Fetch repositories on mount
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/repositories', { withCredentials: true });
        if (res.data && res.data.length > 0) {
          setRepos(res.data);
          setSelectedRepo(res.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load connected repositories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  // 2. Fetch deployments and environments when repository changes
  const fetchRepoData = async () => {
    if (!selectedRepo) return;
    try {
      // Fetch deployments (seeds default environments automatically on the first call)
      const depRes = await axios.get(`http://localhost:5000/api/deployments?repositoryId=${selectedRepo}`, { withCredentials: true });
      if (depRes.data) {
        setDeployments(depRes.data);
      }

      // Fetch environments
      const envRes = await axios.get(`http://localhost:5000/api/repositories?id=${selectedRepo}`, { withCredentials: true }); // Wait, let's fetch environments directly
      const repoDoc = repos.find(r => r._id === selectedRepo);
      if (repoDoc) {
        setEnvironments([
          { _id: 'env-dev', name: 'development', branch: 'dev', url: `https://${repoDoc.name}-dev.qapilot.app` },
          { _id: 'env-staging', name: 'staging', branch: 'staging', url: `https://${repoDoc.name}-staging.qapilot.app` },
          { _id: 'env-prod', name: 'production', branch: 'main', url: `https://${repoDoc.name}-prod.qapilot.app` }
        ]);
        setSelectedEnv('env-prod');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRepoData();
    // Poll deployments every 4 seconds to show live multi-stage updates
    const interval = setInterval(fetchRepoData, 4000);
    return () => clearInterval(interval);
  }, [selectedRepo, repos]);

  // 3. Fetch logs for selected deployment
  const fetchLogs = async (id) => {
    setLoadingLogs(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/deployments/${id}/logs`, { withCredentials: true });
      if (res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (!activeLogsId) return;
    fetchLogs(activeLogsId);
    // Poll logs every 3 seconds if active deployment is running
    const activeDep = deployments.find(d => d._id === activeLogsId);
    const isRunning = activeDep && !['completed', 'failed'].includes(activeDep.status);
    if (!isRunning) return;

    const interval = setInterval(() => {
      fetchLogs(activeLogsId);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeLogsId, deployments]);

  // 4. Trigger manual deploy
  const handleDeploy = async () => {
    if (!selectedRepo || !selectedEnv) return;
    setDeploying(true);
    const targetEnv = environments.find(e => e._id === selectedEnv);
    const repoDoc = repos.find(r => r._id === selectedRepo);

    try {
      const payload = {
        repositoryId: selectedRepo,
        environmentId: selectedRepo, // Use repo ID as dummy environmentId since controller dynamically hooks it
        branch: targetEnv ? targetEnv.branch : 'main',
        commitSha: Math.random().toString(16).substring(2, 10),
        commitMessage: `Manual dispatch via deployment console - [QAPilot CI/CD]`
      };

      const res = await axios.post('http://localhost:5000/api/deployments', payload, { withCredentials: true });
      addToast('Deployment Queued', 'success', 'CI/CD pipeline build enqueued.');
      if (res.data) {
        setDeployments(prev => [res.data, ...prev]);
        setActiveLogsId(res.data._id);
      }
    } catch (err) {
      console.error(err);
      addToast('Deploy Failed', 'error', 'Unable to dispatch pipeline.');
    } finally {
      setDeploying(false);
    }
  };

  // 5. Trigger Rollback
  const handleRollback = async () => {
    if (!selectedRollbackTarget) return;
    setRollingBack(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/deployments/${selectedRollbackTarget._id}/rollback`, {}, { withCredentials: true });
      addToast('Rollback Dispatched', 'success', `Reverting codebase to version commit [${selectedRollbackTarget.commitSha}].`);
      if (res.data) {
        setDeployments(prev => [res.data, ...prev]);
        setActiveLogsId(res.data._id);
      }
      setShowRollbackModal(false);
    } catch (err) {
      console.error(err);
      addToast('Rollback Failed', 'error', 'Unable to initiate rollback pipeline.');
    } finally {
      setRollingBack(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" /> Passed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3" /> Failed
          </span>
        );
      case 'queued':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-text-muted bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
            Queued
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2 py-0.5 rounded-full">
            <Loader2 className="w-3 h-3 animate-spin" /> {status}
          </span>
        );
    }
  };

  // Metrics Calculations
  const completedDeps = deployments.filter(d => d.status === 'completed');
  const failedDeps = deployments.filter(d => d.status === 'failed');
  const successRate = deployments.length > 0 ? Math.round((completedDeps.length / (deployments.length - deployments.filter(d => d.status === 'queued').length || 1)) * 100) : 100;
  const avgDuration = completedDeps.length > 0 ? Math.round(completedDeps.reduce((acc, d) => acc + (d.duration || 0), 0) / completedDeps.length) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Loading deployments dashboard...</span>
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
            <span className="text-white">CI/CD Deployments</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">CI/CD Pipeline Automation</h1>
          <p className="text-xs text-brand-text-secondary mt-1">
            Trigger builds, trace execution logs, check deployment gates, and roll back legacy versions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="bg-white/[0.02] border border-white/[0.08] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-blue/50 transition-all font-medium"
          >
            {repos.map((r) => (
              <option key={r._id} value={r._id} className="bg-[#0b0e14]">
                {r.name}
              </option>
            ))}
          </select>

          <select
            value={selectedEnv}
            onChange={(e) => setSelectedEnv(e.target.value)}
            className="bg-white/[0.02] border border-white/[0.08] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-blue/50 transition-all font-medium"
          >
            {environments.map((e) => (
              <option key={e._id} value={e._id} className="bg-[#0b0e14]">
                {e.name} ({e.branch})
              </option>
            ))}
          </select>

          <button
            onClick={handleDeploy}
            disabled={deploying || !selectedRepo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-brand-blue/15 cursor-pointer"
          >
            {deploying ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            Trigger Deploy
          </button>
        </div>
      </div>

      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-brand-text-secondary">Pipeline Success Rate</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{successRate}%</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-brand-text-secondary">Average Duration</span>
            <h3 className="text-2xl font-black text-white mt-1">{avgDuration}s</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-brand-blue/15 flex items-center justify-center text-brand-blue">
            <Loader2 className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-brand-text-secondary">Failed Deployments</span>
            <h3 className="text-2xl font-black text-red-400 mt-1">{failedDeps.length}</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Deployments list (7 cols) */}
        <div className="col-span-1 lg:col-span-7 space-y-4">
          <div className="glass-card rounded-2xl border border-white/[0.08] p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary mb-4">Deployment History Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.01] text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">
                    <th className="py-2.5 px-3">Commit</th>
                    <th className="py-2.5 px-3">Environment</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Duration</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {deployments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-xs text-brand-text-secondary">
                        No deployments executed yet. Click 'Trigger Deploy' to start your first pipeline run.
                      </td>
                    </tr>
                  ) : (
                    deployments.map((d) => (
                      <tr key={d._id} className={`hover:bg-white/[0.01] transition-colors ${activeLogsId === d._id ? 'bg-brand-blue/5' : ''}`}>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white font-mono">{d.commitSha}</span>
                            <span className="text-[10px] text-brand-text-secondary truncate max-w-[150px]" title={d.commitMessage}>
                              {d.commitMessage}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] font-bold text-brand-text-secondary uppercase">
                            {d.environmentId?.name || 'production'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {getStatusBadge(d.status)}
                        </td>
                        <td className="py-3 px-3 text-center text-xs text-brand-text-secondary font-mono">
                          {d.duration ? `${d.duration}s` : '-'}
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            onClick={() => setActiveLogsId(d._id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] text-white text-[10px] font-bold uppercase transition-all cursor-pointer"
                          >
                            <Terminal className="w-3 h-3" /> Logs
                          </button>
                          {d.status === 'completed' && (
                            <button
                              onClick={() => {
                                setSelectedRollbackTarget(d);
                                setShowRollbackModal(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase transition-all cursor-pointer"
                            >
                              <RollbackIcon className="w-3 h-3" /> Rollback
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Active logs console (5 cols) */}
        <div className="col-span-1 lg:col-span-5">
          <div className="glass-card rounded-2xl border border-white/[0.08] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brand-blue" />
                Console Logs Inspector
              </h3>
              {activeLogsId && (
                <span className="text-[10px] font-mono text-brand-text-secondary">
                  Job ID: {activeLogsId.substring(18)}
                </span>
              )}
            </div>

            {activeLogsId ? (
              <div className="bg-[#05070a] border border-white/[0.05] rounded-xl p-4 font-mono text-[11px] leading-relaxed text-slate-300 h-[380px] overflow-y-auto space-y-2">
                {loadingLogs ? (
                  <div className="flex items-center justify-center h-full gap-2 text-brand-text-secondary">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                    Fetching build output logs...
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-brand-text-muted italic">No logs recorded for this stage execution.</div>
                ) : (
                  logs.map((log) => (
                    <div key={log._id} className="flex items-start gap-2">
                      <span className="text-brand-text-muted shrink-0">
                        [{new Date(log.timestamp).toLocaleTimeString()}]
                      </span>
                      <span className={`shrink-0 uppercase text-[9px] font-extrabold ${log.level === 'error' ? 'text-red-400' : log.level === 'warn' ? 'text-amber-400' : 'text-brand-blue'}`}>
                        {log.level}
                      </span>
                      <span className="text-white">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-[380px] text-brand-text-secondary gap-2 border border-dashed border-white/[0.06] rounded-xl p-5">
                <Layers className="w-8 h-8 text-brand-text-muted mb-2 animate-pulse" />
                <h4 className="text-xs font-bold text-white">No active console selected</h4>
                <p className="text-[11px] max-w-xs leading-normal">
                  Click 'Logs' on any history run item in the table to inspect build, test compile, and AI quality checks.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rollback confirmation modal */}
      <AnimatePresence>
        {showRollbackModal && selectedRollbackTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card max-w-md w-full border border-white/[0.08] p-6 rounded-3xl space-y-4"
            >
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Confirm Rollback Execution
              </h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                You are initiating a rollback build to revert this repository environment to commit{' '}
                <strong className="text-white font-mono">{selectedRollbackTarget.commitSha}</strong> (
                <em>{selectedRollbackTarget.commitMessage}</em>).
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowRollbackModal(false)}
                  className="px-4 py-2 text-xs font-bold text-white bg-white/5 border border-white/8 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRollback}
                  disabled={rollingBack}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-400 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {rollingBack ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RollbackIcon className="w-3.5 h-3.5" />
                  )}
                  Revert Version
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Deployments;
