const mongoose = require("mongoose");

// Notification Schema for managing all user notifications
const NotificationSchema = new mongoose.Schema(
  {
    // Recipient Information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification Content
    type: {
      type: String,
      enum: [
        "session_reminder",         // Upcoming session notification
        "session_started",          // Session has started
        "session_ended",            // Session has ended
        "session_cancelled",        // Session was cancelled
        "session_rescheduled",      // Session was rescheduled
        "payment_success",          // Payment processed successfully
        "payment_failed",           // Payment processing failed
        "payment_refunded",         // Payment was refunded
        "new_message",              // New message received
        "skill_progress",           // Skill progress update
        "achievement_unlocked",     // New achievement earned
        "teacher_request",          // Request to become a teacher
        "teacher_approved",         // Teacher application approved
        "teacher_rejected",         // Teacher application rejected
        "review_received",          // New review received
        "system_announcement",      // System-wide announcements
        "maintenance_notice",       // Scheduled maintenance
        "security_alert",           // Security-related notifications
        "marketing",                // Marketing communications
        "welcome",                  // Welcome message for new users
        "reminder",                 // General reminders
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    // Rich content for notifications
    content: {
      html: String, // HTML version of the message
      actions: [
        {
          text: {
            type: String,
            required: true,
          },
          url: String,
          action: {
            type: String,
            enum: ["navigate", "api_call", "dismiss"],
            default: "navigate",
          },
          style: {
            type: String,
            enum: ["primary", "secondary", "success", "warning", "danger"],
            default: "primary",
          },
        },
      ],
      attachments: [
        {
          type: {
            type: String,
            enum: ["image", "document", "link"],
          },
          url: String,
          title: String,
          description: String,
        },
      ],
    },

    // Priority and Delivery
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },

    channels: [
      {
        type: String,
        enum: ["in_app", "email", "push", "sms"],
        required: true,
      },
    ],

    // Delivery Status
    delivery: {
      inApp: {
        delivered: {
          type: Boolean,
          default: false,
        },
        deliveredAt: Date,
        read: {
          type: Boolean,
          default: false,
        },
        readAt: Date,
      },
      email: {
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: Date,
        opened: {
          type: Boolean,
          default: false,
        },
        openedAt: Date,
        clicked: {
          type: Boolean,
          default: false,
        },
        clickedAt: Date,
        bounced: {
          type: Boolean,
          default: false,
        },
        bouncedAt: Date,
        bouncedReason: String,
      },
      push: {
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: Date,
        delivered: {
          type: Boolean,
          default: false,
        },
        deliveredAt: Date,
        clicked: {
          type: Boolean,
          default: false,
        },
        clickedAt: Date,
        failed: {
          type: Boolean,
          default: false,
        },
        failedAt: Date,
        failureReason: String,
      },
      sms: {
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: Date,
        delivered: {
          type: Boolean,
          default: false,
        },
        deliveredAt: Date,
        failed: {
          type: Boolean,
          default: false,
        },
        failedAt: Date,
        failureReason: String,
      },
    },

    // Related Data
    relatedEntities: {
      sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
      paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
      skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
      messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message", // If you have a Message model
      },
      achievementId: String,
      reviewId: String,
    },

    // Additional Data
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Scheduling
    scheduledFor: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      // Notifications expire after 30 days by default
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },

    // Status
    status: {
      type: String,
      enum: ["scheduled", "sent", "delivered", "read", "failed", "expired"],
      default: "scheduled",
    },

    // Sender Information
    sender: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      system: {
        type: Boolean,
        default: false,
      },
      service: String, // Which service sent this notification
    },

    // Tracking and Analytics
    analytics: {
      deviceType: String, // mobile, desktop, tablet
      platform: String,   // ios, android, web
      location: {
        country: String,
        city: String,
      },
      engagement: {
        timeToRead: Number, // Time in seconds from delivery to read
        timeToAction: Number, // Time in seconds from delivery to action
        actionTaken: String, // Which action was taken
      },
    },

    // Batch Information (for bulk notifications)
    batchId: String,
    batchSize: Number,
    batchIndex: Number,
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1 });
NotificationSchema.index({ userId: 1, status: 1 });
NotificationSchema.index({ userId: 1, "delivery.inApp.read": 1 });
NotificationSchema.index({ type: 1, createdAt: -1 });
NotificationSchema.index({ scheduledFor: 1, status: 1 });
NotificationSchema.index({ expiresAt: 1 });
NotificationSchema.index({ batchId: 1 });
NotificationSchema.index({ priority: 1, createdAt: -1 });

