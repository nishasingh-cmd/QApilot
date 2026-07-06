import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Zap, Mail } from 'lucide-react';

export function ConnectionSuccess({ numRepos, sensitivity, email, onFinish }) {
  const listItems = [
    {
      title: `${numRepos} ${numRepos === 1 ? 'Repository' : 'Repositories'} Connected`,
      desc: 'Webhook triggers registered successfully.',
      icon: ShieldCheck,
    },
    {
      title: `${sensitivity.charAt(0).toUpperCase() + sensitivity.slice(1)} Scanning Enabled`,
      desc: 'AI analyzers configured to detect quality bottlenecks.',
      icon: Zap,
    },
    {
      title: 'Alert Config Saved',
      desc: `Weekly reports will be sent to ${email}`,
      icon: Mail,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto rounded-3xl bg-white/[0.01] border border-white/[0.05] p-8 sm:p-10 backdrop-blur-md text-center relative overflow-hidden my-6"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Confetti / Success Circle Animation */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 relative z-10"
          >
            <Check className="w-8 h-8 stroke-[3]" />
          </motion.div>
          
          {/* Animated decorative pulses */}
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-3 rounded-full border border-emerald-500/15 pointer-events-none"
          />
        </div>
      </div>

      <h2 className="text-xl font-extrabold text-white tracking-tight">GitHub Connected Successfully</h2>
      <p className="text-[13px] text-brand-text-secondary mt-1.5 mb-8">
        Your repositories are connected and ready for scanning.
      </p>

      {/* Integration Summaries list */}
      <div className="space-y-4 max-w-sm mx-auto mb-8 text-left">
        {listItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="flex gap-3.5 items-start p-3 rounded-xl bg-white/[0.005] border border-white/[0.04]"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">{item.title}</p>
                <p className="text-[11px] text-brand-text-secondary mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Direct conversion button */}
      <button
        onClick={onFinish}
        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand-blue/20 border border-white/[0.08] select-none"
      >
        Go To Dashboard
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
export default ConnectionSuccess;
