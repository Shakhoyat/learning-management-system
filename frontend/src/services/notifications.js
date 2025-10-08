import api from "./api";

export const notificationService = {
  // Get notifications for current user
  getNotifications: async (params = {}) => {
    const response = await api.get("/notifications", { params });
    return response;
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count");
    return response.count;
  },

  // Get notification preferences
  getNotificationPreferences: async () => {
    const response = await api.get("/notifications/preferences");
    return response.preferences;
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    const response = await api.put("/notifications/preferences", preferences);
    return response.preferences;
  },

  // Get notification by ID
  getNotificationById: async (notificationId) => {
    const response = await api.get(`/notifications/${notificationId}`);
    return response.notification;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response;
  },

  // Mark notification as dismissed
  markAsDismissed: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/dismiss`);
    return response;
  },

  // Mark multiple notifications as read
  markMultipleAsRead: async (notificationIds) => {
    const response = await api.put("/notifications/read/multiple", {
      notificationIds,
    });
    return response;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put("/notifications/read/all");
    return response;
  },

  // Record notification action
  recordAction: async (notificationId, action) => {
    const response = await api.post(`/notifications/${notificationId}/action`, {
      action,
    });
    return response;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response;
  },
};
