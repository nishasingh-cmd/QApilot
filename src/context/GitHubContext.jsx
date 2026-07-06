import React, { createContext, useContext, useState } from 'react';
import { githubService } from '../services/githubService';
import { repositoryService } from '../services/repositoryService';

const GitHubContext = createContext(null);

export function GitHubProvider({ children }) {
  const [connectionStatus, setConnectionStatus] = useState('not_connected'); // not_connected | connecting | connected | error | syncing
  const [githubUser, setGithubUser] = useState(null);
  const [availableRepos, setAvailableRepos] = useState([]);
  const [selectedRepoIds, setSelectedRepoIds] = useState([]);
  const [importedRepos, setImportedRepos] = useState([]);
  const [configuration, setConfiguration] = useState(null);
  const [step, setStep] = useState('connect'); // connect | oauth_progress | import_list | config | success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulated Connection flow triggers
  const startOAuthFlow = async () => {
    setError(null);
    setStep('oauth_progress');
    setConnectionStatus('connecting');
  };

  const handleOAuthSuccess = async (user) => {
    setGithubUser(user);
    setConnectionStatus('syncing');
    try {
      const repos = await githubService.fetchRepositories();
      setAvailableRepos(repos);
      setConnectionStatus('connected');
      setStep('import_list');
    } catch (err) {
      setConnectionStatus('error');
      setError(err.message || 'Failed to fetch repositories from GitHub.');
      setStep('connect');
    }
  };

  const handleOAuthFailure = (errorMessage) => {
    setConnectionStatus('error');
    setError(errorMessage);
    setStep('connect');
  };

  const toggleRepoSelection = (repoId) => {
    setSelectedRepoIds((prev) =>
      prev.includes(repoId) ? prev.filter((id) => id !== repoId) : [...prev, repoId]
    );
  };

  const toggleSelectAll = (reposToToggle) => {
    const allIds = reposToToggle.map((r) => r.id);
    const allSelected = allIds.every((id) => selectedRepoIds.includes(id));
    if (allSelected) {
      // Deselect all in the active view
      setSelectedRepoIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      // Select all in the active view
      setSelectedRepoIds((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  const importSelectedRepositories = async () => {
    if (selectedRepoIds.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const reposToImport = availableRepos.filter((r) => selectedRepoIds.includes(r.id));
      const imported = await repositoryService.importRepositories(reposToImport);
      setImportedRepos(imported);
      setStep('config');
    } catch (err) {
      setError('Failed to import repositories.');
    } finally {
      setLoading(false);
    }
  };

  const saveScanConfiguration = async (config) => {
    setLoading(true);
    setError(null);
    try {
      const result = await repositoryService.saveConfiguration(config);
      setConfiguration(result.savedConfig);
      setStep('success');
    } catch (err) {
      setError('Failed to save scan settings.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectGitHub = async () => {
    setLoading(true);
    try {
      await githubService.disconnect();
      setConnectionStatus('not_connected');
      setGithubUser(null);
      setAvailableRepos([]);
      setSelectedRepoIds([]);
      setImportedRepos([]);
      setConfiguration(null);
      setStep('connect');
    } catch (err) {
      setError('Failed to disconnect GitHub account.');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('connect');
    setError(null);
  };

  return (
    <GitHubContext.Provider
      value={{
        connectionStatus,
        githubUser,
        availableRepos,
        selectedRepoIds,
        importedRepos,
        configuration,
        step,
        setStep,
        loading,
        error,
        setError,
        startOAuthFlow,
        handleOAuthSuccess,
        handleOAuthFailure,
        toggleRepoSelection,
        toggleSelectAll,
        importSelectedRepositories,
        saveScanConfiguration,
        disconnectGitHub,
        resetFlow,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHub() {
  const context = useContext(GitHubContext);
  if (!context) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
}
export default GitHubContext;
