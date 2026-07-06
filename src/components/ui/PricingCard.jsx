import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Button } from './Button';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    icon: Zap,
    price: '$0',
    period: '/month',
    description: 'For students and individual developers exploring AI-powered QA.',
    cta: 'Start Free',
    ctaVariant: 'glass',
    ctaTo: '/signup',
    popular: false,
    features: [
      'One repository',
      'Weekly AI scan',
      'Basic bug reports',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Zap,
    price: '$29',
    period: '/month',
    description: 'For growing engineering teams that need continuous, automated quality assurance.',
    cta: 'Start Pro',
    ctaVariant: 'primary',
    ctaTo: '/signup?plan=pro',
    popular: true,
    badge: 'Most Popular',
    features: [
      'Unlimited repositories',
      'Unlimited AI scans',
      'Visual regression testing',
      'Performance reports',
      'Accessibility reports',
      'Priority support',
      'GitHub integration',
      'CI/CD support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Building2,
    price: 'Custom',
    period: '',
    description: 'For large organisations with advanced security, compliance, and scale requirements.',
    cta: 'Contact Sales',
    ctaVariant: 'glass',
    ctaTo: '/contact',
    popular: false,
    features: [
      'Unlimited everything',
      'Single Sign-On (SSO)',
      'Dedicated support',
      'Audit logs',
      'Custom integrations',
      'Security compliance',
      'Full API access',
      'Private cloud deployment',
    ],
  },
];

export function PricingCard({ plan, index = 0 }) {
  const PlanIcon = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 * index }}
      whileHover={{ y: plan.popular ? -10 : -6 }}
      className={cn(
        'relative flex flex-col gap-6 rounded-2xl border p-7 transition-all duration-300 cursor-default',
        plan.popular
          ? 'bg-brand-blue/[0.07] border-brand-blue/30 shadow-2xl shadow-brand-blue/15 scale-[1.03] z-10'
          : 'bg-white/[0.025] border-white/[0.07] hover:border-white/[0.13] shadow-xl shadow-black/30',
      )}
    >
      {/* Animated border glow for popular plan */}
      {plan.popular && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
        >
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-2xl border border-brand-blue/50 shadow-[inset_0_0_30px_rgba(79,140,255,0.08)]"
          />
        </div>
      )}

      {/* Inner radial gradient on popular */}
      {plan.popular && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(79,140,255,0.1),transparent)] pointer-events-none"
        />
      )}

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-text-muted">
            {plan.name}
          </span>
          <div className="flex items-end gap-1">
            <span className={cn('text-4xl font-extrabold tracking-tight', plan.popular ? 'text-white' : 'text-white')}>
              {plan.price}
            </span>
            {plan.period && (
              <span className="text-sm text-brand-text-muted mb-1">{plan.period}</span>
            )}
          </div>
        </div>
        {plan.badge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue text-white text-[11px] font-bold shadow-md shadow-brand-blue/40 shrink-0">
            {plan.badge}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="relative z-10 text-[13px] text-brand-text-secondary leading-relaxed">
        {plan.description}
      </p>

      {/* Divider */}
      <div className="h-px bg-white/[0.06]" />

      {/* Feature list */}
      <ul className="relative z-10 flex flex-col gap-3 flex-1" aria-label={`${plan.name} plan features`}>
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-[13px] text-brand-text-secondary">
            <Check
              size={15}
              className={plan.popular ? 'text-brand-blue shrink-0' : 'text-brand-success shrink-0'}
              aria-hidden="true"
            />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link to={plan.ctaTo} className="relative z-10">
        <Button
          variant={plan.ctaVariant}
          size="lg"
          className={cn('w-full gap-2', plan.popular && 'shadow-lg shadow-brand-blue/30')}
        >
          {plan.cta}
          <ArrowRight size={15} />
        </Button>
      </Link>
    </motion.div>
  );
}

// Export plan data so the section can consume it
export { PLANS };
