import React from 'react';
import { ShieldCheck, ShieldAlert, RefreshCw, Link2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="text-white" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export function IntegrationStatusCard({ status, githubUser, onConnect, onDisconnect, error }) {
  const cardVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.06] backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center flex-shrink-0">
          <GithubIcon />
        </div>
        <div>
          <h4 className="text-[14px] font-extrabold text-white tracking-tight">GitHub Integration</h4>
          {status === 'connected' && githubUser ? (
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-[12px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Connected as {githubUser.user}
              </p>
              <p className="text-[11px] text-brand-text-secondary">All repository push triggers are listening.</p>
            </div>
          ) : status === 'connecting' || status === 'syncing' ? (
            <p className="text-[12px] text-brand-blue font-semibold flex items-center gap-1.5 mt-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Establishing authorization tunnel...
            </p>
          ) : status === 'error' ? (
            <div className="mt-1">
              <p className="text-[12px] text-red-400 font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Connection Error
              </p>
              <p className="text-[11px] text-red-400/80 mt-0.5 leading-relaxed">{error || 'Failed to authenticate connection.'}</p>
            </div>
          ) : (
            <div className="mt-1">
              <p className="text-[12px] text-brand-text-secondary flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Not Connected
              </p>
              <p className="text-[11px] text-brand-text-secondary mt-0.5 leading-relaxed">
                Connect your account to allow automatic checks on push, pull-request quality scans, and automated branch testing.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="self-stretch md:self-auto flex items-center justify-end">
        {status === 'connected' ? (
          <button
            onClick={onDisconnect}
            className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/80 border border-red-500/20 hover:border-red-500/50 transition-all duration-300 select-none text-center"
          >
            Disconnect Account
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={status === 'connecting' || status === 'syncing'}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue-hover border border-white/[0.08] hover:shadow-lg hover:shadow-brand-blue/20 transition-all duration-300 flex items-center justify-center gap-2 select-none"
          >
            <Link2 className="w-3.5 h-3.5" />
            Connect GitHub
          </button>
        )}
      </div>
    </motion.div>
  );
}
export default IntegrationStatusCard;
