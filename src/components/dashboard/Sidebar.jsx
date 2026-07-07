import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderGit2,
  Zap,
  ShieldAlert,
  Terminal,
  TrendingUp,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Activity
} from 'lucide-react';
import { cn } from '../../utils/cn';

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Repositories', icon: FolderGit2, path: '/dashboard/repos' },
  { name: 'AI Scans', icon: Zap, path: '/dashboard/scans' },
  { name: 'AI Findings', icon: ShieldAlert, path: '/dashboard/bugs' },
  { name: 'AI Reports', icon: FileText, path: '/dashboard/reports' },
  { name: 'Test Runs', icon: Terminal, path: '/dashboard/runs' },
  { name: 'Analytics', icon: TrendingUp, path: '/dashboard/analytics' },
  { name: 'Team', icon: Users, path: '/dashboard/team' },
  { name: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
  { name: 'Activity Log', icon: Activity, path: '/dashboard/activity' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export function Sidebar({ isOpen, onClose }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    onClose && onClose();
    navigate('/');
  }

  // Sidebar animations
  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 78 },
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar Element */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-brand-bg-secondary border-r border-white/[0.06] backdrop-blur-md transition-transform duration-300 md:translate-x-0 md:static md:inset-auto h-screen",
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header Branding section */}
        <div className="relative flex items-center h-16 px-5 border-b border-white/[0.06] select-none justify-between">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center shrink-0 shadow-md shadow-brand-blue/30">
              <span className="text-white text-xs font-black">QA</span>
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="text-[16px] font-extrabold text-white tracking-tight"
                >
                  QAPilot
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Desktop collapse triggers */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] text-brand-text-muted hover:text-white transition-all cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all group select-none",
                  isActive
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/15'
                    : 'text-brand-text-secondary hover:bg-white/[0.03] hover:text-white'
                )}
              >
                {/* Active left border indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeSideBarLine"
                    className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-md bg-brand-cyan"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <IconComponent
                  size={17}
                  className={cn(
                    "shrink-0",
                    isActive ? 'text-white' : 'text-brand-text-secondary group-hover:text-brand-cyan transition-colors duration-150'
                  )}
                />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile details & Quick Logouts */}
        <div className="p-4 border-t border-white/[0.06] bg-brand-bg/25">
          <div className="flex items-center gap-3 px-1 py-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue font-black text-[13px] shrink-0 select-none">
              NS
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[12.5px] font-bold text-white truncate leading-none">Nisha Singh</p>
                <p className="text-[11px] text-brand-text-muted truncate mt-1 leading-none">nisha@qapilot.io</p>
              </motion.div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 h-9 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-brand-danger/5 hover:border-brand-danger/25 text-[12px] font-semibold text-brand-text-secondary hover:text-brand-danger transition-colors cursor-pointer focus-visible:outline-none"
          >
            <LogOut size={14} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
