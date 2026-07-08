import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Clock, 
  Cpu, 
  AlertTriangle, 
  FolderGit2, 
  GitBranch, 
  Activity, 
  ShieldAlert, 
  Heart, 
  ChevronRight, 
  Search, 
  Code,
  FileCode,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

export function ScanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useNotifications();

  // Scan & findings state
  const [scan, setScan] = useState(null);
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch scan details on mount
  useEffect(() => {
    const fetchScanDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/scan/result/${id}`, { withCredentials: true });
        if (res.data) {
          setScan(res.data);
          setFindings(res.data.findings || []);
        }
      } catch (err) {
        console.error('Failed to load scan details:', err);
        addToast('Error Loading Scan', 'error', 'Unable to fetch static analysis outcome.');
        navigate('/dashboard/scans');
      } finally {
        setLoading(false);
      }
    };
    fetchScanDetails();
  }, [id]);

  // Convert technical debt minutes to clean human readable string
  const formatDebt = (mins) => {
    if (!mins) return '0 hrs';
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hrs === 0) return `${remainingMins} mins`;
    return `${hrs}h ${remainingMins}m`;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Activity size={32} className="text-brand-blue animate-spin shrink-0" />
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="text-center py-20 text-brand-text-secondary">
        Scan results could not be located.
      </div>
    );
  }

  // Aggregate code smells summary categories
  const categories = {
    security: findings.filter(f => f.category === 'security' || f.type === 'security').length,
    maintainability: findings.filter(f => f.category === 'maintainability' || f.type === 'maintainability').length,
    react: findings.filter(f => f.category === 'react').length,
    performance: findings.filter(f => f.category === 'performance' || f.type === 'performance').length,
    style: findings.filter(f => f.category === 'style' || f.type === 'style').length,
  };

  // Find most complex function from findings (cyclomatic complexity rules)
  const complexFunctionFindings = findings
    .filter(f => f.ruleId === 'high-cyclomatic-complexity')
    .map(f => {
      // Parse complexity value from message if possible (e.g. complexity of 12)
      const match = f.message?.match(/complexity of (\d+)/);
      const cc = match ? parseInt(match[1]) : 11;
      // Parse function name
      const nameMatch = f.message?.match(/Function "([^"]+)"/);
      const name = nameMatch ? nameMatch[1] : 'handler';
      return { name, complexity: cc, file: f.file, line: f.line };
    })
    .sort((a, b) => b.complexity - a.complexity)
    .slice(0, 5);

  // Identify top risky files (files with the most occurrences of findings)
  const fileRisksMap = {};
  findings.forEach(f => {
    if (!f.file) return;
    if (!fileRisksMap[f.file]) {
      fileRisksMap[f.file] = { path: f.file, count: 0, criticals: 0 };
    }
    fileRisksMap[f.file].count += 1;
    if (f.severity === 'critical' || f.severity === 'high') {
      fileRisksMap[f.file].criticals += 1;
    }
  });

  const topRiskyFiles = Object.values(fileRisksMap)
    .sort((a, b) => (b.criticals * 3 + b.count) - (a.criticals * 3 + a.count))
    .slice(0, 5);

  // Filter findings for the main table view
  const filteredFindings = findings.filter(f => {
    const matchesSearch = f.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.file?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'all') return matchesSearch;
    return matchesSearch && (f.category === activeCategory || f.type === activeCategory);
  });

  // Score styling color checks
  const getGradeColor = (grade) => {
    if (grade === 'A') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (grade === 'B') return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    if (grade === 'C') return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-6 select-none">
      
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/scans')}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:text-white transition-colors"
            aria-label="Back to Scans"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              Scan Audit: {scan.repoId?.name || 'Codebase'}
              <span className={`text-[11px] font-mono font-black border px-2 py-0.5 rounded-md ${getGradeColor(scan.overallGrade || 'A')}`}>
                Grade {scan.overallGrade || 'A'}
              </span>
            </h1>
            <p className="text-xs text-brand-text-secondary mt-0.5 flex items-center gap-1.5 font-mono">
              <GitBranch className="w-3.5 h-3.5 text-brand-blue shrink-0" />
              <span>{scan.branch || 'main'}</span>
              <span className="text-white/[0.1]">•</span>
              <Clock className="w-3.5 h-3.5 text-brand-text-muted shrink-0" />
              <span>Executed: {new Date(scan.createdAt).toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to="/dashboard/bugs"
            className="px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4 text-brand-warning" />
            Vulnerabilities Log
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Maintainability Index */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
            <Heart size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Maintainability</span>
            <span className="text-lg font-black text-white font-mono">{scan.maintainabilityIndex || 95}%</span>
          </div>
        </div>

        {/* Technical Debt */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-warning/10 border border-brand-warning/20 flex items-center justify-center text-brand-warning shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Technical Debt</span>
            <span className="text-lg font-black text-white font-mono">{formatDebt(scan.technicalDebt)}</span>
          </div>
        </div>

        {/* Avg Cyclomatic Complexity */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0">
            <Cpu size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Avg Complexity</span>
            <span className="text-lg font-black text-white font-mono">{scan.complexity || 1}</span>
          </div>
        </div>

        {/* Code Smells */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-danger/10 border border-brand-danger/20 flex items-center justify-center text-brand-danger shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Code Smells</span>
            <span className="text-lg font-black text-white font-mono">{scan.codeSmells || 0}</span>
          </div>
        </div>

        {/* Duplicated Lines */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4 col-span-2 md:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success shrink-0">
            <FileCode size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Duplicated Lines</span>
            <span className="text-lg font-black text-white font-mono">{scan.duplicatedLines || 0}</span>
          </div>
        </div>

      </div>

      {/* Middle Grid: Code Smells Breakdown & Risky Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Smells Categories Breakdown chart */}
        <div className="lg:col-span-5 rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Code Smells Breakdown</h3>
          
          <div className="flex flex-col gap-4 mt-2">
            
            {/* Security Category */}
            <div className="flex flex-col gap-1 text-left">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-brand-text-secondary">Security Vulnerabilities</span>
                <span className="text-white font-bold">{categories.security} issues</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.03] overflow-hidden">
                <div 
                  className="bg-brand-danger h-full rounded-full" 
                  style={{ width: `${Math.min(100, (categories.security / (findings.length || 1)) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Maintainability */}
            <div className="flex flex-col gap-1 text-left">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-brand-text-secondary">Maintainability Smells</span>
                <span className="text-white font-bold">{categories.maintainability} issues</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.03] overflow-hidden">
                <div 
                  className="bg-brand-blue h-full rounded-full" 
                  style={{ width: `${Math.min(100, (categories.maintainability / (findings.length || 1)) * 100)}%` }} 
                />
              </div>
            </div>

            {/* React Anti-patterns */}
            <div className="flex flex-col gap-1 text-left">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-brand-text-secondary">React Anti-Patterns</span>
                <span className="text-white font-bold">{categories.react} issues</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.03] overflow-hidden">
                <div 
                  className="bg-brand-cyan h-full rounded-full" 
                  style={{ width: `${Math.min(100, (categories.react / (findings.length || 1)) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Performance */}
            <div className="flex flex-col gap-1 text-left">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-brand-text-secondary">Performance Issues</span>
                <span className="text-white font-bold">{categories.performance} issues</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.03] overflow-hidden">
                <div 
                  className="bg-brand-warning h-full rounded-full" 
                  style={{ width: `${Math.min(100, (categories.performance / (findings.length || 1)) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Style Violations */}
            <div className="flex flex-col gap-1 text-left">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-brand-text-secondary">Code Style & Best Practices</span>
                <span className="text-white font-bold">{categories.style} issues</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.03] overflow-hidden">
                <div 
                  className="bg-brand-success h-full rounded-full" 
                  style={{ width: `${Math.min(100, (categories.style / (findings.length || 1)) * 100)}%` }} 
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Top Risky Files & Complex Functions */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Top Risky Files */}
          <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-brand-danger" />
              Top Risky Modules/Files
            </h3>
            
            <div className="flex flex-col gap-2">
              {topRiskyFiles.length === 0 ? (
                <p className="text-xs text-brand-text-muted italic">No problematic modules detected.</p>
              ) : (
                topRiskyFiles.map((item, idx) => (
                  <div 
                    key={item.path} 
                    className="p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0">
                      <span className="block font-bold text-white truncate text-[11.5px]">{item.path.split('/').pop()}</span>
                      <span className="block text-[9.5px] text-brand-text-muted truncate mt-0.5">{item.path}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.criticals > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-brand-danger/10 text-brand-danger text-[9.5px] font-bold">
                          {item.criticals} Critical
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.05] text-[9.5px] font-bold text-brand-text-secondary">
                        {item.count} Smells
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Most Complex Functions */}
          <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={14} className="text-brand-cyan" />
              Most Complex Functions
            </h3>

            <div className="flex flex-col gap-2">
              {complexFunctionFindings.length === 0 ? (
                <div className="p-4 text-center rounded-xl bg-white/[0.005] border border-white/[0.03] text-brand-text-secondary text-xs italic">
                  All scanned functions are under complexity limits.
                </div>
              ) : (
                complexFunctionFindings.map((func, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0">
                      <span className="block font-bold text-white truncate text-[11.5px]">
                        {func.name}()
                      </span>
                      <span className="block text-[9.5px] text-brand-text-muted truncate mt-0.5">
                        {func.file.split('/').pop()}:{func.line}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10.5px] font-black font-mono shrink-0">
                      CC: {func.complexity}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Scans Findings list section */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5 relative">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 text-left">Codebase Scan Findings List</h3>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-white/[0.04]">
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'security', 'maintainability', 'react', 'performance', 'style'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-brand-blue border-brand-blue text-white'
                    : 'bg-white/[0.02] border-white/[0.05] text-brand-text-secondary hover:text-white'
                }`}
              >
                {cat === 'style' ? 'Code Style' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-white/[0.06] bg-[#090D14] w-full sm:max-w-xs text-brand-text-secondary">
            <Search size={13} />
            <input
              type="text"
              placeholder="Search findings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-white outline-none w-full placeholder-brand-text-muted focus:ring-0"
            />
          </div>
        </div>

        {/* Main Split Layout: Findings List (Left) & Inspector Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel: list of findings */}
          <div className="lg:col-span-5 flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredFindings.length === 0 ? (
              <div className="text-center py-10 text-brand-text-muted text-xs">
                No findings match the filters.
              </div>
            ) : (
              filteredFindings.map((item) => (
                <button
                  key={item._id}
                  onClick={() => setSelectedFinding(item)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 ${
                    selectedFinding?._id === item._id
                      ? 'bg-brand-blue/10 border-brand-blue/30 text-white'
                      : 'bg-white/[0.01] border-white/[0.04] text-brand-text-secondary hover:bg-white/[0.02] hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 w-full">
                    <span className="font-extrabold text-[12px] text-white leading-tight truncate">
                      {item.title || 'Quality Smell'}
                    </span>
                    <span className={`text-[8.5px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 ${
                      item.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      item.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      item.severity === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-white/[0.04] border border-white/[0.06] text-brand-text-secondary'
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                  
                  <p className="text-[10.5px] leading-relaxed text-brand-text-secondary truncate w-full">
                    {item.description || item.message}
                  </p>
                  
                  <span className="text-[9px] font-mono text-brand-text-muted truncate">
                    {item.file.split('/').pop()}:{item.line}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Right panel: Remediation preview */}
          <div className="lg:col-span-7 border border-white/[0.05] rounded-xl p-5 bg-[#090D14] min-h-[350px] flex flex-col gap-4">
            {selectedFinding ? (
              <div className="flex flex-col gap-4 text-left">
                <div>
                  <h4 className="text-[13.5px] font-black text-white tracking-tight flex items-center gap-2">
                    {selectedFinding.title || 'Code Smell Detail'}
                    <span className="text-[9.5px] font-bold uppercase bg-white/[0.04] text-brand-text-muted px-2 py-0.5 rounded border border-white/[0.06] font-mono">
                      Category: {selectedFinding.category || 'Quality'}
                    </span>
                  </h4>
                  <p className="text-[11.5px] text-brand-text-secondary mt-1.5 leading-relaxed">
                    {selectedFinding.description || selectedFinding.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-white/[0.04]">
                  <div>
                    <span className="block text-[8.5px] text-brand-text-muted uppercase tracking-wider font-semibold">Location</span>
                    <span className="text-[11px] font-mono font-medium text-white truncate block mt-0.5">
                      {selectedFinding.file}:{selectedFinding.line}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8.5px] text-brand-text-muted uppercase tracking-wider font-semibold">Remediation Effort</span>
                    <span className="text-[11px] text-white font-medium block mt-0.5">
                      {selectedFinding.effort || '15 mins'}
                    </span>
                  </div>
                </div>

                {selectedFinding.recommendation && (
                  <div>
                    <span className="block text-[8.5px] text-brand-text-muted uppercase tracking-wider font-semibold mb-1">Recommendation</span>
                    <p className="text-[11px] text-brand-text-secondary bg-white/[0.01] border border-white/[0.04] p-3 rounded-xl leading-relaxed italic">
                      {selectedFinding.recommendation}
                    </p>
                  </div>
                )}

                {selectedFinding.codeSnippet && (
                  <div>
                    <span className="block text-[8.5px] text-brand-text-muted uppercase tracking-wider font-semibold mb-1">Code Snippet Context</span>
                    <pre className="font-mono text-[10.5px] text-[#A6B2C0] bg-[#05070a] border border-white/[0.04] p-3.5 rounded-xl overflow-x-auto leading-relaxed">
                      {selectedFinding.codeSnippet}
                    </pre>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-center gap-3 text-brand-text-muted select-none">
                <Code size={40} className="text-brand-blue/30" />
                <div className="max-w-xs">
                  <h4 className="text-xs font-bold text-white tracking-wide uppercase mb-1">Findings Remediation</h4>
                  <p className="text-[10.5px] leading-relaxed text-brand-text-secondary">
                    Select any static quality finding from the list on the left to inspect variables, suggestions, and snippets.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

export default ScanDetail;
