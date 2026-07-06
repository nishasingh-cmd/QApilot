import React, { createContext, useContext, useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';

const AnalyticsContext = createContext(null);

export function AnalyticsProvider({ children }) {
  const [timeframe, setTimeframe] = useState('30d');
  const [overview, setOverview] = useState(null);
  const [qualityTrends, setQualityTrends] = useState([]);
  const [repoHealth, setRepoHealth] = useState([]);
  const [teamMetrics, setTeamMetrics] = useState(null);
  const [aiAnalytics, setAiAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [exportOpen, setExportOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Load everything
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ov, trends, health, team, ai] = await Promise.all([
          analyticsService.getOverview(),
          analyticsService.getQualityTrends(timeframe),
          analyticsService.getRepositoryHealth(),
          analyticsService.getTeamMetrics(),
          analyticsService.getAIAnalytics(),
        ]);
        setOverview(ov);
        setQualityTrends(trends);
        setRepoHealth(health);
        setTeamMetrics(team);
        setAiAnalytics(ai);
      } catch (err) {
        setError('Failed to fetch analytics statistics.');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [timeframe]);

  const triggerExport = async (format) => {
    setExportLoading(true);
    try {
      await analyticsService.exportAnalytics(format);
    } catch (err) {
      console.error(err);
    } finally {
      setExportLoading(false);
      setExportOpen(false);
    }
  };

  return (
    <AnalyticsContext.Provider
      value={{
        timeframe,
        setTimeframe,
        overview,
        qualityTrends,
        repoHealth,
        teamMetrics,
        aiAnalytics,
        loading,
        error,
        exportOpen,
        setExportOpen,
        exportLoading,
        triggerExport,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error('useAnalytics must be used inside <AnalyticsProvider>');
  return ctx;
}

export default AnalyticsContext;
