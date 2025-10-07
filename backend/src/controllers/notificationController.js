const Notification = require("../models/Notification");
const User = require("../models/User");
const logger = require("../utils/logger");
const { PAGINATION } = require("../config/constants");
const {
  sendNotification,
  processNotification,
} = require("../services/notificationService");

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      category,
      type,
      unreadOnly = false,
      priority,
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      unreadOnly: unreadOnly === "true",
    };

    // Add additional filters
    const query = {
      recipient: req.user._id,
      "channels.inApp.enabled": true,
    };

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (priority) {
      query.priority = priority;
    }

    if (unreadOnly) {
      query["channels.inApp.read"] = false;
      query["channels.inApp.dismissed"] = false;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const notifications = await Notification.find(query)
      .populate("sender", "name avatar")
      .populate("relatedEntities.session", "title scheduledDate")
      .populate("relatedEntities.skill", "name category")
      .populate("relatedEntities.user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalNotifications = await Notification.countDocuments(query);
    const totalPages = Math.ceil(totalNotifications / limit);

    // Get unread count
    const unreadCount = await Notification.getUnreadCount(req.user._id);

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalNotifications,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve notifications",
    });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id)
      .populate("sender", "name avatar")
      .populate("relatedEntities.session", "title scheduledDate skill")
      .populate("relatedEntities.skill", "name category")
      .populate("relatedEntities.user", "name avatar");

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    // Check permission
    if (req.user._id.toString() !== notification.recipient.toString()) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    res.json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    logger.error("Get notification by ID error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve notification",
    });
  }
};

// Create notification (admin only or system)
exports.createNotification = async (req, res) => {
  try {
    const notificationData = {
      ...req.body,
      sender: req.user._id,
    };

    const notification = await sendNotification(notificationData);

    logger.info(
      `Notification created: ${notification._id} by ${req.user.email}`
    );

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: { notification },
    });
  } catch (error) {
    logger.error("Create notification error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create notification",
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    // Check permission
    if (req.user._id.toString() !== notification.recipient.toString()) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: "Notification marked as read",
      data: { notification },
    });
  } catch (error) {
    logger.error("Mark as read error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to mark notification as read",
    });
  }
};

// Mark notification as dismissed
exports.markAsDismissed = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    // Check permission
    if (req.user._id.toString() !== notification.recipient.toString()) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    await notification.markAsDismissed();

    res.json({
      success: true,
      message: "Notification dismissed",
      data: { notification },
    });
  } catch (error) {
    logger.error("Mark as dismissed error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to dismiss notification",
    });
  }
};

// Mark multiple notifications as read
exports.markMultipleAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Valid notification IDs array is required",
      });
    }

    const result = await Notification.markMultipleAsRead(
      notificationIds,
      req.user._id
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    logger.error("Mark multiple as read error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to mark notifications as read",
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        recipient: req.user._id,
        "channels.inApp.enabled": true,
        "channels.inApp.read": false,
      },
      {
        $set: {
          "channels.inApp.read": true,
          "channels.inApp.readAt": new Date(),
        },
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    logger.error("Mark all as read error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to mark all notifications as read",
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    // Check permission
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== notification.recipient.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    await Notification.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    logger.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete notification",
    });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.getUnreadCount(req.user._id);

    res.json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    logger.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get unread count",
    });
  }
};

// Get notification preferences
exports.getNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "notificationSettings"
    );

    res.json({
      success: true,
      data: { preferences: user.notificationSettings },
    });
  } catch (error) {
    logger.error("Get notification preferences error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get notification preferences",
    });
  }
};

// Update notification preferences
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notificationSettings: preferences },
      { new: true, runValidators: true }
    ).select("notificationSettings");

    logger.info(`Notification preferences updated for user: ${req.user.email}`);

    res.json({
      success: true,
      message: "Notification preferences updated successfully",
      data: { preferences: user.notificationSettings },
    });
  } catch (error) {
    logger.error("Update notification preferences error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update notification preferences",
    });
  }
};

// Send bulk notifications (admin only)
exports.sendBulkNotifications = async (req, res) => {
  try {
    const {
      recipientIds,
      recipientQuery,
      type,
      title,
      message,
      content,
      priority = "normal",
      category,
      scheduledFor,
    } = req.body;

    let recipients = [];

    if (recipientIds && Array.isArray(recipientIds)) {
      recipients = recipientIds;
    } else if (recipientQuery) {
      // Find recipients based on query
      const users = await User.find(recipientQuery).select("_id");
      recipients = users.map((user) => user._id);
    } else {
      return res.status(400).json({
        success: false,
        error: "Either recipientIds or recipientQuery is required",
      });
    }

    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No recipients found",
      });
    }

    // Create notifications for all recipients
    const notifications = await Promise.all(
      recipients.map((recipientId) =>
        sendNotification({
          recipient: recipientId,
          sender: req.user._id,
          type,
          title,
          message,
          content,
          priority,
          category,
          scheduledFor,
        })
      )
    );

    logger.info(
      `Bulk notifications sent to ${recipients.length} users by ${req.user.email}`
    );

    res.json({
      success: true,
      message: `Notifications sent to ${recipients.length} recipients`,
      data: {
        sentCount: notifications.length,
        recipientCount: recipients.length,
      },
    });
  } catch (error) {
    logger.error("Send bulk notifications error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send bulk notifications",
    });
  }
};

// Get notification statistics (admin only)
exports.getNotificationStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchQuery = dateFilter.createdAt ? { createdAt: dateFilter } : {};

    const stats = await Notification.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalNotifications: { $sum: 1 },
          totalSent: {
            $sum: {
              $cond: [{ $eq: ["$status", "sent"] }, 1, 0],
            },
          },
          totalFailed: {
            $sum: {
              $cond: [{ $eq: ["$status", "failed"] }, 1, 0],
            },
          },
          emailsSent: {
            $sum: {
              $cond: ["$channels.email.sent", 1, 0],
            },
          },
          smsSent: {
            $sum: {
              $cond: ["$channels.sms.sent", 1, 0],
            },
          },
          pushSent: {
            $sum: {
              $cond: ["$channels.push.sent", 1, 0],
            },
          },
        },
      },
    ]);

    const categoryStats = await Notification.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const typeStats = await Notification.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalNotifications: 0,
          totalSent: 0,
          totalFailed: 0,
          emailsSent: 0,
          smsSent: 0,
          pushSent: 0,
        },
        categories: categoryStats,
        types: typeStats,
      },
    });
  } catch (error) {
    logger.error("Get notification stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get notification statistics",
    });
  }
};

// Record notification action (click, etc.)
exports.recordAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionIndex } = req.body;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    // Check permission
    if (req.user._id.toString() !== notification.recipient.toString()) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    await notification.recordAction(actionIndex);

    res.json({
      success: true,
      message: "Action recorded successfully",
    });
  } catch (error) {
    logger.error("Record action error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to record action",
    });
  }
};
