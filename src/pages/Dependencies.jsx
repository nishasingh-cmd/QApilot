import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Boxes, 
  FileSpreadsheet, 
  FileJson, 
  FileText,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

export function Dependencies() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useNotifications();

  // Scan & details states
  const [repo, setRepo] = useState(null);
  const [dependencies, setDependencies] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('all'); // all | production | dev
  const [activeStatus, setActiveStatus] = useState('all'); // all | outdated | vulnerability | healthy

  const fetchRepoHeader = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/repositories', { withCredentials: true });
      if (res.data) {
        const matched = res.data.find(r => r._id === id);
        if (matched) setRepo(matched);
      }
    } catch (err) {
      console.error('Failed to load repo header info:', err);
    }
  };

  const fetchDependenciesData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const depsRes = await axios.get(`http://localhost:5000/api/repositories/${id}/dependencies`, { withCredentials: true });
      const summaryRes = await axios.get(`http://localhost:5000/api/repositories/${id}/dependencies/summary`, { withCredentials: true });
      
      if (depsRes.data) setDependencies(depsRes.data);
      if (summaryRes.data) setSummary(summaryRes.data);
    } catch (err) {
      console.error('Failed to load repository dependencies:', err);
      addToast('Error Loading Dependencies', 'error', 'Unable to fetch packages configuration.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepoHeader();
    fetchDependenciesData();
  }, [id]);

  // Run background scan enqueuer
  const triggerScan = async () => {
    setScanning(true);
    try {
      await axios.post(`http://localhost:5000/api/repositories/${id}/dependencies/scan`, {}, { withCredentials: true });
      addToast('Scan Triggered', 'success', 'Background dependency audit enqueued.');
      
      // Poll database for updates
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        await fetchDependenciesData(true);
        if (attempts > 6) {
          clearInterval(interval);
          setScanning(false);
        }
      }, 3000);
      
    } catch (err) {
      setScanning(false);
      addToast('Scan Failed', 'error', err.response?.data?.message || 'Could not queue dependency scan task.');
    }
  };

  // EXPORTS
  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ summary, dependencies }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dependency_report_${repo?.name || 'repo'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Report Exported', 'success', 'JSON report downloaded.');
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Package Name,Declared Version,Current Version,Latest Version,Manager,Type,License,Is Outdated,Risk Level,Vulnerabilities Count\n";
    
    dependencies.forEach((d) => {
      csvContent += `"${d.name}","","${d.currentVersion}","${d.latestVersion || d.currentVersion}","${d.packageManager}","${d.type}","${d.license}","${d.isOutdated}","${d.riskLevel}","${d.knownVulnerabilities?.length || 0}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `dependency_report_${repo?.name || 'repo'}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Report Exported', 'success', 'CSV report downloaded.');
  };

  const exportPDF = () => {
    window.print();
  };

  // Filter package dependencies list
  const filteredDeps = dependencies.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.license.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = activeType === 'all' || d.type === activeType;
    
    let matchesStatus = true;
    if (activeStatus === 'outdated') matchesStatus = d.isOutdated;
    else if (activeStatus === 'vulnerability') matchesStatus = d.knownVulnerabilities?.length > 0;
    else if (activeStatus === 'healthy') matchesStatus = !d.isOutdated && d.knownVulnerabilities?.length === 0;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Check risk score styling
  const getRiskColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 70) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-red-400 border-red-500/20 bg-red-500/5';
  };

  if (loading && !summary) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <RefreshCw size={36} className="text-brand-blue animate-spin shrink-0" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-6 print:p-0 print:bg-white print:text-black">
      
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/dashboard/repos/${id}`)}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Repository"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              Dependencies Audit: {repo?.name || 'Codebase'}
            </h1>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              Review third-party library licenses, semver upgrades, and vulnerability advisories.
            </p>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Scan button */}
          <button
            onClick={triggerScan}
            disabled={scanning}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
              scanning
                ? 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue/50 cursor-not-allowed'
                : 'bg-brand-blue hover:bg-brand-blue-hover text-white border-white/[0.08]'
            }`}
          >
            <RefreshCw size={14} className={scanning ? 'animate-spin' : ''} />
            {scanning ? 'Auditing packages...' : 'Scan Dependencies'}
          </button>

          {/* Export triggers */}
          <button
            onClick={exportPDF}
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] transition-all cursor-pointer"
            title="Print PDF"
          >
            <FileText size={16} />
          </button>
          <button
            onClick={exportCSV}
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] transition-all cursor-pointer"
            title="Download CSV"
          >
            <FileSpreadsheet size={16} />
          </button>
          <button
            onClick={exportJSON}
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] transition-all cursor-pointer"
            title="Download JSON"
          >
            <FileJson size={16} />
          </button>
        </div>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:block text-left border-b pb-4 mb-6">
        <h1 className="text-2xl font-black text-black">QAPilot Dependencies Scan Report</h1>
        <p className="text-sm text-gray-600 mt-1">Repository: {repo?.fullName || 'Codebase'}</p>
        <p className="text-xs text-gray-500">Date Checked: {new Date().toLocaleString()}</p>
      </div>

      {/* Summary Scorecards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Risk Score Dial Meter */}
        <div className={`rounded-2xl border p-5 flex items-center gap-4 ${getRiskColor(summary?.riskScore || 100)}`}>
          <div className="relative w-12 h-12 shrink-0 font-mono">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="opacity-10"
                strokeWidth={4}
                stroke="currentColor"
                fill="transparent"
                r={20}
                cx={24}
                cy={24}
              />
              <circle
                strokeWidth={4}
                strokeDasharray={20 * 2 * Math.PI}
                strokeDashoffset={20 * 2 * Math.PI - ((summary?.riskScore || 100) / 100) * 20 * 2 * Math.PI}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={20}
                cx={24}
                cy={24}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">
              {summary?.riskScore || 100}
            </div>
          </div>
          <div className="text-left">
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Security Score</span>
            <span className="text-sm font-bold text-white">
              {summary?.riskScore >= 85 ? 'Healthy' : (summary?.riskScore >= 70 ? 'Moderate Risk' : 'High Risk')}
            </span>
          </div>
        </div>

        {/* Total Packages */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
            <Boxes size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Total Packages</span>
            <span className="text-lg font-black text-white font-mono">{summary?.totalCount || 0}</span>
          </div>
        </div>

        {/* Outdated Packages */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-brand-warning/10 border border-brand-warning/20 flex items-center justify-center text-brand-warning shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Outdated Libraries</span>
            <span className="text-lg font-black text-white font-mono">{summary?.outdatedCount || 0}</span>
          </div>
        </div>

        {/* Vulnerability Count */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-brand-danger/10 border border-brand-danger/20 flex items-center justify-center text-brand-danger shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Vulnerabilities</span>
            <span className="text-lg font-black text-white font-mono">{summary?.vulnerabilityCount || 0}</span>
          </div>
        </div>

        {/* Package Manager */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success shrink-0">
            <Bookmark size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Package Manager</span>
            <span className="text-sm font-bold text-white capitalize">{dependencies[0]?.packageManager || 'npm'}</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Licenses Distribution & Packages Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: License Distribution */}
        <div className="lg:col-span-4 rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex flex-col gap-4 text-left">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">License distribution</h3>
          
          <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
            {summary?.licenses?.length === 0 ? (
              <p className="text-xs text-brand-text-muted italic">No licenses evaluated.</p>
            ) : (
              summary?.licenses?.map((lic, idx) => {
                const colors = ['bg-brand-blue', 'bg-brand-cyan', 'bg-brand-warning', 'bg-brand-success', 'bg-brand-danger'];
                const color = colors[idx % colors.length];
                const pct = Math.round((lic.count / (summary.totalCount || 1)) * 100);

                // Copyleft license risk warnings
                const isRestrictive = ["GPL", "AGPL", "LGPL"].some(k => lic.name.toUpperCase().includes(k));

                return (
                  <div key={lic.name} className="flex flex-col gap-1.5 text-xs font-medium">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-brand-text-secondary">
                        <span className={`w-2 h-2 rounded-full ${color}`} />
                        {lic.name}
                        {isRestrictive && (
                          <span className="px-1 py-0.2 bg-brand-danger/10 text-brand-danger text-[8px] font-black rounded uppercase">
                            Restrictive
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-brand-text-muted text-[11px]">
                        {lic.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/[0.03] h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isRestrictive ? 'bg-brand-danger' : color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Dependency tree representation list */}
        <div className="lg:col-span-8 rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex flex-col gap-4 text-left">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Packages Structure Tree</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[220px] overflow-y-auto pr-1 text-xs">
            {/* Production Dependencies */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-brand-blue uppercase tracking-wide text-[10px] pb-1 border-b border-white/[0.04]">
                Production Dependencies ({dependencies.filter(d => d.type === 'production').length})
              </span>
              <div className="flex flex-col gap-1.5 pl-1.5">
                {dependencies.filter(d => d.type === 'production').slice(0, 10).map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-brand-text-secondary">
                    <span className="text-brand-text-muted">└─</span>
                    <span className="font-bold text-white truncate max-w-[150px]">{d.name}</span>
                    <span className="font-mono text-brand-text-muted text-[10.5px]">@{d.currentVersion}</span>
                  </div>
                ))}
                {dependencies.filter(d => d.type === 'production').length > 10 && (
                  <span className="text-brand-text-muted text-[10px] pl-6 italic">...and more</span>
                )}
              </div>
            </div>

            {/* Dev Dependencies */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-brand-cyan uppercase tracking-wide text-[10px] pb-1 border-b border-white/[0.04]">
                Development Dependencies ({dependencies.filter(d => d.type === 'dev').length})
              </span>
              <div className="flex flex-col gap-1.5 pl-1.5">
                {dependencies.filter(d => d.type === 'dev').slice(0, 10).map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-brand-text-secondary">
                    <span className="text-brand-text-muted">└─</span>
                    <span className="font-bold text-white truncate max-w-[150px]">{d.name}</span>
                    <span className="font-mono text-brand-text-muted text-[10.5px]">@{d.currentVersion}</span>
                  </div>
                ))}
                {dependencies.filter(d => d.type === 'dev').length > 10 && (
                  <span className="text-brand-text-muted text-[10px] pl-6 italic">...and more</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Known Vulnerabilities Details (CVE list table) */}
      {summary?.vulnerabilities?.length > 0 && (
        <div className="rounded-2xl border border-brand-danger/10 bg-brand-danger/[0.01] p-5 text-left">
          <h3 className="text-xs font-bold text-brand-danger uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-brand-danger animate-pulse" />
            Security Advisories / Vulnerability Log
          </h3>
          
          <div className="overflow-x-auto rounded-xl border border-brand-danger/20">
            <table className="w-full text-left text-xs text-brand-text-secondary border-collapse">
              <thead>
                <tr className="bg-brand-danger/[0.04] border-b border-brand-danger/10 text-white">
                  <th className="p-3 font-extrabold uppercase text-[10px] tracking-wide">CVE ID</th>
                  <th className="p-3 font-extrabold uppercase text-[10px] tracking-wide">Package</th>
                  <th className="p-3 font-extrabold uppercase text-[10px] tracking-wide">Severity</th>
                  <th className="p-3 font-extrabold uppercase text-[10px] tracking-wide">Affected Version</th>
                  <th className="p-3 font-extrabold uppercase text-[10px] tracking-wide">Fixed Version</th>
                  <th className="p-3 font-extrabold uppercase text-[10px] tracking-wide">Description</th>
                  <th className="p-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {summary.vulnerabilities.map((v, index) => (
                  <tr key={index} className="border-b border-brand-danger/5 last:border-none hover:bg-brand-danger/[0.02]">
                    <td className="p-3 font-mono font-bold text-white">{v.cveId}</td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{v.packageName}</span>
                        <span className="text-[10px] text-brand-text-muted mt-0.5">Current: {v.currentVersion}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                        v.severity === 'critical' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        v.severity === 'high' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                        v.severity === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        'bg-white/[0.04] border-white/[0.06] text-brand-text-secondary'
                      }`}>
                        {v.severity}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{v.affectedVersion}</td>
                    <td className="p-3 font-mono text-brand-success font-bold">{v.fixedVersion}</td>
                    <td className="p-3 max-w-[320px] truncate" title={v.description}>{v.description}</td>
                    <td className="p-3 text-right">
                      {v.referenceUrl && (
                        <a 
                          href={v.referenceUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1 rounded bg-white/[0.02] border border-white/[0.05] hover:text-white inline-block transition-colors"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section: Upgrade Recommendations Table */}
      <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 text-left">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Boxes size={14} className="text-brand-cyan" />
          Recommended Upgrade Actions
        </h3>
        
        <div className="overflow-x-auto rounded-xl border border-white/[0.05]">
          <table className="w-full text-left text-xs text-brand-text-secondary border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.06] text-white">
                <th className="p-3 font-extrabold uppercase text-[10px] tracking-wide">Package Name</th>
                <th className="p-3 font-extrabold uppercase text-[10px] tracking-wide">Current</th>
                <th className="p-3 font-extrabold uppercase text-[10px] tracking-wide">Latest Version</th>
                <th className="p-3 font-extrabold uppercase text-[10px] tracking-wide">License</th>
                <th className="p-3 font-extrabold uppercase text-[10px] tracking-wide">Recommended Upgrade</th>
                <th className="p-3 font-extrabold uppercase text-[10px] tracking-wide">Risk State</th>
              </tr>
            </thead>
            <tbody>
              {dependencies.filter(d => d.isOutdated || d.riskLevel !== 'none').length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-brand-text-muted italic">
                    No upgrade recommendations. All packages are healthy and up to date!
                  </td>
                </tr>
              ) : (
                dependencies.filter(d => d.isOutdated || d.riskLevel !== 'none').map((d) => (
                  <tr key={d._id} className="border-b border-white/[0.04] last:border-none hover:bg-white/[0.01]">
                    <td className="p-3 font-bold text-white">{d.name}</td>
                    <td className="p-3 font-mono">{d.currentVersion}</td>
                    <td className="p-3 font-mono">{d.latestVersion || d.currentVersion}</td>
                    <td className="p-3">{d.license}</td>
                    <td className="p-3 font-mono text-brand-success font-bold">
                      {d.recommendedVersion || d.latestVersion}
                    </td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                        d.riskLevel === 'critical' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        d.riskLevel === 'high' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                        d.riskLevel === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        d.riskLevel === 'low' ? 'bg-white/[0.04] border-white/[0.06] text-brand-text-secondary' :
                        'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        {d.riskLevel === 'none' ? 'Healthy' : `${d.riskLevel} risk`}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section: Main Packages Database table list */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5 text-left print:hidden">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Codebase Packages Catalog</h3>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-white/[0.04]">
          <div className="flex flex-wrap items-center gap-2">
            {/* Dependency Types */}
            {['all', 'production', 'dev'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize border transition-all cursor-pointer ${
                  activeType === t
                    ? 'bg-brand-blue border-brand-blue text-white'
                    : 'bg-white/[0.02] border-white/[0.05] text-brand-text-secondary hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
            <span className="text-white/[0.1] px-1">|</span>
            {/* Status tabs */}
            {['all', 'outdated', 'vulnerability', 'healthy'].map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize border transition-all cursor-pointer ${
                  activeStatus === s
                    ? 'bg-brand-cyan border-brand-cyan text-white'
                    : 'bg-white/[0.02] border-white/[0.05] text-brand-text-secondary hover:text-white'
                }`}
              >
                {s === 'vulnerability' ? 'Vulnerable' : s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-white/[0.06] bg-[#090D14] w-full sm:max-w-xs text-brand-text-secondary">
            <Search size={13} />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-white w-full outline-none placeholder-brand-text-muted focus:ring-0"
            />
          </div>
        </div>

        {/* Packages List Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-text-secondary border-collapse">
            <thead>
              <tr className="border-b border-white/[0.05] text-white">
                <th className="p-3 font-bold uppercase text-[10px] tracking-wide">Package Name</th>
                <th className="p-3 font-bold uppercase text-[10px] tracking-wide">Version</th>
                <th className="p-3 font-bold uppercase text-[10px] tracking-wide">Type</th>
                <th className="p-3 font-bold uppercase text-[10px] tracking-wide">License</th>
                <th className="p-3 font-bold uppercase text-[10px] tracking-wide">Status</th>
                <th className="p-3 font-bold uppercase text-[10px] tracking-wide">Risk</th>
                <th className="p-3 font-bold uppercase text-[10px] tracking-wide">Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeps.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-brand-text-muted">
                    No packages match the filtered criteria.
                  </td>
                </tr>
              ) : (
                filteredDeps.map((d) => (
                  <tr key={d._id} className="border-b border-white/[0.04] last:border-none hover:bg-white/[0.01] transition-colors">
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-[13px]">{d.name}</span>
                        {d.homepage && (
                          <a href={d.homepage} target="_blank" rel="noreferrer" className="text-[9.5px] text-brand-blue hover:underline mt-0.5 block truncate max-w-[200px]">
                            {d.homepage}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-mono">{d.currentVersion}</td>
                    <td className="p-3">
                      <span className="capitalize">{d.type}</span>
                    </td>
                    <td className="p-3 font-medium text-white">{d.license}</td>
                    <td className="p-3">
                      {d.isOutdated ? (
                        <span className="inline-flex items-center gap-1 text-brand-warning font-bold">
                          <Clock size={12} /> Outdated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-brand-success font-bold">
                          <CheckCircle2 size={12} /> Up to date
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wide border ${
                        d.riskLevel === 'critical' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        d.riskLevel === 'high' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                        d.riskLevel === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        {d.riskLevel === 'none' ? 'None' : d.riskLevel}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-brand-text-muted">
                      {new Date(d.lastChecked).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Dependencies;
