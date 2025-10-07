const mongoose = require("mongoose");

// Session Schema with comprehensive tracking and recording capabilities
const SessionSchema = new mongoose.Schema(
  {
    // Participants
    participants: {
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      learner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },

    // Skill being taught/learned
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    // Session Details
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    objectives: [
      {
        type: String,
        trim: true,
      },
    ],

    // Scheduling
    schedule: {
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },
      timezone: {
        type: String,
        required: true,
        default: "UTC",
      },
      duration: {
        type: Number, // Duration in minutes
        required: true,
      },
      buffer: {
        before: {
          type: Number,
          default: 5, // 5 minutes before
        },
        after: {
          type: Number,
          default: 5, // 5 minutes after
        },
      },
    },

    // Session Status and State
    status: {
      type: String,
      enum: [
        "scheduled", // Session is scheduled
        "confirmed", // Both parties confirmed
        "started", // Session has started
        "ongoing", // Session is currently active
        "paused", // Session is temporarily paused
        "resumed", // Session resumed after pause
        "completed", // Session completed successfully
        "cancelled", // Session was cancelled
        "no_show_teacher", // Teacher didn't show up
        "no_show_learner", // Learner didn't show up
        "technical_issue", // Session ended due to technical problems
      ],
      default: "scheduled",
    },

    // Virtual Meeting Room
    room: {
      videoRoomId: {
        type: String,
        required: true,
      },
      videoProvider: {
        type: String,
        enum: ["jitsi", "zoom", "webrtc", "custom"],
        default: "webrtc",
      },
      whiteboardId: {
        type: String,
      },
      whiteboardProvider: {
        type: String,
        enum: ["miro", "figma", "custom"],
        default: "custom",
      },
      chatId: {
        type: String,
      },
      roomSettings: {
        recordingEnabled: {
          type: Boolean,
          default: true,
        },
        whiteboardEnabled: {
          type: Boolean,
          default: true,
        },
        chatEnabled: {
          type: Boolean,
          default: true,
        },
        screenShareEnabled: {
          type: Boolean,
          default: true,
        },
      },
    },

    // Session Recording and Documentation
    recording: {
      isRecorded: {
        type: Boolean,
        default: false,
      },
      url: {
        type: String,
      },
      duration: {
        type: Number, // Duration in seconds
      },
      fileSize: {
        type: Number, // Size in bytes
      },
      format: {
        type: String,
        enum: ["mp4", "webm", "avi"],
        default: "mp4",
      },
      quality: {
        type: String,
        enum: ["720p", "1080p", "4k"],
        default: "720p",
      },
      highlights: [
        {
          timestamp: {
            type: Number, // Seconds from start
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
          note: {
            type: String,
            maxlength: 500,
          },
          createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      transcription: {
        url: String,
        language: String,
        accuracy: Number, // 0-100 percentage
      },
    },

    // Session Materials and Resources
    materials: {
      shared: [
        {
          name: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            enum: [
              "document",
              "image",
              "video",
              "audio",
              "code",
              "link",
              "other",
            ],
            required: true,
          },
          size: Number, // File size in bytes
          sharedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          sharedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      homework: [
        {
          title: String,
          description: String,
          dueDate: Date,
          completed: {
            type: Boolean,
            default: false,
          },
          completedAt: Date,
          submissionUrl: String,
        },
      ],
    },

    // Session Analytics and Tracking
    analytics: {
      actualStartTime: Date,
      actualEndTime: Date,
      actualDuration: Number, // Actual duration in minutes
      attendanceRate: {
        teacher: {
          type: Number,
          min: 0,
          max: 100,
          default: 100,
        },
        learner: {
          type: Number,
          min: 0,
          max: 100,
          default: 100,
        },
      },
      engagementMetrics: {
        chatMessages: {
          type: Number,
          default: 0,
        },
        whiteboardInteractions: {
          type: Number,
          default: 0,
        },
        screenShareDuration: {
          type: Number,
          default: 0,
        },
        breaksDuration: {
          type: Number,
          default: 0,
        },
      },
      technicalIssues: [
        {
          type: {
            type: String,
            enum: [
              "audio",
              "video",
              "connection",
              "whiteboard",
              "recording",
              "other",
            ],
          },
          description: String,
          timestamp: {
            type: Date,
            default: Date.now,
          },
          resolved: {
            type: Boolean,
            default: false,
          },
          resolutionTime: Number, // Time to resolve in minutes
        },
      ],
    },

    // Session Activity Tracking
    activity: {
      joinedAt: Date,
      actualStartTime: Date,
      actualEndTime: Date,
      rescheduling: [
        {
          rescheduledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          rescheduledAt: {
            type: Date,
            default: Date.now,
          },
          reason: String,
          oldSchedule: {
            startTime: Date,
            endTime: Date,
          },
        },
      ],
    },

    // Cancellation Information
    cancellation: {
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      cancelledAt: Date,
      reason: String,
    },

    // Financial Transaction
    creditTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },

    pricing: {
      hourlyRate: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
      totalCost: {
        type: Number,
        required: true,
        min: 0,
      },
      platformFee: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // Feedback and Reviews
    feedback: {
      fromTeacher: {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          maxlength: 1000,
        },
        skillProgress: {
          type: Number,
          min: 0,
          max: 10,
        },
        recommendation: {
          type: String,
          maxlength: 500,
        },
        submittedAt: Date,
      },
      fromLearner: {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          maxlength: 1000,
        },
        teachingQuality: {
          type: Number,
          min: 1,
          max: 5,
        },
        materialQuality: {
          type: Number,
          min: 1,
          max: 5,
        },
        wouldRecommend: {
          type: Boolean,
        },
        submittedAt: Date,
      },
    },

    // Session Follow-up
    followUp: {
      nextSessionScheduled: {
        type: Boolean,
        default: false,
      },
      nextSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
      learnerProgress: {
        skillLevelBefore: Number,
        skillLevelAfter: Number,
        improvementAreas: [String],
        strengthsIdentified: [String],
      },
    },

    // Cancellation Details
    cancellation: {
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      cancelledAt: Date,
      reason: {
        type: String,
        enum: [
          "schedule_conflict",
          "personal_emergency",
          "technical_issues",
          "no_longer_needed",
          "teacher_unavailable",
          "learner_unavailable",
          "other",
        ],
      },
      note: {
        type: String,
        maxlength: 500,
      },
      refundIssued: {
        type: Boolean,
        default: false,
      },
      refundAmount: Number,
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
SessionSchema.index({ "participants.teacher": 1, "schedule.startTime": -1 });
SessionSchema.index({ "participants.learner": 1, "schedule.startTime": -1 });
SessionSchema.index({ skill: 1, "schedule.startTime": -1 });
SessionSchema.index({ status: 1, "schedule.startTime": -1 });
SessionSchema.index({ "schedule.startTime": 1, "schedule.endTime": 1 });
SessionSchema.index({ createdAt: -1 });

// Virtual properties
SessionSchema.virtual("isUpcoming").get(function () {
  return (
    this.schedule.startTime > new Date() &&
    ["scheduled", "confirmed"].includes(this.status)
  );
});

SessionSchema.virtual("isActive").get(function () {
  const now = new Date();
  return (
    this.schedule.startTime <= now &&
    this.schedule.endTime >= now &&
    ["started", "ongoing", "paused", "resumed"].includes(this.status)
  );
});

SessionSchema.virtual("isPast").get(function () {
  return (
    this.schedule.endTime < new Date() ||
    [
      "completed",
      "cancelled",
      "no_show_teacher",
      "no_show_learner",
      "technical_issue",
    ].includes(this.status)
  );
});

SessionSchema.virtual("canBeCancelled").get(function () {
  const hoursUntilSession =
    (this.schedule.startTime - new Date()) / (1000 * 60 * 60);
  return (
    hoursUntilSession > 24 && ["scheduled", "confirmed"].includes(this.status)
  );
});

// Pre-save middleware
SessionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Calculate total cost based on duration and hourly rate
  if (this.schedule.duration && this.pricing.hourlyRate) {
    const hours = this.schedule.duration / 60;
    this.pricing.totalCost = hours * this.pricing.hourlyRate;
  }

  next();
});

// Methods
SessionSchema.methods.addHighlight = function (timestamp, title, note, userId) {
  this.recording.highlights.push({
    timestamp,
    title,
    note,
    createdBy: userId,
    createdAt: new Date(),
  });
  return this.save();
};

SessionSchema.methods.updateStatus = function (newStatus, userId = null) {
  const oldStatus = this.status;
  this.status = newStatus;

  // Track timing for analytics
  const now = new Date();
  if (newStatus === "started" && !this.analytics.actualStartTime) {
    this.analytics.actualStartTime = now;
  } else if (
    ["completed", "cancelled", "technical_issue"].includes(newStatus) &&
    !this.analytics.actualEndTime
  ) {
    this.analytics.actualEndTime = now;
    if (this.analytics.actualStartTime) {
      this.analytics.actualDuration =
        (now - this.analytics.actualStartTime) / (1000 * 60); // minutes
    }
  }

  return this.save();
};

// Static methods
SessionSchema.statics.getUpcomingSessions = function (userId, limit = 10) {
  return this.find({
    $or: [
      { "participants.teacher": userId },
      { "participants.learner": userId },
    ],
    "schedule.startTime": { $gt: new Date() },
    status: { $in: ["scheduled", "confirmed"] },
  })
    .populate("skill participants.teacher participants.learner")
    .sort({ "schedule.startTime": 1 })
    .limit(limit);
};

SessionSchema.statics.getSessionHistory = function (
  userId,
  page = 1,
  limit = 20
) {
  const skip = (page - 1) * limit;

  return this.find({
    $or: [
      { "participants.teacher": userId },
      { "participants.learner": userId },
    ],
    status: { $in: ["completed", "cancelled"] },
  })
    .populate("skill participants.teacher participants.learner")
    .sort({ "schedule.startTime": -1 })
    .skip(skip)
    .limit(limit);
};

SessionSchema.statics.getSessionAnalytics = function (
  userId,
  startDate,
  endDate
) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { "participants.teacher": mongoose.Types.ObjectId(userId) },
          { "participants.learner": mongoose.Types.ObjectId(userId) },
        ],
        "schedule.startTime": {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        completedSessions: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        totalHours: { $sum: "$analytics.actualDuration" },
        averageRating: { $avg: "$feedback.fromLearner.rating" },
      },
    },
  ]);
};

module.exports = mongoose.model("Session", SessionSchema);
