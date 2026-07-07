import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Shield, Trash2, Loader2, ChevronRight, UserMinus, Key, CheckCircle, XCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

export function Members() {
  const { addToast } = useNotifications();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);

  // Invite form parameters
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Developer');

  // Hardcode active workspace ID resolver for current view (uses ensured personal workspace)
  const [activeWsId, setActiveWsId] = useState('');

  const fetchMembers = async () => {
    try {
      // 1. Fetch organization and workspaces to resolve active workspace context
      const wsRes = await axios.get('http://localhost:5000/api/workspaces', { withCredentials: true });
      if (wsRes.data && wsRes.data.length > 0) {
        const wsId = wsRes.data[0]._id;
        setActiveWsId(wsId);

        // 2. Fetch members list
        const res = await axios.get(`http://localhost:5000/api/workspaces/${wsId}/members`, { withCredentials: true });
        if (res.data) {
          setMembers(res.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim() || !activeWsId) return;
    setInviting(true);
    try {
      await axios.post(
        `http://localhost:5000/api/workspaces/${activeWsId}/invite`,
        { email, role },
        { withCredentials: true }
      );
      addToast('Invitation Sent', 'success', `Email invite successfully dispatched to '${email}'.`);
      setEmail('');
    } catch (err) {
      console.error(err);
      addToast('Dispatch Failure', 'error', 'Unable to send workspace invitation.');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.patch(`http://localhost:5000/api/members/${id}/role`, { role: newRole }, { withCredentials: true });
      addToast('Role Updated', 'success', `Teammate status promoted to '${newRole}'.`);
      fetchMembers();
    } catch (err) {
      console.error(err);
      addToast('Update Failed', 'error', 'Unable to change member role.');
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member from the workspace?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/members/${id}`, { withCredentials: true });
      addToast('Member Removed', 'info', 'Teammate workspace credentials revoked.');
      fetchMembers();
    } catch (err) {
      console.error(err);
      addToast('Revocation Failed', 'error', 'Unable to remove member.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Loading team directory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans select-none pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-text-secondary text-[11px] font-bold uppercase tracking-wider mb-1.5">
          <span>Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Team Members</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-brand-blue" />
          Teammate Management
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">
          Invite developers, change administrative access levels, and inspect access logs.
        </p>
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Invites and Members table (7 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Invite block */}
          <div className="glass-card border border-white/[0.08] p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Invite Team Member</h3>
            <form onSubmit={handleInvite} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@qapilot.app"
                className="flex-1 bg-white/[0.02] border border-white/[0.08] rounded-xl text-white text-xs px-3 focus:outline-none focus:border-brand-blue/50"
                required
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-white/[0.02] border border-white/[0.08] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="Admin" className="bg-[#0b0e14]">Admin</option>
                <option value="Developer" className="bg-[#0b0e14]">Developer</option>
                <option value="Viewer" className="bg-[#0b0e14]">Viewer</option>
              </select>
              <button
                type="submit"
                disabled={inviting}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer"
              >
                {inviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Invite
              </button>
            </form>
          </div>

          {/* Members Table */}
          <div className="glass-card border border-white/[0.08] p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-4">Teammate Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Role</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs">
                  {members.map((m) => (
                    <tr key={m._id} className="hover:bg-white/[0.01]">
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{m.userId?.name || 'Pending Invite'}</span>
                          <span className="text-[10px] text-brand-text-secondary font-mono">{m.userId?.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {m.role === 'Owner' ? (
                          <span className="text-[10px] font-bold uppercase text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2 py-0.5 rounded-md">
                            Owner
                          </span>
                        ) : (
                          <select
                            value={m.role}
                            onChange={(e) => handleRoleChange(m._id, e.target.value)}
                            className="bg-transparent border-0 text-brand-text-primary text-xs focus:outline-none cursor-pointer"
                          >
                            <option value="Admin" className="bg-[#0b0e14]">Admin</option>
                            <option value="Developer" className="bg-[#0b0e14]">Developer</option>
                            <option value="Viewer" className="bg-[#0b0e14]">Viewer</option>
                          </select>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {m.role !== 'Owner' && (
                          <button
                            onClick={() => handleRemove(m._id)}
                            className="text-red-400 hover:text-red-300 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 cursor-pointer transition-colors"
                            title="Remove Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Permission Matrix (4 cols) */}
        <div className="lg:col-span-4">
          <div className="glass-card border border-white/[0.08] p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-brand-blue" />
              Role Permission Matrix
            </h3>
            <p className="text-[11px] text-brand-text-secondary leading-relaxed">
              Verify administrative scope constraints for standard system tiers.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                <span className="font-bold text-white">Owner</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase">Full Access</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                <span className="font-bold text-white">Admin</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase">All Except Billing</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                <span className="font-bold text-white">Developer</span>
                <span className="text-[9px] font-bold text-brand-blue uppercase">Scans & Deploys</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                <span className="font-bold text-white">Viewer</span>
                <span className="text-[9px] font-bold text-brand-text-muted uppercase">Read Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Members;
