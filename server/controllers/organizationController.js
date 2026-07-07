import Organization from "../models/Organization.js";
import { ensureUserWorkspace } from "../middleware/roleMiddleware.js";
import { logAudit } from "../services/auditService.js";
import { createNotification } from "../services/notificationService.js";

/**
 * Get all organizations matching user memberships. Auto-seeds defaults if empty.
 */
export const getOrganizations = async (req, res) => {
  try {
    const userId = req.user._id;
    // Pre-seed if user doesn't belong to any organization
    await ensureUserWorkspace(userId);

    const list = await Organization.find({ owner: userId });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new Organization tenant.
 */
export const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Organization name is required." });
    }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;
    const doc = await Organization.create({
      name,
      slug,
      owner: req.user._id
    });

    await logAudit(req.user._id, "CREATE_ORGANIZATION", doc.name, req);
    await createNotification(req.user._id, {
      type: "system_alert",
      title: "Organization created",
      message: `Organization '${doc.name}' was successfully registered today.`,
      severity: "success"
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get organization by ID.
 */
export const getOrganizationById = async (req, res) => {
  try {
    const doc = await Organization.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Organization not found." });
    }
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update organization parameters.
 */
export const updateOrganization = async (req, res) => {
  try {
    const doc = await Organization.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!doc) {
      return res.status(404).json({ message: "Organization not found." });
    }
    await logAudit(req.user._id, "UPDATE_ORGANIZATION", doc.name, req);
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete organization.
 */
export const deleteOrganization = async (req, res) => {
  try {
    const doc = await Organization.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Organization not found." });
    }
    await logAudit(req.user._id, "DELETE_ORGANIZATION", doc.name, req);
    res.json({ message: "Organization deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getOrganizations,
  createOrganization,
  getOrganizationById,
  updateOrganization,
  deleteOrganization
};
