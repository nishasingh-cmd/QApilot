import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Building2, Plus, Shield, Calendar, Loader2, Link as LinkIcon, User } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

export function Organization() {
  const { addToast } = useNotifications();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchOrgs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/organizations', { withCredentials: true });
      if (res.data) {
        setOrgs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await axios.post('http://localhost:5000/api/organizations', { name }, { withCredentials: true });
      addToast('Tenant Registered', 'success', `Organization '${name}' created successfully.`);
      setName('');
      fetchOrgs();
    } catch (err) {
      console.error(err);
      addToast('Creation Failed', 'error', 'Unable to create organization.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Loading organizations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans select-none pb-24">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-6 h-6 text-brand-blue" />
          Organizations Console
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">
          Manage multi-tenant SaaS accounts, register teams, and isolate repository environments.
        </p>
      </div>

      {/* Creation Form */}
      <div className="glass-card border border-white/[0.08] p-5 rounded-2xl">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Register New Organization</h3>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Corp, Engineering Group"
            className="flex-1 bg-white/[0.02] border border-white/[0.08] rounded-xl text-white text-xs px-3 focus:outline-none focus:border-brand-blue/50 transition-all"
            required
          />
          <button
            type="submit"
            disabled={creating}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer"
          >
            {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Register
          </button>
        </form>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orgs.map((org) => (
          <div key={org._id} className="glass-card border border-white/[0.08] p-5 rounded-2xl space-y-4 hover:border-brand-blue/30 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-white">{org.name}</h4>
                <span className="text-[10px] font-mono text-brand-text-secondary mt-0.5 block">{org.slug}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Shield className="w-3 h-3" /> Owner Account
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-brand-text-secondary border-t border-white/[0.04] pt-3">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Managed by You
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {new Date(org.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Organization;
