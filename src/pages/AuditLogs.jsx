import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Shield, Clock, Loader2, Info, Calendar, User, Globe } from 'lucide-react';

export function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/audit', { withCredentials: true });
      if (res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionColor = (action) => {
    if (action.includes('CREATE')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (action.includes('DELETE') || action.includes('REMOVE')) return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-brand-blue bg-brand-blue/10 border-brand-blue/20';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Loading security audit trail...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans select-none pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Shield className="w-6 h-6 text-brand-blue" />
          Security Audit Logs
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">
          Trace administrative changes, membership adjustments, and tenant actions.
        </p>
      </div>

      {/* Logs Table */}
      <div className="glass-card border border-white/[0.08] p-5 rounded-2xl">
        <h3 className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-4">Audit Logs Activity</h3>
        
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-xs text-brand-text-secondary">
              No audit logs captured. Try updating repository settings or creating workspaces to generate audit activity.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-white/[0.015] border border-white/[0.04] gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="text-xs font-bold text-white">Target: {log.target}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-brand-text-secondary">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-brand-text-muted" /> {log.userId?.name || log.userId?.email || 'System'}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Globe className="w-3.5 h-3.5 text-brand-text-muted" /> {log.ipAddress}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-brand-text-secondary shrink-0 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;
