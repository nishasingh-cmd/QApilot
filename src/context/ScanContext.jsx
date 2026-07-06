import React, { createContext, useContext, useState, useEffect } from 'react';
import { scanService } from '../services/scanService';
import { MOCK_METRICS, MOCK_ACTIVE_SCANS, MOCK_HISTORY, MOCK_QUEUE, MOCK_QUALITY_SCORECARD } from '../data/scans';

const ScanContext = createContext(null);

export function ScanProvider({ children }) {
  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [activeScans, setActiveScans] = useState(MOCK_ACTIVE_SCANS);
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [scorecard, setScorecard] = useState(MOCK_QUALITY_SCORECARD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [filterRepo, setFilterRepo] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterTime, setFilterTime] = useState('all');

  // Trigger automated scanning updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScans((prev) => {
        const updated = prev.map((scan) => {
          if (scan.progress >= 100) return scan;

          const nextProgress = scan.progress + Math.floor(Math.random() * 8) + 5;
          const progressVal = Math.min(100, nextProgress);

          // Update elapsed time & estimate
          const elapsedSec = parseInt(scan.elapsedTime) + 3;
          const elapsedStr = `${elapsedSec}s`;

          // Determine stage based on progress value
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

        // Filter out completed ones and move to history
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
              qualityScore: Math.floor(Math.random() * 15) + 85, // 85 - 100
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
  }, []);

  const triggerStartScan = async (repoName, branch) => {
    setLoading(true);
    setError(null);
    try {
      const newActive = await scanService.startScan(repoName, branch);
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
  };

  const triggerCancelScan = async (scanId) => {
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
  };

  const triggerRetryScan = async (scanId) => {
    setLoading(true);
    try {
      const result = await scanService.retryScan(scanId);
      // Retrieve metadata from history to spin up new scan
      const histItem = history.find((h) => h.id === scanId);
      if (histItem) {
        await triggerStartScan(histItem.repoName, histItem.branch);
      }
    } catch (err) {
      setError('Failed to retry scan.');
    } finally {
      setLoading(false);
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
