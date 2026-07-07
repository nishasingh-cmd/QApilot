import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CreditCard, Shield, Sparkles, Calendar, Layers, Clock, AlertCircle, ChevronRight, Loader2, ArrowUpRight } from 'lucide-react';

export function Billing() {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/billing/subscription', { withCredentials: true });
        if (res.data) {
          setSub(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Resolving active subscription context...</span>
      </div>
    );
  }

  const plan = sub?.planId;

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans select-none pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-text-secondary text-[11px] font-bold uppercase tracking-wider mb-1.5">
          <span>Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Billing & Subscriptions</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-brand-blue" />
          Billing Console
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">
          Manage subscriptions, select pricing plans, and inspect usage limits.
        </p>
      </div>

      {/* Subscription Card */}
      <div className="glass-card border border-white/[0.08] p-6 rounded-3xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.06] pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2.5 py-1 rounded-md">
              Active Subscription Plan
            </span>
            <h2 className="text-xl font-black text-white tracking-tight pt-1">
              {plan?.name || 'Free Trial'}
            </h2>
          </div>

          <Link
            to="/dashboard/plans"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold transition-all shadow-lg shadow-brand-blue/15"
          >
            Upgrade Plan <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Sub Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
          <div className="space-y-1">
            <span className="text-brand-text-secondary font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-text-muted" /> Renewal Interval
            </span>
            <p className="text-white font-medium uppercase font-mono">{sub?.billingCycle || 'monthly'}</p>
          </div>

          <div className="space-y-1">
            <span className="text-brand-text-secondary font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-text-muted" /> Renewal Date
            </span>
            <p className="text-white font-medium font-mono">
              {sub?.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-brand-text-secondary font-bold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-brand-text-muted" /> Status
            </span>
            <div>
              <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${
                sub?.status === 'active' || sub?.status === 'trialing'
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              }`}>
                {sub?.status || 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub menu columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/dashboard/usage"
          className="glass-card border border-white/[0.08] p-5 rounded-2xl flex flex-col justify-between hover:border-brand-blue/30 transition-all group"
        >
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-brand-blue transition-colors">Workspace Usage</h3>
            <p className="text-[11px] text-brand-text-secondary mt-1 leading-normal">
              Inspect scanned repositories, AI credits, and active team member slots.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-blue mt-4 flex items-center gap-0.5">
            View usage dashboard <ChevronRight className="w-4.5 h-4.5" />
          </span>
        </Link>

        <Link
          to="/dashboard/invoices"
          className="glass-card border border-white/[0.08] p-5 rounded-2xl flex flex-col justify-between hover:border-brand-blue/30 transition-all group"
        >
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-brand-blue transition-colors">Invoices History</h3>
            <p className="text-[11px] text-brand-text-secondary mt-1 leading-normal">
              Download payment receipts and review past transactions.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-blue mt-4 flex items-center gap-0.5">
            View invoices ledger <ChevronRight className="w-4.5 h-4.5" />
          </span>
        </Link>

        <Link
          to="/dashboard/plans"
          className="glass-card border border-white/[0.08] p-5 rounded-2xl flex flex-col justify-between hover:border-brand-blue/30 transition-all group"
        >
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-brand-blue transition-colors">Pricing Comparison</h3>
            <p className="text-[11px] text-brand-text-secondary mt-1 leading-normal">
              Compare repository limits, scan quotas, and developer features across tiers.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-blue mt-4 flex items-center gap-0.5">
            Upgrade plan tier <ChevronRight className="w-4.5 h-4.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Billing;
