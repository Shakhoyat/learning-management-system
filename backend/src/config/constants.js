// Application constants
module.exports = {
  // JWT Settings
  JWT: {
    SECRET:
      process.env.JWT_SECRET ||
      "your-super-secret-jwt-key-change-in-production",
    REFRESH_SECRET:
      process.env.JWT_REFRESH_SECRET ||
      "your-super-secret-refresh-key-change-in-production",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  // User roles
  USER_ROLES: {
    ADMIN: "admin",
    TUTOR: "tutor",
    LEARNER: "learner",
  },

  // Session status
  SESSION_STATUS: {
    SCHEDULED: "scheduled",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    NO_SHOW: "no_show",
  },

  // Payment status
  PAYMENT_STATUS: {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
    REFUNDED: "refunded",
    CANCELLED: "cancelled",
  },

  // Notification types
  NOTIFICATION_TYPES: {
    EMAIL: "email",
    SMS: "sms",
    PUSH: "push",
    IN_APP: "in_app",
  },

  // Skill difficulty levels
  SKILL_DIFFICULTY: {
    BEGINNER: 1,
    INTERMEDIATE: 5,
    ADVANCED: 10,
  },

  // Matching algorithms
  MATCHING_ALGORITHMS: {
    SKILL_BASED: "skill_based",
    AVAILABILITY_BASED: "availability_based",
    RATING_BASED: "rating_based",
    HYBRID: "hybrid",
  },

  // File upload limits
  UPLOAD_LIMITS: {
    AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
    DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 1000,
  },

  // Email templates
  EMAIL_TEMPLATES: {
    WELCOME: "welcome",
    PASSWORD_RESET: "password_reset",
    EMAIL_VERIFICATION: "email_verification",
    SESSION_REMINDER: "session_reminder",
    PAYMENT_CONFIRMATION: "payment_confirmation",
  },
};
