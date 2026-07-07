import WorkspaceMember from "../models/WorkspaceMember.js";
import Invitation from "../models/Invitation.js";
import User from "../models/User.js";
import crypto from "crypto";
import { logAudit } from "../services/auditService.js";
import { createNotification } from "../services/notificationService.js";

/**
 * Fetch members list inside a workspace.
 */
export const getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const list = await WorkspaceMember.find({ workspaceId }).populate("userId");
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Invite teammate by creating an Invitation document.
 */
export const inviteMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required fields." });
    }

    const inviteToken = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 Hours expiry

    const doc = await Invitation.create({
      email,
      workspaceId,
      role,
      inviteToken,
      expiresAt,
      accepted: false
    });

    await logAudit(req.user._id, "INVITE_MEMBER", email, req);
    await createNotification(req.user._id, {
      type: "system_alert",
      title: "Member invited",
      message: `Teammate '${email}' was sent an invitation code link.`,
      severity: "info"
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update member access role.
 */
export const updateMemberRole = async (req, res) => {
  try {
    const { id } = req.params; // Member doc ID
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required." });
    }

    const doc = await WorkspaceMember.findById(id).populate("userId");
    if (!doc) {
      return res.status(404).json({ message: "Member record not found." });
    }

    const previousRole = doc.role;
    doc.role = role;
    await doc.save();

    await logAudit(req.user._id, "CHANGE_ROLE", doc.userId?.email || doc._id, req);
    await createNotification(req.user._id, {
      type: "system_alert",
      title: "Role changed",
      message: `Access level of '${doc.userId?.name || "Member"}' updated from ${previousRole} to ${role}.`,
      severity: "info"
    });

    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Revoke workspace access.
 */
export const removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await WorkspaceMember.findByIdAndDelete(id).populate("userId");
    if (!doc) {
      return res.status(404).json({ message: "Member record not found." });
    }

    await logAudit(req.user._id, "REMOVE_MEMBER", doc.userId?.email || doc._id, req);
    await createNotification(req.user._id, {
      type: "system_alert",
      title: "Member removed",
      message: `Teammate '${doc.userId?.name || "Member"}' was removed from the workspace.`,
      severity: "warn"
    });

    res.json({ message: "Teammate removed from workspace successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getWorkspaceMembers,
  inviteMember,
  updateMemberRole,
  removeMember
};
