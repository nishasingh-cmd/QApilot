import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Layers, Loader2, Play, ChevronRight, CheckCircle, Database } from 'lucide-react';

export function Usage() {
  const [usage, setUsage] = useState(null);
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const usageRes = await axios.get('http://localhost:5000/api/usage', { withCredentials: true });
        if (usageRes.data) {
          setUsage(usageRes.data);
        }

        const subRes = await axios.get('http://localhost:5000/api/billing/subscription', { withCredentials: true });
        if (subRes.data) {
          setSub(subRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsageData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Loading workspace usage counters...</span>
      </div>
    );
  }

  const plan = sub?.planId || {
    repositoryLimit: 5,
    scanLimit: 10,
    aiCredits: 10,
    deploymentLimit: 5,
    reportLimit: 5
  };

  const meters = [
    { title: 'Connected Repositories', used: usage?.repositoriesUsed || 0, limit: plan.repositoryLimit, color: 'bg-brand-blue' },
    { title: 'Monthly Scans Quota', used: usage?.scansUsed || 0, limit: plan.scanLimit, color: 'bg-brand-cyan' },
    { title: 'AI Assistant Prompts', used: usage?.aiRequests || 0, limit: plan.aiCredits, color: 'bg-brand-blue' },
    { title: 'CI/CD Deployments Triggered', used: usage?.deployments || 0, limit: plan.deploymentLimit, color: 'bg-brand-blue' },
    { title: 'AI Reports Downloads', used: usage?.reportsGenerated || 0, limit: plan.reportLimit, color: 'bg-brand-blue' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans select-none pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-text-secondary text-[11px] font-bold uppercase tracking-wider mb-1.5">
          <span>Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Usage Dashboard</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Database className="w-6 h-6 text-brand-blue" />
          Active Usage Meters
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">
          Review active resource consumption matching plan tier configurations.
        </p>
      </div>

      {/* Grid */}
      <div className="glass-card border border-white/[0.08] p-6 rounded-3xl space-y-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Plan Resource Limits Consumption</h3>

        <div className="space-y-5">
          {meters.map((m) => {
            const percent = Math.min(100, Math.round((m.used / (m.limit || 1)) * 100));
            return (
              <div key={m.title} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-brand-text-primary">{m.title}</span>
                  <span className="text-white font-mono">
                    {m.used} / {m.limit} ({percent}%)
                  </span>
                </div>
                {/* Bar */}
                <div className="h-2 w-full bg-white/[0.03] border border-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-full rounded-full ${m.color}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Usage;
