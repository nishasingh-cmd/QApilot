import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Settings, LogOut, CreditCard, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    setIsOpen(false);
    await logout();
    navigate('/login');
  }

  const getInitials = () => {
    if (!user || !user.name) return 'U';
    const parts = user.name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Avatar Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue font-black text-sm select-none hover:bg-brand-blue/20 hover:border-brand-blue/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue overflow-hidden"
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {user?.profileImage || user?.avatar ? (
          <img src={user.profileImage || user.avatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          getInitials()
        )}
      </button>

      {/* Menu popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 z-50 w-56 rounded-xl border border-white/[0.08] bg-brand-bg-secondary/95 backdrop-blur-xl p-1.5 shadow-2xl shadow-black/80"
          >
            {/* Header info */}
            <div className="px-2.5 py-2.5 border-b border-white/[0.06] select-none">
              <p className="text-[13px] font-bold text-white leading-none">{user?.name || 'User'}</p>
              <p className="text-[11px] text-brand-text-muted mt-1 leading-none">{user?.email}</p>
            </div>

            {/* Menu options */}
            <div className="py-1 flex flex-col gap-0.5">
              <Link
                to="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12.5px] text-brand-text-secondary hover:bg-white/[0.03] hover:text-white transition-colors duration-150 select-none"
              >
                <User size={14} />
                <span>My Profile</span>
              </Link>
              <Link
                to="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12.5px] text-brand-text-secondary hover:bg-white/[0.03] hover:text-white transition-colors duration-150 select-none"
              >
                <Settings size={14} />
                <span>Settings</span>
              </Link>
              <Link
                to="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12.5px] text-brand-text-secondary hover:bg-white/[0.03] hover:text-white transition-colors duration-150 select-none"
              >
                <CreditCard size={14} />
                <span>Billing & Plans</span>
              </Link>
              <a
                href="#"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12.5px] text-brand-text-secondary hover:bg-white/[0.03] hover:text-white transition-colors duration-150 select-none"
              >
                <Shield size={14} />
                <span>Security</span>
              </a>
            </div>

            <div className="h-px bg-white/[0.06] my-1" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12.5px] text-brand-danger hover:bg-brand-danger/5 transition-colors duration-150 select-none font-semibold"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
