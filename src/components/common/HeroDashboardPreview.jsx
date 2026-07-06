import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ShieldAlert, CheckCircle2, Zap, Terminal, Activity } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const GitHubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export function HeroDashboardPreview() {
  // Container float variants
  const floatVariants = {
    animate: {
      y: [0, -6, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      variants={floatVariants}
      animate="animate"
      className="relative w-full max-w-[500px] aspect-[4/3] flex items-center justify-center select-none"
    >
      {/* Background Soft Glow backing */}
      <div className="absolute inset-0 bg-brand-blue/10 rounded-full blur-[80px] pointer-events-none transform scale-75" />

      {/* Layer 1: Repository Card (Top-Left) */}
      <motion.div 
        whileHover={{ y: -4, scale: 1.02 }}
        className="absolute top-2 left-2 w-[220px] z-20 cursor-default"
      >
        <Card variant="glass" className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white">
                <GitHubIcon />
              </span>
              <span className="text-[13px] font-bold text-white tracking-wide">qapilot-web</span>
            </div>
            <Badge variant="success" className="text-[10px] px-2 py-0">Active</Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-brand-text-secondary border-t border-white/[0.04] pt-2">
            <span>Branch</span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-brand-cyan">
              <GitBranch size={12} />
              main
            </span>
          </div>
        </Card>
      </motion.div>

      {/* Layer 2: Live Scanning / Deployment Card (Top-Right) */}
      <motion.div 
        whileHover={{ y: -4, scale: 1.02 }}
        className="absolute top-8 right-2 w-[240px] z-30 cursor-default"
      >
        <Card variant="glass" className="p-4 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse shadow-sm shadow-brand-cyan/50" />
              <span className="text-[12px] font-semibold text-white">Commit scan running</span>
            </div>
            <span className="text-[10px] font-mono text-brand-text-muted">#8f2c9a</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] text-brand-text-secondary">
              <span>Logic Audit</span>
              <span className="text-brand-cyan">Scanning...</span>
            </div>
            {/* Animated progress bar */}
            <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden border border-white/[0.02]">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: ["0%", "35%", "70%", "100%", "0%"] }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  times: [0, 0.4, 0.7, 0.9, 1]
                }}
                className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Layer 3: Bug Summary Card (Center-Left) */}
      <motion.div 
        whileHover={{ y: -4, scale: 1.02 }}
        className="absolute bottom-6 left-0 w-[240px] z-30 cursor-default"
      >
        <Card variant="glass" className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
            <span className="text-[12px] font-bold text-white">Anomalies Detected</span>
            <ShieldAlert size={14} className="text-brand-danger" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-2">
              <span className="block text-[11px] text-brand-text-secondary">Critical</span>
              <span className="text-base font-bold text-brand-danger">2</span>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-2">
              <span className="block text-[11px] text-brand-text-secondary">Medium</span>
              <span className="text-base font-bold text-brand-warning">7</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-brand-text-secondary">Security checks</span>
            <span className="text-brand-success font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} />
              Passed 96%
            </span>
          </div>
        </Card>
      </motion.div>

      {/* Layer 4: Performance & Accessibility Scores Card (Center-Right) */}
      <motion.div 
        whileHover={{ y: -4, scale: 1.02 }}
        className="absolute bottom-16 right-0 w-[220px] z-20 cursor-default"
      >
        <Card variant="glass" className="p-4 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-white">Audits Complete</span>
            <Zap size={14} className="text-brand-cyan" />
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-brand-text-secondary">Performance</span>
              <span className="font-bold text-white text-[13px]">98 <span className="text-[10px] text-brand-success font-normal">/100</span></span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-brand-text-secondary">Accessibility</span>
              <span className="font-bold text-white text-[13px]">100 <span className="text-[10px] text-brand-success font-normal">/100</span></span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Layer 5: Activity Log Card (Bottom) */}
      <motion.div 
        whileHover={{ y: -4, scale: 1.02 }}
        className="absolute -bottom-8 left-[10%] w-[320px] z-40 cursor-default hidden sm:block"
      >
        <Card variant="glass" className="p-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-brand-success/15 border border-brand-success/20 flex items-center justify-center text-brand-success">
              <Activity size={14} />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-semibold text-white">Latest Integration Run</p>
              <p className="text-[9px] text-brand-text-muted">Successfully checked 4 endpoints</p>
            </div>
          </div>
          <span className="text-[10px] text-brand-text-secondary font-medium">2 mins ago</span>
        </Card>
      </motion.div>
    </motion.div>
  );
}
