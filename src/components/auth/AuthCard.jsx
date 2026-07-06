import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function AuthCard({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
      className={cn(
        "relative w-full max-w-[440px] px-8 py-9 rounded-2xl bg-white/[0.025] border border-white/[0.06] backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden",
        className
      )}
    >
      {/* Decorative top-right edge highlight */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none"
      />
      
      {/* Interactive children */}
      <div className="relative z-10 flex flex-col gap-6">
        {children}
      </div>
    </motion.div>
  );
}
