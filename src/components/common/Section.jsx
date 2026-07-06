import React from 'react';
import { cn } from '../../utils/cn';

export function Section({ className, children, ...props }) {
  return (
    <section 
      className={cn('py-12 md:py-20 lg:py-28', className)} 
      {...props}
    >
      {children}
    </section>
  );
}
