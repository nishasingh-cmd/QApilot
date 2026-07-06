import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Premium SVG icons for Github & Google
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.336 0 3.332 2.682 1.386 6.618l3.88 3.147z"
    />
    <path
      fill="#34A853"
      d="M16.04 15.345c-1.077.737-2.43 1.191-4.04 1.191-3.568 0-6.581-2.413-7.659-5.672L.427 13.98A11.954 11.954 0 0 0 12 24c3.245 0 6.191-1.082 8.382-2.945l-4.341-3.71z"
    />
    <path
      fill="#4285F4"
      d="M23.49 12.273c0-.818-.073-1.609-.209-2.373H12v4.5h6.455c-.278 1.472-1.11 2.718-2.364 3.563l4.34 3.71c2.541-2.346 4.059-5.8 4.059-9.4z"
    />
    <path
      fill="#FBBC05"
      d="M4.341 10.864A7.17 7.17 0 0 1 4.34 8.255V5.109L.46 1.964A11.977 11.977 0 0 0 0 12c0 2.29.645 4.436 1.764 6.264l2.577-5.4z"
    />
  </svg>
);

export function SocialButton({ provider, onClick, className, ...props }) {
  const isGithub = provider === 'github';

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-3 h-11 px-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[13px] font-semibold text-brand-text-primary hover:bg-white/[0.06] hover:border-white/[0.12] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue",
        className
      )}
      {...props}
    >
      <span className="shrink-0 flex items-center justify-center">
        {isGithub ? <GithubIcon /> : <GoogleIcon />}
      </span>
      <span>
        {isGithub ? 'GitHub' : 'Google'}
      </span>
    </motion.button>
  );
}
