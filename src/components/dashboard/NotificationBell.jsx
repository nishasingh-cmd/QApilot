import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    title: 'AI Scan Passed',
    desc: 'Repository main branch code audit success.',
    time: '5 mins ago',
    icon: ShieldCheck,
    color: 'text-brand-success bg-brand-success/10 border-brand-success/20',
  },
  {
    id: 2,
    type: 'danger',
    title: 'Critical Bug Detected',
    desc: 'Potential XSS injection risk inside Input.jsx.',
    time: '12 mins ago',
    icon: AlertTriangle,
    color: 'text-brand-danger bg-brand-danger/10 border-brand-danger/20',
  },
  {
    id: 3,
    type: 'info',
    title: 'Deployment Completed',
    desc: 'Vercel preview generated for PR #12.',
    time: '2 hours ago',
    icon: Info,
    color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20',
  },
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState(NOTIFICATIONS);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function clearAll() {
    setList([]);
  }

  const unreadCount = list.length;

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-brand-text-secondary hover:text-white border border-white/[0.06] rounded-xl bg-white/[0.01] hover:bg-white/[0.05] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={isOpen}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
        )}
      </button>

      {/* Popover list container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 z-50 w-80 rounded-xl border border-white/[0.08] bg-brand-bg-secondary/95 backdrop-blur-xl p-1.5 shadow-2xl shadow-black/80"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] select-none">
              <span className="text-[12px] font-bold text-white">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[10px] font-bold text-brand-blue hover:text-brand-cyan transition-colors"
                >
                  Mark as read
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto py-1 flex flex-col gap-1">
              {list.length > 0 ? (
                list.map((n) => {
                  const ItemIcon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] cursor-default transition-colors duration-150"
                    >
                      <div className={`p-1.5 rounded-lg border shrink-0 ${n.color}`}>
                        <ItemIcon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[12px] font-bold text-white truncate">{n.title}</p>
                          <span className="text-[9px] text-brand-text-muted shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-brand-text-secondary leading-snug mt-0.5">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-[12px] text-brand-text-muted select-none">
                  🎉 No new notifications. All caught up!
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
