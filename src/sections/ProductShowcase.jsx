import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, BarChart3, Bell, GitMerge } from 'lucide-react';
import { Container } from '../components/common/Container';
import { ProductDashboardPreview } from '../components/common/ProductDashboardPreview';

const CAPABILITIES = [
  {
    icon: BrainCircuit,
    title: 'AI-Driven Analysis',
    description:
      'Goes beyond linting. Our model understands application logic, data flows, and edge-case scenarios.',
  },
  {
    icon: BarChart3,
    title: 'Quality Scores',
    description:
      'Every deploy gets a holistic score across performance, accessibility, and code correctness.',
  },
  {
    icon: GitMerge,
    title: 'PR-Level Reports',
    description:
      'Reports attach directly to pull requests with file-level diffs and actionable remediation steps.',
  },
  {
    icon: Bell,
    title: 'Smart Alerting',
    description:
      'Critical severity bugs trigger real-time Slack or PagerDuty alerts before they reach users.',
  },
];

export function ProductShowcase() {
  return (
    <section
      id="product"
      aria-label="Product Showcase"
      className="relative w-full py-28 overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[600px] bg-brand-blue/5 rounded-full blur-[180px] pointer-events-none"
      />

      <Container>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center text-center mb-16 gap-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan inline-block" />
            Product Preview
          </span>
          <h2 className="text-heading text-white font-extrabold max-w-2xl leading-tight tracking-tight">
            See QAPilot{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan">
              in Action
            </span>
          </h2>
          <p className="text-body text-brand-text-secondary max-w-xl">
            Monitor repositories, detect issues automatically, and generate AI-powered quality
            reports from one intelligent dashboard.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT: Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 flex justify-center"
          >
            <ProductDashboardPreview />
          </motion.div>

          {/* RIGHT: Capability cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 * i }}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md hover:border-brand-blue/25 hover:bg-brand-blue/[0.03] transition-all duration-300 group cursor-default"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-blue/8 border border-brand-blue/20 text-brand-blue group-hover:text-brand-cyan group-hover:bg-brand-blue/15 transition-all duration-300 shrink-0">
                    <Icon size={19} aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-white mb-1 group-hover:text-brand-blue transition-colors duration-200">
                      {cap.title}
                    </h4>
                    <p className="text-[13px] text-brand-text-secondary leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </Container>
    </section>
  );
}
