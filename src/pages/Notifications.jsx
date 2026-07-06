import React from 'react';
import { useNotifications } from '../context/NotificationsContext';
import { NotificationItem } from '../components/notifications/NotificationItem';
import { NotificationFilters } from '../components/notifications/NotificationFilters';
import { Bell, CheckCircle2, Trash2, ChevronRight, Inbox, Loader2 } from 'lucide-react';

export function Notifications() {
  const {
    notifications,
    filter,
    setFilter,
    markAllAsRead,
    clearAll,
    unreadCount,
    loading,
  } = useNotifications();

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto pb-24 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-text-secondary text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <span>Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Notifications</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Notifications</h1>
          <p className="text-xs text-brand-text-secondary mt-1">
            Stay updated with real-time activity across scans, repositories and AI insights.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.08] text-xs font-bold transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-brand-blue" />
              Mark all read
            </button>
          )}
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.08] text-xs font-bold transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            Clear Feed
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="glass-card p-4 rounded-xl border border-white/[0.06] flex items-center justify-between">
        <NotificationFilters activeFilter={filter} onChange={setFilter} />
      </div>

      {/* Infinite-style Feed list */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            <span className="text-xs text-brand-text-secondary">Syncing alert logs...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="glass-card p-12 text-center border border-white/[0.06] rounded-2xl flex flex-col items-center gap-3">
            <Inbox className="w-10 h-10 text-brand-text-secondary/40" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">All caught up</h3>
              <p className="text-[11px] text-brand-text-secondary mt-1 max-w-xs">
                No notification logs matched this filter criteria.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Notifications;
