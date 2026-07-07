import Workspace from "../models/Workspace.js";
import Organization from "../models/Organization.js";
import { logAudit } from "../services/auditService.js";
import { createNotification } from "../services/notificationService.js";

/**
 * Get workspaces under user organizations.
 */
export const getWorkspaces = async (req, res) => {
  try {
    const { organizationId } = req.query;
    if (!organizationId) {
      // Find workspaces where user is owner or member
      const list = await Workspace.find({}).populate("organizationId");
      return res.json(list);
    }

    const list = await Workspace.find({ organizationId });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new Workspace.
 */
export const createWorkspace = async (req, res) => {
  try {
    const { name, description, organizationId } = req.body;
    if (!name || !organizationId) {
      return res.status(400).json({ message: "Name and organizationId parameters are required." });
    }

    const doc = await Workspace.create({
      organizationId,
      name,
      description,
      repositories: []
    });

    await logAudit(req.user._id, "CREATE_WORKSPACE", doc.name, req);
    await createNotification(req.user._id, {
      type: "system_alert",
      title: "Workspace created",
      message: `Workspace '${doc.name}' was successfully created in organization.`,
      severity: "info"
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update workspace details.
 */
export const updateWorkspace = async (req, res) => {
  try {
    const doc = await Workspace.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!doc) {
      return res.status(404).json({ message: "Workspace not found." });
    }
    await logAudit(req.user._id, "UPDATE_WORKSPACE", doc.name, req);
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete workspace.
 */
export const deleteWorkspace = async (req, res) => {
  try {
    const doc = await Workspace.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Workspace not found." });
    }
    await logAudit(req.user._id, "DELETE_WORKSPACE", doc.name, req);
    res.json({ message: "Workspace deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace
};