// Compound indexes for common queries
NotificationSchema.index({ userId: 1, "delivery.inApp.read": 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1, createdAt: -1 });

// TTL index for automatic cleanup of expired notifications
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for determining if notification is read
NotificationSchema.virtual("isRead").get(function () {
  return this.delivery.inApp.read;
});

// Virtual for determining overall delivery status
NotificationSchema.virtual("isDelivered").get(function () {
  const channels = this.channels;
  let delivered = false;
  
  if (channels.includes("in_app")) {
    delivered = delivered || this.delivery.inApp.delivered;
  }
  if (channels.includes("email")) {
    delivered = delivered || this.delivery.email.sent;
  }
  if (channels.includes("push")) {
    delivered = delivered || this.delivery.push.sent;
  }
  if (channels.includes("sms")) {
    delivered = delivered || this.delivery.sms.sent;
  }
  
  return delivered;
});

// Methods
NotificationSchema.methods.markAsRead = function () {
  if (!this.delivery.inApp.read) {
    this.delivery.inApp.read = true;
    this.delivery.inApp.readAt = new Date();
    
    if (this.status === "delivered") {
      this.status = "read";
    }
    
    // Track time to read for analytics
    if (this.delivery.inApp.deliveredAt) {
      this.analytics.engagement.timeToRead = 
        (this.delivery.inApp.readAt - this.delivery.inApp.deliveredAt) / 1000;
    }
  }
  return this.save();
};

NotificationSchema.methods.markAsDelivered = function (channel = "in_app") {
  const now = new Date();
  
  switch (channel) {
    case "in_app":
      this.delivery.inApp.delivered = true;
      this.delivery.inApp.deliveredAt = now;
      break;
    case "email":
      this.delivery.email.sent = true;
      this.delivery.email.sentAt = now;
      break;
    case "push":
      this.delivery.push.sent = true;
      this.delivery.push.sentAt = now;
      break;
    case "sms":
      this.delivery.sms.sent = true;
      this.delivery.sms.sentAt = now;
      break;
  }
  
  if (this.status === "scheduled") {
    this.status = "delivered";
  }
  
  return this.save();
};

NotificationSchema.methods.trackAction = function (actionTaken) {
  this.analytics.engagement.actionTaken = actionTaken;
  
  if (this.delivery.inApp.deliveredAt) {
    this.analytics.engagement.timeToAction = 
      (new Date() - this.delivery.inApp.deliveredAt) / 1000;
  }
  
  return this.save();
};

// Static methods
NotificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({
    userId: mongoose.Types.ObjectId(userId),
    "delivery.inApp.read": false,
    status: { $in: ["delivered", "sent"] },
  });
};

NotificationSchema.statics.markAllAsRead = function (userId) {
  return this.updateMany(
    {
      userId: mongoose.Types.ObjectId(userId),
      "delivery.inApp.read": false,
    },
    {
      $set: {
        "delivery.inApp.read": true,
        "delivery.inApp.readAt": new Date(),
        status: "read",
      },
    }
  );
};

NotificationSchema.statics.getNotificationsByType = function (userId, type, limit = 10) {
  return this.find({
    userId: mongoose.Types.ObjectId(userId),
    type: type,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("relatedEntities.sessionId", "title schedule")
    .populate("relatedEntities.skillId", "name category")
    .populate("sender.userId", "personal.name personal.avatar");
};

NotificationSchema.statics.cleanupExpired = function () {
  return this.deleteMany({
    expiresAt: { $lte: new Date() },
    status: { $in: ["delivered", "read", "failed"] },
  });
};

NotificationSchema.statics.getEngagementStats = function (startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$type",
        totalSent: { $sum: 1 },
        totalRead: {
          $sum: { $cond: ["$delivery.inApp.read", 1, 0] },
        },
        averageTimeToRead: {
          $avg: "$analytics.engagement.timeToRead",
        },
        totalActions: {
          $sum: { $cond: [{ $ne: ["$analytics.engagement.actionTaken", null] }, 1, 0] },
        },
      },
    },
    {
      $addFields: {
        readRate: { $divide: ["$totalRead", "$totalSent"] },
        actionRate: { $divide: ["$totalActions", "$totalSent"] },
      },
    },
  ]);
};

module.exports = mongoose.model("Notification", NotificationSchema);