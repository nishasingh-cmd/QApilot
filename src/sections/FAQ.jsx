import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../components/common/Container';
import { FAQItem } from '../components/ui/FAQItem';

const FAQ_DATA = [
  {
    question: "What is QAPilot?",
    answer:
      "QAPilot is an AI-powered quality assurance platform that automatically analyzes your web applications after every GitHub push. It detects bugs, regressions, accessibility issues, and performance problems — then generates structured reports so your team can ship software with confidence.",
  },
  {
    question: "How does AI bug detection work?",
    answer:
      "Our neural engine analyzes the changed files in each commit, maps data flows, and cross-references known bug patterns with your application\u2019s logic. Unlike traditional linters or test runners, QAPilot understands intent \u2014 not just syntax \u2014 so it catches regressions that scripts miss.",
  },
  {
    question: "Does it integrate with GitHub?",
    answer:
      "Yes. QAPilot integrates natively with GitHub via OAuth. Once connected, every push or pull request automatically triggers a QA scan. Reports are attached directly to the PR so your reviewers see quality scores without leaving GitHub.",
  },
  {
    question: "Can I use it with CI/CD pipelines?",
    answer:
      "Absolutely. QAPilot exposes a REST API and webhooks so you can embed it into any CI/CD workflow \u2014 GitHub Actions, CircleCI, GitLab CI, Jenkins, and more. You can configure it to block merges if the confidence score drops below your threshold.",
  },
  {
    question: "Is there a Free plan?",
    answer:
      "Yes. The Free plan supports one repository with weekly AI scans and basic bug reports \u2014 no credit card required. It\u2019s ideal for solo developers and students exploring AI-powered testing. You can upgrade to Pro at any time.",
  },
  {
    question: "How secure is my code?",
    answer:
      "Security is our highest priority. All code analysis happens inside isolated, ephemeral containers \u2014 your source code is never stored on our servers. Enterprise customers get private cloud deployment, SOC 2 compliance, audit logs, and SSO. See our Security page for the full breakdown.",
  },
];


export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  function toggle(i) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="relative w-full py-28 overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[450px] h-[500px] bg-brand-cyan/3 rounded-full blur-[180px] pointer-events-none"
      />

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center text-center mb-12 gap-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan inline-block" />
            FAQ
          </span>
          <h2 className="text-heading text-white font-extrabold max-w-lg leading-tight tracking-tight">
            Frequently Asked{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan">
              Questions
            </span>
          </h2>
          <p className="text-body text-brand-text-secondary max-w-md">
            Everything you need to know about QAPilot. Can't find your answer?{' '}
            <a href="mailto:support@qapilot.io" className="text-brand-blue hover:underline underline-offset-2">
              Reach out to us.
            </a>
          </p>
        </motion.div>

        {/* Accordion */}
        <div
          className="max-w-2xl mx-auto flex flex-col gap-3"
          role="list"
          aria-label="FAQ accordion"
        >
          {FAQ_DATA.map((item, i) => (
            <div key={i} role="listitem">
              <FAQItem
                question={item.question}
                answer={item.answer}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
