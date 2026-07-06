import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGitHub } from '../context/GitHubContext';
import { GitHubConnectCard } from '../components/github/GitHubConnectCard';
import { OAuthProgress } from '../components/github/OAuthProgress';
import { RepositoryImportTable } from '../components/github/RepositoryImportTable';
import { RepositorySelector } from '../components/github/RepositorySelector';
import { ScanConfiguration } from '../components/github/ScanConfiguration';
import { ConnectionSuccess } from '../components/github/ConnectionSuccess';

export function ConnectGithub() {
  const navigate = useNavigate();
  const {
    step,
    setStep,
    connectionStatus,
    githubUser,
    availableRepos,
    selectedRepoIds,
    importedRepos,
    configuration,
    loading,
    error,
    startOAuthFlow,
    handleOAuthSuccess,
    handleOAuthFailure,
    toggleRepoSelection,
    toggleSelectAll,
    importSelectedRepositories,
    saveScanConfiguration,
    resetFlow,
  } = useGitHub();

  // Reset wizard flow when mounting the connect page
  useEffect(() => {
    resetFlow();
  }, []);

  const handleFinish = () => {
    // Navigate back to repositories tab where they can see their new repos
    navigate('/dashboard/repos');
  };

  const selectedReposFull = availableRepos.filter((r) => selectedRepoIds.includes(r.id));

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center">
      {/* Wizard Step Progress Tracker */}
      {step !== 'success' && step !== 'oauth_progress' && (
        <div className="max-w-xl mx-auto w-full mb-10 flex items-center justify-between text-xs font-semibold text-brand-text-secondary select-none">
          <div className="flex flex-col items-center gap-1.5">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border font-mono ${
              step === 'connect'
                ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
            }`}>
              1
            </span>
            <span className={step === 'connect' ? 'text-white font-extrabold' : ''}>Authorize</span>
          </div>
          <div className="h-[2px] flex-1 bg-white/[0.06] mx-4" />
          <div className="flex flex-col items-center gap-1.5">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border font-mono ${
              step === 'import_list'
                ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                : step === 'config' || step === 'success'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-white/[0.04] border-white/[0.06]'
            }`}>
              2
            </span>
            <span className={step === 'import_list' ? 'text-white font-extrabold' : ''}>Import</span>
          </div>
          <div className="h-[2px] flex-1 bg-white/[0.06] mx-4" />
          <div className="flex flex-col items-center gap-1.5">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border font-mono ${
              step === 'config'
                ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                : step === 'success'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-white/[0.04] border-white/[0.06]'
            }`}>
              3
            </span>
            <span className={step === 'config' ? 'text-white font-extrabold' : ''}>Configure</span>
          </div>
        </div>
      )}

      {/* Main step routing switch */}
      <div>
        {step === 'connect' && (
          <GitHubConnectCard onConnect={startOAuthFlow} />
        )}

        {step === 'oauth_progress' && (
          <OAuthProgress
            onSuccess={handleOAuthSuccess}
            onFailure={handleOAuthFailure}
          />
        )}

        {step === 'import_list' && (
          <div className="flex flex-col gap-2">
            <RepositoryImportTable
              availableRepos={availableRepos}
              selectedRepoIds={selectedRepoIds}
              onToggleRepo={toggleRepoSelection}
              onToggleSelectAll={toggleSelectAll}
              onImport={importSelectedRepositories}
              loading={loading}
            />
          </div>
        )}

        {step === 'config' && (
          <div className="flex flex-col gap-1">
            {/* Visual list of imported repos showing before final submission */}
            <RepositorySelector
              selectedRepos={selectedReposFull}
              onRemove={toggleRepoSelection}
            />
            <ScanConfiguration
              onSave={saveScanConfiguration}
              loading={loading}
            />
          </div>
        )}

        {step === 'success' && (
          <ConnectionSuccess
            numRepos={selectedRepoIds.length}
            sensitivity={configuration?.sensitivity || 'balanced'}
            email={configuration?.email || 'notifications@qapilot.io'}
            onFinish={handleFinish}
          />
        )}
      </div>

      {error && step !== 'oauth_progress' && (
        <div className="max-w-xl mx-auto w-full p-4 mt-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center text-xs text-red-400 font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
export default ConnectGithub;
