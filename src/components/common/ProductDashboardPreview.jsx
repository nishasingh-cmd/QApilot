import React from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch, ShieldCheck, Zap, AlertTriangle,
  CheckCircle2, Clock, Activity, TrendingUp, ChevronRight
} from 'lucide-react';

// ── Mini sparkline bar chart ───────────────────────────────────────────────
function SparkBar({ value, max = 100, color = 'bg-brand-blue' }) {
  return (
    <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

// ── Circular progress ring ─────────────────────────────────────────────────
function ScoreRing({ score, color = '#4F8CFF', label }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg width="64" height="64" className="-rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <motion.circle
            cx="32" cy="32" r={r} fill="none"
            stroke={color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - filled }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.6 }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">{score}</span>
      </div>
      <span className="text-[11px] text-brand-text-muted font-medium">{label}</span>
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    passing: { color: 'bg-brand-success/15 text-brand-success border-brand-success/20', dot: 'bg-brand-success', label: 'Passing' },
    warning: { color: 'bg-brand-warning/15 text-brand-warning border-brand-warning/20', dot: 'bg-brand-warning', label: 'Warning' },
    deployed: { color: 'bg-brand-blue/15 text-brand-blue border-brand-blue/20', dot: 'bg-brand-blue', label: 'Deployed' },
    scanning: { color: 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/20', dot: 'bg-brand-cyan animate-pulse', label: 'Scanning' },
  };
  const s = map[status] || map.passing;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function ProductDashboardPreview() {
  const repos = [
    { name: 'web-app', branch: 'main', status: 'deployed', bugs: 0 },
    { name: 'api-service', branch: 'feat/auth', status: 'scanning', bugs: 2 },
    { name: 'ui-library', branch: 'main', status: 'passing', bugs: 0 },
  ];

  const recentScans = [
    { repo: 'web-app', time: '2m ago', score: 98, status: 'passing' },
    { repo: 'api-service', time: '11m ago', score: 72, status: 'warning' },
    { repo: 'ui-library', time: '34m ago', score: 95, status: 'passing' },
  ];

  const bugDist = [
    { label: 'Critical', value: 1, max: 10, color: 'bg-brand-danger' },
    { label: 'High', value: 3, max: 10, color: 'bg-brand-warning' },
    { label: 'Medium', value: 6, max: 10, color: 'bg-brand-blue' },
    { label: 'Low', value: 9, max: 10, color: 'bg-brand-success' },
  ];

  const insights = [
    { icon: AlertTriangle, text: 'Auth token expiry not handled in /api/refresh', severity: 'critical' },
    { icon: Zap, text: 'Unoptimized image render in HeroSection detected', severity: 'medium' },
    { icon: CheckCircle2, text: 'All 143 unit tests passed successfully', severity: 'success' },
  ];

  const timeline = [
    { time: '09:41', event: 'Push to feat/auth by @maya', type: 'push' },
    { time: '09:42', event: 'AI scan triggered — 14 files changed', type: 'scan' },
    { time: '09:43', event: '2 issues flagged, report generated', type: 'report' },
  ];

  const insightColor = { critical: 'text-brand-danger', medium: 'text-brand-warning', success: 'text-brand-success' };

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      className="w-full max-w-[540px] rounded-2xl border border-white/[0.08] bg-[#0B0F1A] shadow-2xl shadow-black/60 overflow-hidden"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
        <div className="w-3 h-3 rounded-full bg-brand-danger/70" />
        <div className="w-3 h-3 rounded-full bg-brand-warning/70" />
        <div className="w-3 h-3 rounded-full bg-brand-success/70" />
        <span className="ml-2 text-[11px] text-brand-text-muted font-mono">QAPilot — Dashboard</span>
        <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-blue/10 border border-brand-blue/20">
          <Activity size={10} className="text-brand-cyan" />
          <span className="text-[10px] text-brand-cyan font-semibold">Live</span>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3 max-h-[520px] overflow-y-auto scrollbar-thin">

        {/* Repository Overview */}
        <div className="col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-text-muted mb-2.5 flex items-center gap-2">
            <GitBranch size={11} /> Repositories
          </p>
          <div className="flex flex-col gap-2">
            {repos.map((r) => (
              <div key={r.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[12px] font-semibold text-white truncate">{r.name}</span>
                  <span className="text-[10px] text-brand-text-muted font-mono hidden sm:block">{r.branch}</span>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Bug Distribution */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-text-muted mb-3 flex items-center gap-1.5">
            <AlertTriangle size={11} /> Bugs
          </p>
          <div className="flex flex-col gap-2">
            {bugDist.map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="text-[10px] text-brand-text-muted w-12 shrink-0">{b.label}</span>
                <SparkBar value={b.value} max={b.max} color={b.color} />
                <span className="text-[10px] font-bold text-white w-4 text-right">{b.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Score Cards */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex flex-col items-center gap-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-text-muted self-start flex items-center gap-1.5">
            <TrendingUp size={11} /> Scores
          </p>
          <div className="flex gap-4 justify-center">
            <ScoreRing score={98} color="#4F8CFF" label="Perf" />
            <ScoreRing score={87} color="#4FD1FF" label="A11y" />
          </div>
        </div>

        {/* Recent Scans */}
        <div className="col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-text-muted mb-2.5 flex items-center gap-1.5">
            <Clock size={11} /> Recent Scans
          </p>
          <div className="flex flex-col gap-1.5">
            {recentScans.map((s) => (
              <div key={s.repo} className="flex items-center gap-2 text-[11px]">
                <span className="text-white font-semibold w-20 truncate">{s.repo}</span>
                <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.score}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.8 }}
                    className={`h-full rounded-full ${s.score > 90 ? 'bg-brand-success' : 'bg-brand-warning'}`}
                  />
                </div>
                <span className="text-white font-bold w-6 text-right">{s.score}</span>
                <span className="text-brand-text-muted w-10 text-right">{s.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="col-span-2 rounded-xl border border-brand-blue/10 bg-brand-blue/[0.04] p-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-blue mb-2.5 flex items-center gap-1.5">
            <ShieldCheck size={11} /> AI Insights
          </p>
          <div className="flex flex-col gap-2">
            {insights.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <div key={i} className="flex items-start gap-2">
                  <Icon size={12} className={`shrink-0 mt-0.5 ${insightColor[ins.severity]}`} />
                  <span className="text-[11px] text-brand-text-secondary leading-snug">{ins.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-text-muted mb-2.5 flex items-center gap-1.5">
            <Activity size={11} /> Activity
          </p>
          <div className="flex flex-col gap-2">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[11px]">
                <span className="text-brand-text-muted font-mono shrink-0 mt-0.5">{t.time}</span>
                <div className="flex items-center gap-1.5 flex-1">
                  <ChevronRight size={10} className="text-brand-blue shrink-0" />
                  <span className="text-brand-text-secondary">{t.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
