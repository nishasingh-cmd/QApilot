import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '../ui/Button';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      aria-label="Newsletter signup"
      className="relative w-full max-w-3xl mx-auto px-4 sm:px-0 py-4"
    >
      <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8 px-7 py-7 rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl shadow-xl shadow-black/30 overflow-hidden">
        {/* Subtle glow */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-48 bg-brand-blue/5 blur-2xl rounded-full pointer-events-none"
        />

        {/* Text */}
        <div className="relative z-10 flex flex-col gap-1 text-center sm:text-left shrink-0">
          <h3 className="text-[15px] font-bold text-white">Stay Updated</h3>
          <p className="text-[12px] text-brand-text-muted max-w-[200px]">
            Product updates and engineering articles.
          </p>
        </div>

        {/* Form */}
        {submitted ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex-1 text-center text-[13px] font-semibold text-brand-success"
          >
            🎉 You're on the list! We'll be in touch.
          </motion.p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="relative z-10 flex-1 flex flex-col sm:flex-row gap-2.5 w-full"
            noValidate
          >
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@company.com"
                autoComplete="email"
                aria-describedby={error ? 'newsletter-error' : undefined}
                className="h-11 w-full rounded-[14px] bg-white/[0.04] border border-white/[0.08] text-[13px] text-white placeholder-brand-text-muted px-4 outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/40 transition-all duration-200"
              />
              {error && (
                <p id="newsletter-error" role="alert" className="text-[11px] text-brand-danger px-1">
                  {error}
                </p>
              )}
            </div>
            <Button type="submit" variant="primary" size="md" className="gap-2 whitespace-nowrap shrink-0">
              <Send size={14} aria-hidden="true" />
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </motion.section>
  );
}
