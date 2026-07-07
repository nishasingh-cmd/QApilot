/**
 * Report Exporter Service for QAPilot.
 * Prepares reports in JSON, PDF-ready layout, and CSV formats.
 */

export const exportToJson = (report) => {
  return report;
};

export const exportToPdfReady = (report) => {
  // Return structured, highly detailed JSON ready for canvas painting or PDF templators
  return {
    documentMeta: {
      title: report.name,
      version: report.version,
      generatedAt: report.createdAt,
      generatedBy: report.generatedBy,
      targetRepository: report.repo,
      targetBranch: report.branch
    },
    sections: {
      executiveSummary: {
        header: "1. EXECUTIVE AUDIT SUMMARY",
        score: `${report.overallScore}%`,
        grade: report.overallScore >= 90 ? "A" : report.overallScore >= 80 ? "B" : report.overallScore >= 70 ? "C" : "D",
        content: report.aiSummary,
        metricsOverview: [
          { name: "Overall Quality Score", value: `${report.overallScore}%` },
          { name: "Code Security Score", value: `${report.categoryScores?.security || 0}%` },
          { name: "Performance Score", value: `${report.categoryScores?.performance || 0}%` },
          { name: "Maintainability Score", value: `${report.categoryScores?.maintainability || 0}%` },
          { name: "Code Coverage Estimate", value: `${report.categoryScores?.coverage || 0}%` }
        ]
      },
      findingsBreakdown: {
        header: "2. SCAN FINDINGS INVENTORY SUMMARY",
        counts: {
          critical: report.findingsSummary?.critical || 0,
          high: report.findingsSummary?.high || 0,
          medium: report.findingsSummary?.medium || 0,
          low: report.findingsSummary?.low || 0
        },
        chartData: [
          { label: "Critical Risk Issues", count: report.findingsSummary?.critical || 0 },
          { label: "High Risk Issues", count: report.findingsSummary?.high || 0 },
          { label: "Medium Risk Issues", count: report.findingsSummary?.medium || 0 },
          { label: "Low Risk Issues", count: report.findingsSummary?.low || 0 }
        ]
      },
      actionItems: {
        header: "3. TARGETED ACTION STEPS & MITIGATIONS",
        priorityActions: report.recommendations?.priorityActions || [],
        architectureSuggestions: report.recommendations?.architecture || [],
        testingEnhancements: report.recommendations?.testing || [],
        securityBestPractices: report.recommendations?.security || [],
        performanceTweaks: report.recommendations?.performance || []
      }
    }
  };
};

export const exportToCsv = (report, scan) => {
  const headers = ["File Path", "Violation Type", "Severity", "Finding Description", "Recommendation Action"];
  
  const rows = [];
  if (scan && scan.findings) {
    scan.findings.forEach((finding) => {
      rows.push([
        finding.file || "",
        finding.type || "",
        finding.severity || "",
        (finding.message || "").replace(/"/g, '""'), // escape quotes
        (finding.recommendation || "").replace(/"/g, '""')
      ]);
    });
  }

  // Convert array to CSV string format
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((val) => `"${val}"`).join(","))
  ].join("\n");

  return csvContent;
};

export default { exportToJson, exportToPdfReady, exportToCsv };
