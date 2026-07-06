import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export function FAQItem({ question, answer, index = 0, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: 0.07 * index }}
      className={cn(
        'rounded-2xl border transition-all duration-300 overflow-hidden',
        isOpen
          ? 'border-brand-blue/25 bg-brand-blue/[0.04]'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]',
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        <span className={cn('text-[14px] font-semibold leading-snug transition-colors duration-200', isOpen ? 'text-white' : 'text-brand-text-secondary')}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={cn('shrink-0 transition-colors duration-200', isOpen ? 'text-brand-blue' : 'text-brand-text-muted')}
        >
          <ChevronDown size={18} aria-hidden="true" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="px-6 pb-5 text-[13px] text-brand-text-secondary leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
