import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Mail, Shield, ToggleLeft, ToggleRight } from 'lucide-react';

export function ScanConfiguration({ onSave, loading }) {
  const [defaultBranch, setDefaultBranch] = useState('main');
  const [scanOnPush, setScanOnPush] = useState(true);
  const [scanPR, setScanPR] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [email, setEmail] = useState('notifications@qapilot.io');
  const [sensitivity, setSensitivity] = useState('balanced'); // basic | balanced | strict

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        defaultBranch,
        scanOnPush,
        scanPR,
        weeklyReport,
        email,
        sensitivity,
      });
    }
  };

  const sensitivities = [
    { id: 'basic', title: 'Basic', desc: 'Critical errors & security alerts.' },
    { id: 'balanced', title: 'Balanced', desc: 'Code smells, security risks & bugs.' },
    { id: 'strict', title: 'Strict', desc: 'Deep lint warnings, performance & styling.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto rounded-3xl bg-white/[0.01] border border-white/[0.05] p-6 sm:p-8 backdrop-blur-md relative my-6"
    >
      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/[0.06]">
        <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-white tracking-tight">Scan Configuration</h3>
          <p className="text-[12px] text-brand-text-secondary mt-0.5">
            Configure scan sensitivity and automation preferences.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Default branch & email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-brand-text-secondary">Default Branch</label>
            <input
              type="text"
              value={defaultBranch}
              onChange={(e) => setDefaultBranch(e.target.value)}
              className="px-3.5 py-2.5 bg-white/[0.01] border border-white/[0.08] text-white text-[13px] rounded-xl focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-mono"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-brand-text-secondary">Notification Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-white/[0.01] border border-white/[0.08] text-white text-[13px] rounded-xl focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-brand-text-secondary">
                <Mail className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Toggle automation switches */}
        <div className="space-y-4 py-3 border-t border-b border-white/[0.04]">
          {/* Toggle 1: Scan on Push */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white">Automatic Scan on Push</p>
              <p className="text-[11px] text-brand-text-secondary mt-0.5">Trigger AI scan automatically on git push.</p>
            </div>
            <button
              type="button"
              onClick={() => setScanOnPush(!scanOnPush)}
              className="focus:outline-none"
              aria-label="Toggle scan on push"
            >
              {scanOnPush ? (
                <ToggleRight className="w-10 h-10 text-brand-blue" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-brand-text-secondary/60" />
              )}
            </button>
          </div>

          {/* Toggle 2: PR Scanning */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white">Pull Request Quality Gates</p>
              <p className="text-[11px] text-brand-text-secondary mt-0.5">Report findings and block checks directly on GitHub PRs.</p>
            </div>
            <button
              type="button"
              onClick={() => setScanPR(!scanPR)}
              className="focus:outline-none"
              aria-label="Toggle pull request scanning"
            >
              {scanPR ? (
                <ToggleRight className="w-10 h-10 text-brand-blue" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-brand-text-secondary/60" />
              )}
            </button>
          </div>

          {/* Toggle 3: Weekly Health Report */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white">Weekly Health Summary Reports</p>
              <p className="text-[11px] text-brand-text-secondary mt-0.5">Deliver workspace quality updates to email inbox.</p>
            </div>
            <button
              type="button"
              onClick={() => setWeeklyReport(!weeklyReport)}
              className="focus:outline-none"
              aria-label="Toggle weekly report emails"
            >
              {weeklyReport ? (
                <ToggleRight className="w-10 h-10 text-brand-blue" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-brand-text-secondary/60" />
              )}
            </button>
          </div>
        </div>

        {/* AI Sensitivity selector */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold text-brand-text-secondary flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            AI Scan Sensitivity
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sensitivities.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSensitivity(s.id)}
                className={`p-3.5 rounded-xl border text-left flex flex-col transition-all cursor-pointer ${
                  sensitivity === s.id
                    ? 'bg-brand-blue/10 border-brand-blue/40 text-white shadow-lg shadow-brand-blue/5'
                    : 'bg-white/[0.005] border-white/[0.06] text-brand-text-secondary hover:border-white/[0.12] hover:text-white'
                }`}
              >
                <span className="text-xs font-bold">{s.title}</span>
                <span className="text-[10px] opacity-80 mt-1 leading-relaxed">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand-blue/20 border border-white/[0.08]"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving Preferences...' : 'Save Configuration & Finish'}
        </button>
      </form>
    </motion.div>
  );
}
export default ScanConfiguration;
