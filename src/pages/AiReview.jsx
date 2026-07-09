import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bot, 
  FolderGit2, 
  ChevronRight, 
  Search, 
  FileCode, 
  Folder, 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Download, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  Info, 
  Check,
  ChevronDown
} from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';
import reviewService from '../services/reviewService';

export function AiReview() {
  const { addToast } = useNotifications();

  // Selected entities
  const [repositories, setRepositories] = useState([]);
  const [selectedRepoId, setSelectedRepoId] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');

  // Search & Explorer state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [folders, setFolders] = useState([]);

  // Review states
  const [reviewsHistory, setReviewsHistory] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewType, setReviewType] = useState('full');
  
  // Loading indicators
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [triggeringReview, setTriggeringReview] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Copy code utility state
  const [copiedLine, setCopiedLine] = useState(null);

  // Poll reviews state in case one is running
  const [pollingActive, setPollingActive] = useState(false);

  // Load repositories on mount
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoadingRepos(true);
        const res = await axios.get('http://localhost:5000/api/repositories', { withCredentials: true });
        setRepositories(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedRepoId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load repositories:', err);
        addToast('Error Loading Repositories', 'error', 'Unable to fetch connected workspaces.');
      } finally {
        setLoadingRepos(false);
      }
    };
    fetchRepos();
  }, []);

  // Fetch files when selected repository changes
  useEffect(() => {
    if (!selectedRepoId) return;
    
    const fetchRepoFiles = async () => {
      try {
        setLoadingFiles(true);
        setSelectedFileId('');
        setSelectedFile(null);
        setFileContent('');
        setSelectedReview(null);
        setReviewsHistory([]);

        const res = await axios.get(`http://localhost:5000/api/repositories/${selectedRepoId}/files`, { withCredentials: true });
        
        const filesList = res.data.files || [];
        setFiles(filesList);
        setFolders(res.data.summary?.folders || []);
        
        // Also fetch review history for this repo
        fetchRepoReviews(selectedRepoId);
      } catch (err) {
        console.error('Failed to load repo files:', err);
        addToast('Error Loading Files', 'error', 'Unable to fetch file structure.');
      } finally {
        setLoadingFiles(false);
      }
    };
    fetchRepoFiles();
  }, [selectedRepoId]);

  // Fetch reviews for repository
  const fetchRepoReviews = async (repoId, fileId = null) => {
    try {
      setHistoryLoading(true);
      const data = await reviewService.getReviews(repoId, fileId);
      setReviewsHistory(data || []);
      
      // If there's an active running/queued review, trigger polling
      const hasPending = data.some(r => r.status === 'queued' || r.status === 'running');
      if (hasPending) {
        setPollingActive(true);
      }
    } catch (err) {
      console.error('Failed to fetch reviews history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Poll running review statuses
  useEffect(() => {
    let intervalId;
    if (pollingActive && selectedRepoId) {
      intervalId = setInterval(async () => {
        try {
          const data = await reviewService.getReviews(selectedRepoId, selectedFileId || null);
          setReviewsHistory(data || []);
          
          // Check if still pending
          const hasPending = data.some(r => r.status === 'queued' || r.status === 'running');
          if (!hasPending) {
            setPollingActive(false);
            // If the currently viewed review was running, refresh it
            if (selectedReview && (selectedReview.status === 'queued' || selectedReview.status === 'running')) {
              const updated = data.find(r => r._id === selectedReview._id);
              if (updated) setSelectedReview(updated);
            }
            addToast('AI Code Review Complete', 'success', 'Review has finished processing.');
          } else {
            // Update active review context if open
            if (selectedReview) {
              const updated = data.find(r => r._id === selectedReview._id);
              if (updated && updated.status !== selectedReview.status) {
                setSelectedReview(updated);
              }
            }
          }
        } catch (err) {
          console.error('Error polling reviews:', err);
        }
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pollingActive, selectedRepoId, selectedFileId, selectedReview]);

  // Load single file content and reviews when file is clicked
  const handleFileSelect = async (fileId) => {
    try {
      setLoadingContent(true);
      setSelectedFileId(fileId);
      setSelectedReview(null);

      // Fetch file content
      const contentRes = await axios.get(`http://localhost:5000/api/repositories/${selectedRepoId}/file/${fileId}`, { withCredentials: true });
      setSelectedFile(contentRes.data);
      setFileContent(contentRes.data.content || '// No content available inside this file.');
      
      // Fetch review history specifically for this file
      const reviews = await reviewService.getReviews(selectedRepoId, fileId);
      setReviewsHistory(reviews || []);
      
      if (reviews && reviews.length > 0) {
        // Automatically display the latest completed/failed review
        setSelectedReview(reviews[0]);
      }
    } catch (err) {
      console.error('Failed to load file details:', err);
      addToast('Error Loading File', 'error', 'Unable to fetch file content.');
    } finally {
      setLoadingContent(false);
    }
  };

  // Run AI review
  const handleRunReview = async () => {
    if (!selectedRepoId || !selectedFileId) return;

    try {
      setTriggeringReview(true);
      const newReview = await reviewService.createReview(selectedRepoId, selectedFileId, null, reviewType);
      addToast('AI Review Enqueued', 'success', 'The review task has been dispatched.');
      
      // Refresh history & activate polling
      await fetchRepoReviews(selectedRepoId, selectedFileId);
      setSelectedReview(newReview);
      setPollingActive(true);
    } catch (err) {
      console.error('Failed to run AI review:', err);
      addToast('Execution Failed', 'error', err.response?.data?.message || 'Could not queue review.');
    } finally {
      setTriggeringReview(false);
    }
  };

  // Delete past review
  const handleDeleteReview = async (reviewId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this code review record?')) return;

    try {
      await reviewService.deleteReview(reviewId);
      addToast('Review Deleted', 'success', 'Review record successfully removed.');
      
      if (selectedReview?._id === reviewId) {
        setSelectedReview(null);
      }
      
      // Refresh review history
      fetchRepoReviews(selectedRepoId, selectedFileId || null);
    } catch (err) {
      console.error('Failed to delete review:', err);
      addToast('Deletion Failed', 'error', 'Unable to remove review.');
    }
  };

  // Trigger exports
  const handleExport = (format) => {
    if (!selectedReview) return;
    try {
      reviewService.exportReview(selectedReview, format);
      addToast('Export Successful', 'success', `Review exported as ${format.toUpperCase()}.`);
    } catch (err) {
      console.error('Export failed:', err);
      addToast('Export Failed', 'error', err.message);
    }
  };

  // Copy code utility
  const copyToClipboard = (text, lineId) => {
    navigator.clipboard.writeText(text);
    setCopiedLine(lineId);
    setTimeout(() => setCopiedLine(null), 2000);
  };

  // Helpers
  const getSeverityStyles = (sev) => {
    switch (sev) {
      case 'critical':
        return {
          border: 'border-red-500/30 bg-red-500/5',
          text: 'text-red-400',
          badge: 'bg-red-500/10 text-red-400 border-red-500/20'
        };
      case 'warning':
        return {
          border: 'border-amber-500/30 bg-amber-500/5',
          text: 'text-amber-400',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        };
      case 'info':
      default:
        return {
          border: 'border-blue-500/30 bg-blue-500/5',
          text: 'text-blue-400',
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  // Filter files based on queries
  const filteredFiles = files.filter(f => {
    const matchesSearch = f.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFolder === 'All') return matchesSearch;
    return matchesSearch && (f.path.startsWith(`${selectedFolder}/`) || f.path.substring(0, f.path.lastIndexOf('/')) === selectedFolder);
  });

  // Organize file content line by line
  const codeLines = fileContent.split('\n');

  // Map review comments by line number
  const commentsByLine = {};
  if (selectedReview && selectedReview.comments) {
    selectedReview.comments.forEach(c => {
      if (!commentsByLine[c.line]) {
        commentsByLine[c.line] = [];
      }
      commentsByLine[c.line].push(c);
    });
  }

  // Count severity totals
  const criticalCount = selectedReview?.comments?.filter(c => c.severity === 'critical').length || 0;
  const warningCount = selectedReview?.comments?.filter(c => c.severity === 'warning').length || 0;
  const infoCount = selectedReview?.comments?.filter(c => c.severity === 'info').length || 0;

  return (
    <div className="min-h-[85vh] flex flex-col gap-6 select-none max-w-[1600px] mx-auto p-1 sm:p-2">
      
      {/* Top Header Selector Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-brand-bg-secondary/40 border border-white/[0.04] p-5 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
            <Bot size={20} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              AI Code Review Assistant
              <span className="text-[9px] font-bold uppercase tracking-widest bg-brand-blue/15 text-brand-blue border border-brand-blue/20 px-2 py-0.5 rounded-md">
                Beta
              </span>
            </h1>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              Review repository code structures, identify vulnerabilities, and access line-by-line AI corrections.
            </p>
          </div>
        </div>

        {/* Repository selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-brand-text-secondary whitespace-nowrap hidden sm:inline">Workspace Repos:</span>
          {loadingRepos ? (
            <div className="h-10 w-48 bg-white/[0.02] border border-white/[0.06] rounded-xl animate-pulse" />
          ) : (
            <div className="relative w-full md:w-60">
              <select
                value={selectedRepoId}
                onChange={(e) => setSelectedRepoId(e.target.value)}
                className="w-full h-10 px-4 pr-10 rounded-xl bg-[#0b0e14]/60 border border-white/[0.06] text-xs font-bold text-white transition-all hover:bg-white/[0.03] hover:border-white/[0.12] focus:outline-none appearance-none cursor-pointer"
              >
                {repositories.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-brand-text-secondary">
                <FolderGit2 size={14} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: File Explorer & Past History (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* File Browser Card */}
          <div className="bg-brand-bg-secondary/40 border border-white/[0.04] rounded-2xl p-5 flex flex-col h-[400px] backdrop-blur-md">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>File Explorer</span>
              <span className="text-[10px] text-brand-text-muted font-normal lowercase">
                {filteredFiles.length} files
              </span>
            </h3>

            {/* Filters & Search */}
            <div className="flex flex-col gap-2 mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search file names..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-8 pr-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-blue transition-colors"
                />
                <Search size={12} className="absolute left-3 top-3 text-brand-text-secondary" />
              </div>

              {/* Folder Selector Filter */}
              {folders.length > 0 && (
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#0b0e14]/50 border border-white/[0.05] text-[11px] text-brand-text-secondary focus:outline-none cursor-pointer"
                >
                  <option value="All">All Folders</option>
                  {folders.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Files List tree */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {loadingFiles ? (
                <div className="space-y-2 py-4">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className="h-8 bg-white/[0.02] border border-white/[0.04] rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                  <Folder size={24} className="text-brand-text-muted" />
                  <p className="text-[11px] text-brand-text-secondary">No files found.</p>
                </div>
              ) : (
                filteredFiles.map((file) => {
                  const isSelected = selectedFileId === file.id;
                  return (
                    <button
                      key={file.id}
                      onClick={() => handleFileSelect(file.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                        isSelected 
                          ? 'bg-brand-blue/15 border border-brand-blue/30 text-white' 
                          : 'hover:bg-white/[0.02] border border-transparent text-brand-text-secondary hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode size={13} className={isSelected ? 'text-brand-blue' : 'text-brand-text-secondary'} />
                        <span className="text-[11.5px] truncate font-medium">{file.path}</span>
                      </div>
                      <ChevronRight size={10} className="opacity-40" />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Past Review History Card */}
          <div className="bg-brand-bg-secondary/40 border border-white/[0.04] rounded-2xl p-5 flex flex-col h-[300px] backdrop-blur-md">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>Review History</span>
              {pollingActive && <RefreshCw size={11} className="animate-spin text-brand-blue shrink-0" />}
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {historyLoading && reviewsHistory.length === 0 ? (
                <div className="space-y-2">
                  {[1, 2].map(n => (
                    <div key={n} className="h-10 bg-white/[0.02] rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : reviewsHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                  <Clock size={20} className="text-brand-text-muted" />
                  <p className="text-[11px] text-brand-text-secondary">No review records yet.</p>
                </div>
              ) : (
                reviewsHistory.map((rev) => {
                  const isSelected = selectedReview?._id === rev._id;
                  const dateStr = new Date(rev.createdAt).toLocaleDateString();
                  
                  let statusBadge = 'border-white/[0.08] text-brand-text-muted';
                  let statusText = rev.status;
                  if (rev.status === 'completed') {
                    statusBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
                    statusText = `${rev.overallScore}%`;
                  } else if (rev.status === 'running') {
                    statusBadge = 'bg-blue-500/10 text-blue-400 border-blue-500/25 animate-pulse';
                  } else if (rev.status === 'failed') {
                    statusBadge = 'bg-red-500/10 text-red-400 border-red-500/25';
                  }

                  return (
                    <div
                      key={rev._id}
                      onClick={() => setSelectedReview(rev)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-white/[0.04] border-white/[0.12]' 
                          : 'bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[11.5px] font-bold text-white truncate">
                          {rev.fileId?.name || 'File Review'}
                        </span>
                        <span className="text-[9.5px] text-brand-text-muted flex items-center gap-1.5">
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span className="capitalize">{rev.provider}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-md ${statusBadge}`}>
                          {statusText}
                        </span>
                        <button
                          onClick={(e) => handleDeleteReview(rev._id, e)}
                          className="p-1 rounded-lg text-brand-text-muted hover:text-brand-danger hover:bg-brand-danger/10 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Action center, Summary, & Code viewer (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* FILE SELECTION STATUS / TRIGGER AUDIT VIEW */}
          {!selectedFileId ? (
            <div className="bg-brand-bg-secondary/40 border border-white/[0.04] rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[450px] backdrop-blur-md select-none">
              <Bot size={48} className="text-brand-blue/30 mb-4 animate-bounce" />
              <h2 className="text-base font-bold text-white">No File Selected</h2>
              <p className="text-xs text-brand-text-secondary max-w-sm mt-1">
                Choose a file from the left explorer tree to trigger dynamic AI code quality checks or explore past audit reviews.
              </p>
            </div>
          ) : (
            <>
              {/* FILE VIEW HEADER & TRIGGER BUTTON */}
              <div className="bg-brand-bg-secondary/40 border border-white/[0.04] p-5 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileCode size={16} className="text-brand-blue" />
                    <span className="text-sm font-bold text-white truncate">{selectedFile?.path}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-brand-text-secondary mt-1">
                    <span>Language: <strong className="text-white">{selectedFile?.language || 'Unknown'}</strong></span>
                    <span>•</span>
                    <span>Size: <strong className="text-white">{Math.round((selectedFile?.size || 0)/102)/10} KB</strong></span>
                  </div>
                </div>

                {/* Audit trigger settings */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={reviewType}
                      onChange={(e) => setReviewType(e.target.value)}
                      className="h-9 px-3 pr-8 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-bold text-white focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="full">Full Review</option>
                      <option value="security">Security Focus</option>
                      <option value="quality">Quality Focus</option>
                      <option value="performance">Performance Focus</option>
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-3 text-brand-text-secondary pointer-events-none" />
                  </div>

                  <button
                    onClick={handleRunReview}
                    disabled={triggeringReview || pollingActive}
                    className="h-9 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-brand-blue/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {triggeringReview ? (
                      <RefreshCw size={13} className="animate-spin shrink-0" />
                    ) : (
                      <Play size={11} className="fill-white" />
                    )}
                    <span>Request AI Review</span>
                  </button>
                </div>
              </div>

              {/* QUEUED / RUNNING STATUS CARD */}
              {selectedReview && (selectedReview.status === 'queued' || selectedReview.status === 'running') && (
                <div className="bg-brand-bg-secondary/40 border border-brand-blue/20 p-6 rounded-2xl backdrop-blur-md flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-brand-blue animate-pulse" />
                      <div>
                        <h4 className="text-xs font-bold text-white">AI Analysis Job is {selectedReview.status}</h4>
                        <p className="text-[10px] text-brand-text-secondary mt-0.5">
                          The code content is being processed by the configured {selectedReview.provider} provider.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-md">
                      Processing
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue w-2/5 animate-pulse" />
                  </div>
                </div>
              )}

              {/* AUDIT SUMMARY & SCORE OVERVIEW */}
              {selectedReview && selectedReview.status === 'completed' && (
                <div className="bg-brand-bg-secondary/40 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md flex flex-col gap-5">
                  
                  {/* Scores dashboard */}
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">
                      Review Score Overview
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      
                      {/* Overall score card */}
                      <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreBg(selectedReview.overallScore)}`}>
                        <span className="text-[10px] font-bold text-brand-text-secondary uppercase">Overall Score</span>
                        <span className={`text-2xl font-black mt-1 ${getScoreColor(selectedReview.overallScore)}`}>
                          {selectedReview.overallScore}%
                        </span>
                      </div>

                      {/* Security */}
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold text-brand-text-secondary uppercase">Security</span>
                        <span className={`text-base font-black mt-1 ${getScoreColor(selectedReview.securityScore)}`}>
                          {selectedReview.securityScore}%
                        </span>
                      </div>

                      {/* Performance */}
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold text-brand-text-secondary uppercase">Performance</span>
                        <span className={`text-base font-black mt-1 ${getScoreColor(selectedReview.performanceScore)}`}>
                          {selectedReview.performanceScore}%
                        </span>
                      </div>

                      {/* Maintainability */}
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold text-brand-text-secondary uppercase">Maintainability</span>
                        <span className={`text-base font-black mt-1 ${getScoreColor(selectedReview.maintainabilityScore)}`}>
                          {selectedReview.maintainabilityScore}%
                        </span>
                      </div>

                      {/* Readability */}
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold text-brand-text-secondary uppercase">Readability</span>
                        <span className={`text-base font-black mt-1 ${getScoreColor(selectedReview.readabilityScore)}`}>
                          {selectedReview.readabilityScore}%
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Summary text */}
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Sparkles size={12} className="text-brand-blue" />
                      <span>Executive Summary</span>
                    </h4>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[12px] text-brand-text-secondary leading-relaxed">
                      {selectedReview.summary}
                    </div>
                  </div>

                  {/* Risk Indicators & Exporters */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-white/[0.04] pt-4">
                    
                    {/* Findings badges */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-brand-text-secondary font-bold">Findings Breakdown:</span>
                      <div className="flex items-center gap-2">
                        {criticalCount > 0 && (
                          <span className="text-[9px] font-bold uppercase tracking-wide bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md">
                            {criticalCount} Critical
                          </span>
                        )}
                        {warningCount > 0 && (
                          <span className="text-[9px] font-bold uppercase tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md">
                            {warningCount} Warning
                          </span>
                        )}
                        {infoCount > 0 && (
                          <span className="text-[9px] font-bold uppercase tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md">
                            {infoCount} Info
                          </span>
                        )}
                        {criticalCount === 0 && warningCount === 0 && infoCount === 0 && (
                          <span className="text-[9px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            Clean
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Exporters buttons */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-brand-text-secondary font-bold hidden sm:inline">Export Audit:</span>
                      <button
                        onClick={() => handleExport('pdf')}
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.05] text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Download size={10} />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => handleExport('markdown')}
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.05] text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Download size={10} />
                        <span>Markdown</span>
                      </button>
                      <button
                        onClick={() => handleExport('json')}
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-brand-text-secondary hover:text-white border border-white/[0.05] text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Download size={10} />
                        <span>JSON</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* FAILED REVIEW METRICS STATE */}
              {selectedReview && selectedReview.status === 'failed' && (
                <div className="bg-brand-bg-secondary/40 border border-red-500/20 p-6 rounded-2xl backdrop-blur-md flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-brand-danger">
                    <AlertCircle size={16} />
                    <h4 className="text-xs font-bold">Review Pipeline Failure</h4>
                  </div>
                  <p className="text-[11.5px] text-brand-text-secondary">
                    An error occurred during LLM prompt invocation:
                  </p>
                  <div className="p-3 rounded-lg bg-[#0b0e14] border border-white/[0.04] text-[10.5px] font-mono text-red-300 whitespace-pre-wrap mt-1">
                    {selectedReview.error || 'Unknown process mapping pipeline crash details.'}
                  </div>
                </div>
              )}

              {/* CODE AND INLINE COMMENTS VIEWER */}
              <div className="bg-[#0b0e14]/60 border border-white/[0.04] rounded-2xl flex flex-col overflow-hidden backdrop-blur-md">
                
                {/* Code panel header bar */}
                <div className="px-5 py-3 border-b border-white/[0.06] flex justify-between items-center bg-white/[0.01]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">
                    Source Code Viewer
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-brand-text-muted lowercase">editing mode locked</span>
                  </div>
                </div>

                {/* Line by line container */}
                <div className="overflow-x-auto p-4 font-mono text-[12px] bg-brand-bg/10 leading-6">
                  {loadingContent ? (
                    <div className="flex justify-center items-center py-20">
                      <RefreshCw size={24} className="text-brand-blue animate-spin" />
                    </div>
                  ) : (
                    codeLines.map((lineContent, index) => {
                      const lineNumber = index + 1;
                      const hasComments = commentsByLine[lineNumber];
                      
                      return (
                        <div key={index} className="flex flex-col">
                          
                          {/* Code line layout */}
                          <div className={`flex group hover:bg-white/[0.03] transition-colors pr-2 ${hasComments ? 'bg-brand-blue/5' : ''}`}>
                            <div className="w-12 text-right pr-4 text-brand-text-muted opacity-40 select-none border-r border-white/[0.04] shrink-0">
                              {lineNumber}
                            </div>
                            <div className="pl-4 whitespace-pre text-brand-text-primary overflow-x-auto select-text font-normal flex-1">
                              {lineContent || ' '}
                            </div>
                          </div>

                          {/* Inline comments section */}
                          {hasComments && hasComments.map((comment, commentIdx) => {
                            const styles = getSeverityStyles(comment.severity);
                            const isCopied = copiedLine === `${lineNumber}-${commentIdx}`;

                            return (
                              <div
                                key={commentIdx}
                                className={`ml-16 my-3 p-4 rounded-xl border flex flex-col gap-3 select-none ${styles.border} ${styles.border}`}
                              >
                                {/* Comment header details */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-md capitalize ${styles.badge}`}>
                                      {comment.severity}
                                    </span>
                                    <span className="text-[9px] font-bold text-brand-text-secondary uppercase">
                                      {comment.category}
                                    </span>
                                  </div>
                                  <span className="text-[9.5px] text-brand-text-muted">
                                    Confidence: <strong>{comment.confidence}</strong>
                                  </span>
                                </div>

                                {/* Title & Description */}
                                <div>
                                  <h5 className="text-[12px] font-bold text-white flex items-center gap-1.5">
                                    {comment.title}
                                  </h5>
                                  <p className="text-[11px] text-brand-text-secondary mt-1 leading-relaxed select-text">
                                    {comment.description}
                                  </p>
                                </div>

                                {/* Remediation Recommendation */}
                                <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-brand-blue flex items-center gap-1">
                                    <Info size={10} />
                                    <span>Remediation Action</span>
                                  </span>
                                  <p className="text-[11px] text-brand-text-secondary mt-1 select-text">
                                    {comment.recommendation}
                                  </p>
                                </div>

                                {/* Suggested Code Snippet Diff */}
                                {comment.suggestedCode && (
                                  <div className="flex flex-col rounded-lg overflow-hidden border border-white/[0.06] bg-[#0b0e14]">
                                    <div className="px-3 py-1.5 bg-white/[0.02] border-b border-white/[0.04] flex justify-between items-center">
                                      <span className="text-[9px] font-bold text-brand-text-secondary uppercase">
                                        Suggested Improvement
                                      </span>
                                      <button
                                        onClick={() => copyToClipboard(comment.suggestedCode, `${lineNumber}-${commentIdx}`)}
                                        className="text-[9.5px] font-bold text-brand-blue hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                                      >
                                        {isCopied ? (
                                          <>
                                            <Check size={10} className="text-emerald-400" />
                                            <span className="text-emerald-400">Copied!</span>
                                          </>
                                        ) : (
                                          <span>Copy Code</span>
                                        )}
                                      </button>
                                    </div>
                                    <pre className="p-3 text-[11px] overflow-x-auto text-brand-text-primary whitespace-pre select-text font-mono leading-5">
                                      {comment.suggestedCode}
                                    </pre>
                                  </div>
                                )}

                              </div>
                            );
                          })}

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default AiReview;
