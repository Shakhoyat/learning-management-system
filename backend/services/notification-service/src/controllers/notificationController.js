const { logger } = require("../../../../shared/logger");

// Mock notification storage (in production, use MongoDB)
const notifications = new Map();
const userSettings = new Map();

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, read } = req.query;
    const userId = req.user.id;

    // Mock notifications for user
    const userNotifications = [
      {
        id: "notif_1",
        userId,
        type: "session_reminder",
        title: "Upcoming Session",
        message: "Your programming session starts in 30 minutes",
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        data: { sessionId: "session_123" },
      },
      {
        id: "notif_2",
        userId,
        type: "payment_success",
        title: "Payment Successful",
        message: "Your payment of $50.00 has been processed",
        read: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        data: { paymentId: "payment_456" },
      },
      {
        id: "notif_3",
        userId,
        type: "new_message",
        title: "New Message",
        message: "You have a new message from John Doe",
        read: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        data: { messageId: "msg_789" },
      },
    ];

    // Filter notifications
    let filteredNotifications = userNotifications;
    if (type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }
    if (read !== undefined) {
      const isRead = read === "true";
      filteredNotifications = filteredNotifications.filter(n => n.read === isRead);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

    res.json({
      notifications: paginatedNotifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredNotifications.length / limit),
        totalItems: filteredNotifications.length,
      },
    });
  } catch (error) {
    logger.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Mock notification
    const notification = {
      id,
      userId: req.user.id,
      type: "session_reminder",
      title: "Upcoming Session",
      message: "Your programming session starts in 30 minutes",
      read: false,
      createdAt: new Date(),
      data: { sessionId: "session_123" },
    };

    res.json(notification);
  } catch (error) {
    logger.error("Error fetching notification:", error);
    res.status(500).json({ error: "Failed to fetch notification" });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      message: "Notification marked as read",
      notificationId: id,
    });
  } catch (error) {
    logger.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    res.json({
      message: "All notifications marked as read",
      userId,
    });
  } catch (error) {
    logger.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      message: "Notification deleted successfully",
      notificationId: id,
    });
  } catch (error) {
    logger.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

// Delete all notifications
const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    res.json({
      message: "All notifications deleted successfully",
      userId,
    });
  } catch (error) {
    logger.error("Error deleting all notifications:", error);
    res.status(500).json({ error: "Failed to delete all notifications" });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Mock unread count
    const unreadCount = 5;

    res.json({ unreadCount });
  } catch (error) {
    logger.error("Error fetching unread count:", error);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
};

// Update notification settings
const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = req.body;

    // Mock settings update
    userSettings.set(userId, {
      ...settings,
      updatedAt: new Date(),
    });

    res.json({
      message: "Notification settings updated successfully",
      settings,
    });
  } catch (error) {
    logger.error("Error updating notification settings:", error);
    res.status(500).json({ error: "Failed to update notification settings" });
  }
};

// Get notification settings
const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Mock settings
    const settings = userSettings.get(userId) || {
      email: {
        sessionReminders: true,
        paymentNotifications: true,
        messageAlerts: true,
        marketingEmails: false,
      },
      push: {
        sessionReminders: true,
        paymentNotifications: true,
        messageAlerts: true,
        marketingNotifications: false,
      },
      inApp: {
        sessionReminders: true,
        paymentNotifications: true,
        messageAlerts: true,
        achievements: true,
      },
      frequency: "immediate", // immediate, daily, weekly
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "08:00",
      },
    };

    res.json({ settings });
  } catch (error) {
    logger.error("Error fetching notification settings:", error);
    res.status(500).json({ error: "Failed to fetch notification settings" });
  }
};

// Send notification (admin/system use)
const sendNotification = async (req, res) => {
  try {
    const { userId, type, title, message, data } = req.body;

    // Mock notification creation
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      message,
      data: data || {},
      read: false,
      createdAt: new Date(),
      sentBy: req.user.id,
    };

    res.status(201).json({
      message: "Notification sent successfully",
      notification,
    });
  } catch (error) {
    logger.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
};

// Subscribe to push notifications
const subscribeToNotifications = async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.user.id;

    // Mock subscription storage
    res.json({
      message: "Successfully subscribed to push notifications",
      subscription: {
        userId,
        endpoint: subscription.endpoint,
        subscriptionId: `sub_${Date.now()}`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    logger.error("Error subscribing to notifications:", error);
    res.status(500).json({ error: "Failed to subscribe to notifications" });
  }
};

// Unsubscribe from push notifications
const unsubscribeFromNotifications = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const userId = req.user.id;

    res.json({
      message: "Successfully unsubscribed from push notifications",
      userId,
      subscriptionId,
    });
  } catch (error) {
    logger.error("Error unsubscribing from notifications:", error);
    res.status(500).json({ error: "Failed to unsubscribe from notifications" });
  }
};

module.exports = {
  getUserNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
  updateNotificationSettings,
  getNotificationSettings,
  sendNotification,
  subscribeToNotifications,
  unsubscribeFromNotifications,
};