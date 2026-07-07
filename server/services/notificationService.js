import Notification from "../models/Notification.js";

/**
 * Creates and stores a new notification record in the database.
 */
export const createNotification = async (userId, data) => {
  try {
    const notification = await Notification.create({
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      repository: data.repository || "",
      severity: data.severity || "info",
      metadata: data.metadata || {},
      isRead: false
    });
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error.message);
    throw error;
  }
};

/**
 * Retrieves all notifications for a specific user.
 */
export const getNotifications = async (userId) => {
  return Notification.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Marks a single notification as read for a specific user.
 */
export const markAsRead = async (userId, notificationId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
};

/**
 * Marks all unread notifications as read for a specific user.
 */
export const markAllAsRead = async (userId) => {
  return Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

/**
 * Deletes a single notification for a specific user.
 */
export const deleteNotification = async (userId, notificationId) => {
  return Notification.findOneAndDelete({ _id: notificationId, userId });
};

/**
 * Deletes all notifications for a specific user.
 */
export const deleteAllNotifications = async (userId) => {
  return Notification.deleteMany({ userId });
};

export default {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
};
