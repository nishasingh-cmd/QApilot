import React from 'react';
import { 
  Play, 
  GitBranch, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  User, 
  ExternalLink 
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function Dashboard() {
  const metrics = [
    { title: 'Total Audits', value: '1,284', detail: '+12% this week', variant: 'primary' },
    { title: 'Test Coverage', value: '96.4%', detail: 'High stability', variant: 'success' },
    { title: 'Active Anomalies', value: '3', detail: 'Requires review', variant: 'danger' },
    { title: 'Automations Loaded', value: '42', detail: 'Across 4 flows', variant: 'accent' },
  ];

  const recentRuns = [
    {
      id: 'RUN-402',
      commit: 'feat: add secure auth middleware with jwt',
      branch: 'main',
      author: 'Sarah Connor',
      status: 'success',
      duration: '45s',
      time: '12 mins ago'
    },
    {
      id: 'RUN-401',
      commit: 'fix: billing card checkout submission logic',
      branch: 'release-1.1',
      author: 'John Connor',
      status: 'warning',
      duration: '1m 12s',
      time: '2 hours ago'
    },
    {
      id: 'RUN-400',
      commit: 'refactor: split tailwind theme colors to globals.css',
      branch: 'main',
      author: 'Alex Mercer',
      status: 'success',
      duration: '32s',
      time: '4 hours ago'
    },
    {
      id: 'RUN-399',
      commit: 'test: run visual regression on login screen',
      branch: 'dev-auth',
      author: 'Sarah Connor',
      status: 'danger',
      duration: '18s',
      time: '1 day ago'
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-heading text-white">Workspace Overview</h2>
          <p className="text-sm text-brand-text-secondary">Track real-time quality audits and system health checks</p>
        </div>
        <Button variant="primary" className="gap-2 self-start sm:self-auto">
          <Play size={16} fill="currentColor" />
          <span>Trigger Audit Run</span>
        </Button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} hoverEffect={true} className="bg-brand-surface border-brand-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary mb-2">{metric.title}</p>
            <h3 className="text-display text-white font-extrabold mb-1">{metric.value}</h3>
            <span className="text-xs font-medium text-brand-cyan">{metric.detail}</span>
          </Card>
        ))}
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Recent Runs List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-title text-white">Recent Audit Runs</h3>
            <Button variant="link" size="sm" className="text-xs text-brand-blue">
              View all runs
            </Button>
          </div>

          <div className="space-y-4">
            {recentRuns.map((run) => (
              <Card key={run.id} className="bg-brand-surface/40 hover:bg-brand-surface/60 border-brand-border/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-blue">{run.id}</span>
                    <span className="text-brand-border">•</span>
                    <span className="text-xs text-brand-text-secondary flex items-center gap-1">
                      <GitBranch size={12} />
                      {run.branch}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate max-w-[280px] sm:max-w-md">{run.commit}</h4>
                  <div className="flex items-center gap-4 text-xs text-brand-text-secondary">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {run.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {run.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 border-brand-border/40 pt-3 sm:pt-0">
                  <span className="text-xs text-brand-text-secondary sm:text-right block">{run.time}</span>
                  <Badge variant={run.status}>
                    {run.status === 'success' && 'Passed'}
                    {run.status === 'warning' && 'Warning'}
                    {run.status === 'danger' && 'Failed'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side: Quality Analytics & Active Errors */}
        <div className="space-y-6">
          <h3 className="text-title text-white">Integration Status</h3>
          <Card className="bg-brand-surface border-brand-border space-y-6">
            {/* Git Integration status */}
            <div className="flex items-center justify-between pb-4 border-b border-brand-border/60">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">GitHub Webhooks</h4>
                <p className="text-xs text-brand-text-secondary">Active on 4 main repos</p>
              </div>
              <Badge variant="success">Connected</Badge>
            </div>

            {/* Slack integration status */}
            <div className="flex items-center justify-between pb-4 border-b border-brand-border/60">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Slack Notifications</h4>
                <p className="text-xs text-brand-text-secondary">Alerting channels #dev-qa</p>
              </div>
              <Badge variant="success">Connected</Badge>
            </div>

            {/* Vercel integration status */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Vercel Previews</h4>
                <p className="text-xs text-brand-text-secondary">Auto-audits active</p>
              </div>
              <Badge variant="default">Configure</Badge>
            </div>
          </Card>

          {/* Prompt banner for next step */}
          <Card className="bg-gradient-to-tr from-brand-blue/15 to-brand-cyan/5 border border-brand-blue/20 p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/10 rounded-full blur-xl pointer-events-none" />
            <h4 className="text-base font-bold text-white">Configure custom test cases</h4>
            <p className="text-xs text-brand-text-secondary leading-relaxed">
              Create assertions and user flow recordings to test login triggers, cart actions, and premium account limits automatically.
            </p>
            <Button variant="secondary" size="sm" className="w-full flex items-center justify-center gap-1.5 self-start">
              <span>Read API Docs</span>
              <ExternalLink size={12} />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
