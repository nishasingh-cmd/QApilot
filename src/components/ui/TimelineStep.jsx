import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function TimelineStep({ step, icon: Icon, title, description, isLast = false, index = 0 }) {
  return (
    <div className="flex flex-col items-center relative group">
      {/* Desktop connector line (right side, hidden on last) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-[-calc(50%-2rem)] h-px w-full z-0">
          <div className="w-full h-px bg-white/[0.08] relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 * index }}
              className="absolute inset-0 h-full bg-gradient-to-r from-brand-blue/60 to-brand-cyan/40"
            />
          </div>
        </div>
      )}

      {/* Circle Icon */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.1 * index }}
        className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 border-brand-blue/30 bg-brand-blue/8 text-brand-blue group-hover:border-brand-blue/70 group-hover:bg-brand-blue/15 group-hover:text-brand-cyan group-hover:shadow-lg group-hover:shadow-brand-blue/20 transition-all duration-300"
      >
        {/* Step number badge */}
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-blue text-white text-[10px] font-extrabold flex items-center justify-center shadow-md shadow-brand-blue/40">
          {step}
        </span>
        <Icon size={22} aria-hidden="true" />
      </motion.div>

      {/* Text block */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.12 * index + 0.1 }}
        className="mt-4 text-center max-w-[140px]"
      >
        <h4 className="text-[13px] font-bold text-white leading-snug mb-1">{title}</h4>
        <p className="text-[11px] text-brand-text-muted leading-relaxed">{description}</p>
      </motion.div>
    </div>
  );
}
