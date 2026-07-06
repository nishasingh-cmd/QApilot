import React from 'react';
import { motion } from 'framer-motion';
import { GitFork, Zap, Users, BarChart3, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ACTIONS = [
  {
    title: 'Connect Repository',
    desc: 'Integrate active GitHub project directories.',
    icon: GitFork,
    to: '/dashboard/repos',
    color: 'group-hover:text-brand-blue bg-brand-blue/5 border-brand-blue/10 text-brand-blue',
  },
  {
    title: 'Start New Scan',
    desc: 'Initiate manual AI codebase code audit run.',
    icon: Zap,
    to: '/dashboard/scans',
    color: 'group-hover:text-brand-cyan bg-brand-cyan/5 border-brand-cyan/10 text-brand-cyan',
  },
  {
    title: 'Invite Team',
    desc: 'Add collaborators to active workspaces.',
    icon: Users,
    to: '/dashboard/team',
    color: 'group-hover:text-brand-success bg-brand-success/5 border-brand-success/10 text-brand-success',
  },
  {
    title: 'View Reports',
    desc: 'Check detailed bug analytics charts.',
    icon: BarChart3,
    to: '/dashboard/analytics',
    color: 'group-hover:text-brand-blue bg-brand-blue/5 border-brand-blue/10 text-brand-blue',
  },
];

export function QuickActions() {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-md shadow-xl select-none">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h3 className="text-[13.5px] font-bold text-white tracking-wide">Quick Actions</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">Shortcuts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {ACTIONS.map((act) => {
          const ActIcon = act.icon;
          return (
            <Link key={act.title} to={act.to} className="group">
              <motion.div
                whileHover={{ y: -3, borderColor: 'rgba(255, 255, 255, 0.12)' }}
                className="flex items-start gap-4 p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.025] transition-all duration-200"
              >
                <div className={`p-2 rounded-lg border shrink-0 transition-colors duration-200 ${act.color}`}>
                  <ActIcon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[12.5px] font-bold text-white group-hover:text-brand-blue transition-colors leading-snug">
                      {act.title}
                    </p>
                    <Plus size={11} className="text-brand-text-muted opacity-0 group-hover:opacity-100 group-hover:rotate-90 transition-all" />
                  </div>
                  <p className="text-[11px] text-brand-text-secondary leading-normal mt-0.5">
                    {act.desc}
                  </p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
