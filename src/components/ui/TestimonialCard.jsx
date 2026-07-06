import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// Avatar initials generator
function Avatar({ name }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const hues = [210, 180, 260];
  const hue = hues[name.length % hues.length];
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 border border-white/10"
      style={{ background: `linear-gradient(135deg, hsl(${hue},80%,45%), hsl(${hue + 30},90%,60%))` }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export function TestimonialCard({ name, role, company, quote, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.12 * index }}
      whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(79,140,255,0.12)' }}
      className="flex flex-col gap-5 p-7 rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl shadow-xl shadow-black/30 transition-all duration-300 group cursor-default h-full"
      tabIndex={0}
      aria-label={`Testimonial from ${name}, ${role} at ${company}`}
    >
      {/* Star rating */}
      <div className="flex items-center gap-1" aria-label="5 star rating">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} className="text-brand-warning fill-brand-warning" aria-hidden="true" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-[14px] text-brand-text-secondary leading-relaxed flex-1 italic relative">
        <span className="text-brand-blue text-3xl leading-none font-serif not-italic absolute -top-2 -left-1 opacity-40" aria-hidden="true">"</span>
        <span className="relative z-10 pl-4 block">{quote}</span>
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.05]">
        <Avatar name={name} />
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-white group-hover:text-brand-blue transition-colors duration-200 truncate">{name}</p>
          <p className="text-[11px] text-brand-text-muted truncate">{role} · <span className="text-brand-text-secondary">{company}</span></p>
        </div>
      </div>
    </motion.div>
  );
}
