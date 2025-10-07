const mongoose = require("mongoose");

// User Schema with comprehensive skill tracking
const UserSchema = new mongoose.Schema(
  {
    // Personal Information
    personal: {
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
      timezone: {
        type: String,
        required: true,
        default: "UTC",
      },
      languages: [
        {
          type: String,
          trim: true,
        },
      ],
      bio: {
        type: String,
        maxlength: 500,
      },
      location: {
        country: String,
        city: String,
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
      },
    },

    // Authentication
    auth: {
      passwordHash: {
        type: String,
        required: true,
      },
      emailVerified: {
        type: Boolean,
        default: false,
      },
      lastLogin: Date,
      loginAttempts: {
        type: Number,
        default: 0,
      },
      lockUntil: Date,
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

    // Skills - Teaching and Learning
    skills: {
      teaching: [
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
            min: 0,
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
          verifications: [
            {
              type: {
                type: String,
                enum: [
                  "certificate",
                  "degree",
                  "work_experience",
                  "project",
                  "peer_review",
                ],
                required: true,
              },
              title: String,
              issuedBy: String,
              issuedDate: Date,
              verificationUrl: String,
              status: {
                type: String,
                enum: ["pending", "verified", "rejected"],
                default: "pending",
              },
            },
          ],
          availability: {
            hoursPerWeek: Number,
            preferredTimeSlots: [
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
          pricing: {
            hourlyRate: Number,
            currency: {
              type: String,
              default: "USD",
            },
          },
        },
      ],

      learning: [
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
            min: 0,
          },
          progressMilestones: [
            {
              level: Number,
              achievedAt: Date,
              verifiedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            },
          ],
          learningGoals: [
            {
              description: String,
              targetDate: Date,
              completed: {
                type: Boolean,
                default: false,
              },
            },
          ],
          preferredLearningStyle: {
            type: String,
            enum: ["visual", "auditory", "kinesthetic", "reading_writing"],
          },
        },
      ],
    },

    // Credit System
    credits: {
      balance: {
        type: Number,
        default: 0,
        min: 0,
      },
      earned: {
        type: Number,
        default: 0,
        min: 0,
      },
      spent: {
        type: Number,
        default: 0,
        min: 0,
      },
      transactions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Transaction",
        },
      ],
    },

    // Reputation System
    reputation: {
      score: {
        type: Number,
        default: 0,
        min: 0,
      },
      level: {
        type: String,
        enum: ["bronze", "silver", "gold", "platinum", "diamond"],
        default: "bronze",
      },
      badges: [
        {
          name: String,
          description: String,
          earnedAt: Date,
          iconUrl: String,
        },
      ],
      reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
        },
      ],
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
        averageProgress: {
          type: Number,
          default: 0,
        },
      },
    },

    // Platform Settings
    settings: {
      notifications: {
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
          weeklyProgress: {
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
      privacy: {
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

    // Account Status
    status: {
      type: String,
      enum: ["active", "suspended", "deactivated", "pending_verification"],
      default: "pending_verification",
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.auth.passwordHash;
        delete ret.auth.refreshTokens;
        return ret;
      },
    },
  }
);

// Indexes for performance
UserSchema.index({ "personal.email": 1 });
UserSchema.index({ "skills.teaching.skillId": 1 });
UserSchema.index({ "skills.learning.skillId": 1 });
UserSchema.index({ "reputation.score": -1 });
UserSchema.index({ "personal.location.coordinates": "2dsphere" });
UserSchema.index({ createdAt: -1 });

// Virtual for account lock status
UserSchema.virtual("auth.isLocked").get(function () {
  return !!(this.auth.lockUntil && this.auth.lockUntil > Date.now());
});

// Pre-save middleware
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);
