import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({ className, variant = 'default', children, ...props }) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border tracking-wide';
  
  const variants = {
    default: 'bg-brand-surface border-brand-border text-brand-text-secondary',
    primary: 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue',
    accent: 'bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan',
    success: 'bg-brand-success/10 border-brand-success/20 text-brand-success',
    warning: 'bg-brand-warning/10 border-brand-warning/20 text-brand-warning',
    danger: 'bg-brand-danger/10 border-brand-danger/20 text-brand-danger',
  };

  return (
    <span 
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
