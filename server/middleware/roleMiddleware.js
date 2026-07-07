import Organization from "../models/Organization.js";
import Workspace from "../models/Workspace.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import Repository from "../models/Repository.js";

/**
 * Ensures a user has a default organization, workspace, and Owner membership.
 * Facilitates a seamless, backward-compatible upgrade path from single-user to multi-tenant.
 */
export const ensureUserWorkspace = async (userId) => {
  let member = await WorkspaceMember.findOne({ userId }).populate("workspaceId");
  if (member && member.workspaceId) {
    return {
      workspace: member.workspaceId,
      role: member.role
    };
  }

  let org = await Organization.findOne({ owner: userId });
  if (!org) {
    org = await Organization.create({
      name: "Default Organization",
      slug: `org-${userId}-${Math.floor(Math.random() * 10000)}`,
      owner: userId
    });
  }

  let ws = await Workspace.findOne({ organizationId: org._id });
  if (!ws) {
    const repos = await Repository.find({ userId });
    ws = await Workspace.create({
      organizationId: org._id,
      name: "Default Workspace",
      description: "Auto-generated default workspace.",
      repositories: repos.map((r) => r._id)
    });
  }

  member = await WorkspaceMember.create({
    workspaceId: ws._id,
    userId,
    role: "Owner"
  });

  return {
    workspace: ws,
    role: "Owner"
  };
};

/**
 * Validates that the requesting user has access to the workspace.
 * Resolves default workspace configurations if no workspace context is specified.
 */
export const requireWorkspaceAccess = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let workspaceId = req.headers["x-workspace-id"] || req.query.workspaceId || req.body.workspaceId;

    if (!workspaceId) {
      // Resolve/Seed default
      const { workspace, role } = await ensureUserWorkspace(userId);
      req.workspaceId = workspace._id;
      req.memberRole = role;
      return next();
    }

    const member = await WorkspaceMember.findOne({ workspaceId, userId });
    if (!member) {
      return res.status(403).json({ message: "Access denied. You are not a member of this workspace." });
    }

    req.workspaceId = member.workspaceId;
    req.memberRole = member.role;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * REST API role guard check.
 */
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.memberRole) {
      return res.status(403).json({ message: "Access denied. Membership role context missing." });
    }

    const roleHierarchy = {
      Owner: ["Owner", "Admin", "Developer", "Viewer"],
      Admin: ["Admin", "Developer", "Viewer"],
      Developer: ["Developer", "Viewer"],
      Viewer: ["Viewer"]
    };

    const hasAllowedRole = allowedRoles.some((r) => {
      const allowedHierarchy = roleHierarchy[req.memberRole] || [];
      return allowedHierarchy.includes(r);
    });

    if (!hasAllowedRole) {
      return res.status(403).json({ message: `Access denied. Role '${req.memberRole}' does not satisfy permissions.` });
    }
    next();
  };
};

/**
 * Maps granular developer scopes and triggers.
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.memberRole) {
      return res.status(403).json({ message: "Access denied. Membership role context missing." });
    }

    // Role-to-Permissions Matrix mapping
    const permissionsMap = {
      Owner: [
        "manageRepositories",
        "manageMembers",
        "startScans",
        "manageReports",
        "manageDeployments",
        "manageSettings",
        "viewAnalytics",
        "manageBilling"
      ],
      Admin: [
        "manageRepositories",
        "manageMembers",
        "startScans",
        "manageReports",
        "manageDeployments",
        "manageSettings",
        "viewAnalytics"
      ],
      Developer: [
        "startScans",
        "manageReports",
        "manageDeployments",
        "viewAnalytics"
      ],
      Viewer: [
        "viewAnalytics"
      ]
    };

    const userPerms = permissionsMap[req.memberRole] || [];
    if (!userPerms.includes(permission)) {
      return res.status(403).json({ message: `Access denied. Permission '${permission}' is not permitted for role '${req.memberRole}'.` });
    }
    next();
  };
};

export default {
  requireWorkspaceAccess,
  requireRole,
  requirePermission,
  ensureUserWorkspace
};
