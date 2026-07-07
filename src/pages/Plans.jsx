import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CreditCard, Check, Loader2, Sparkles } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

export function Plans() {
  const { addToast } = useNotifications();
  const [plans, setPlans] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchPlansData = async () => {
    try {
      const plansRes = await axios.get('http://localhost:5000/api/billing/plans', { withCredentials: true });
      if (plansRes.data) {
        setPlans(plansRes.data);
      }

      const subRes = await axios.get('http://localhost:5000/api/billing/subscription', { withCredentials: true });
      if (subRes.data) {
        setCurrentSub(subRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlansData();
  }, []);

  const handleSubscribe = async (planId, planName) => {
    setProcessingId(planId);
    try {
      await axios.patch(
        'http://localhost:5000/api/billing/change-plan',
        { planId, billingCycle: 'monthly' },
        { withCredentials: true }
      );
      addToast('Plan Upgraded', 'success', `Successfully subscribed to '${planName}'. Invoice created.`);
      fetchPlansData();
    } catch (err) {
      console.error(err);
      addToast('Upgrade Failed', 'error', 'Unable to complete checkout transaction.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Comparing billing plans...</span>
      </div>
    );
  }

  const activePlanId = currentSub?.planId?._id;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans select-none pb-24">
      <div className="text-center space-y-2 max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Select Subscription Plan</h1>
        <p className="text-xs text-brand-text-secondary">
          Choose the billing plan that matches your engineering organization constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isActive = activePlanId === p._id;
          const isEnterprise = p.name === 'Enterprise Team';
          return (
            <div
              key={p._id}
              className={`glass-card border p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden transition-all ${
                isActive
                  ? 'border-brand-blue bg-brand-blue/5'
                  : 'border-white/[0.08] hover:border-brand-blue/30'
              }`}
            >
              {isEnterprise && (
                <div className="absolute top-0 right-0 bg-brand-blue text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-black text-white font-mono">${p.monthlyPrice}</span>
                    <span className="text-[10px] text-brand-text-secondary">/ month</span>
                  </div>
                </div>

                {/* Limits list */}
                <div className="space-y-2 pt-2 text-xs border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-brand-text-primary">{p.repositoryLimit} Repositories limit</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-brand-text-primary">{p.memberLimit} Teammate accounts</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-brand-text-primary">{p.scanLimit} Scans/month</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-brand-text-primary">{p.aiCredits} AI Assistant requests</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-brand-text-primary">{p.deploymentLimit} CI/CD Deployments</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.04] mt-6">
                {isActive ? (
                  <div className="w-full text-center py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(p._id, p.name)}
                    disabled={processingId !== null}
                    className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    {processingId === p._id ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Plans;
