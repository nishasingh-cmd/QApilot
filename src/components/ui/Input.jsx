import React, { useId } from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  className,
  icon: Icon,
  required,
  ...props
}, ref) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="text-xs font-semibold text-brand-text-secondary select-none"
        >
          {label} {required && <span className="text-brand-danger" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-brand-text-muted pointer-events-none" aria-hidden="true">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          required={required}
          className={cn(
            "w-full h-11 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-brand-text-muted transition-all duration-200 outline-none",
            Icon ? "pl-11 pr-4" : "px-4",
            error 
              ? "border-brand-danger/50 focus:border-brand-danger focus:ring-1 focus:ring-brand-danger/30" 
              : "focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/40 focus:bg-white/[0.05]",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p 
          id={`${id}-error`} 
          role="alert" 
          className="text-[11px] text-brand-danger px-1"
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
