import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, critical, scans, findings, reports, repos
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Initial load
  useEffect(() => {
    const load = async () => {
      try {
        const list = await notificationService.getNotifications();
        setNotifications(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Global toast triggers
  const addToast = useCallback((title, type = 'info', message = '') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, type, message }]);
    
    // Auto remove
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Event stream listener
  useEffect(() => {
    const handleNewEvent = (event) => {
      setNotifications((prev) => [event, ...prev]);

      // Map event severity to toast type
      let toastType = 'info';
      if (event.severity === 'critical') toastType = 'error';
      else if (event.severity === 'high') toastType = 'warning';
      else if (event.type === 'scan_completed') toastType = 'success';

      addToast(event.title, toastType, event.description);
    };

    const stopStream = notificationService.startNotificationStream(handleNewEvent, 15000);
    return () => stopStream();
  }, [addToast]);

  const markAsRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'success');
  };

  const clearAll = async () => {
    await notificationService.clearNotifications();
    setNotifications([]);
    addToast('Cleared all notifications', 'info');
  };

  // Filtered notifications logic
  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'critical') return n.severity === 'critical';
    if (filter === 'scans') return n.type.startsWith('scan_');
    if (filter === 'findings') return n.type === 'critical_issue' || n.type === 'ai_insight';
    if (filter === 'reports') return n.type === 'report_ready';
    if (filter === 'repos') return n.type === 'repo_connected';
    return true;
  });

  return (
    <NotificationsContext.Provider
      value={{
        notifications: filteredNotifications,
        allNotifications: notifications,
        unreadCount,
        filter,
        setFilter,
        toasts,
        addToast,
        removeToast,
        markAsRead,
        markAllAsRead,
        clearAll,
        loading,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return ctx;
}

export default NotificationsContext;
