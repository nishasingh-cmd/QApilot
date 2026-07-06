import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CONNECTED_REPOS, AVAILABLE_REPOS } from '../data/repositories';
import { RepositoryStats } from '../components/repositories/RepositoryStats';
import { RepositorySearch } from '../components/repositories/RepositorySearch';
import { RepositoryFilters } from '../components/repositories/RepositoryFilters';
import { RepositoryCard } from '../components/repositories/RepositoryCard';
import { RepositoryEmptyState } from '../components/repositories/RepositoryEmptyState';
import { RepositoryModal } from '../components/repositories/RepositoryModal';
import { useGitHub } from '../context/GitHubContext';
import { IntegrationStatusCard } from '../components/github/IntegrationStatusCard';

export function Repositories() {
  const navigate = useNavigate();
  const { connectionStatus, githubUser, importedRepos, disconnectGitHub, error } = useGitHub();

  // Combine standard mock repos with dynamically imported ones
  const [connected, setConnected] = useState([...importedRepos, ...CONNECTED_REPOS]);
  const [available, setAvailable] = useState(AVAILABLE_REPOS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state if importedRepos changes
  useEffect(() => {
    setConnected([...importedRepos, ...CONNECTED_REPOS]);
  }, [importedRepos]);

  // Handle connecting a repo from the modal
  const handleConnectRepo = (repo) => {
    // Add to connected list with realistic initial scan state
    const newConnected = {
      id: `repo-${Date.now()}`,
      name: repo.name,
      owner: repo.owner,
      fullName: `${repo.owner}/${repo.name}`,
      visibility: repo.visibility,
      language: repo.language,
      branch: repo.branch,
      stars: repo.stars,
      lastScan: 'Just now',
      status: 'healthy',
      healthScore: 100,
      openIssues: 0,
      aiCoverage: 100,
      deploymentStatus: 'success',
      recentActivity: 'Repository successfully connected to QAPilot',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setConnected((prev) => [newConnected, ...prev]);
    setAvailable((prev) => prev.filter((r) => r.id !== repo.id));
  };

  // Simulate repository scan trigger
  const handleScanRepo = (repo) => {
    // Set to scanning
    setConnected((prev) =>
      prev.map((r) => (r.id === repo.id ? { ...r, status: 'scanning', recentActivity: 'AI Scan started...' } : r))
    );

    // Simulate completion
    setTimeout(() => {
      setConnected((prev) =>
        prev.map((r) =>
          r.id === repo.id
            ? {
                ...r,
                status: 'healthy',
                lastScan: 'Just now',
                healthScore: Math.min(100, r.healthScore + Math.floor(Math.random() * 5)),
                recentActivity: 'AI Scan complete — 0 security vulnerabilities found',
              }
            : r
        )
      );
    }, 4000);
  };

  const handleSettingsRepo = (repo) => {
    alert(`Configure webhooks, secrets, and branch settings for ${repo.fullName} coming in next phase.`);
  };

  const handleViewRepo = (repo) => {
    alert(`Opening scan dashboard details for ${repo.fullName} coming in next phase.`);
  };

  // Filter & Search logic
  const filteredRepos = connected
    .filter((repo) => {
      // Search term matching
      const term = searchQuery.toLowerCase();
      const matchesSearch =
        repo.name.toLowerCase().includes(term) ||
        repo.owner.toLowerCase().includes(term) ||
        repo.language.toLowerCase().includes(term);

      if (!matchesSearch) return false;

      // Filter tabs matching
      if (activeFilter === 'all') return true;
      if (activeFilter === 'healthy') return repo.status === 'healthy';
      if (activeFilter === 'scanning') return repo.status === 'scanning';
      if (activeFilter === 'attention') return repo.status === 'attention' || repo.status === 'offline';
      if (activeFilter === 'public') return repo.visibility === 'public';
      if (activeFilter === 'private') return repo.visibility === 'private';

      return true;
    })
    .sort((a, b) => {
      // Sort dropdown matching
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'highest_score') return b.healthScore - a.healthScore;
      if (sortBy === 'lowest_score') return a.healthScore - b.healthScore;
      if (sortBy === 'most_issues') return b.openIssues - a.openIssues;
      return 0;
    });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Repositories</h1>
          <p className="text-[13px] text-brand-text-secondary mt-1">
            Manage and monitor all connected repositories from one place.
          </p>
        </div>
      </div>

      {/* GitHub Integration Status Banner */}
      <div className="mb-6">
        <IntegrationStatusCard
          status={connectionStatus}
          githubUser={githubUser}
          onConnect={() => navigate('/dashboard/connect-github')}
          onDisconnect={disconnectGitHub}
          error={error}
        />
      </div>

      {/* Repository Stats overview */}
      {connected.length > 0 && <RepositoryStats repos={connected} />}

      {/* Search & Actions Bar */}
      <RepositorySearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onConnectClick={() => setIsModalOpen(true)}
      />

      {/* Filters & Sort options */}
      {connected.length > 0 && (
        <RepositoryFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      )}

      {/* Main Grid View */}
      {connected.length === 0 ? (
        <RepositoryEmptyState onConnectClick={() => setIsModalOpen(true)} />
      ) : filteredRepos.length === 0 ? (
        <div className="text-center py-20 text-brand-text-secondary text-xs rounded-2xl bg-white/[0.01] border border-white/[0.04]">
          No connected repositories match the current search or filters.
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredRepos.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repo={repo}
                onView={handleViewRepo}
                onScan={handleScanRepo}
                onSettings={handleSettingsRepo}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Connect Repository Modal */}
      <RepositoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableRepos={available}
        onConnectRepo={handleConnectRepo}
      />
    </div>
  );
}
export default Repositories;
