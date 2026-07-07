import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GitFork, ShieldCheck, AlertTriangle, CloudLightning, GitPullRequest, RefreshCw } from 'lucide-react';

const MOCK_ACTIVITIES = [
  {
    id: 1,
    title: 'Deployment Succeeded',
    desc: 'Vercel deployment checked automatically.',
    repo: 'acme-frontend',
    time: '12 mins ago',
    icon: CloudLightning,
    color: 'text-brand-success bg-brand-success/10 border-brand-success/15',
  },
  {
    id: 2,
    title: 'Bug Detected',
    desc: 'XSS vulnerability identified inside query handlers.',
    repo: 'acme-frontend',
    time: '45 mins ago',
    icon: AlertTriangle,
    color: 'text-brand-danger bg-brand-danger/10 border-brand-danger/15',
  },
  {
    id: 3,
    title: 'AI Scan Completed',
    desc: 'Codebase stability check scored 98/100.',
    repo: 'acme-frontend',
    time: '2 hours ago',
    icon: ShieldCheck,
    color: 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/15',
  },
  {
    id: 4,
    title: 'Repository Connected',
    desc: 'Webhook active for triggers and PR scoring.',
    repo: 'acme-frontend',
    time: '1 day ago',
    icon: GitFork,
    color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/15',
  },
];

export function ActivityTimeline() {
  const [activities, setActivities] = useState([]);
  const [mode, setMode] = useState('simulator');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/repositories/activity/logs', { withCredentials: true });
        if (res.data && res.data.length > 0) {
          // Format DB logs to look like activity timeline items
          const formatted = res.data.slice(0, 5).map((a) => {
            let title = 'Repository Event';
            let icon = GitFork;
            let color = 'text-brand-blue bg-brand-blue/10 border-brand-blue/15';

            if (a.event === 'push') {
              title = 'Push received';
              icon = GitFork;
              color = 'text-brand-blue bg-brand-blue/10 border-brand-blue/15';
            } else if (a.event === 'pull_request') {
              title = 'Pull request opened';
              icon = GitPullRequest;
              color = 'text-purple-400 bg-purple-500/10 border-purple-500/15';
            } else if (a.event === 'sync') {
              title = 'Repository Synced';
              icon = RefreshCw;
              color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15';
            } else if (a.event === 'release') {
              title = 'New Release Published';
              icon = ShieldCheck;
              color = 'text-amber-400 bg-amber-500/10 border-amber-500/15';
            }

            // Simple time elapsed
            const diffMs = Date.now() - new Date(a.timestamp || a.createdAt).getTime();
            const mins = Math.round(diffMs / 60000);
            const timeStr = mins < 60 ? `${mins}m ago` : mins < 1440 ? `${Math.round(mins / 60)}h ago` : `${Math.round(mins / 1440)}d ago`;

            return {
              id: a._id,
              title,
              desc: a.commit || 'Webhook delivery processed successfully.',
              repo: a.repository,
              time: timeStr,
              icon,
              color
            };
          });
          setActivities(formatted);
          setMode('live');
        } else {
          setActivities(MOCK_ACTIVITIES);
        }
      } catch (err) {
        setActivities(MOCK_ACTIVITIES);
        setMode('simulator');
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-5 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-md shadow-xl select-none">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h3 className="text-[13.5px] font-bold text-white tracking-wide">Recent Activity</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">
          {mode === 'live' ? 'Live DB' : 'Simulated'}
        </span>
      </div>

      <div className="relative flex flex-col gap-5 pl-4">
        {/* Timeline connector track line */}
        <div 
          aria-hidden="true" 
          className="absolute left-[7.5px] top-1 bottom-1 w-px bg-white/[0.06] pointer-events-none" 
        />

        {activities.map((act) => {
          const ActIcon = act.icon;
          return (
            <div key={act.id} className="relative flex items-start gap-4 animate-fadeIn">
              {/* Left track node circle wrapper */}
              <div 
                className={`
                  absolute left-[-11px] top-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 z-10
                  ${act.color}
                `}
              >
                <ActIcon size={10} />
              </div>

              {/* Main content display details */}
              <div className="flex-1 min-w-0 pl-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[12.5px] font-bold text-white truncate">{act.title}</p>
                  <span className="text-[10px] text-brand-text-muted shrink-0">{act.time}</span>
                </div>
                <p className="text-[11px] text-brand-text-secondary leading-snug mt-0.5 truncate" title={act.desc}>
                  {act.desc}
                </p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.05] text-[9.5px] text-brand-text-muted font-mono">
                  {act.repo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActivityTimeline;
