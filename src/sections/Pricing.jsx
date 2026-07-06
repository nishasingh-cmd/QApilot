import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../components/common/Container';
import { PricingCard, PLANS } from '../components/ui/PricingCard';

export function Pricing() {
  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="relative w-full py-28 overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-blue/5 rounded-full blur-[180px] pointer-events-none"
      />

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center text-center mb-14 gap-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan inline-block" />
            Pricing
          </span>
          <h2 className="text-heading text-white font-extrabold max-w-xl leading-tight tracking-tight">
            Simple pricing for every{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan">
              engineering team.
            </span>
          </h2>
          <p className="text-body text-brand-text-secondary max-w-lg">
            Start for free. Upgrade when you need more power. Cancel anytime, no questions asked.
          </p>
        </motion.div>

        {/* Card grid — center popular card with scale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4 items-stretch">
          {PLANS.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        {/* Reassurance line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10 text-[12px] text-brand-text-muted"
        >
          All plans include a 14-day free trial · No credit card required to start
        </motion.p>
      </Container>
    </section>
  );
}
