import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Mail, MessageSquare, Compass, Send, Check } from 'lucide-react';
import { useReports } from '../../context/ReportsContext';

export function ShareReportModal() {
  const { shareReport: r, setShareReport, shareLoading, shareOne } = useReports();
  const [method, setMethod] = useState('link'); // link, email, slack, teams
  const [emailInput, setEmailInput] = useState('');
  const [copied, setCopied] = useState(false);

  if (!r) return null;

  const mockShareUrl = `https://qapilot.io/share/report/${r.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareSubmit = () => {
    const target = method === 'email' ? emailInput : method;
    shareOne(r.id, method, target);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShareReport(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-[#0b0e14] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden select-none z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
            <div>
              <h2 className="text-sm font-bold text-white">Share AI Quality Report</h2>
              <p className="text-[10px] text-brand-text-secondary mt-0.5 truncate max-w-[320px]">
                {r.name}
              </p>
            </div>
            <button
              onClick={() => setShareReport(null)}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] text-brand-text-secondary hover:text-white transition-all"
              aria-label="Close share dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Share navigation pills */}
          <div className="p-5 pb-3 flex border-b border-white/[0.04] bg-white/[0.005] gap-2.5">
            <button
              onClick={() => setMethod('link')}
              className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                method === 'link'
                  ? 'bg-brand-blue/10 border-brand-blue/30 text-white'
                  : 'bg-transparent border-white/[0.04] text-brand-text-secondary hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              Copy Link
            </button>
            <button
              onClick={() => setMethod('email')}
              className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                method === 'email'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                  : 'bg-transparent border-white/[0.04] text-brand-text-secondary hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => setMethod('slack')}
              className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                method === 'slack'
                  ? 'bg-purple-500/10 border-purple-500/30 text-white'
                  : 'bg-transparent border-white/[0.04] text-brand-text-secondary hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Slack
            </button>
            <button
              onClick={() => setMethod('teams')}
              className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                method === 'teams'
                  ? 'bg-brand-blue/10 border-brand-blue/30 text-white'
                  : 'bg-transparent border-white/[0.04] text-brand-text-secondary hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Teams
            </button>
          </div>

          {/* Form Content body */}
          <div className="p-5 space-y-4 min-h-[120px] flex flex-col justify-center">
            {method === 'link' && (
              <div className="space-y-2.5">
                <span className="text-[9px] font-bold text-brand-text-secondary/70 uppercase tracking-wider">Secure sharing link</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={mockShareUrl}
                    className="flex-1 bg-white/[0.02] border border-white/[0.08] text-xs font-mono px-3.5 py-2.5 rounded-xl text-brand-text-secondary select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white text-xs font-bold border border-white/[0.08] transition-all flex items-center gap-1.5 shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {method === 'email' && (
              <div className="space-y-2.5">
                <span className="text-[9px] font-bold text-brand-text-secondary/70 uppercase tracking-wider">Email Addresses (comma separated)</span>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="engineering-leads@company.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 bg-white/[0.02] border border-white/[0.08] text-xs px-3.5 py-2.5 rounded-xl text-white focus:outline-none focus:border-brand-blue/50"
                  />
                  <button
                    disabled={shareLoading || !emailInput}
                    onClick={handleShareSubmit}
                    className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-lg shadow-brand-blue/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </div>
              </div>
            )}

            {(method === 'slack' || method === 'teams') && (
              <div className="text-center space-y-3.5">
                <p className="text-xs text-brand-text-secondary/80 leading-relaxed px-4">
                  Dispatch quality reports summary notifications into your active webhook channels.
                </p>
                <button
                  disabled={shareLoading}
                  onClick={handleShareSubmit}
                  className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold transition-all shadow-lg shadow-brand-blue/20"
                >
                  Confirm Integration Dispatch
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default ShareReportModal;
