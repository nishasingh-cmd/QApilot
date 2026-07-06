import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_STREAMING_LOGS } from '../../data/scans';

export function LiveScanLog({ isActive }) {
  const [logs, setLogs] = useState([]);
  const logEndRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      setLogs(['Ready to scan. Click "Start New Scan" to begin.']);
      return;
    }

    setLogs([MOCK_STREAMING_LOGS[0]]);
    let currentIdx = 0;

    const interval = setInterval(() => {
      currentIdx += 1;
      if (currentIdx < MOCK_STREAMING_LOGS.length) {
        setLogs((prev) => [...prev, MOCK_STREAMING_LOGS[currentIdx]]);
      } else {
        clearInterval(interval);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [isActive]);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full rounded-2xl border border-white/[0.06] bg-black/60 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Terminal Title Bar */}
      <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-blue" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">
            AI Scan Terminal log
          </span>
        </div>
        
        {/* Connection/status dot */}
        <div className="flex items-center gap-1.5 text-[10px] text-brand-text-secondary font-mono">
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-brand-blue animate-pulse' : 'bg-white/20'}`} />
          <span>{isActive ? 'Streaming log output' : 'Terminal Idle'}</span>
        </div>
      </div>

      {/* Log screen */}
      <div className="p-4 h-[240px] overflow-y-auto font-mono text-[11.5px] leading-relaxed text-brand-text-secondary bg-[#07090f]/60 space-y-1">
        <AnimatePresence initial={false}>
          {logs.map((log, index) => {
            let color = 'text-brand-text-secondary';
            if (log.includes('PASS') || log.includes('successfully') || log.includes('Success')) {
              color = 'text-emerald-400';
            } else if (log.includes('warning') || log.includes('warnings')) {
              color = 'text-amber-400';
            } else if (log.includes('Analyzing') || log.includes('Scanning')) {
              color = 'text-cyan-400 font-bold';
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={color}
              >
                <span className="text-white/20 select-none mr-2">$&gt;</span>
                {log}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
export default LiveScanLog;
