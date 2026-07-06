import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingDown, Users2, Clock4 } from 'lucide-react';
import { Container } from '../components/common/Container';

const DIFFERENTIATORS = [
  'Runs automatically on every GitHub push — no manual triggers',
  'AI understands business logic, not just syntax errors',
  'Zero configuration for Next.js, Vite, and React projects',
  'Confidence scores that block risky merges at the gate',
  'Human-readable reports built for developers, not auditors',
];

const STATS = [
  {
    icon: TrendingDown,
    value: '74%',
    label: 'Reduction in production bugs',
    color: 'text-brand-cyan',
    glow: 'shadow-brand-cyan/20',
  },
  {
    icon: Clock4,
    value: '<60s',
    label: 'Average full-repo analysis',
    color: 'text-brand-blue',
    glow: 'shadow-brand-blue/20',
  },
  {
    icon: Users2,
    value: '2,400+',
    label: 'Engineering teams onboarded',
    color: 'text-purple-400',
    glow: 'shadow-purple-400/20',
  },
];

const floatVariant = (delay = 0) => ({
  animate: {
    y: [0, -10, 0],
    transition: { duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay },
  },
});

export function WhySection() {
  return (
    <section className="relative w-full py-28 overflow-hidden" id="why" aria-label="Why QAPilot">
      {/* Background accent */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[600px] bg-brand-cyan/4 rounded-full blur-[160px] pointer-events-none"
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT: Narrative Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col gap-8"
          >
            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block animate-pulse" />
              Why QAPilot
            </span>

            <h2 className="text-heading text-white font-extrabold leading-tight tracking-tight">
              Traditional QA can't keep up{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan">
                with modern teams.
              </span>
            </h2>

            <p className="text-body text-brand-text-secondary max-w-lg leading-relaxed">
              Manual testing is slow. Generic CI pipelines are blind to logic regressions.
              QAPilot is built from the ground up to understand your application — not just
              run scripts against it.
            </p>

            {/* Differentiator list */}
            <ul className="flex flex-col gap-3.5" aria-label="Key differentiators">
              {DIFFERENTIATORS.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5, ease: 'easeOut' }}
                  className="flex items-start gap-3 text-[14px] text-brand-text-secondary"
                >
                  <CheckCircle2
                    size={18}
                    className="text-brand-blue shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* RIGHT: Floating Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="relative flex flex-col gap-5"
          >
            {STATS.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={floatVariant(i * 0.8)}
                  animate="animate"
                  className={`relative flex items-center gap-5 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl shadow-xl ${stat.glow} hover:border-white/10 transition-all duration-300 group cursor-default`}
                  style={{
                    marginLeft: i === 1 ? '2rem' : i === 2 ? '0.5rem' : '0',
                  }}
                >
                  {/* Glow pulse behind icon */}
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_20%_50%,rgba(79,140,255,0.05),transparent_60%)] pointer-events-none`}
                  />

                  {/* Icon */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.07] shrink-0 ${stat.color}`}>
                    <StatIcon size={22} aria-hidden="true" />
                  </div>

                  {/* Text */}
                  <div>
                    <p className={`text-3xl font-extrabold tracking-tight ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-brand-text-secondary mt-0.5">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}

            {/* Decorative corner dots */}
            <div aria-hidden="true" className="absolute -bottom-6 -right-6 w-24 h-24 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(79,140,255,0.5) 1px, transparent 1px)',
                backgroundSize: '8px 8px',
              }}
            />
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
