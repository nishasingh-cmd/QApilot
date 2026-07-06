import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Card } from './Card';

export function FeatureCard({ className, icon: Icon, title, description, href = "#", ...props }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full flex"
    >
      <Card 
        variant="glass" 
        className={cn(
          "relative flex flex-col items-start gap-4 p-7 flex-1 hover:border-brand-blue/30 transition-all duration-300 overflow-hidden group select-none cursor-default",
          className
        )}
        {...props}
      >
        {/* Soft background glow overlay on card hover */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,140,255,0.04),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Icon wrapper */}
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] text-brand-blue group-hover:text-brand-cyan group-hover:bg-brand-blue/10 group-hover:border-brand-blue/20 transition-all duration-300">
          {Icon && <Icon size={22} />}
        </div>

        {/* Text details */}
        <div className="space-y-2 flex-1 relative z-10">
          <h4 className="text-title text-white font-bold group-hover:text-brand-blue transition-colors duration-200">{title}</h4>
          <p className="text-[14px] text-brand-text-secondary leading-relaxed">{description}</p>
        </div>

        {/* Learn More link */}
        <div className="flex items-center gap-1 text-xs font-semibold text-brand-blue group-hover:text-brand-cyan transition-colors duration-200 mt-2 relative z-10">
          <span>Learn More</span>
          <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </div>
      </Card>
    </motion.div>
  );
}
