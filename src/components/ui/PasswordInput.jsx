import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from './Input';

export const PasswordInput = React.forwardRef(({
  label = 'Password',
  className,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  function toggleVisibility() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className="relative w-full">
      <Input
        ref={ref}
        label={label}
        type={showPassword ? 'text' : 'password'}
        icon={Lock}
        className={className}
        {...props}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-3.5 top-[34px] p-1.5 rounded-lg text-brand-text-muted hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
