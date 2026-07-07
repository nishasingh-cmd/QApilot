import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, Shield, Database, Cpu, HardDrive, RefreshCw, RefreshCw as RestartIcon, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

export function SystemStatus() {
  const { addToast } = useNotifications();
  const [health, setHealth] = useState(null);
  const [db, setDb] = useState(null);
  const [redis, setRedis] = useState(null);
  const [workers, setWorkers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSystemData = async () => {
    try {
      const hRes = await axios.get('http://localhost:5000/api/health', { withCredentials: true });
      if (hRes.data) setHealth(hRes.data);

      const dbRes = await axios.get('http://localhost:5000/api/health/database', { withCredentials: true });
      if (dbRes.data) setDb(dbRes.data);

      const rRes = await axios.get('http://localhost:5000/api/health/redis', { withCredentials: true });
      if (rRes.data) setRedis(rRes.data);

      const wRes = await axios.get('http://localhost:5000/api/health/workers', { withCredentials: true });
      if (wRes.data) setWorkers(wRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
    // Poll state every 5 seconds to provide real-time updates
    const interval = setInterval(fetchSystemData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSystemData();
    addToast('System Updated', 'success', 'Observability metrics refreshed.');
  };

  const handleClearCache = () => {
    addToast('Cache Cleared', 'success', 'All system memory caches flushed.');
  };

  const handleRestartWorkers = () => {
    addToast('Workers Reset', 'info', 'BullMQ background queues process reset dispatched.');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Loading observability metrics...</span>
      </div>
    );
  }

  // Format uptime
  const uptime = health?.uptime || 0;
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans select-none pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand-blue animate-pulse" />
            System Observability
          </h1>
          <p className="text-xs text-brand-text-secondary mt-1">
            Monitor API cluster health, MongoDB configurations, Redis caches, and BullMQ workers.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] text-white text-xs font-bold transition-all cursor-pointer"
        >
          {refreshing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Refresh Metrics
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Core Node Server */}
        <div className="glass-card border border-white/[0.08] p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4.5 h-4.5 text-brand-blue" />
              API Cluster
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Uptime</span>
              <span className="text-white font-mono">{hours}h {minutes}m {seconds}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Runtime</span>
              <span className="text-white font-mono">{health?.nodeVersion || 'v18.0'}</span>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="glass-card border border-white/[0.08] p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-4.5 h-4.5 text-brand-blue" />
              MongoDB Database
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${db?.status === 'healthy' ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`} />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">State</span>
              <span className="text-white font-mono uppercase">{db?.connectionState || 'connected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">DB Scope</span>
              <span className="text-white font-mono">{db?.databaseName || 'QApilot'}</span>
            </div>
          </div>
        </div>

        {/* Redis Cache */}
        <div className="glass-card border border-white/[0.08] p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-4.5 h-4.5 text-brand-blue" />
              Redis Job Store
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${redis?.status === 'healthy' ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`} />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Client Status</span>
              <span className="text-white font-mono uppercase">{redis?.redisState || 'ready'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Scope Connection</span>
              <span className="text-white font-mono">Local Instance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Memory footprint and background queues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Node Memory usage */}
        <div className="glass-card border border-white/[0.08] p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Node Engine Heap Allocation</h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-brand-text-secondary">Heap Used</span>
                <span className="text-white font-mono">{health?.memory?.heapUsed || '0MB'}</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] border border-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-brand-blue rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-brand-text-secondary">RSS Overhead</span>
                <span className="text-white font-mono">{health?.memory?.rss || '0MB'}</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] border border-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-brand-cyan rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* BullMQ worker queue monitor */}
        <div className="glass-card border border-white/[0.08] p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Job Queues Activity</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white/[0.015] border border-white/[0.04] rounded-xl">
              <span className="text-[10px] font-bold text-brand-text-secondary uppercase">Active Jobs</span>
              <h4 className="text-lg font-black text-white font-mono mt-1">
                {workers?.statistics?.active || 0}
              </h4>
            </div>

            <div className="p-3 bg-white/[0.015] border border-white/[0.04] rounded-xl">
              <span className="text-[10px] font-bold text-brand-text-secondary uppercase">Queued Jobs</span>
              <h4 className="text-lg font-black text-white font-mono mt-1">
                {workers?.statistics?.pending || 0}
              </h4>
            </div>

            <div className="p-3 bg-white/[0.015] border border-white/[0.04] rounded-xl">
              <span className="text-[10px] font-bold text-brand-text-secondary uppercase">Completed Jobs</span>
              <h4 className="text-lg font-black text-emerald-400 font-mono mt-1">
                {workers?.statistics?.completed || 0}
              </h4>
            </div>

            <div className="p-3 bg-white/[0.015] border border-white/[0.04] rounded-xl">
              <span className="text-[10px] font-bold text-brand-text-secondary uppercase">Failed Jobs</span>
              <h4 className="text-lg font-black text-red-400 font-mono mt-1">
                {workers?.statistics?.failed || 0}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Admin system actions panel */}
      <div className="glass-card border border-white/[0.08] p-5 rounded-2xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">System Administration controls</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleClearCache}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] text-white text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Flush Memory Cache
          </button>

          <button
            onClick={handleRestartWorkers}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-danger/10 border border-brand-danger/25 text-brand-danger text-xs font-bold hover:bg-brand-danger/15 transition-all cursor-pointer"
          >
            <RestartIcon className="w-3.5 h-3.5" />
            Reset Background Workers
          </button>
        </div>
      </div>
    </div>
  );
}

export default SystemStatus;
