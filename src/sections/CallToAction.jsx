import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Container } from '../components/common/Container';
import { Button } from '../components/ui/Button';

export function CallToAction() {
  return (
    <section
      id="cta"
      aria-label="Call to Action"
      className="relative w-full py-28 overflow-hidden"
    >
      {/* Radial glow — the centerpiece */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[700px] h-[700px] rounded-full bg-brand-blue/8 blur-[160px]" />
      </div>

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
        className="absolute top-12 left-[10%] w-4 h-4 rounded-full bg-brand-blue/30 blur-sm pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 18, 0], x: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        aria-hidden="true"
        className="absolute bottom-16 right-[12%] w-6 h-6 rounded-full bg-brand-cyan/20 blur-sm pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        aria-hidden="true"
        className="absolute top-1/3 right-[20%] w-2 h-2 rounded-full bg-brand-blue/60 pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        aria-hidden="true"
        className="absolute bottom-1/3 left-[15%] w-2.5 h-2.5 rounded-full bg-brand-cyan/40 pointer-events-none"
      />

      {/* Decorative corner dot grid — top right */}
      <div
        aria-hidden="true"
        className="absolute top-8 right-8 w-32 h-32 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(79,140,255,1) 1.5px, transparent 1.5px)',
          backgroundSize: '10px 10px',
        }}
      />
      {/* Decorative corner dot grid — bottom left */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-8 w-32 h-32 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(79,209,255,1) 1.5px, transparent 1.5px)',
          backgroundSize: '10px 10px',
        }}
      />

      <Container>
        {/* Glass card container */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative flex flex-col items-center text-center gap-8 px-6 py-16 md:py-20 rounded-3xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40"
        >
          {/* Inner radial gradient overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(79,140,255,0.1),transparent)] pointer-events-none"
          />
          {/* Top edge glow line */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent"
          />

          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/25 bg-brand-blue/8 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan inline-block animate-pulse" />
            Get Started Today
          </motion.span>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="relative z-10 text-heading text-white font-extrabold max-w-2xl leading-tight tracking-tight"
          >
            Ready to Build{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan">
              Better Software?
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.22 }}
            className="relative z-10 text-body text-brand-text-secondary max-w-lg"
          >
            Join engineering teams using AI-powered testing to ship faster, catch more bugs, and
            deploy with real confidence — starting today.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            className="relative z-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link to="/signup">
              <Button
                variant="primary"
                size="lg"
                className="gap-2.5 px-8 text-[14px]"
              >
                <span>Start Free</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#demo">
              <Button
                variant="glass"
                size="lg"
                className="gap-2.5 px-7 text-[14px]"
              >
                <CalendarDays size={16} />
                <span>Schedule Demo</span>
              </Button>
            </a>
          </motion.div>

          {/* Reassurance line */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative z-10 text-[12px] text-brand-text-muted"
          >
            No credit card required · Setup in under 5 minutes · Cancel anytime
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
