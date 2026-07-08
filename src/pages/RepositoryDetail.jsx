import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  FileCode, 
  Folder, 
  RefreshCw, 
  Calendar, 
  HardDrive, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Code,
  Info
} from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

export function RepositoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useNotifications();

  // Repository & File state
  const [repo, setRepo] = useState(null);
  const [files, setFiles] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // File explorer selection states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);

  // Fetch all repository files and summaries
  const fetchRepositoryData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/repositories/${id}/files`, { withCredentials: true });
      if (res.data) {
        setFiles(res.data.files || []);
        setSummary(res.data.summary || null);
        
        // If repo sync state is active, keep local sync tracking synced with backend
        if (res.data.summary) {
          setSyncing(res.data.summary.syncStatus === 'syncing');
        }
      }
    } catch (err) {
      console.error('Failed to retrieve repository files:', err);
      // Fallback redirect if repository doesn't exist
      addToast('Error Loading Repository', 'error', 'Unable to fetch file structure.');
      navigate('/dashboard/repos');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Fetch selected file details/content
  const fetchFileDetails = async (fileId) => {
    setLoadingContent(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/repositories/${id}/file/${fileId}`, { withCredentials: true });
      if (res.data) {
        setSelectedFile(res.data);
        setSelectedFileContent(res.data.content || '// No content available in this file.');
      }
    } catch (err) {
      console.error('Failed to load file content:', err);
      addToast('Error Loading File', 'error', 'Unable to read file content.');
    } finally {
      setLoadingContent(false);
    }
  };

  // Trigger manual sync
  const triggerFileSync = async () => {
    setSyncing(true);
    try {
      await axios.post(`http://localhost:5000/api/repositories/${id}/sync-files`, {}, { withCredentials: true });
      addToast('Sync Enqueued', 'success', 'Background file sync task enqueued.');
    } catch (err) {
      setSyncing(false);
      addToast('Sync Failed', 'error', err.response?.data?.message || 'Could not queue files sync task.');
    }
  };

  // Initial mount load
  useEffect(() => {
    // Retrieve repository details to display header info
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
    
    fetchRepoHeader();
    fetchRepositoryData();
  }, [id]);

  // Polling for progress percentage updates when syncing
  useEffect(() => {
    let timer;
    if (syncing) {
      timer = setInterval(() => {
        fetchRepositoryData(true);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [syncing]);

  // Handle format size string
  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading && !summary) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <RefreshCw size={36} className="text-brand-blue animate-spin shrink-0" />
      </div>
    );
  }

  // Filter files by folder and search query
  const foldersList = summary?.folders || [];
  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.path.toLowerCase().includes(searchQuery.toLowerCase()) || f.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFolder === 'All') return matchesSearch;
    
    // Check if the file is in the selected folder hierarchy
    return matchesSearch && (f.path.startsWith(`${selectedFolder}/`) || f.path.substring(0, f.path.lastIndexOf('/')) === selectedFolder);
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/repos')}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:text-white transition-colors"
            aria-label="Back to Repositories"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              {repo?.name || 'Repository Explorer'}
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/[0.04] text-brand-text-secondary border border-white/[0.06] px-2 py-0.5 rounded-md">
                {repo?.private ? 'Private' : 'Public'}
              </span>
            </h1>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              {repo?.fullName || 'Manage codebase tree index metadata.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/repos/${id}/dependencies`)}
            className="px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.06] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Dependency Scanner
          </button>
          <button
            onClick={triggerFileSync}
            disabled={syncing}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
              syncing
                ? 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue/50 cursor-not-allowed'
                : 'bg-brand-blue hover:bg-brand-blue-hover text-white border-white/[0.08]'
            }`}
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? `Syncing ${summary?.syncProgress || 0}%` : 'Sync Files'}
          </button>
        </div>
      </div>

      {/* Sync Status Alert Banner */}
      {syncing && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/20 text-brand-blue">
          <div className="flex items-center gap-3">
            <RefreshCw size={18} className="animate-spin shrink-0" />
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-xs font-bold leading-none">Syncing Codebase Files</span>
              <span className="text-[11px] text-brand-text-secondary leading-relaxed">
                Downloading file trees, matching SHA values, and updating local MongoDB blobs.
              </span>
            </div>
          </div>
          <div className="w-32 bg-white/[0.05] h-1.5 rounded-full overflow-hidden shrink-0 border border-white/[0.04]">
            <div 
              className="bg-brand-blue h-full transition-all duration-300"
              style={{ width: `${summary?.syncProgress || 0}%` }}
            />
          </div>
        </div>
      )}

      {summary?.syncStatus === 'failed' && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand-danger/5 border border-brand-danger/20 text-brand-danger">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 text-left">
            <span className="text-xs font-bold">Sync Task Failed</span>
            <span className="text-[11px] text-brand-text-secondary leading-relaxed">
              {summary.syncError || 'An error occurred during synchronization. Verify GitHub credentials and try again.'}
            </span>
          </div>
        </div>
      )}

      {/* Stats Summary Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Files */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
            <FileCode size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Total Indexed Files</span>
            <span className="text-lg font-black text-white font-mono">{summary?.totalFiles || 0}</span>
          </div>
        </div>

        {/* Sync Status */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Sync Status</span>
            <span className="text-sm font-bold text-white capitalize">{summary?.syncStatus || 'Idle'}</span>
          </div>
        </div>

        {/* Total Folders */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-warning/10 border border-brand-warning/20 flex items-center justify-center text-brand-warning shrink-0">
            <Folder size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Total Folders</span>
            <span className="text-lg font-black text-white font-mono">{foldersList.length}</span>
          </div>
        </div>

        {/* Last Sync */}
        <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success shrink-0">
            <Calendar size={20} />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Last Synchronization</span>
            <span className="text-xs font-bold text-white truncate block">
              {summary?.lastSyncTime ? new Date(summary.lastSyncTime).toLocaleString() : 'Never'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Explorer (Left) & Code Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Folder Selector, Search, Files List */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
          
          <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-4 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Repository Explorer</h3>

            {/* Folder Dropdown selector */}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] font-bold text-brand-text-secondary uppercase">Folder Filter</label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full bg-brand-bg-secondary border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue/50"
              >
                <option value="All">All Folders</option>
                {foldersList.map((folder) => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.01] focus-within:border-brand-blue/30 focus-within:text-white text-brand-text-secondary transition-all">
              <Search size={14} className="shrink-0" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs text-white outline-none w-full placeholder-brand-text-muted focus:ring-0"
              />
            </div>

            {/* Files list container */}
            <div className="max-h-[350px] overflow-y-auto flex flex-col gap-1.5 pr-1">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-brand-text-muted text-xs">
                  No files found.
                </div>
              ) : (
                filteredFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => fetchFileDetails(file.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                      selectedFile?.id === file.id
                        ? 'bg-brand-blue/10 border-brand-blue/30 text-white'
                        : 'bg-white/[0.01] border-white/[0.04] text-brand-text-secondary hover:bg-white/[0.03] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Code size={13} className="shrink-0 text-brand-blue" />
                      <div className="truncate flex flex-col">
                        <span className="font-bold truncate text-[11.5px] leading-tight">{file.name}</span>
                        <span className="text-[9px] text-brand-text-muted truncate leading-snug">{file.path}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono shrink-0">{formatBytes(file.size)}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Languages Distribution Card */}
          <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-4 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Languages</h3>
            {summary?.languages?.length === 0 ? (
              <p className="text-xs text-brand-text-muted italic">No file data synced yet.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {/* Horizontal language stack bar */}
                <div className="h-2 w-full rounded-full bg-white/[0.03] overflow-hidden flex">
                  {summary?.languages?.map((lang, idx) => {
                    const pct = Math.round((lang.count / (summary.totalFiles || 1)) * 100);
                    const colors = ['bg-brand-blue', 'bg-brand-cyan', 'bg-brand-warning', 'bg-brand-success', 'bg-brand-danger'];
                    const colorClass = colors[idx % colors.length];
                    return (
                      <div
                        key={lang.name}
                        className={`${colorClass} h-full`}
                        style={{ width: `${pct}%` }}
                        title={`${lang.name}: ${pct}%`}
                      />
                    );
                  })}
                </div>

                {/* Legend list */}
                <div className="flex flex-col gap-1.5 mt-1 max-h-[160px] overflow-y-auto pr-1">
                  {summary?.languages?.map((lang, idx) => {
                    const pct = Math.round((lang.count / (summary.totalFiles || 1)) * 100);
                    const colors = ['bg-brand-blue', 'bg-brand-cyan', 'bg-brand-warning', 'bg-brand-success', 'bg-brand-danger'];
                    const colorClass = colors[idx % colors.length];
                    return (
                      <div key={lang.name} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${colorClass} shrink-0`} />
                          <span className="text-brand-text-secondary font-medium">{lang.name}</span>
                        </div>
                        <span className="font-mono text-brand-text-muted text-[11px]">
                          {lang.count} files ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Code Viewer & Side Panels */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          
          {/* Monospace Code Viewer Card */}
          <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex flex-col gap-4 min-h-[450px]">
            {loadingContent ? (
              <div className="flex flex-1 items-center justify-center min-h-[350px]">
                <RefreshCw size={28} className="text-brand-blue animate-spin" />
              </div>
            ) : selectedFile ? (
              <div className="flex flex-col gap-4 flex-1">
                {/* File Details header */}
                <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCode size={18} className="text-brand-blue shrink-0" />
                    <div className="truncate flex flex-col">
                      <span className="text-xs font-black text-white leading-none truncate">{selectedFile.name}</span>
                      <span className="text-[10px] text-brand-text-muted leading-relaxed truncate font-mono mt-0.5">{selectedFile.path}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] shrink-0 text-brand-text-secondary font-mono">
                    <span>Language: <b className="text-brand-cyan">{selectedFile.language || 'Plain Text'}</b></span>
                    <span>Size: <b>{formatBytes(selectedFile.size)}</b></span>
                  </div>
                </div>

                {/* Monospace Line Number code representation container */}
                <div className="flex-1 overflow-x-auto rounded-xl bg-[#090D14] border border-white/[0.04] p-3 text-left">
                  <pre className="font-mono text-[11px] leading-relaxed text-[#D2D9E2] whitespace-pre select-text">
                    {selectedFileContent.split('\n').map((line, idx) => (
                      <div key={idx} className="flex hover:bg-white/[0.03]">
                        <span className="w-10 select-none text-brand-text-muted text-right pr-3.5 border-r border-white/[0.04] mr-3.5">{idx + 1}</span>
                        <span>{line || ' '}</span>
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[380px] text-center select-none gap-3 text-brand-text-muted">
                <Code size={48} className="text-brand-blue/30" />
                <div className="max-w-xs">
                  <h4 className="text-sm font-bold text-white tracking-wide leading-none mb-1">Code Inspector</h4>
                  <p className="text-[11px] leading-normal text-brand-text-secondary">
                    Select a source file from the explorer list on the left to inspect its structure and contents.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Grid: Largest Files & Recent Changes Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Largest Files Table */}
            <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <HardDrive size={13} className="text-brand-warning" />
                Largest Codebase Files
              </h3>
              <div className="flex flex-col gap-2">
                {summary?.largestFiles?.length === 0 ? (
                  <p className="text-xs text-brand-text-muted italic">No file sizes calculated.</p>
                ) : (
                  summary?.largestFiles?.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => fetchFileDetails(file.id)}
                      className="w-full text-left p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:text-white transition-all flex items-center justify-between gap-3 text-xs text-brand-text-secondary"
                    >
                      <div className="min-w-0">
                        <span className="block font-bold text-white truncate text-[11px]">{file.name}</span>
                        <span className="block text-[9px] text-brand-text-muted truncate mt-0.5">{file.path}</span>
                      </div>
                      <span className="text-[10px] font-mono shrink-0">{formatBytes(file.size)}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Recent Changes feed */}
            <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-5 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={13} className="text-brand-cyan" />
                Recent Synced Updates
              </h3>
              <div className="flex flex-col gap-2">
                {summary?.recentChanges?.length === 0 ? (
                  <p className="text-xs text-brand-text-muted italic">No recent updates synced.</p>
                ) : (
                  summary?.recentChanges?.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => fetchFileDetails(file.id)}
                      className="w-full text-left p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:text-white transition-all flex items-center justify-between gap-3 text-xs text-brand-text-secondary"
                    >
                      <div className="min-w-0">
                        <span className="block font-bold text-white truncate text-[11px]">{file.name}</span>
                        <span className="block text-[9px] text-brand-text-muted truncate mt-0.5">{file.path}</span>
                      </div>
                      <span className="text-[9px] text-brand-text-muted shrink-0">
                        {new Date(file.lastSynced).toLocaleTimeString()}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default RepositoryDetail;
