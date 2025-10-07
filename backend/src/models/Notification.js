const mongoose = require("mongoose");

// Notification Schema
const NotificationSchema = new mongoose.Schema(
  {
    // Recipient Information
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Sender Information (optional - system notifications have no sender)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Notification Content
    type: {
      type: String,
      enum: [
        "session_reminder",
        "session_cancelled",
        "session_completed",
        "payment_received",
        "payment_failed",
        "new_message",
        "skill_match",
        "profile_update",
        "system_announcement",
        "welcome",
        "email_verification",
        "password_reset",
        "tutor_application",
        "booking_request",
        "review_received",
        "achievement_unlocked",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      maxlength: 100,
    },

    message: {
      type: String,
      required: true,
      maxlength: 500,
    },

    // Rich Content (optional)
    content: {
      html: String, // HTML version for email
      markdown: String, // Markdown for rich display
      attachments: [
        {
          filename: String,
          url: String,
          contentType: String,
          size: Number,
        },
      ],
    },

    // Priority and Importance
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },

    category: {
      type: String,
      enum: [
        "session",
        "payment",
        "message",
        "system",
        "marketing",
        "security",
        "achievement",
        "reminder",
      ],
      required: true,
    },

    // Delivery Channels
    channels: {
      email: {
        enabled: {
          type: Boolean,
          default: false,
        },
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: Date,
        deliveryStatus: {
          type: String,
          enum: ["pending", "sent", "delivered", "bounced", "failed"],
          default: "pending",
        },
        emailId: String, // Provider's email ID
        openedAt: Date,
        clickedAt: Date,
      },
      sms: {
        enabled: {
          type: Boolean,
          default: false,
        },
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: Date,
        deliveryStatus: {
          type: String,
          enum: ["pending", "sent", "delivered", "failed"],
          default: "pending",
        },
        smsId: String, // Provider's SMS ID
      },
      push: {
        enabled: {
          type: Boolean,
          default: false,
        },
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: Date,
        deliveryStatus: {
          type: String,
          enum: ["pending", "sent", "delivered", "failed"],
          default: "pending",
        },
        pushId: String, // Provider's push notification ID
        clickedAt: Date,
      },
      inApp: {
        enabled: {
          type: Boolean,
          default: true,
        },
        read: {
          type: Boolean,
          default: false,
        },
        readAt: Date,
        dismissed: {
          type: Boolean,
          default: false,
        },
        dismissedAt: Date,
      },
    },

    // Scheduling
    scheduling: {
      isScheduled: {
        type: Boolean,
        default: false,
      },
      scheduledFor: Date,
      timezone: String,
      sent: {
        type: Boolean,
        default: false,
      },
    },

    // Actions and CTAs
    actions: [
      {
        type: {
          type: String,
          enum: ["url", "deep_link", "api_call", "dismiss"],
        },
        label: String,
        value: String, // URL, deep link, or API endpoint
        primary: {
          type: Boolean,
          default: false,
        },
        clickedAt: Date,
        clickCount: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Related Entities
    relatedEntities: {
      session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
      payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
      skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    // Metadata and Context
    metadata: {
      templateId: String, // Email template ID
      campaignId: String, // Marketing campaign ID
      source: {
        type: String,
        enum: ["system", "user", "automation", "webhook", "admin"],
        default: "system",
      },
      context: mongoose.Schema.Types.Mixed, // Additional context data
      version: {
        type: String,
        default: "1.0",
      },
    },

    // Delivery Tracking
    delivery: {
      attempts: {
        type: Number,
        default: 0,
      },
      maxAttempts: {
        type: Number,
        default: 3,
      },
      lastAttemptAt: Date,
      nextAttemptAt: Date,
      errors: [
        {
          channel: String,
          error: String,
          timestamp: Date,
        },
      ],
    },

    // Expiration
    expiresAt: Date,

    // Status
    status: {
      type: String,
      enum: ["draft", "queued", "sending", "sent", "failed", "cancelled"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, createdAt: -1 });
NotificationSchema.index({ category: 1, createdAt: -1 });
NotificationSchema.index({ priority: 1, status: 1 });
NotificationSchema.index({
  "scheduling.scheduledFor": 1,
  "scheduling.sent": 1,
});
NotificationSchema.index({ "channels.inApp.read": 1, recipient: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
NotificationSchema.index({ status: 1, "delivery.nextAttemptAt": 1 });

// Virtual for delivery status
NotificationSchema.virtual("isDelivered").get(function () {
  return (
    this.channels.email.sent ||
    this.channels.sms.sent ||
    this.channels.push.sent ||
    this.channels.inApp.enabled
  );
});

// Virtual for read status
NotificationSchema.virtual("isRead").get(function () {
  return this.channels.inApp.read;
});

// Methods
NotificationSchema.methods.markAsRead = function () {
  this.channels.inApp.read = true;
  this.channels.inApp.readAt = new Date();
  return this.save();
};

NotificationSchema.methods.markAsDismissed = function () {
  this.channels.inApp.dismissed = true;
  this.channels.inApp.dismissedAt = new Date();
  return this.save();
};

NotificationSchema.methods.updateDeliveryStatus = function (
  channel,
  status,
  metadata = {}
) {
  if (this.channels[channel]) {
    this.channels[channel].deliveryStatus = status;

    if (status === "sent" || status === "delivered") {
      this.channels[channel].sent = true;
      this.channels[channel].sentAt = new Date();
    }

    // Update with additional metadata
    Object.assign(this.channels[channel], metadata);
  }

  return this.save();
};

NotificationSchema.methods.recordAction = function (actionIndex) {
  if (this.actions[actionIndex]) {
    this.actions[actionIndex].clickedAt = new Date();
    this.actions[actionIndex].clickCount += 1;
  }

  return this.save();
};

NotificationSchema.methods.canRetry = function () {
  return (
    this.delivery.attempts < this.delivery.maxAttempts &&
    this.status === "failed" &&
    (!this.expiresAt || this.expiresAt > new Date())
  );
};

// Static methods
NotificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({
    recipient: userId,
    "channels.inApp.enabled": true,
    "channels.inApp.read": false,
    "channels.inApp.dismissed": false,
  });
};

NotificationSchema.statics.getNotificationsForUser = function (
  userId,
  options = {}
) {
  const {
    page = 1,
    limit = 20,
    category,
    unreadOnly = false,
    includeRead = true,
  } = options;

  const query = {
    recipient: userId,
    "channels.inApp.enabled": true,
  };

  if (category) {
    query.category = category;
  }

  if (unreadOnly) {
    query["channels.inApp.read"] = false;
    query["channels.inApp.dismissed"] = false;
  } else if (!includeRead) {
    query["channels.inApp.dismissed"] = false;
  }

  return this.find(query)
    .populate("sender", "name avatar")
    .populate("relatedEntities.session", "title scheduledDate")
    .populate("relatedEntities.skill", "name category")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

NotificationSchema.statics.markMultipleAsRead = function (
  notificationIds,
  userId
) {
  return this.updateMany(
    {
      _id: { $in: notificationIds },
      recipient: userId,
      "channels.inApp.enabled": true,
    },
    {
      $set: {
        "channels.inApp.read": true,
        "channels.inApp.readAt": new Date(),
      },
    }
  );
};

// Pre-save middleware
NotificationSchema.pre("save", function (next) {
  // Set expiration if not set (default to 30 days)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  // Update delivery attempt tracking
  if (this.isModified("status") && this.status === "sending") {
    this.delivery.attempts += 1;
    this.delivery.lastAttemptAt = new Date();
  }

  next();
});

module.exports = mongoose.model("Notification", NotificationSchema);
