/**
 * Service to compute and enrich repository telemetry stats.
 * Generates health scores, activity distribution indicators, and AI readiness metrics.
 */

export const computeRepoMetrics = (repo) => {
  // Compute simulated stable health values using attributes like language, size or name hash to ensure consistency
  const stringSeed = (repo.fullName || repo.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Health score (0-100)
  const healthScore = Math.min(100, Math.max(40, 75 + (stringSeed % 26)));

  // Activity score (0-100)
  const activityScore = Math.min(100, Math.max(10, 50 + (stringSeed % 51)));

  // Risk score (0-100) - higher when health is lower and activity is lower
  const riskScore = Math.max(10, Math.min(95, 100 - healthScore + Math.floor(activityScore / 4)));

  // AI readiness score (0-100)
  const aiReadiness = Math.min(100, Math.max(50, 60 + (stringSeed % 41)));

  // Language distribution ratios
  const primaryLang = repo.language || 'Javascript';
  const distribution = [
    { name: primaryLang, percentage: 70 },
    { name: 'CSS', percentage: 15 },
    { name: 'HTML', percentage: 10 },
    { name: 'Other', percentage: 5 }
  ];

  return {
    repositoryId: repo._id || repo.githubId,
    name: repo.name,
    healthScore,
    activityScore,
    riskScore,
    aiReadiness,
    languages: distribution,
    lastComputed: new Date()
  };
};

export default { computeRepoMetrics };
