import React from 'react';
import { motion } from 'framer-motion';
import { AuthIllustration } from './AuthIllustration';

export function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-brand-bg flex items-stretch overflow-hidden">
      {/* Dynamic light leaks for total screen depth */}
      <div 
        aria-hidden="true" 
        className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-brand-blue/5 rounded-full blur-[160px] pointer-events-none"
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none"
      />

      {/* Grid wrapper splits layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full min-h-screen">
        {/* Left Side: Branding Panel (Hidden on Mobile/Tablet down) */}
        <div className="hidden lg:block lg:col-span-5 border-r border-white/[0.05] bg-brand-bg-secondary/40 backdrop-blur-sm">
          <AuthIllustration />
        </div>

        {/* Right Side: Authentication card display */}
        <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="w-full flex justify-center"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
