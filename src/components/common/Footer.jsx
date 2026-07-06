import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '../common/Container';

// Social icons as inline SVG (lucide-react doesn't export Github/LinkedIn/Twitter)
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterXIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const NAV_COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', to: '#features' },
      { label: 'Pricing', to: '#pricing' },
      { label: 'Roadmap', to: '#' },
      { label: 'API', to: '#' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation', to: '#' },
      { label: 'Blog', to: '#' },
      { label: 'Support', to: '#' },
      { label: 'Status', to: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '#' },
      { label: 'Careers', to: '#' },
      { label: 'Privacy', to: '#' },
      { label: 'Terms', to: '#' },
    ],
  },
];

const SOCIALS = [
  { label: 'GitHub', Icon: GithubIcon, href: 'https://github.com' },
  { label: 'LinkedIn', Icon: LinkedinIcon, href: 'https://linkedin.com' },
  { label: 'Twitter / X', Icon: TwitterXIcon, href: 'https://twitter.com' },
];

function FooterLink({ to, children }) {
  const isExternal = to.startsWith('http');
  const className =
    'text-[13px] text-brand-text-muted hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:text-brand-blue';
  if (isExternal) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer
      className="relative w-full border-t border-white/[0.06] bg-brand-bg-secondary/60 backdrop-blur-sm mt-2"
      aria-label="Site footer"
    >
      {/* Top edge glow line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-brand-blue/20 to-transparent pointer-events-none"
      />

      <Container>
        <div className="py-16">
          {/* 4-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

            {/* Column 1: Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-5"
            >
              {/* Logo */}
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-md w-fit"
                aria-label="QAPilot home"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-blue flex items-center justify-center shadow-md shadow-brand-blue/40">
                  <span className="text-white text-[11px] font-extrabold tracking-tight select-none">QA</span>
                </div>
                <span className="text-[15px] font-extrabold text-white tracking-tight">QAPilot</span>
              </Link>

              <p className="text-[13px] text-brand-text-muted leading-relaxed max-w-[220px]">
                AI-powered quality assurance for engineering teams that care about shipping
                reliable software.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3" aria-label="Social links">
                {SOCIALS.map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] text-brand-text-muted hover:text-white hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Columns 2-4: Navigation */}
            {NAV_COLUMNS.map((col, i) => (
              <motion.nav
                key={col.heading}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 * (i + 1) }}
                aria-label={`${col.heading} links`}
              >
                <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-text-muted mb-5">
                  {col.heading}
                </h3>
                <ul className="flex flex-col gap-3.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink to={link.to}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </motion.nav>
            ))}

          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 border-t border-white/[0.05] text-[12px] text-brand-text-muted">
          <span>© 2026 QAPilot. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built with{' '}
            <span className="text-brand-danger" aria-label="love">❤️</span>
            {' '}for modern engineering teams.
          </span>
        </div>
      </Container>
    </footer>
  );
}
