import React, { createContext, useContext, useState, useEffect } from 'react';
import { findingService } from '../services/findingService';

const FindingsContext = createContext(null);

export function FindingsProvider({ children }) {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic metrics calculation
  const resolvedFindings = findings.filter((f) => f.status === 'resolved' && f.resolvedAt);
  let computedAvgResolutionTime = '4.2 days';
  if (resolvedFindings.length > 0) {
    const totalDiff = resolvedFindings.reduce((sum, f) => {
      const diff = new Date(f.resolvedAt).getTime() - new Date(f.createdAt).getTime();
      return sum + diff;
    }, 0);
    const avgDays = (totalDiff / resolvedFindings.length / 86400000).toFixed(1);
    computedAvgResolutionTime = `${avgDays} days`;
  }

  const metrics = {
    total: findings.length,
    critical: findings.filter((f) => f.severity === 'critical' && f.status === 'open').length,
    high: findings.filter((f) => f.severity === 'high' && f.status === 'open').length,
    resolved: findings.filter((f) => f.status === 'resolved').length,
    avgResolutionTime: computedAvgResolutionTime,
    reposImpacted: new Set(findings.map((f) => f.repo)).size,
  };

  // Drawer state
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Filter state
  const [filterRepo, setFilterRepo] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterTimeRange, setFilterTimeRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Export state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await findingService.getFindings();
        setFindings(data);
      } catch (err) {
        setError('Failed to load findings.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openDrawer = (finding) => {
    setSelectedFinding(finding);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedFinding(null), 300);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (visibleIds) => {
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const bulkResolve = async () => {
    if (selectedIds.length === 0) return;
    await findingService.bulkActions(selectedIds, 'resolve');
    setFindings((prev) =>
      prev.map((f) => (selectedIds.includes(f.id) ? { ...f, status: 'resolved', resolvedAt: new Date().toISOString() } : f))
    );
    clearSelection();
  };

  const bulkIgnore = async () => {
    if (selectedIds.length === 0) return;
    await findingService.bulkActions(selectedIds, 'ignore');
    setFindings((prev) =>
      prev.map((f) => (selectedIds.includes(f.id) ? { ...f, status: 'ignored' } : f))
    );
    clearSelection();
  };

  const bulkAssign = async (assignee) => {
    if (selectedIds.length === 0) return;
    await findingService.bulkActions(selectedIds, 'assign', assignee);
    setFindings((prev) =>
      prev.map((f) => (selectedIds.includes(f.id) ? { ...f, assignee } : f))
    );
    clearSelection();
  };

  const resolveOne = async (id) => {
    await findingService.resolveFinding(id);
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'resolved', resolvedAt: new Date().toISOString() } : f))
    );
    if (selectedFinding?.id === id) {
      setSelectedFinding((prev) => ({ ...prev, status: 'resolved', resolvedAt: new Date().toISOString() }));
    }
  };

  const ignoreOne = async (id) => {
    await findingService.ignoreFinding(id);
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'ignored' } : f))
    );
    if (selectedFinding?.id === id) {
      setSelectedFinding((prev) => ({ ...prev, status: 'ignored' }));
    }
  };

  const triggerExport = async (format) => {
    setExportLoading(true);
    const idsToExport = selectedIds.length > 0 ? selectedIds : findings.map((f) => f.id);
    await findingService.exportFindings(idsToExport, format);
    setExportLoading(false);
    setExportModalOpen(false);
    clearSelection();
  };

  const resetFilters = () => {
    setFilterRepo('all');
    setFilterSeverity('all');
    setFilterCategory('all');
    setFilterStatus('all');
    setFilterAssignee('all');
    setFilterTimeRange('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  // Build filtered + sorted results
  const filteredFindings = findings
    .filter((f) => {
      if (filterRepo !== 'all' && f.repo !== filterRepo) return false;
      if (filterSeverity !== 'all' && f.severity !== filterSeverity) return false;
      if (filterCategory !== 'all' && f.category !== filterCategory) return false;
      if (filterStatus !== 'all' && f.status !== filterStatus) return false;
      if (filterAssignee !== 'all' && f.assignee !== filterAssignee) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !f.title.toLowerCase().includes(q) &&
          !f.repo.toLowerCase().includes(q) &&
          !f.file.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const sevOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      if (sortBy === 'highest_severity') return sevOrder[a.severity] - sevOrder[b.severity];
      if (sortBy === 'highest_confidence') return b.confidence - a.confidence;
      if (sortBy === 'repo_name') return a.repo.localeCompare(b.repo);
      if (sortBy === 'oldest') return parseInt(b.detectedAt) - parseInt(a.detectedAt);
      // Default: newest first (lower number = more recent)
      return parseInt(a.detectedAt) - parseInt(b.detectedAt);
    });

  return (
    <FindingsContext.Provider
      value={{
        findings,
        filteredFindings,
        metrics,
        loading,
        error,
        selectedFinding,
        drawerOpen,
        openDrawer,
        closeDrawer,
        selectedIds,
        toggleSelect,
        toggleSelectAll,
        clearSelection,
        bulkResolve,
        bulkIgnore,
        bulkAssign,
        resolveOne,
        ignoreOne,
        filterRepo, setFilterRepo,
        filterSeverity, setFilterSeverity,
        filterCategory, setFilterCategory,
        filterStatus, setFilterStatus,
        filterAssignee, setFilterAssignee,
        filterTimeRange, setFilterTimeRange,
        searchQuery, setSearchQuery,
        sortBy, setSortBy,
        resetFilters,
        exportModalOpen, setExportModalOpen,
        exportLoading,
        triggerExport,
      }}
    >
      {children}
    </FindingsContext.Provider>
  );
}

export function useFindings() {
  const ctx = useContext(FindingsContext);
  if (!ctx) throw new Error('useFindings must be used inside <FindingsProvider>');
  return ctx;
}
export default FindingsContext;
