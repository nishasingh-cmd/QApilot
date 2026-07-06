import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ 
  className, 
  hoverEffect = false, 
  variant = 'default', // 'default' (20px), 'large' (24px), 'glass' (20px/24px depending on setup)
  children, 
  ...props 
}) {
  const radii = {
    default: 'rounded-[20px]',
    large: 'rounded-[24px]',
  };

  const variants = {
    default: 'bg-brand-surface border border-brand-border',
    large: 'bg-brand-surface border border-brand-border',
    glass: 'bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40',
  };

  const selectedRadius = variant === 'large' ? 'large' : 'default';

  return (
    <div 
      className={cn(
        radii[selectedRadius],
        variants[variant],
        'p-6 transition-all duration-300', 
        hoverEffect && 'hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/5 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
