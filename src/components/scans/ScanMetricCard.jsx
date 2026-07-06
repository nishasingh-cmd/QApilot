import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function ScanMetricCard({ label, value, icon: Icon, color, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Basic counter increment for numerical values
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      if (start === end) return;

      const duration = 1.2; // seconds
      const stepTime = Math.abs(Math.floor((duration * 1000) / end));
      
      const timer = setInterval(() => {
        start += 1;
        setDisplayValue(start);
        if (start >= end) {
          clearInterval(timer);
        }
      }, Math.max(stepTime, 8));

      return () => clearInterval(timer);
    }
  }, [value]);

  const valStr = typeof value === 'number' ? displayValue : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.05] flex items-center justify-between hover:border-white/[0.12] transition-colors"
    >
      <div>
        <p className="text-[12px] uppercase tracking-wider text-brand-text-secondary font-semibold">{label}</p>
        <h3 className="text-2xl font-extrabold text-white mt-1.5 font-mono">{valStr}</h3>
      </div>
      <div className={`p-3 rounded-xl border ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </motion.div>
  );
}
export default ScanMetricCard;
