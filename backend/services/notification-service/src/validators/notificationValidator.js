const Joi = require("joi");

const notificationSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  type: Joi.string().valid(
    "session_reminder",
    "session_started",
    "session_ended",
    "payment_success",
    "payment_failed",
    "new_message",
    "achievement_unlocked",
    "skill_progress",
    "system_announcement",
    "marketing"
  ).required(),
  title: Joi.string().max(100).required(),
  message: Joi.string().max(500).required(),
  data: Joi.object().optional(),
  priority: Joi.string().valid("low", "normal", "high", "urgent").default("normal"),
  channels: Joi.array().items(
    Joi.string().valid("email", "push", "in_app", "sms")
  ).default(["in_app"]),
  scheduledFor: Joi.date().optional(),
});

const settingsSchema = Joi.object({
  email: Joi.object({
    sessionReminders: Joi.boolean().default(true),
    paymentNotifications: Joi.boolean().default(true),
    messageAlerts: Joi.boolean().default(true),
    marketingEmails: Joi.boolean().default(false),
    achievementNotifications: Joi.boolean().default(true),
    skillProgressUpdates: Joi.boolean().default(true),
  }).optional(),
  push: Joi.object({
    sessionReminders: Joi.boolean().default(true),
    paymentNotifications: Joi.boolean().default(true),
    messageAlerts: Joi.boolean().default(true),
    marketingNotifications: Joi.boolean().default(false),
    achievementNotifications: Joi.boolean().default(true),
    skillProgressUpdates: Joi.boolean().default(false),
  }).optional(),
  inApp: Joi.object({
    sessionReminders: Joi.boolean().default(true),
    paymentNotifications: Joi.boolean().default(true),
    messageAlerts: Joi.boolean().default(true),
    achievements: Joi.boolean().default(true),
    skillProgressUpdates: Joi.boolean().default(true),
    systemAnnouncements: Joi.boolean().default(true),
  }).optional(),
  frequency: Joi.string().valid("immediate", "hourly", "daily", "weekly").default("immediate"),
  quietHours: Joi.object({
    enabled: Joi.boolean().default(false),
    start: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).default("22:00"),
    end: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).default("08:00"),
    timezone: Joi.string().default("UTC"),
  }).optional(),
});

const subscriptionSchema = Joi.object({
  endpoint: Joi.string().uri().required(),
  keys: Joi.object({
    p256dh: Joi.string().required(),
    auth: Joi.string().required(),
  }).required(),
});

const validateNotification = (req, res, next) => {
  const { error } = notificationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

const validateSettings = (req, res, next) => {
  const { error } = settingsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

const validateSubscription = (req, res, next) => {
  const { error } = subscriptionSchema.validate(req.body.subscription);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

module.exports = {
  validateNotification,
  validateSettings,
  validateSubscription,
};