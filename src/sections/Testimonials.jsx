import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../components/common/Container';
import { TestimonialCard } from '../components/ui/TestimonialCard';

const TESTIMONIALS = [
  {
    name: 'Marcus Chen',
    role: 'VP of Engineering',
    company: 'NovaTech',
    quote:
      "QAPilot caught a critical auth regression three seconds after our push. We didn't even have time to open Slack. The AI report explained exactly what broke and why — our team was blown away.",
  },
  {
    name: 'Priya Nair',
    role: 'Lead Developer',
    company: 'CloudForge',
    quote:
      "We went from 12-hour QA cycles to under a minute. The confidence score system is a game-changer — our stakeholders now get a real number instead of hoping we tested everything.",
  },
  {
    name: 'Jordan Ellis',
    role: 'CTO',
    company: 'ByteStack',
    quote:
      "Integrating QAPilot took literally five minutes. Our pipeline went from a dumb script runner to an intelligent system that actually understands our codebase. It feels like hiring a QA team that never sleeps.",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="Customer Testimonials"
      className="relative w-full py-28 overflow-hidden"
    >
      {/* Ambient glow node */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-cyan/3 rounded-full blur-[180px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/4 bottom-0 w-[400px] h-[400px] bg-brand-blue/4 rounded-full blur-[160px] pointer-events-none"
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
            Testimonials
          </span>
          <h2 className="text-heading text-white font-extrabold max-w-xl leading-tight tracking-tight">
            Loved by{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan">
              Engineering Teams
            </span>
          </h2>
          <p className="text-body text-brand-text-secondary max-w-lg">
            Thousands of developers trust QAPilot to catch what manual testing misses — every single deploy.
          </p>
        </motion.div>

        {/* Testimonial card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard
              key={t.name}
              name={t.name}
              role={t.role}
              company={t.company}
              quote={t.quote}
              index={i}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
