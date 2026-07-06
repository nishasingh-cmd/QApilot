import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Container } from '../components/common/Container';
import { Button } from '../components/ui/Button';
import { HeroDashboardPreview } from '../components/common/HeroDashboardPreview';
import { TrustedLogos } from '../sections/TrustedLogos';
import { FeaturesSection } from '../sections/FeaturesSection';
import { HighlightChips } from '../sections/HighlightChips';
import { WhySection } from '../sections/WhySection';
import { ProductShowcase } from '../sections/ProductShowcase';
import { HowItWorks } from '../sections/HowItWorks';
import { Testimonials } from '../sections/Testimonials';
import { CallToAction } from '../sections/CallToAction';
import { Pricing } from '../sections/Pricing';
import { FAQ } from '../sections/FAQ';
import { Newsletter } from '../components/common/Newsletter';

// Shared animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, filter: 'blur(10px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 100, damping: 18 },
  },
};

const bgLightVariants = {
  animate: {
    scale: [1, 1.1, 0.95, 1],
    x: [0, 20, -20, 0],
    y: [0, -30, 20, 0],
    transition: { duration: 15, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Divider component — subtle horizontal rule between sections
function SectionDivider() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-border/60 to-transparent" />
    </div>
  );
}

export function Home() {
  return (
    <div className="relative w-full bg-brand-bg overflow-x-hidden select-none">

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        aria-label="Hero"
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background Layer 1: Ambient Grid Texture */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.8] pointer-events-none z-0" />

        {/* Background Layer 2: Blurred Gradient Nodes */}
        <motion.div
          variants={bgLightVariants}
          animate="animate"
          className="absolute top-[10%] left-[45%] -translate-x-1/2 w-[600px] h-[600px] bg-brand-blue/8 rounded-full blur-[140px] pointer-events-none z-0"
        />
        <motion.div
          animate={{
            scale: [1, 0.9, 1.05, 1],
            x: [0, -30, 15, 0],
            y: [0, 20, -10, 0],
            transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute bottom-[15%] right-[10%] w-[450px] h-[450px] bg-brand-cyan/4 rounded-full blur-[120px] pointer-events-none z-0"
        />

        {/* Background Layer 3: Drifting Particle Stars */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <motion.div
            animate={{ y: [0, -40, 0], opacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[25%] left-[12%] w-1.5 h-1.5 rounded-full bg-brand-blue shadow-lg shadow-brand-blue/50"
          />
          <motion.div
            animate={{ y: [0, -60, 0], opacity: [0.1, 0.35, 0.1] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-[65%] left-[28%] w-2 h-2 rounded-full bg-brand-cyan shadow-lg shadow-brand-cyan/50"
          />
          <motion.div
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-[15%] right-[25%] w-1.5 h-1.5 rounded-full bg-brand-blue shadow-lg shadow-brand-blue/50"
          />
          <motion.div
            animate={{ y: [0, -50, 0], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-[20%] right-[40%] w-2 h-2 rounded-full bg-white shadow-lg shadow-white/40"
          />
        </div>

        {/* Hero Content Grid */}
        <Container className="relative z-20 w-full py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">

            {/* Left Column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:gap-8"
            >
              {/* Eyebrow badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-brand-blue/20 bg-brand-blue/5 backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan" />
                </span>
                <span className="text-[12px] font-semibold tracking-wider text-brand-blue uppercase">
                  AI-Powered Quality Assurance
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-display text-white max-w-2xl leading-[1.08] tracking-tight font-extrabold"
              >
                Ship Better Software with{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue via-brand-blue to-brand-cyan">
                  AI-Powered
                </span>{' '}
                Testing.
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-body text-brand-text-secondary max-w-[620px]"
              >
                QAPilot automatically analyzes every deployment, detects bugs, generates
                intelligent reports, and helps engineering teams release software with confidence.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2.5 px-7 text-[14px]">
                    <span>Start Free</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <a href="#demo" className="w-full sm:w-auto">
                  <Button variant="glass" size="lg" className="w-full sm:w-auto gap-2.5 px-6 text-[14px]">
                    <Play size={14} fill="currentColor" />
                    <span>Watch Demo</span>
                  </Button>
                </a>
              </motion.div>
            </motion.div>

            {/* Right Column: Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              className="lg:col-span-5 flex items-center justify-center"
            >
              <div className="relative w-full flex justify-center py-10 lg:py-0">
                <HeroDashboardPreview />
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ─── TRUSTED LOGOS ───────────────────────────────────────────────── */}
      <TrustedLogos />

      {/* ─── HIGHLIGHT CHIPS ─────────────────────────────────────────────── */}
      <HighlightChips />

      <SectionDivider />

      {/* ─── FEATURES ────────────────────────────────────────────────────── */}
      <FeaturesSection />

      <SectionDivider />

      {/* ─── WHY QAPILOT ─────────────────────────────────────────────────── */}
      <WhySection />

      <SectionDivider />

      {/* ─── PRODUCT SHOWCASE ─────────────────────────────────────────────── */}
      <ProductShowcase />

      <SectionDivider />

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <HowItWorks />

      <SectionDivider />

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <Testimonials />

      <SectionDivider />

      {/* ─── CALL TO ACTION ───────────────────────────────────────────────── */}
      <CallToAction />

      <SectionDivider />

      {/* ─── PRICING ───────────────────────────────────────────────────── */}
      <Pricing />

      <SectionDivider />

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      <FAQ />

      <SectionDivider />

      {/* ─── NEWSLETTER ─────────────────────────────────────────────────── */}
      <div className="pb-20">
        <Newsletter />
      </div>

    </div>
  );
}
