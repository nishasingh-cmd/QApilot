import notificationService from "../services/notificationService.js";

// Helper helper to format database notification objects to match frontend properties
const formatNotification = (n) => {
  if (!n) return null;

  // Simple relative-style timestamp or standard local time
  const timeDifference = Date.now() - new Date(n.createdAt).getTime();
  let timestampStr = "Just now";
  if (timeDifference > 86400000) {
    timestampStr = `${Math.floor(timeDifference / 86400000)} days ago`;
  } else if (timeDifference > 3600000) {
    timestampStr = `${Math.floor(timeDifference / 3600000)} hours ago`;
  } else if (timeDifference > 60000) {
    timestampStr = `${Math.floor(timeDifference / 6000) / 10} minutes ago`;
  }

  return {
    id: n._id.toString(),
    _id: n._id,
    type: n.type,
    title: n.title,
    description: n.message,
    message: n.message,
    repo: n.repository || "",
    repository: n.repository || "",
    severity: n.severity,
    read: n.isRead,
    isRead: n.isRead,
    metadata: n.metadata,
    timestamp: timestampStr,
    createdAt: n.createdAt
  };
};

export const getNotifications = async (req, res) => {
  try {
    const list = await notificationService.getNotifications(req.user._id);
    res.json(list.map(formatNotification));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await notificationService.markAsRead(req.user._id, id);
    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(formatNotification(updated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user._id);
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await notificationService.deleteNotification(req.user._id, id);
    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    await notificationService.deleteAllNotifications(req.user._id);
    res.json({ success: true, message: "All notifications cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  deleteAllNotifications
};
