import React from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  GitBranch,
  BarChart3,
  ShieldCheck,
  Zap,
  Bell,
} from 'lucide-react';
import { FeatureCard } from '../components/ui/FeatureCard';
import { Container } from '../components/common/Container';

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI Bug Detection',
    description:
      'Our neural engine analyzes every commit and surfaces regressions, logic faults, and edge cases that automated scripts miss — before they reach production.',
  },
  {
    icon: GitBranch,
    title: 'GitHub Push Triggers',
    description:
      'Every push fires an instant QA pipeline. Zero configuration needed. QAPilot hooks into your existing CI/CD and runs silently in the background.',
  },
  {
    icon: BarChart3,
    title: 'Intelligent Reports',
    description:
      'Receive structured, diff-aware reports with severity rankings, reproduction steps, and suggested fixes — delivered directly to your PR.',
  },
  {
    icon: ShieldCheck,
    title: 'Confidence Scoring',
    description:
      'Every release gets a QA confidence score. Track stability trends over time and set thresholds that block risky merges automatically.',
  },
  {
    icon: Zap,
    title: 'Sub-60s Analysis',
    description:
      'Powered by a distributed edge runtime, QAPilot delivers full analysis results in under 60 seconds — even on large monorepos.',
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    description:
      'Critical bugs trigger Slack, email, or PagerDuty alerts immediately. Your on-call team gets the context they need without digging through logs.',
  },
];

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 18 },
  },
};

export function FeaturesSection() {
  return (
    <section className="relative w-full py-28 overflow-hidden" id="features" aria-label="Features">
      {/* Ambient glow blob */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 w-[700px] h-[500px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none"
      />

      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center text-center mb-16 gap-4"
        >
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan inline-block" />
            Platform Features
          </span>

          <h2 className="text-heading text-white font-extrabold max-w-2xl leading-tight tracking-tight">
            Everything your team needs to ship with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan">
              confidence
            </span>
          </h2>

          <p className="text-body text-brand-text-secondary max-w-xl">
            QAPilot brings AI-driven quality assurance directly into your development workflow —
            so your engineers can focus on building, not debugging.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants} className="h-full">
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
