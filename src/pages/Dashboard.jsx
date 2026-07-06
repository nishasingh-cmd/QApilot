import React from 'react';
import { motion } from 'framer-motion';
import { GitFork, Zap, ShieldAlert, CloudLightning } from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentScansTable } from '../components/dashboard/RecentScansTable';
import { AIInsightsCard } from '../components/dashboard/AIInsightsCard';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';

export function Dashboard() {
  const metrics = [
    {
      title: 'Connected Repositories',
      value: '8',
      description: 'Active source control connections syncing code.',
      trend: '+2',
      trendType: 'up',
      icon: GitFork,
    },
    {
      title: 'Active AI Scans',
      value: '12',
      description: 'Scans run automatically on push/PR events.',
      trend: 'Continuous',
      trendType: 'up',
      icon: Zap,
    },
    {
      title: 'Critical Bugs',
      value: '3',
      description: 'Detected security risks or functional gaps.',
      trend: '-12%',
      trendType: 'up', // showing down is positive trend here, but we will style trend color appropriately
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
    <div className="flex flex-col gap-6 md:gap-8 font-sans pb-10">
      {/* Welcome Title Greetings block */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col gap-1 select-none"
      >
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
          Welcome back, Nisha 👋
        </h2>
        <p className="text-[13px] text-brand-text-secondary">
          Here's what's happening across your repositories today.
        </p>
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
