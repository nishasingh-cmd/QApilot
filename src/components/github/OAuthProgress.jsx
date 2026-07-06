import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, ShieldCheck, Database, Key } from 'lucide-react';

export function OAuthProgress({ onSuccess, onFailure }) {
  const [currentStep, setCurrentStep] = useState(0); // 0: auth, 1: access, 2: fetch, 3: success

  const steps = [
    {
      title: 'Authorizing Application',
      description: 'Redirecting OAuth handshake with github.com secure API...',
      icon: Key,
      color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20',
    },
    {
      title: 'Granting Repository Access',
      description: 'Applying workspace permissions and security scopes...',
      icon: ShieldCheck,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Fetching Repositories',
      description: 'Retrieving your active repositories and branches...',
      icon: Database,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Connection Successful',
      description: 'Tunnel established! Syncing initial workspace details...',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  useEffect(() => {
    // Step 0 -> Step 1 after 1500ms
    const t1 = setTimeout(() => setCurrentStep(1), 1500);
    // Step 1 -> Step 2 after 3000ms
    const t2 = setTimeout(() => setCurrentStep(2), 3000);
    // Step 2 -> Step 3 after 4500ms
    const t3 = setTimeout(() => setCurrentStep(3), 4500);

    // Final Success Callback after 5800ms
    const t4 = setTimeout(() => {
      if (onSuccess) {
        onSuccess({
          user: 'github-user-qapilot',
          avatar: 'https://avatars.githubusercontent.com/u/9919?v=4',
        });
      }
    }, 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onSuccess]);

  const activeStep = steps[currentStep];
  const StepIcon = activeStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md rounded-3xl bg-[#0b0e14]/90 border border-white/[0.08] p-8 shadow-2xl overflow-hidden text-center"
      >
        {/* Glow ambient */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none" />

        {/* Dynamic Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {currentStep < 3 && (
              <div className="absolute -inset-2 rounded-full border-2 border-brand-blue/10 border-t-brand-blue animate-spin" />
            )}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border relative z-10 ${activeStep.color}`}>
              <StepIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Text descriptions */}
        <h3 className="text-base font-extrabold text-white tracking-tight mb-2">
          {activeStep.title}
        </h3>
        <p className="text-xs text-brand-text-secondary leading-relaxed max-w-[280px] mx-auto min-h-[40px]">
          {activeStep.description}
        </p>

        {/* Stepper Progress bar indicators */}
        <div className="flex justify-center gap-1.5 mt-8">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentStep
                  ? 'w-6 bg-brand-blue'
                  : idx < currentStep
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-white/[0.06]'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
export default OAuthProgress;
