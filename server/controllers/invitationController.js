import Invitation from "../models/Invitation.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import { logAudit } from "../services/auditService.js";
import { createNotification } from "../services/notificationService.js";

/**
 * Accept invitation using token and add current logged-in user to workspace.
 */
export const acceptInvitation = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Invitation token is required." });
    }

    const invite = await Invitation.findOne({ inviteToken: token, accepted: false });
    if (!invite) {
      return res.status(400).json({ message: "Invalid or already accepted invitation link." });
    }

    if (new Date() > invite.expiresAt) {
      return res.status(400).json({ message: "Invitation link has expired." });
    }

    invite.accepted = true;
    await invite.save();

    // Check if membership already exists, otherwise create it
    let member = await WorkspaceMember.findOne({
      workspaceId: invite.workspaceId,
      userId: req.user._id
    });

    if (!member) {
      member = await WorkspaceMember.create({
        workspaceId: invite.workspaceId,
        userId: req.user._id,
        role: invite.role
      });
    }

    await logAudit(req.user._id, "ACCEPT_INVITATION", invite.email, req);
    await createNotification(req.user._id, {
      type: "system_alert",
      title: "Invitation accepted",
      message: `You accepted invitation and joined workspace successfully.`,
      severity: "success"
    });

    res.json({ message: "Invitation accepted. You successfully joined the workspace.", member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Reject or ignore a pending invitation.
 */
export const rejectInvitation = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Invitation token is required." });
    }

    const invite = await Invitation.findOne({ inviteToken: token });
    if (!invite) {
      return res.status(404).json({ message: "Invitation link not found." });
    }

    await Invitation.findByIdAndDelete(invite._id);
    res.json({ message: "Invitation rejected and removed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  acceptInvitation,
  rejectInvitation
};
