import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Layers, Plus, Calendar, Loader2, Info, FolderGit2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

export function Workspace() {
  const { addToast } = useNotifications();
  const [workspaces, setWorkspaces] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchWorkspaceData = async () => {
    try {
      const orgRes = await axios.get('http://localhost:5000/api/organizations', { withCredentials: true });
      if (orgRes.data && orgRes.data.length > 0) {
        setOrgs(orgRes.data);
        setSelectedOrg(orgRes.data[0]._id);
      }

      const res = await axios.get('http://localhost:5000/api/workspaces', { withCredentials: true });
      if (res.data) {
        setWorkspaces(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedOrg) return;
    setCreating(true);
    try {
      await axios.post(
        'http://localhost:5000/api/workspaces',
        { name, description: desc, organizationId: selectedOrg },
        { withCredentials: true }
      );
      addToast('Workspace created', 'success', `Workspace '${name}' configured.`);
      setName('');
      setDesc('');
      fetchWorkspaceData();
    } catch (err) {
      console.error(err);
      addToast('Setup Failed', 'error', 'Unable to create workspace.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Loading workspaces...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans select-none pb-24">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-brand-blue" />
          Workspaces Management
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">
          Create and switch workspaces to partition repository projects.
        </p>
      </div>

      {/* Creation form */}
      {orgs.length > 0 && (
        <div className="glass-card border border-white/[0.08] p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Configure New Workspace</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-text-secondary uppercase">Target Organization</label>
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.08] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                >
                  {orgs.map(o => (
                    <option key={o._id} value={o._id} className="bg-[#0b0e14]">
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-text-secondary uppercase">Workspace Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Backend Dev, Frontend QA"
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl text-white text-xs px-3 py-2 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-text-secondary uppercase">Description</label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Optional workspace context description..."
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl text-white text-xs px-3 py-2 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer"
              >
                {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Create Workspace
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Active Workspaces</h3>
        {workspaces.length === 0 ? (
          <div className="text-center py-8 text-xs text-brand-text-secondary">No workspaces initialized yet.</div>
        ) : (
          workspaces.map((ws) => (
            <div key={ws._id} className="glass-card border border-white/[0.08] p-4 rounded-2xl flex items-center justify-between hover:border-brand-blue/20 transition-all">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{ws.name}</h4>
                  <span className="text-[9px] text-brand-text-secondary bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                    {ws.organizationId?.name || 'Default Org'}
                  </span>
                </div>
                {ws.description && <p className="text-[11px] text-brand-text-secondary">{ws.description}</p>}
              </div>

              <div className="flex items-center gap-5 text-xs text-brand-text-secondary">
                <span className="flex items-center gap-1">
                  <FolderGit2 className="w-3.5 h-3.5" /> {ws.repositories?.length || 0} Repositories
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {new Date(ws.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Workspace;
