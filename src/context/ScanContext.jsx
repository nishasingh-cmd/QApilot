import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { scanService } from '../services/scanService';
import { MOCK_METRICS, MOCK_ACTIVE_SCANS, MOCK_HISTORY, MOCK_QUEUE, MOCK_QUALITY_SCORECARD } from '../data/scans';

const ScanContext = createContext(null);

export function ScanProvider({ children }) {
  // Configured states
  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [activeScans, setActiveScans] = useState(MOCK_ACTIVE_SCANS);
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [scorecard, setScorecard] = useState(MOCK_QUALITY_SCORECARD);
  
  const [repositories, setRepositories] = useState([]);
  const [mode, setMode] = useState('simulator'); // 'live' | 'simulator'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filterRepo, setFilterRepo] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterTime, setFilterTime] = useState('all');

  // 1. Fetch user repositories & scan histories on startup
  useEffect(() => {
    const initData = async () => {
      try {
        const reposRes = await axios.get('http://localhost:5000/api/repositories', {
          withCredentials: true
        });
        if (reposRes.data && reposRes.data.length > 0) {
          setRepositories(reposRes.data);
          setMode('live');
          setQueue([]); // Clear mock queue in live mode
          
          // Load scan history for the first repository by default
          const defaultRepoId = reposRes.data[0]._id;
          fetchScanHistory(defaultRepoId);
        }
      } catch (err) {
        console.warn('ScanContext live API unavailable. Defaulting to simulator mode.', err.message);
        setMode('simulator');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const fetchScanHistory = async (repoId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/scan/history/${repoId}`, {
        withCredentials: true
      });
      if (res.data) {
        // Map backend scan objects to frontend table schema
        const mappedHistory = res.data.map((h) => ({
          id: h._id,
          repoId: h.repoId,
          repoName: h.repoId?.name || 'repo',
          owner: 'git',
          commit: Math.random().toString(16).substr(2, 7),
          commitMessage: 'Triggered quality audit scan',
          branch: h.branch,
          qualityScore: h.scores?.qualityScore || 0,
          duration: `${h.elapsedTime}s`,
          status: h.status,
          triggeredBy: 'User Action',
          completedAt: new Date(h.updatedAt).toLocaleTimeString(),
          findings: h.findings
        }));
        setHistory(mappedHistory);

        // Compute metrics
        const completed = mappedHistory.filter(h => h.status === 'success');
        const failed = mappedHistory.filter(h => h.status === 'failed');
        const avgScore = completed.length > 0
          ? Math.round(completed.reduce((sum, c) => sum + c.qualityScore, 0) / completed.length)
          : 0;

        setMetrics({
          totalScans: mappedHistory.length,
          completedScans: completed.length,
          failedScans: failed.length,
          runningScans: 0,
          avgQualityScore: avgScore,
          avgScanTime: '3s'
        });
      }
    } catch (err) {
      console.error('Failed to retrieve scan histories:', err);
    }
  };

  // Sync historical scans when repository filter changes
  useEffect(() => {
    if (mode === 'live' && filterRepo !== 'all') {
      fetchScanHistory(filterRepo);
    }
  }, [filterRepo, mode]);

  // Background mock scan runner for Simulator Mode
  useEffect(() => {
    if (mode !== 'simulator') return;

    const interval = setInterval(() => {
      setActiveScans((prev) => {
        const updated = prev.map((scan) => {
          if (scan.progress >= 100) return scan;

          const nextProgress = scan.progress + Math.floor(Math.random() * 8) + 5;
          const progressVal = Math.min(100, nextProgress);

          const elapsedSec = parseInt(scan.elapsedTime) + 3;
          const elapsedStr = `${elapsedSec}s`;

          let currentStage = scan.currentStage;
          const stages = scan.stages.map((st, index) => {
            const rangeMin = index * 16;
            const rangeMax = (index + 1) * 16;

            if (progressVal >= rangeMax) {
              return { ...st, status: 'completed' };
            } else if (progressVal >= rangeMin && progressVal < rangeMax) {
              currentStage = st.name;
              return { ...st, status: 'active' };
            }
            return { ...st, status: 'pending' };
          });

          return {
            ...scan,
            progress: progressVal,
            elapsedTime: elapsedStr,
            currentStage,
            stages,
          };
        });

        const finished = updated.filter((s) => s.progress >= 100);
        if (finished.length > 0) {
          finished.forEach((s) => {
            const newHistoryItem = {
              id: `scan-hist-${Date.now()}`,
              repoName: s.repoName,
              owner: s.owner,
              commit: Math.random().toString(16).substr(2, 7),
              commitMessage: 'Automatic scan runner finished auditing changes',
              branch: s.branch,
              qualityScore: Math.floor(Math.random() * 15) + 85,
              duration: s.elapsedTime,
              status: 'success',
              triggeredBy: 'QAPilot Scheduler',
              completedAt: 'Just now',
            };

            setHistory((prevHist) => [newHistoryItem, ...prevHist]);
            setMetrics((prevMet) => ({
              ...prevMet,
              totalScans: prevMet.totalScans + 1,
              completedScans: prevMet.completedScans + 1,
              runningScans: Math.max(0, prevMet.runningScans - 1),
            }));
          });
        }

        return updated.filter((s) => s.progress < 100);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [mode]);

  // Polling helper for active backend scans
  const pollScanResult = useCallback((scanId, repoId) => {
    const timer = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/scan/result/${scanId}`, {
          withCredentials: true
        });
        if (res.data) {
          const scan = res.data;
          
          if (scan.status === 'success' || scan.status === 'failed') {
            clearInterval(timer);
            
            // Remove from active list
            setActiveScans((prev) => prev.filter((s) => s.id !== scanId));
            
            // Reload repository history logs
            fetchScanHistory(repoId);
          }
        }
      } catch (err) {
        console.error('Error polling scan outcomes:', err);
        clearInterval(timer);
      }
    }, 2000);
  }, []);

  const triggerStartScan = async (repoNameOrId, branch) => {
    setLoading(true);
    setError(null);

    if (mode === 'live') {
      try {
        // Find corresponding repository object
        const repoObj = repositories.find(r => r._id === repoNameOrId || r.name === repoNameOrId);
        if (!repoObj) throw new Error("Target repository not matched");

        const res = await axios.post(`http://localhost:5000/api/scan/run/${repoObj._id}`, {
          branch: branch || 'main'
        }, {
          withCredentials: true
        });

        if (res.data) {
          const newScan = res.data;
          const mappedActive = {
            id: newScan._id,
            repoName: repoObj.name,
            owner: repoObj.owner?.login || 'git',
            branch: newScan.branch,
            progress: 15,
            elapsedTime: '0s',
            currentStage: 'Initializing',
            stages: [
              { name: 'Clone', status: 'active' },
              { name: 'Rules parsing', status: 'pending' },
              { name: 'Static analyze', status: 'pending' },
              { name: 'Quality index', status: 'pending' }
            ]
          };

          setActiveScans((prev) => [mappedActive, ...prev]);
          pollScanResult(newScan._id, repoObj._id);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to initiate live codebase scan.');
      } finally {
        setLoading(false);
      }
    } else {
      // Simulator fallback mode
      try {
        const newActive = await scanService.startScan(repoNameOrId, branch);
        setActiveScans((prev) => [newActive, ...prev]);
        setMetrics((prevMet) => ({
          ...prevMet,
          runningScans: prevMet.runningScans + 1,
        }));
      } catch (err) {
        setError('Failed to initiate codebase scan.');
      } finally {
        setLoading(false);
      }
    }
  };

  const triggerCancelScan = async (scanId) => {
    if (mode === 'live') {
      // Just drop locally in simulation
      setActiveScans((prev) => prev.filter((s) => s.id !== scanId));
    } else {
      try {
        await scanService.cancelScan(scanId);
        setActiveScans((prev) => prev.filter((s) => s.id !== scanId));
        setMetrics((prevMet) => ({
          ...prevMet,
          runningScans: Math.max(0, prevMet.runningScans - 1),
        }));
      } catch (err) {
        setError('Failed to cancel scan.');
      }
    }
  };

  const triggerRetryScan = async (scanId) => {
    if (mode === 'live') {
      const histItem = history.find((h) => h.id === scanId);
      if (histItem) {
        await triggerStartScan(histItem.repoId || histItem.repoName, histItem.branch);
      }
    } else {
      try {
        const histItem = history.find((h) => h.id === scanId);
        if (histItem) {
          await triggerStartScan(histItem.repoName, histItem.branch);
        }
      } catch (err) {
        setError('Failed to retry scan.');
      }
    }
  };

  const resetFilters = () => {
    setFilterRepo('all');
    setFilterStatus('all');
    setFilterBranch('all');
    setFilterTime('all');
  };

  return (
    <ScanContext.Provider
      value={{
        metrics,
        activeScans,
        history,
        queue,
        scorecard,
        loading,
        error,
        filterRepo,
        setFilterRepo,
        filterStatus,
        setFilterStatus,
        filterBranch,
        setFilterBranch,
        filterTime,
        setFilterTime,
        triggerStartScan,
        triggerCancelScan,
        triggerRetryScan,
        resetFilters,
        repositories,
        mode
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScans() {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScans must be used within a ScanProvider');
  }
  return context;
}
export default ScanContext;
