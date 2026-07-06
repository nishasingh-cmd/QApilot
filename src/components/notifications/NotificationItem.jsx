import React from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../../context/NotificationsContext';
import {
  Play, CheckCircle2, ShieldAlert, GitFork, Sparkles, FileText, Bell, CloudLightning, Eye, Check
} from 'lucide-react';

const CONFIG_MAP = {
  scan_started:     { icon: Play,           color: 'text-brand-blue',   bg: 'bg-brand-blue/10 border-brand-blue/20' },
  scan_completed:   { icon: CheckCircle2,   color: 'text-emerald-400',  bg: 'bg-emerald-500/10 border-emerald-500/20' },
  critical_issue:   { icon: ShieldAlert,    color: 'text-red-400',      bg: 'bg-red-500/10 border-red-500/20' },
  repo_connected:   { icon: GitFork,        color: 'text-white',        bg: 'bg-white/5 border-white/10' },
  ai_insight:       { icon: Sparkles,       color: 'text-purple-400',   bg: 'bg-purple-500/10 border-purple-500/20' },
  report_ready:     { icon: FileText,       color: 'text-brand-cyan',   bg: 'bg-brand-cyan/10 border-brand-cyan/20' },
  system_alert:     { icon: Bell,           color: 'text-slate-400',    bg: 'bg-slate-500/10 border-slate-500/20' },
  deployment_event: { icon: CloudLightning, color: 'text-amber-400',    bg: 'bg-amber-500/10 border-amber-500/20' },
};

export function NotificationItem({ notification, compact = false }) {
  const { markAsRead } = useNotifications();
  const { id, type, title, description, timestamp, repo, severity, read } = notification;

  const cfg = CONFIG_MAP[type] || CONFIG_MAP.system_alert;
  const EventIcon = cfg.icon;

  return (
    <motion.div
      layout
      whileHover={{ y: -1, borderColor: 'rgba(255, 255, 255, 0.1)' }}
      className={`relative p-4 rounded-xl border flex gap-3.5 items-start transition-all duration-150 text-left select-none ${
        read
          ? 'bg-white/[0.005] border-white/[0.04]'
          : 'bg-white/[0.02] border-white/[0.08] shadow-sm shadow-brand-blue/[0.01]'
      }`}
    >
      {/* Unread Indicator dot */}
      {!read && (
        <span className="absolute top-4.5 right-4 w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
      )}

      {/* Left Icon */}
      <div className={`p-2 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${cfg.color} ${cfg.bg}`}>
        <EventIcon className="w-4 h-4" />
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className={`text-xs font-bold leading-snug ${read ? 'text-white/80' : 'text-white'}`}>
            {title}
          </h4>
          {severity === 'critical' && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-500/10 border border-red-500/20 text-red-400">
              Critical
            </span>
          )}
        </div>
        <p className="text-[11px] text-brand-text-secondary mt-1 leading-relaxed">
          {description}
        </p>

        {/* Meta details footer */}
        {!compact && (
          <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[10px] text-brand-text-secondary/60">
            <span className="font-mono">{timestamp}</span>
            {repo && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <div className="flex items-center gap-1 font-mono text-brand-text-secondary">
                  <GitFork className="w-3 h-3 text-brand-text-secondary/50" />
                  <span>{repo}</span>
                </div>
              </>
            )}
            {!read && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <button
                  onClick={() => markAsRead(id)}
                  className="flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:text-brand-blue/80 transition-colors"
                >
                  <Check className="w-3 h-3" />
                  Mark read
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
export default NotificationItem;
