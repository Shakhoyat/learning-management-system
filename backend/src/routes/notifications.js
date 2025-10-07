const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticate, authorize } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");

// Protected routes (authentication required)
router.use(authenticate);

// User notification management
router.get("/", notificationController.getNotifications);
router.get("/unread-count", notificationController.getUnreadCount);
router.get("/preferences", notificationController.getNotificationPreferences);
router.put(
  "/preferences",
  notificationController.updateNotificationPreferences
);
router.get("/:id", notificationController.getNotificationById);

// Notification actions
router.put("/:id/read", notificationController.markAsRead);
router.put("/:id/dismiss", notificationController.markAsDismissed);
router.put("/read/multiple", notificationController.markMultipleAsRead);
router.put("/read/all", notificationController.markAllAsRead);
router.post("/:id/action", notificationController.recordAction);
router.delete("/:id", notificationController.deleteNotification);

// Admin only routes
router.post(
  "/",
  authorize("admin"),
  validate(schemas.createNotification),
  notificationController.createNotification
);
router.post(
  "/bulk",
  authorize("admin"),
  notificationController.sendBulkNotifications
);
router.get(
  "/admin/stats",
  authorize("admin"),
  notificationController.getNotificationStats
);

module.exports = router;
