import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Check, X, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

export function Invitations() {
  const { addToast } = useNotifications();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccept = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/invitations/accept',
        { token },
        { withCredentials: true }
      );
      if (res.data) {
        addToast('Joined Workspace', 'success', res.data.message);
        setToken('');
      }
    } catch (err) {
      console.error(err);
      addToast('Redemption Failed', 'error', err.response?.data?.message || 'Unable to accept invitation token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto font-sans select-none pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-text-secondary text-[11px] font-bold uppercase tracking-wider mb-1.5">
          <span>Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Invitations</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Mail className="w-6 h-6 text-brand-blue" />
          Redeem Invitation
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">
          Paste workspace invitation security token parameters to verify and join engineering teams.
        </p>
      </div>

      {/* Redemption card */}
      <div className="glass-card border border-white/[0.08] p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Workspace Security Token</h3>
            <p className="text-[10px] text-brand-text-secondary mt-0.5">Dispatched by workspace owners.</p>
          </div>
        </div>

        <form onSubmit={handleAccept} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-brand-text-secondary uppercase">Invitation Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="e.g. 5f4d8a9c..."
              className="w-full bg-[#05070a] border border-white/[0.08] focus:border-brand-blue/50 rounded-xl text-white font-mono text-xs px-3 py-2.5 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-brand-blue/15"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Join Workspace Team
          </button>
        </form>
      </div>
    </div>
  );
}

export default Invitations;
