import findingService from "../services/findingService.js";
import Repository from "../models/Repository.js";
import { createNotification } from "../services/notificationService.js";

// Helper format response to map DB properties to UI properties
const formatFinding = (f, repoName = "") => {
  if (!f) return null;

  // AI recommendations elements
  const fixSteps = [
    `Locate and verify vulnerability context in [${f.file.split('/').pop()}].`,
    `Apply targeted refactoring recommendation: "${f.recommendation}"`,
    `Run tests framework validation sweep to check health metrics.`
  ];

  return {
    id: f._id.toString(),
    _id: f._id,
    userId: f.userId,
    repositoryId: f.repositoryId,
    scanId: f.scanId,
    branch: f.branch || "main",
    title: f.title,
    description: f.description,
    category: f.category,
    severity: f.severity,
    confidence: f.confidence,
    status: f.status,
    file: f.file,
    lineNumber: f.line, // mapped from line
    line: f.line,
    codeSnippet: f.codeSnippet,
    aiExplanation: f.aiExplanation,
    recommendation: f.recommendation,
    effort: f.effort,
    impact: f.impact,
    resolvedAt: f.resolvedAt,
    assignedTo: f.assignedTo || "Unassigned",
    assignee: f.assignedTo || "Unassigned", // mapped from assignedTo
    detectedAt: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "Just now",

    // UI Drawer suggestion blocks
    whyItExists: f.aiExplanation,
    riskAssessment: `Severity is ranked ${f.severity.toUpperCase()}. This code path carries potential vulnerabilities with confidence index score of ${f.confidence}%.`,
    businessImpact: `Violates codebase standards for ${f.category.replace('_', ' ')}. Resolving improves maintainability and system robustness.`,
    fix: f.recommendation,
    fixSteps,
    improvement: f.category === "security" ? "Vulnerability Mitigated" : "90% maintainability index restoration"
  };
};

export const getFindings = async (req, res) => {
  try {
    const {
      repository,
      severity,
      status,
      category,
      branch,
      search,
      sortBy,
      page = 1,
      limit = 100
    } = req.query;

    const filters = {};

    // 1. Repo filters
    if (repository && repository !== "all") {
      const repo = await Repository.findOne({ $or: [{ _id: repository }, { name: repository }] });
      if (repo) {
        filters.repositoryId = repo._id;
      } else {
        filters.repo = repository;
      }
    }

    // 2. Severity filters
    if (severity && severity !== "all") {
      filters.severity = severity;
    }

    // 3. Status filters
    if (status && status !== "all") {
      filters.status = status;
    }

    // 4. Category filters
    if (category && category !== "all") {
      filters.category = category;
    }

    // 5. Branch filters
    if (branch && branch !== "all") {
      filters.branch = branch;
    }

    // 6. Search filters
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filters.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { file: searchRegex }
      ];
    }

    // 7. Sorting parameters
    let sort = { createdAt: -1 };
    if (sortBy === "oldest") {
      sort = { createdAt: 1 };
    } else if (sortBy === "highest_severity") {
      // Custom mapping: since severity is enum, let's sort alphabetically or we can handle it
      sort = { severity: 1 };
    } else if (sortBy === "highest_confidence") {
      sort = { confidence: -1 };
    }

    // 8. Pagination parameters
    const options = {
      sort,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    // 9. Fetch repositories map to resolve repo names
    const repos = await Repository.find({ userId: req.user._id }).lean();
    const repoMap = new Map(repos.map((r) => [r._id.toString(), r.name]));

    const list = await findingService.getFindings(req.user._id, filters, options);
    
    const formattedList = list.map((f) => {
      const repoName = repoMap.get(f.repositoryId?.toString()) || "repo";
      const item = formatFinding(f);
      item.repo = repoName;
      return item;
    });

    res.json(formattedList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFindingById = async (req, res) => {
  try {
    const { id } = req.params;
    const f = await findingService.getFinding(req.user._id, id);
    if (!f) {
      return res.status(404).json({ message: "Finding not found" });
    }

    const repo = await Repository.findById(f.repositoryId);
    const item = formatFinding(f);
    item.repo = repo ? repo.name : "repo";

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFinding = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await findingService.updateFinding(req.user._id, id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Finding not found" });
    }

    const repo = await Repository.findById(updated.repositoryId);
    const item = formatFinding(updated);
    item.repo = repo ? repo.name : "repo";

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveFinding = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await findingService.resolveFinding(req.user._id, id);
    if (!updated) {
      return res.status(404).json({ message: "Finding not found" });
    }

    const repo = await Repository.findById(updated.repositoryId);
    const repoName = repo ? repo.name : "repo";

    // Trigger notification for resolved finding
    await createNotification(req.user._id, {
      type: "scan_completed",
      title: "Finding resolved",
      message: `Quality audit issue '${updated.title}' in '${repoName}' file ${updated.file.split('/').pop()} marked resolved.`,
      repository: repoName,
      severity: "success"
    });

    const item = formatFinding(updated);
    item.repo = repoName;

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const ignoreFinding = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await findingService.ignoreFinding(req.user._id, id);
    if (!updated) {
      return res.status(404).json({ message: "Finding not found" });
    }

    const repo = await Repository.findById(updated.repositoryId);
    const item = formatFinding(updated);
    item.repo = repo ? repo.name : "repo";

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignFinding = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignee } = req.body;

    const updated = await findingService.assignFinding(req.user._id, id, assignee);
    if (!updated) {
      return res.status(404).json({ message: "Finding not found" });
    }

    const repo = await Repository.findById(updated.repositoryId);
    const repoName = repo ? repo.name : "repo";

    // Trigger notification for finding assigned
    await createNotification(req.user._id, {
      type: "system_alert",
      title: "Finding assigned",
      message: `Codebase issue '${updated.title}' has been assigned to ${assignee || "Unassigned"}.`,
      repository: repoName,
      severity: "info"
    });

    const item = formatFinding(updated);
    item.repo = repoName;

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkAction = async (req, res) => {
  try {
    const { ids, action, assignee } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Finding IDs array is required" });
    }

    if (action === "resolve") {
      await findingService.bulkResolve(req.user._id, ids);

      // Trigger notification for bulk resolve
      await createNotification(req.user._id, {
        type: "scan_completed",
        title: "Bulk resolve completed",
        message: `Successfully resolved ${ids.length} codebase quality issues.`,
        severity: "success"
      });
    } else if (action === "ignore") {
      await findingService.bulkIgnore(req.user._id, ids);
    } else if (action === "assign") {
      await findingService.bulkUpdate(req.user._id, ids, { assignedTo: assignee });
    }

    res.json({ success: true, message: `Bulk action ${action} executed successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFinding = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await findingService.deleteFinding(req.user._id, id);
    if (!deleted) {
      return res.status(404).json({ message: "Finding not found" });
    }
    res.json({ success: true, message: "Finding deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getFindings,
  getFindingById,
  updateFinding,
  resolveFinding,
  ignoreFinding,
  assignFinding,
  bulkAction,
  deleteFinding
};
