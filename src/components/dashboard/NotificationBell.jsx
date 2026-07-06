import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationsContext';
import { Bell, CheckCircle2, ChevronRight, Inbox } from 'lucide-react';
import { NotificationItem } from '../notifications/NotificationItem';

export function NotificationBell() {
  const { notifications, allNotifications, unreadCount, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const latest5 = allNotifications.slice(0, 5);

  return (
    <div className="relative select-none" ref={containerRef}>
      {/* Bell Toggle Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-brand-text-secondary hover:text-white transition-all cursor-pointer focus-visible:outline-none"
        aria-label="View notifications preview"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-brand-blue border border-[#07090F] text-[9px] font-black text-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            className="absolute right-0 mt-2.5 w-[320px] sm:w-[360px] bg-[#0b0e14]/95 border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06] bg-white/[0.005]">
              <span className="text-[11px] font-black text-white">Notifications ({unreadCount} unread)</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[9px] font-bold text-brand-blue hover:text-brand-blue/80 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List preview (max 5) */}
            <div className="max-h-[300px] overflow-y-auto p-3 space-y-2 divide-y divide-white/[0.03]">
              {latest5.length === 0 ? (
                <div className="py-8 flex flex-col items-center gap-2 text-center select-none">
                  <Inbox className="w-6 h-6 text-brand-text-secondary/30" />
                  <span className="text-[11px] text-brand-text-secondary/60 font-medium">No recent notifications</span>
                </div>
              ) : (
                latest5.map((n, index) => (
                  <div key={n.id} className={index > 0 ? "pt-2" : ""}>
                    <NotificationItem notification={n} compact={true} />
                  </div>
                ))
              )}
            </div>

            {/* Footer View All shortcut */}
            <Link
              to="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 p-3.5 border-t border-white/[0.06] hover:bg-white/[0.02] text-[11px] font-bold text-brand-text-secondary hover:text-white transition-all text-center border-none"
            >
              See all notifications
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default NotificationBell;
