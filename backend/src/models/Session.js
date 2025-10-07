const mongoose = require("mongoose");

// Session Schema
const SessionSchema = new mongoose.Schema(
  {
    // Participants
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Session Details
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },

    // Scheduling
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
      min: 15,
      max: 300, // 5 hours max
    },
    timezone: {
      type: String,
      required: true,
      default: "UTC",
    },

    // Status and Progress
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled", "no_show"],
      default: "scheduled",
    },

    // Session Content
    objectives: [
      {
        description: String,
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Meeting Details
    meetingDetails: {
      platform: {
        type: String,
        enum: ["zoom", "google_meet", "teams", "skype", "other"],
        default: "zoom",
      },
      meetingUrl: String,
      meetingId: String,
      passcode: String,
    },

    // Pricing and Payment
    pricing: {
      hourlyRate: {
        type: Number,
        required: true,
        min: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "refunded", "failed"],
        default: "pending",
      },
    },

    // Session Notes and Materials
    preparationNotes: {
      tutor: String,
      learner: String,
    },
    sessionNotes: {
      tutor: String,
      learner: String,
    },
    materials: [
      {
        name: String,
        url: String,
        type: {
          type: String,
          enum: ["document", "video", "audio", "link", "image"],
        },
        uploadedBy: {
          type: String,
          enum: ["tutor", "learner"],
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Session Timing
    actualStartTime: Date,
    actualEndTime: Date,
    actualDuration: Number, // in minutes

    // Feedback and Rating
    feedback: {
      tutor: {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        submittedAt: Date,
      },
      learner: {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        submittedAt: Date,
      },
    },

    // Progress Tracking
    learnerProgress: {
      skillLevelBefore: {
        type: Number,
        min: 0,
        max: 10,
      },
      skillLevelAfter: {
        type: Number,
        min: 0,
        max: 10,
      },
      improvementAreas: [String],
      nextSteps: [String],
    },

    // Cancellation Details
    cancellation: {
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reason: String,
      cancelledAt: Date,
      refundAmount: Number,
    },

    // Reminders and Notifications
    reminders: {
      sent24Hours: {
        type: Boolean,
        default: false,
      },
      sent1Hour: {
        type: Boolean,
        default: false,
      },
      sentAt: [Date],
    },

    // Session Recording (if applicable)
    recording: {
      available: {
        type: Boolean,
        default: false,
      },
      url: String,
      duration: Number,
      processingStatus: {
        type: String,
        enum: ["processing", "ready", "failed"],
        default: "processing",
      },
    },

    // Metadata
    metadata: {
      sessionType: {
        type: String,
        enum: ["one_on_one", "group", "workshop"],
        default: "one_on_one",
      },
      difficulty: {
        type: Number,
        min: 1,
        max: 10,
      },
      tags: [String],
      followUpRequired: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
SessionSchema.index({ tutor: 1, scheduledDate: -1 });
SessionSchema.index({ learner: 1, scheduledDate: -1 });
SessionSchema.index({ skill: 1, scheduledDate: -1 });
SessionSchema.index({ status: 1, scheduledDate: -1 });
SessionSchema.index({ scheduledDate: 1 });
SessionSchema.index({ "pricing.paymentStatus": 1 });

// Virtual for session duration in hours
SessionSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});

// Virtual for total price calculation
SessionSchema.virtual("calculatedPrice").get(function () {
  return (this.pricing.hourlyRate * this.duration) / 60;
});

// Methods
SessionSchema.methods.canBeCancelled = function () {
  const now = new Date();
  const sessionTime = new Date(this.scheduledDate);
  const hoursUntilSession = (sessionTime - now) / (1000 * 60 * 60);

  return hoursUntilSession >= 24 && this.status === "scheduled";
};

SessionSchema.methods.isUpcoming = function () {
  const now = new Date();
  const sessionTime = new Date(this.scheduledDate);

  return sessionTime > now && this.status === "scheduled";
};

SessionSchema.methods.updateProgress = function (progress) {
  this.learnerProgress = { ...this.learnerProgress, ...progress };
  return this.save();
};

// Static methods
SessionSchema.statics.getUpcomingSessions = function (userId, days = 7) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  return this.find({
    $or: [{ tutor: userId }, { learner: userId }],
    scheduledDate: { $gte: startDate, $lte: endDate },
    status: "scheduled",
  })
    .populate("tutor", "name email avatar")
    .populate("learner", "name email avatar")
    .populate("skill", "name category difficulty")
    .sort({ scheduledDate: 1 });
};

SessionSchema.statics.getUserStats = function (userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { tutor: new mongoose.Types.ObjectId(userId) },
          { learner: new mongoose.Types.ObjectId(userId) },
        ],
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalHours: { $sum: { $divide: ["$actualDuration", 60] } },
        averageRating: { $avg: "$feedback.tutor.rating" },
      },
    },
  ]);
};

// Pre-save middleware
SessionSchema.pre("save", function (next) {
  // Calculate total amount based on hourly rate and duration
  if (this.pricing.hourlyRate && this.duration) {
    this.pricing.totalAmount = (this.pricing.hourlyRate * this.duration) / 60;
  }

  // Set session title if not provided
  if (!this.title) {
    this.title = `Learning Session`;
  }

  next();
});

module.exports = mongoose.model("Session", SessionSchema);
