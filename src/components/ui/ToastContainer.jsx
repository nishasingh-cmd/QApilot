import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationsContext';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const TOAST_THEMES = {
  success: { icon: CheckCircle,  color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-950/90' },
  warning: { icon: AlertTriangle, color: 'text-amber-400',   border: 'border-amber-500/20',   bg: 'bg-amber-950/90' },
  error:   { icon: AlertCircle,   color: 'text-red-400',     border: 'border-red-500/20',     bg: 'bg-red-950/90' },
  info:    { icon: Info,          color: 'text-brand-blue',  border: 'border-brand-blue/20',  bg: 'bg-brand-blue/10 bg-black/80' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useNotifications();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const cfg = TOAST_THEMES[t.type] || TOAST_THEMES.info;
          const Icon = cfg.icon;

          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={`p-4 rounded-xl border backdrop-blur-xl shadow-2xl pointer-events-auto flex items-start gap-3.5 relative overflow-hidden ${cfg.bg} ${cfg.border}`}
            >
              {/* Left icon wrapper */}
              <div className={`p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] shrink-0 mt-0.5 ${cfg.color}`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Text content details */}
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-xs font-bold text-white leading-snug">{t.title}</h4>
                {t.message && (
                  <p className="text-[10px] text-brand-text-secondary mt-1 leading-normal">
                    {t.message}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 rounded hover:bg-white/[0.06] text-brand-text-secondary hover:text-white transition-all shrink-0"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
export default ToastContainer;
