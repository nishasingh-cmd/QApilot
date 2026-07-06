import React from 'react';
import { motion } from 'framer-motion';
import { GitFork, GitCommitHorizontal, ScanSearch, Bug, FileText, Rocket } from 'lucide-react';
import { Container } from '../components/common/Container';
import { TimelineStep } from '../components/ui/TimelineStep';

const STEPS = [
  {
    icon: GitFork,
    title: 'Connect Repository',
    description: 'Link any GitHub repo in seconds — no config files required.',
  },
  {
    icon: GitCommitHorizontal,
    title: 'Push Code',
    description: 'Develop normally. Every push triggers QAPilot automatically.',
  },
  {
    icon: ScanSearch,
    title: 'AI Scan',
    description: 'Our neural engine analyzes changed files, logic flows, and APIs.',
  },
  {
    icon: Bug,
    title: 'Bug Detection',
    description: 'Issues ranked by severity with root-cause context surfaced instantly.',
  },
  {
    icon: FileText,
    title: 'Generate Report',
    description: 'Structured diff-aware report attached directly to your PR.',
  },
  {
    icon: Rocket,
    title: 'Deploy',
    description: 'Ship with a confidence score. Block risky merges automatically.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-label="How QAPilot Works"
      className="relative w-full py-28 overflow-hidden"
    >
      {/* Subtle top glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[300px] bg-brand-blue/4 rounded-full blur-[140px] pointer-events-none"
      />

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center text-center mb-16 gap-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan inline-block" />
            Workflow
          </span>
          <h2 className="text-heading text-white font-extrabold max-w-xl leading-tight tracking-tight">
            How QAPilot{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan">
              Works
            </span>
          </h2>
          <p className="text-body text-brand-text-secondary max-w-lg">
            From first push to confident deployment — QAPilot integrates into your workflow
            without changing how you build.
          </p>
        </motion.div>

        {/* DESKTOP: Horizontal timeline */}
        <div className="hidden lg:grid grid-cols-6 gap-0 relative">
          {/* Background connector track */}
          <div
            aria-hidden="true"
            className="absolute top-8 left-[calc(100%/12)] right-[calc(100%/12)] h-px bg-white/[0.06]"
          />
          {STEPS.map((step, i) => (
            <TimelineStep
              key={step.title}
              step={i + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={i === STEPS.length - 1}
              index={i}
            />
          ))}
        </div>

        {/* MOBILE: Vertical timeline */}
        <div className="lg:hidden flex flex-col gap-0 relative pl-8">
          {/* Vertical track line */}
          <div
            aria-hidden="true"
            className="absolute left-4 top-8 bottom-8 w-px bg-white/[0.07]"
          />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 * i }}
              className="relative flex items-start gap-5 pb-8 last:pb-0 group"
            >
              {/* Circle on vertical track */}
              <div className="absolute -left-8 flex items-center justify-center w-8 h-8 rounded-full border-2 border-brand-blue/30 bg-[#07090F] text-brand-blue group-hover:border-brand-blue/60 group-hover:bg-brand-blue/10 transition-all duration-300 z-10">
                <step.icon size={14} aria-hidden="true" />
              </div>

              {/* Step badge */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-brand-blue text-white text-[9px] font-extrabold flex items-center justify-center shadow-md shadow-brand-blue/40">
                    {i + 1}
                  </span>
                  <h4 className="text-[14px] font-bold text-white">{step.title}</h4>
                </div>
                <p className="text-[12px] text-brand-text-muted leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
