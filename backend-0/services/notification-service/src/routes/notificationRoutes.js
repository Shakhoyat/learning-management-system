const express = require("express");
const {
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
} = require("../controllers/notificationController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/authorization");
const {
  validateNotification,
  validateSettings,
} = require("../validators/notificationValidator");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user notifications
router.get("/", getUserNotifications);
router.get("/unread-count", getUnreadCount);
router.get("/settings", getNotificationSettings);
router.get("/:id", getNotificationById);

// Notification actions
router.put("/:id/read", markAsRead);
router.put("/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);
router.delete("/", deleteAllNotifications);

// Notification settings
router.put("/settings", validateSettings, updateNotificationSettings);

// Subscription management
router.post("/subscribe", subscribeToNotifications);
router.post("/unsubscribe", unsubscribeFromNotifications);

// Send notification (admin/system only)
router.post(
  "/send",
  authorize(["admin", "system"]),
  validateNotification,
  sendNotification
);

module.exports = router;
