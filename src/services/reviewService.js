import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const escapeHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const reviewService = {
  createReview: async (repositoryId, fileId, scanId = null, reviewType = 'full') => {
    const res = await axios.post(
      `${API_BASE}/reviews`,
      { repositoryId, fileId, scanId, reviewType },
      { withCredentials: true }
    );
    return res.data;
  },

  getReviews: async (repositoryId = null, fileId = null) => {
    let url = `${API_BASE}/reviews`;
    const params = [];
    if (repositoryId) params.push(`repositoryId=${repositoryId}`);
    if (fileId) params.push(`fileId=${fileId}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    const res = await axios.get(url, { withCredentials: true });
    return res.data;
  },

  getReview: async (id) => {
    const res = await axios.get(`${API_BASE}/reviews/${id}`, { withCredentials: true });
    return res.data;
  },

  deleteReview: async (id) => {
    const res = await axios.delete(`${API_BASE}/reviews/${id}`, { withCredentials: true });
    return res.data;
  },

  exportReview: (review, format) => {
    if (format === 'json') {
      const jsonContent = JSON.stringify(review, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `code-review-${review._id || 'export'}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return { success: true };
    }

    if (format === 'markdown') {
      const mdContent = `# AI Code Review: ${review.fileId?.name || 'File Report'}
* **Repository:** ${review.repositoryId?.fullName || review.repositoryId?.name || 'N/A'}
* **Path:** \`${review.fileId?.path || 'N/A'}\`
* **Language:** ${review.fileId?.language || 'N/A'}
* **Date:** ${new Date(review.createdAt).toLocaleString()}
* **Provider:** ${review.provider || 'N/A'}

## Score Breakdown
* **Overall Score:** ${review.overallScore}%
* **Security Score:** ${review.securityScore}%
* **Performance Score:** ${review.performanceScore}%
* **Maintainability Score:** ${review.maintainabilityScore}%
* **Readability Score:** ${review.readabilityScore}%

## Executive Summary
${review.summary || 'No summary text generated.'}

## Inline Analysis Findings (${review.comments?.length || 0} Issues Found)

${review.comments && review.comments.length > 0 
  ? review.comments.map(c => `### Line ${c.line}: ${c.title}
* **Category:** \`${c.category}\`
* **Severity:** \`${c.severity.toUpperCase()}\`
* **Confidence:** \`${c.confidence}\`

**Description:**
${c.description}

**Actionable Recommendation:**
${c.recommendation}

${c.suggestedCode ? `**Suggested Code Improvement:**
\`\`\`${(review.fileId?.language || '').toLowerCase()}
${c.suggestedCode}
\`\`\`
` : ''}
---
`).join('\n')
  : 'No quality, security, or performance findings identified.'}
`;
      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `code-review-${review._id || 'export'}.md`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return { success: true };
    }

    if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Pop-up blocked. Please enable pop-ups to export as PDF.');
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>AI Code Review Report - ${review.fileId?.name || 'File'}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                color: #1f2937;
                padding: 40px;
                line-height: 1.5;
                background-color: #ffffff;
              }
              .header {
                border-bottom: 3px solid #3b82f6;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .header h1 {
                font-size: 28px;
                margin: 0;
                color: #111827;
              }
              .header p {
                font-size: 14px;
                color: #6b7280;
                margin: 5px 0 0 0;
              }
              .meta-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
              }
              .meta-table td {
                padding: 8px 12px;
                border: 1px solid #e5e7eb;
                font-size: 13px;
              }
              .meta-table td.label {
                font-weight: bold;
                background-color: #f9fafb;
                width: 20%;
              }
              .score-cards {
                display: flex;
                gap: 15px;
                margin-bottom: 35px;
              }
              .score-card {
                flex: 1;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                background-color: #f9fafb;
              }
              .score-card.overall {
                background-color: #eff6ff;
                border-color: #bfdbfe;
              }
              .score-card .title {
                font-size: 11px;
                font-weight: bold;
                text-transform: uppercase;
                color: #4b5563;
                margin-bottom: 5px;
              }
              .score-card .value {
                font-size: 24px;
                font-weight: 800;
                color: #1e3a8a;
              }
              .section-title {
                font-size: 18px;
                font-weight: bold;
                color: #111827;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 8px;
                margin-top: 30px;
                margin-bottom: 15px;
              }
              .summary-box {
                background-color: #f3f4f6;
                border-left: 4px solid #9ca3af;
                padding: 15px;
                border-radius: 4px;
                font-size: 14px;
                margin-bottom: 30px;
              }
              .comment {
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                page-break-inside: avoid;
              }
              .comment.critical {
                border-left: 5px solid #ef4444;
              }
              .comment.warning {
                border-left: 5px solid #f59e0b;
              }
              .comment.info {
                border-left: 5px solid #3b82f6;
              }
              .comment-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
              }
              .comment-title {
                font-size: 15px;
                font-weight: bold;
                color: #111827;
              }
              .badge {
                font-size: 11px;
                padding: 3px 8px;
                border-radius: 12px;
                font-weight: bold;
                text-transform: uppercase;
              }
              .badge.critical { background-color: #fee2e2; color: #991b1b; }
              .badge.warning { background-color: #fef3c7; color: #92400e; }
              .badge.info { background-color: #dbeafe; color: #1e40af; }
              .comment-detail {
                font-size: 13px;
                color: #4b5563;
                margin-bottom: 10px;
              }
              .code-box {
                background-color: #1f2937;
                color: #f9fafb;
                font-family: monospace;
                padding: 12px 15px;
                border-radius: 6px;
                font-size: 12px;
                overflow-x: auto;
                white-space: pre-wrap;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>AI Code Review Analysis Audit</h1>
              <p>QAPilot Code Assurance Verification Portal</p>
            </div>

            <table class="meta-table">
              <tr>
                <td class="label">Repository</td>
                <td>${review.repositoryId?.fullName || review.repositoryId?.name || 'N/A'}</td>
                <td class="label">File Path</td>
                <td>${review.fileId?.path || 'N/A'}</td>
              </tr>
              <tr>
                <td class="label">Language</td>
                <td>${review.fileId?.language || 'N/A'}</td>
                <td class="label">Generated At</td>
                <td>${new Date(review.createdAt).toLocaleString()}</td>
              </tr>
              <tr>
                <td class="label">AI Provider</td>
                <td>${review.provider || 'N/A'}</td>
                <td class="label">Review Type</td>
                <td>${review.reviewType || 'N/A'}</td>
              </tr>
            </table>

            <div class="section-title">Quality Metrics Breakdown</div>
            <div class="score-cards">
              <div class="score-card overall">
                <div class="title">Overall Index</div>
                <div class="value">${review.overallScore}%</div>
              </div>
              <div class="score-card">
                <div class="title">Security</div>
                <div class="value">${review.securityScore}%</div>
              </div>
              <div class="score-card">
                <div class="title">Performance</div>
                <div class="value">${review.performanceScore}%</div>
              </div>
              <div class="score-card">
                <div class="title">Maintainability</div>
                <div class="value">${review.maintainabilityScore}%</div>
              </div>
              <div class="score-card">
                <div class="title">Readability</div>
                <div class="value">${review.readabilityScore}%</div>
              </div>
            </div>

            <div class="section-title">Executive Summary</div>
            <div class="summary-box">
              ${review.summary || 'No summary text generated.'}
            </div>

            <div class="section-title">Line level Code Improvements (${review.comments?.length || 0} items)</div>
            
            ${review.comments && review.comments.length > 0 ? review.comments.map(c => `
              <div class="comment ${c.severity}">
                <div class="comment-header">
                  <span class="comment-title">Line ${c.line}: ${c.title}</span>
                  <span class="badge ${c.severity}">${c.severity}</span>
                </div>
                <div class="comment-detail">
                  <strong>Category:</strong> ${c.category} &nbsp;|&nbsp; 
                  <strong>Confidence:</strong> ${c.confidence}
                </div>
                <div class="comment-detail">
                  <strong>Description:</strong> ${c.description}
                </div>
                <div class="comment-detail">
                  <strong>Recommendation:</strong> ${c.recommendation}
                </div>
                ${c.suggestedCode ? `
                  <div class="code-box"><code>${escapeHtml(c.suggestedCode)}</code></div>
                ` : ''}
              </div>
            `).join('') : '<p>No issue findings reported for this file.</p>'}

            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      return { success: true };
    }
  }
};

export default reviewService;
