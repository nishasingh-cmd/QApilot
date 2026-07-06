import React from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Zap, GitFork } from 'lucide-react';

const FLOATING_CARDS = [
  {
    icon: GitFork,
    text: 'Repository Connected',
    color: 'text-brand-blue',
    bgColor: 'bg-brand-blue/10 border-brand-blue/20',
    delay: 0.1,
    yOffset: -12,
  },
  {
    icon: Zap,
    text: 'AI Scan Running',
    color: 'text-brand-cyan',
    bgColor: 'bg-brand-cyan/10 border-brand-cyan/20',
    delay: 0.3,
    yOffset: -22,
  },
  {
    icon: Shield,
    text: '98% Test Coverage',
    color: 'text-brand-success',
    bgColor: 'bg-brand-success/10 border-brand-success/20',
    delay: 0.5,
    yOffset: 12,
  },
  {
    icon: Check,
    text: 'Deployment Successful',
    color: 'text-brand-success',
    bgColor: 'bg-brand-success/10 border-brand-success/20',
    delay: 0.7,
    yOffset: 22,
  },
];

export function AuthIllustration() {
  return (
    <div className="relative flex flex-col justify-between h-full p-12 lg:p-16 select-none overflow-hidden">
      {/* Background dot grid pattern */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
      />
      
      {/* Dynamic ambient blue glow */}
      <div 
        aria-hidden="true"
        className="absolute left-[-20%] top-[-20%] w-[90%] h-[90%] bg-brand-blue/15 rounded-full blur-[140px] pointer-events-none"
      />
      
      <div 
        aria-hidden="true"
        className="absolute right-[-10%] bottom-[-10%] w-[70%] h-[70%] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Brand logo link & back placeholder */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center shadow-md shadow-brand-blue/30">
          <span className="text-white text-xs font-black">QA</span>
        </div>
        <span className="text-[17px] font-black text-white tracking-tight">QAPilot</span>
      </div>

      {/* Center content */}
      <div className="relative z-10 my-auto py-12 flex flex-col gap-12">
        <div className="flex flex-col gap-4 max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight"
          >
            Welcome to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan">
              QAPilot
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="text-[14px] text-brand-text-secondary leading-relaxed"
          >
            Deploy with absolute assurance. Our autonomous quality intelligence scans your PRs, catches regressions, and measures test health.
          </motion.p>
        </div>

        {/* Floating cards sandbox area */}
        <div className="relative w-full h-[240px] flex items-center justify-center">
          {FLOATING_CARDS.map((card, i) => {
            const CardIcon = card.icon;
            return (
              <motion.div
                key={card.text}
                initial={{ opacity: 0, scale: 0.85, y: card.yOffset + 30 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: [card.yOffset, card.yOffset - 10, card.yOffset]
                }}
                transition={{
                  opacity: { duration: 0.6, delay: card.delay },
                  scale: { duration: 0.6, delay: card.delay },
                  y: {
                    repeat: Infinity,
                    duration: 4.5 + i,
                    ease: 'easeInOut',
                    delay: card.delay,
                  }
                }}
                className={`
                  absolute flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg shadow-black/30
                  ${card.bgColor}
                `}
                style={{
                  left: i === 0 ? '5%' : i === 1 ? '45%' : i === 2 ? '10%' : '48%',
                  top: i === 0 ? '10%' : i === 1 ? '25%' : i === 2 ? '55%' : '68%',
                }}
              >
                <div className={`p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.05] ${card.color}`}>
                  <CardIcon size={16} />
                </div>
                <span className="text-[12px] font-semibold text-white tracking-wide">
                  {card.text}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer reference */}
      <div className="relative z-10 text-[11px] text-brand-text-muted">
        © 2026 QAPilot Inc. Secure and SOC2 Compliant.
      </div>
    </div>
  );
}
