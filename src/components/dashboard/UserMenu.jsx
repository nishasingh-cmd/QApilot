import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Settings, LogOut, CreditCard, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    setIsOpen(false);
    navigate('/');
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Avatar Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue font-black text-sm select-none hover:bg-brand-blue/20 hover:border-brand-blue/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        NS
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
              <p className="text-[13px] font-bold text-white leading-none">Nisha Singh</p>
              <p className="text-[11px] text-brand-text-muted mt-1 leading-none">nisha@qapilot.io</p>
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
