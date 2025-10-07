const mongoose = require("mongoose");

// Simplified User Schema
const UserSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    timezone: {
      type: String,
      required: true,
      default: "UTC",
    },
    languages: [String],
    location: {
      country: String,
      city: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },

    // Role and Authentication
    role: {
      type: String,
      enum: ["admin", "tutor", "learner"],
      default: "learner",
    },
    auth: {
      passwordHash: {
        type: String,
        required: true,
      },
      emailVerified: {
        type: Boolean,
        default: false,
      },
      emailVerificationToken: String,
      passwordResetToken: String,
      passwordResetExpires: Date,
      lastLogin: Date,
      isActive: {
        type: Boolean,
        default: true,
      },
      refreshTokens: [
        {
          token: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
          expiresAt: Date,
        },
      ],
    },

    // Skills - for tutors
    teachingSkills: [
      {
        skillId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
          required: true,
        },
        level: {
          type: Number,
          min: 1,
          max: 10,
          required: true,
        },
        hoursTaught: {
          type: Number,
          default: 0,
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
          default: 0,
        },
        totalReviews: {
          type: Number,
          default: 0,
        },
        hourlyRate: {
          type: Number,
          min: 0,
        },
        availability: {
          hoursPerWeek: Number,
          timeSlots: [
            {
              day: {
                type: String,
                enum: [
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ],
              },
              startTime: String, // HH:MM format
              endTime: String, // HH:MM format
            },
          ],
        },
      },
    ],

    // Learning Skills - for learners
    learningSkills: [
      {
        skillId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
          required: true,
        },
        currentLevel: {
          type: Number,
          min: 0,
          max: 10,
          default: 0,
        },
        targetLevel: {
          type: Number,
          min: 1,
          max: 10,
          required: true,
        },
        hoursLearned: {
          type: Number,
          default: 0,
        },
        preferredLearningStyle: {
          type: String,
          enum: ["visual", "auditory", "kinesthetic", "reading_writing"],
        },
      },
    ],

    // Reputation and Stats
    reputation: {
      score: {
        type: Number,
        default: 0,
      },
      teachingStats: {
        totalSessions: {
          type: Number,
          default: 0,
        },
        totalHours: {
          type: Number,
          default: 0,
        },
        averageRating: {
          type: Number,
          default: 0,
        },
        completionRate: {
          type: Number,
          default: 0,
        },
      },
      learningStats: {
        totalSessions: {
          type: Number,
          default: 0,
        },
        totalHours: {
          type: Number,
          default: 0,
        },
        skillsLearned: {
          type: Number,
          default: 0,
        },
      },
    },

    // Notification Settings
    notificationSettings: {
      email: {
        sessionReminders: {
          type: Boolean,
          default: true,
        },
        newMessages: {
          type: Boolean,
          default: true,
        },
        skillMatches: {
          type: Boolean,
          default: true,
        },
      },
      push: {
        sessionReminders: {
          type: Boolean,
          default: true,
        },
        newMessages: {
          type: Boolean,
          default: true,
        },
      },
    },

    // Privacy Settings
    privacySettings: {
      profileVisibility: {
        type: String,
        enum: ["public", "members_only", "private"],
        default: "public",
      },
      showLocation: {
        type: Boolean,
        default: true,
      },
      showOnlineStatus: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.auth.passwordHash;
        delete ret.auth.refreshTokens;
        delete ret.auth.passwordResetToken;
        delete ret.auth.emailVerificationToken;
        return ret;
      },
    },
  }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ "teachingSkills.skillId": 1 });
UserSchema.index({ "learningSkills.skillId": 1 });
UserSchema.index({ "reputation.score": -1 });
UserSchema.index({ role: 1 });
UserSchema.index({ "location.coordinates": "2dsphere" });

// Pre-save middleware to hash password is handled in the auth service

module.exports = mongoose.model("User", UserSchema);
