import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitFork, Zap, ShieldAlert, CloudLightning, Database, Sparkles } from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentScansTable } from '../components/dashboard/RecentScansTable';
import { AIInsightsCard } from '../components/dashboard/AIInsightsCard';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import axios from 'axios';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalRepositories: 8,
    activeRepositories: 12,
    healthScoreAverage: 92,
    recentlyUpdated: []
  });
  const [mode, setMode] = useState('simulator'); // 'live' or 'simulator'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/repositories/overview', {
          withCredentials: true
        });
        if (res.data) {
          setStats(res.data);
          setMode('live');
        }
      } catch (err) {
        console.warn('Dashboard live MERN API unavailable. Falling back to simulator mode.', err.message);
        setMode('simulator');
      }
    };
    fetchStats();
  }, []);

  const metrics = [
    {
      title: 'Connected Repositories',
      value: String(stats.totalRepositories),
      description: 'Active source control connections syncing code.',
      trend: mode === 'live' ? 'Database sync' : '+2',
      trendType: 'up',
      icon: GitFork,
    },
    {
      title: 'Active AI Scans',
      value: String(stats.activeRepositories),
      description: 'Scans run automatically on push/PR events.',
      trend: 'Continuous',
      trendType: 'up',
      icon: Zap,
    },
    {
      title: 'Quality Health Score',
      value: `${stats.healthScoreAverage}%`,
      description: 'Average repository code health index metric.',
      trend: mode === 'live' ? 'Live aggregate' : '-1.5%',
      trendType: 'up',
      icon: ShieldAlert,
    },
    {
      title: 'Deployment Success',
      value: '98.4%',
      description: 'Overall pipelines completing checks successfully.',
      trend: '99%',
      trendType: 'up',
      icon: CloudLightning,
    },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans pb-10 select-none">
      {/* Welcome Title Greetings block */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Welcome back, Nisha 👋
          </h2>
          <p className="text-[13px] text-brand-text-secondary">
            Here's what's happening across your repositories today.
          </p>
        </div>

        {/* MERN Database Connection Badge Indicator */}
        <div className="shrink-0 self-start sm:self-center">
          {mode === 'live' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
              <Database className="w-3 h-3" />
              Live DB Sync
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border bg-amber-500/10 border-amber-500/20 text-amber-400">
              <Sparkles className="w-3 h-3" />
              Simulator Mode
            </span>
          )}
        </div>
      </motion.div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {metrics.map((m, idx) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            description={m.description}
            trend={m.trend}
            trendType={m.trendType}
            icon={m.icon}
            index={idx}
          />
        ))}
      </div>

      {/* Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-start">
        {/* Left column panels - Scans & Actions (8 cols on desktop) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-5 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          >
            <QuickActions />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          >
            <RecentScansTable />
          </motion.div>
        </div>

        {/* Right column panels - AI Insights & Logs (4 cols on desktop) */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-5 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          >
            <AIInsightsCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.25 }}
          >
            <ActivityTimeline />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
