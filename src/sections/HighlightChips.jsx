import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Lock, Cpu, Globe2, RefreshCcw, Code2 } from 'lucide-react';

const CHIPS = [
  { icon: Cpu, label: 'AI-Native Engine' },
  { icon: Lock, label: 'SOC 2 Compliant' },
  { icon: RefreshCcw, label: 'Continuous Analysis' },
  { icon: Globe2, label: 'Edge-Distributed' },
  { icon: Layers, label: 'Framework Agnostic' },
  { icon: Code2, label: 'Developer-First API' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 18 },
  },
};

export function HighlightChips() {
  return (
    <div className="w-full py-12 relative overflow-hidden" aria-label="Platform highlights">
      {/* Faded edge masks for infinite-scroll feel */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="flex items-center justify-center flex-wrap gap-3 px-4 sm:px-8"
      >
        {CHIPS.map(({ icon: Icon, label }) => (
          <motion.div
            key={label}
            variants={chipVariants}
            whileHover={{ scale: 1.06, borderColor: 'rgba(79,140,255,0.4)' }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.07] bg-white/[0.03] backdrop-blur-md text-[12px] font-semibold text-brand-text-secondary hover:text-white transition-all duration-200 cursor-default select-none"
          >
            <Icon size={14} className="text-brand-blue shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
