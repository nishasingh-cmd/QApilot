import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { AnalyticsFilters } from '../components/analytics/AnalyticsFilters';
import { AnalyticsMetricCard } from '../components/analytics/AnalyticsMetricCard';
import { QualityTrendChart } from '../components/analytics/QualityTrendChart';
import { SeverityChart } from '../components/analytics/SeverityChart';
import { CategoryChart } from '../components/analytics/CategoryChart';
import { RepositoryHealthCard } from '../components/analytics/RepositoryHealthCard';
import { AIPerformanceCard } from '../components/analytics/AIPerformanceCard';
import { TeamLeaderboard } from '../components/analytics/TeamLeaderboard';
import { ExecutiveSummary } from '../components/analytics/ExecutiveSummary';
import { ExportAnalyticsModal } from '../components/analytics/ExportAnalyticsModal';
import {
  Sparkles,
  TrendingUp,
  Percent,
  AlertTriangle,
  CheckCircle2,
  GitFork,
  Target,
  ChevronRight,
  Download,
  Loader2,
} from 'lucide-react';

export function Analytics() {
  const {
    timeframe,
    setTimeframe,
    overview,
    qualityTrends,
    repoHealth,
    teamMetrics,
    aiAnalytics,
    loading,
    error,
    setExportOpen,
  } = useAnalytics();

  if (loading && !overview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Computing repository insights...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-400 font-semibold border border-red-500/20 bg-red-500/10 rounded-xl">
        {error}
      </div>
    );
  }

  const metricCards = [
    {
      label: 'Overall Quality Score',
      value: `${overview?.metrics.qualityScore}%`,
      icon: Target,
      color: 'text-brand-blue',
      bg: 'bg-brand-blue/10 border-brand-blue/20',
      desc: 'Aggregated code health & security ranking',
    },
    {
      label: 'Average Test Coverage',
      value: `${overview?.metrics.testCoverage}%`,
      icon: Percent,
      color: 'text-brand-cyan',
      bg: 'bg-brand-cyan/10 border-brand-cyan/20',
      desc: 'Proportion of statements executed in pipelines',
    },
    {
      label: 'Open Findings',
      value: overview?.metrics.openFindings,
      icon: AlertTriangle,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
      desc: 'Active issues awaiting triage resolution',
    },
    {
      label: 'Resolved This Week',
      value: overview?.metrics.resolvedThisWeek,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      desc: 'Total issues closed across all branches',
    },
    {
      label: 'Repositories Monitored',
      value: overview?.metrics.reposMonitored,
      icon: GitFork,
      color: 'text-white',
      bg: 'bg-white/5',
      desc: 'Active codebase connections checked',
    },
    {
      label: 'AI Accuracy Score',
      value: `${overview?.metrics.aiAccuracy}%`,
      icon: Sparkles,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      desc: 'Percentage of issues verified correct',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-24 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-text-secondary text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <span>Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Analytics</h1>
          <p className="text-xs text-brand-text-secondary mt-1">
            Track engineering quality, AI effectiveness and repository health through actionable insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AnalyticsFilters value={timeframe} onChange={setTimeframe} />
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold transition-all shadow-lg shadow-brand-blue/20"
          >
            <Download className="w-4 h-4" />
            Export Dashboard
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metricCards.map((m) => (
          <AnalyticsMetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            icon={m.icon}
            colorClass={m.color}
            bgClass={m.bg}
            description={m.desc}
          />
        ))}
      </div>

      {/* Quality Trends Line Chart Panel */}
      <div className="glass-card p-5 rounded-2xl border border-white/[0.08]">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Quality Trends</h3>
            <p className="text-[10px] text-brand-text-secondary mt-0.5">Historical overview of key codebase health markers.</p>
          </div>
          <TrendingUp className="w-4 h-4 text-brand-text-secondary/50" />
        </div>
        <QualityTrendChart data={qualityTrends} />
      </div>

      {/* Findings Split Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-white/[0.08]">
          <div className="border-b border-white/[0.06] pb-3.5 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Findings by Severity</h3>
          </div>
          {aiAnalytics && <SeverityChart data={aiAnalytics.severity} />}
        </div>
        <div className="glass-card p-5 rounded-2xl border border-white/[0.08]">
          <div className="border-b border-white/[0.06] pb-3.5 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Findings by Category</h3>
          </div>
          {aiAnalytics && <CategoryChart data={aiAnalytics.category} />}
        </div>
      </div>

      {/* Repository Health Scorecards */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-brand-blue to-brand-cyan" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-text-secondary">Repository Health</h3>
        </div>
        <RepositoryHealthCard repos={repoHealth} />
      </div>

      {/* Team Productivity & AI Performance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Leaderboard */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-white/[0.08] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Developer Productivity</h3>
            <p className="text-[10px] text-brand-text-secondary mt-0.5">Resolution efficiency and contribution rank.</p>
          </div>
          {teamMetrics && <TeamLeaderboard members={teamMetrics.productivity} />}
        </div>

        {/* AI Performance */}
        <div className="glass-card p-5 rounded-2xl border border-white/[0.08] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">AI Engine Benchmarks</h3>
            <p className="text-[10px] text-brand-text-secondary mt-0.5">Detection efficiency, accuracy ratios and false rates.</p>
          </div>
          {aiAnalytics && <AIPerformanceCard performance={aiAnalytics.performance} />}
        </div>
      </div>

      {/* Executive Summary */}
      {overview && <ExecutiveSummary summary={overview.summary} />}

      {/* Export modal */}
      <ExportAnalyticsModal />
    </div>
  );
}
export default Analytics;
