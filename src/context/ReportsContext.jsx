import React, { createContext, useContext, useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { MOCK_REPORTS_METRICS, MOCK_REPORTS_SUMMARY } from '../data/reports';

const ReportsContext = createContext(null);

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [metrics, setMetrics] = useState(MOCK_REPORTS_METRICS);
  const [summary, setSummary] = useState(MOCK_REPORTS_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preview & Compare selection states
  const [previewReport, setPreviewReport] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]); // for comparison (max 2)
  const [comparisonData, setComparisonData] = useState(null);
  const [compareMode, setCompareMode] = useState(false);

  // Modals
  const [shareReport, setShareReport] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [exportReport, setExportReport] = useState(null);
  const [exportFormat, setExportFormat] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  // Generation status
  const [generationLoading, setGenerationLoading] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await reportService.getReports();
        setReports(data);
      } catch (err) {
        setError('Failed to fetch AI quality reports.');
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  const openPreview = async (report) => {
    setLoading(true);
    try {
      const detailed = await reportService.getReport(report.id);
      setPreviewReport(detailed);
    } catch (err) {
      setError('Failed to load report summary.');
    } finally {
      setLoading(false);
    }
  };

  const closePreview = () => setPreviewReport(null);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      } else {
        if (prev.length >= 2) return [prev[1], id];
        return [...prev, id];
      }
    });
  };

  const clearSelections = () => {
    setSelectedIds([]);
    setComparisonData(null);
    setCompareMode(false);
  };

  const triggerCompare = async () => {
    if (selectedIds.length !== 2) return;
    setLoading(true);
    try {
      const data = await reportService.compareReports(selectedIds[0], selectedIds[1]);
      setComparisonData(data);
      setCompareMode(true);
    } catch (err) {
      setError('Failed to compare quality reports.');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (repo, branch) => {
    setGenerationLoading(true);
    try {
      const newRep = await reportService.generateReport(repo, branch);
      setReports((prev) => [newRep, ...prev]);
      setMetrics((prev) => ({
        ...prev,
        generated: prev.generated + 1,
        latestScore: newRep.qualityScore,
      }));
      openPreview(newRep);
    } catch (err) {
      setError('Failed to generate report.');
    } finally {
      setGenerationLoading(false);
    }
  };

  const shareOne = async (id, platform, recipient) => {
    setShareLoading(true);
    try {
      await reportService.shareReport(id, platform, recipient);
      // Reload report detail in preview if currently shown
      if (previewReport && previewReport.id === id) {
        const refreshed = await reportService.getReport(id);
        setPreviewReport(refreshed);
      }
      // Refresh reports list
      const refreshedList = await reportService.getReports();
      setReports(refreshedList);
    } catch (err) {
      console.error(err);
    } finally {
      setShareLoading(false);
      setShareReport(null);
    }
  };

  const exportOne = async (id, format) => {
    setExportLoading(true);
    try {
      await reportService.exportReport(id, format);
      // Reload detail in preview if currently shown
      if (previewReport && previewReport.id === id) {
        const refreshed = await reportService.getReport(id);
        setPreviewReport(refreshed);
      }
      // Refresh reports list
      const refreshedList = await reportService.getReports();
      setReports(refreshedList);
    } catch (err) {
      console.error(err);
    } finally {
      setExportLoading(false);
      setExportReport(null);
    }
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        metrics,
        summary,
        loading,
        error,
        previewReport,
        openPreview,
        closePreview,
        selectedIds,
        toggleSelect,
        clearSelections,
        triggerCompare,
        compareMode,
        setCompareMode,
        comparisonData,
        generateReport,
        generationLoading,
        shareReport,
        setShareReport,
        shareLoading,
        shareOne,
        exportReport,
        setExportReport,
        exportLoading,
        exportOne,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used inside <ReportsProvider>');
  return ctx;
}

export default ReportsContext;
