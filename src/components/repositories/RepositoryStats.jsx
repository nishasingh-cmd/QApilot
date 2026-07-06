import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';

export function RepositoryStats({ repos }) {
  const total = repos.length;
  const healthy = repos.filter(r => r.status === 'healthy').length;
  const scanning = repos.filter(r => r.status === 'scanning').length;
  const attention = repos.filter(r => r.status === 'attention' || r.status === 'offline').length;

  const stats = [
    {
      label: 'Total Repositories',
      value: total,
      icon: FolderGit2,
      color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20',
    },
    {
      label: 'Healthy Repos',
      value: healthy,
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Active Scans',
      value: scanning,
      icon: Zap,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      label: 'Needs Attention',
      value: attention,
      icon: ShieldAlert,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md flex items-center justify-between hover:border-white/[0.12] transition-colors"
          >
            <div>
              <p className="text-[12px] uppercase tracking-wider text-brand-text-secondary font-medium">{stat.label}</p>
              <h3 className="text-2xl font-extrabold text-white mt-1.5 font-mono">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl border ${stat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
