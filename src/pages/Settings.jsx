import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, ChevronRight, Loader2, Info, Shield, Bell, FileText, Zap } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

export function Settings() {
  const { addToast } = useNotifications();
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    autoScan: true,
    scanOnPush: true,
    scanOnPullRequest: true,
    generateReport: false,
    enableNotifications: true
  });

  // 1. Fetch repositories list
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/repositories', { withCredentials: true });
        if (res.data && res.data.length > 0) {
          setRepos(res.data);
          setSelectedRepo(res.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load connected repositories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  // 2. Fetch settings when repository changes
  useEffect(() => {
    if (!selectedRepo) return;
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/repositories/${selectedRepo}/settings`, { withCredentials: true });
        if (res.data) {
          setSettings({
            autoScan: res.data.autoScan ?? true,
            scanOnPush: res.data.scanOnPush ?? true,
            scanOnPullRequest: res.data.scanOnPullRequest ?? true,
            generateReport: res.data.generateReport ?? false,
            enableNotifications: res.data.enableNotifications ?? true
          });
        }
      } catch (err) {
        console.error('Failed to load settings for repository', err);
      }
    };
    fetchSettings();
  }, [selectedRepo]);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    if (!selectedRepo) return;
    setSaving(true);
    try {
      await axios.patch(`http://localhost:5000/api/repositories/${selectedRepo}/settings`, settings, { withCredentials: true });
      addToast('Settings Updated', 'success', 'GitHub integration settings successfully saved.');
    } catch (err) {
      console.error(err);
      addToast('Error Saving Settings', 'error', 'Unable to persist changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Retrieving workspace settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[800px] mx-auto pb-24 font-sans select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-text-secondary text-[11px] font-bold uppercase tracking-wider mb-1.5">
          <span>Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Settings</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">GitHub Integration Settings</h1>
        <p className="text-xs text-brand-text-secondary mt-1">
          Configure scanning pipelines, automatic notifications, and PDF report generators for each repository.
        </p>
      </div>

      {/* Select Repository */}
      <div className="glass-card p-5 rounded-2xl border border-white/[0.08] space-y-4">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-brand-text-secondary">Select Target Repository</label>
          <select
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="w-full mt-2 bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] text-white text-xs rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:border-brand-blue/50 transition-all cursor-pointer font-medium"
          >
            {repos.map((r) => (
              <option key={r._id} value={r._id} className="bg-[#0b0e14]">
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Settings Options */}
      {selectedRepo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Main Switches card */}
          <div className="glass-card rounded-2xl border border-white/[0.08] divide-y divide-white/[0.06]">
            {/* Toggle 1: Auto Scan */}
            <div className="flex items-start justify-between p-5 gap-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-normal">Automatic Code Analysis</h4>
                  <p className="text-[10px] text-brand-text-secondary mt-0.5">Detect issues automatically when GitHub webhooks trigger.</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('autoScan')}
                className={`w-10 h-6 rounded-full p-1 transition-all shrink-0 ${settings.autoScan ? 'bg-brand-blue' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all ${settings.autoScan ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Toggle 2: Scan on Push */}
            <div className="flex items-start justify-between p-5 gap-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-normal">Scan on Push Events</h4>
                  <p className="text-[10px] text-brand-text-secondary mt-0.5">Automatically scan commits pushed to default or secondary branches.</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('scanOnPush')}
                className={`w-10 h-6 rounded-full p-1 transition-all shrink-0 ${settings.scanOnPush ? 'bg-brand-blue' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all ${settings.scanOnPush ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Toggle 3: Scan on PR */}
            <div className="flex items-start justify-between p-5 gap-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-normal">Scan on Pull Request Events</h4>
                  <p className="text-[10px] text-brand-text-secondary mt-0.5">Audit new PR commits automatically to secure code reviews.</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('scanOnPullRequest')}
                className={`w-10 h-6 rounded-full p-1 transition-all shrink-0 ${settings.scanOnPullRequest ? 'bg-brand-blue' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all ${settings.scanOnPullRequest ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Toggle 4: PDF Report */}
            <div className="flex items-start justify-between p-5 gap-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-normal">Generate Reports Automatically</h4>
                  <p className="text-[10px] text-brand-text-secondary mt-0.5">Generate client-ready PDF reports immediately upon successful scans.</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('generateReport')}
                className={`w-10 h-6 rounded-full p-1 transition-all shrink-0 ${settings.generateReport ? 'bg-brand-blue' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all ${settings.generateReport ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Toggle 5: Notifications */}
            <div className="flex items-start justify-between p-5 gap-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-normal">Enable Notifications</h4>
                  <p className="text-[10px] text-brand-text-secondary mt-0.5">Receive in-app alerts and notifications for push events and scans.</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('enableNotifications')}
                className={`w-10 h-6 rounded-full p-1 transition-all shrink-0 ${settings.enableNotifications ? 'bg-brand-blue' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all ${settings.enableNotifications ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-brand-blue/15"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Configuration Settings
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Settings;
