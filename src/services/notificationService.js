import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Keeps track of notification IDs that we've already flagged as "seen" to prevent duplicate toast alerts
let seenNotificationIds = new Set();
let isFirstFetch = true;

export const notificationService = {
  /**
   * Fetches all notifications for the authenticated user.
   */
  getNotifications: async () => {
    const res = await axios.get(`${API_BASE}/notifications`, { withCredentials: true });
    
    // Automatically populate seen ids set on loading notifications
    if (res.data) {
      res.data.forEach((n) => {
        seenNotificationIds.add(n.id);
      });
      isFirstFetch = false;
    }
    
    return res.data || [];
  },

  /**
   * Marks a notification as read.
   */
  markAsRead: async (id) => {
    const res = await axios.patch(`${API_BASE}/notifications/${id}/read`, {}, { withCredentials: true });
    return res.data;
  },

  /**
   * Marks all notifications as read.
   */
  markAllAsRead: async () => {
    const res = await axios.patch(`${API_BASE}/notifications/read-all`, {}, { withCredentials: true });
    return res.data;
  },

  /**
   * Clears/deletes all notifications.
   */
  clearNotifications: async () => {
    const res = await axios.delete(`${API_BASE}/notifications`, { withCredentials: true });
    return res.data;
  },

  /**
   * Polls the backend every `intervalMs` (default 15 seconds) to fetch new notifications,
   * triggering the callback for any fresh items.
   */
  startNotificationStream: (callback, intervalMs = 15000) => {
    const poll = async () => {
      try {
        const res = await axios.get(`${API_BASE}/notifications`, { withCredentials: true });
        const list = res.data || [];

        if (isFirstFetch) {
          // On first run, seed seen notification list so we don't trigger a screen-full of alerts
          list.forEach((n) => seenNotificationIds.add(n.id));
          isFirstFetch = false;
          return;
        }

        // Loop through fetched notifications from oldest to newest to trigger alerts in order
        const reversedList = [...list].reverse();
        reversedList.forEach((n) => {
          if (!seenNotificationIds.has(n.id)) {
            seenNotificationIds.add(n.id);
            // Trigger toast alert callback in UI
            callback(n);
          }
        });
      } catch (err) {
        console.warn('Notification polling stream check failed:', err.message);
      }
    };

    // Execute first poll quickly after delay
    setTimeout(poll, 1500);

    const timer = setInterval(poll, intervalMs);
    return () => clearInterval(timer);
  }
};

export default notificationService;
