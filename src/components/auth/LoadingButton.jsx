import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function LoadingButton({
  children,
  className,
  isLoading = false,
  variant = 'primary',
  type = 'submit',
  disabled,
  ...props
}) {
  const baseStyles = 'w-full h-11 px-5 inline-flex items-center justify-center font-bold text-[14px] rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:pointer-events-none select-none';

  const variants = {
    primary: 'bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20 border border-brand-blue/10 disabled:opacity-50',
    secondary: 'bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white disabled:opacity-40',
    glass: 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-brand-text-secondary hover:text-white backdrop-blur-md disabled:opacity-40',
  };

  return (
    <motion.button
      type={type}
      whileHover={isLoading || disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={isLoading || disabled ? {} : { scale: 0.98 }}
      className={cn(baseStyles, variants[variant], className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg 
            className="animate-spin h-4 w-4 text-current" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Please wait...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
