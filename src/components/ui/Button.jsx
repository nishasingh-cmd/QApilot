import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:pointer-events-none disabled:opacity-50 select-none';
  
  const variants = {
    primary: 'bg-brand-blue hover:bg-brand-blue/90 text-white shadow-md shadow-brand-blue/20 border border-brand-blue/10',
    secondary: 'bg-brand-surface hover:bg-brand-surface/80 border border-brand-border text-brand-text-primary',
    glass: 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-brand-text-primary backdrop-blur-md',
    danger: 'bg-brand-danger hover:bg-brand-danger/90 text-white shadow-md shadow-brand-danger/10 border border-brand-danger/10',
    outline: 'bg-transparent border border-brand-border hover:bg-brand-surface text-brand-text-primary',
    ghost: 'bg-transparent hover:bg-white/[0.04] text-brand-text-primary',
    link: 'bg-transparent text-brand-blue hover:underline p-0 underline-offset-4',
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs rounded-[10px]',
    md: 'h-11 px-5 text-sm rounded-[14px]',
    lg: 'h-13 px-6 text-sm rounded-[14px]',
  };

  return (
    <motion.button
      whileHover={{ scale: variant === 'link' ? 1 : 1.03 }}
      whileTap={{ scale: variant === 'link' ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </motion.button>
  );
}
