import React from 'react';
import { cn } from '../../utils/cn';

export function Logo({ className }) {
  return (
    <div className={cn('flex items-center select-none font-sans font-extrabold text-xl tracking-tight', className)}>
      <span className="text-brand-blue">QA</span>
      <span className="text-white">Pilot</span>
    </div>
  );
}
