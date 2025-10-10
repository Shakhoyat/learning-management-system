const mongoose = require("mongoose");

/**
 * Learning Analytics Model
 * Tracks detailed analytics for learners including progress,
 * skill development, session outcomes, and engagement metrics
 */
const LearningAnalyticsSchema = new mongoose.Schema(
  {
    // Learner Reference
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Time Period
    period: {
      type: {
        type: String,
        enum: ["daily", "weekly", "monthly", "quarterly", "yearly"],
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      year: Number,
      month: Number,
      week: Number,
      day: Number,
    },

    // Session Metrics
    sessionMetrics: {
      total: {
        type: Number,
        default: 0,
      },
      completed: {
        type: Number,
        default: 0,
      },
      cancelled: {
        type: Number,
        default: 0,
      },
      noShow: {
        type: Number,
        default: 0,
      },
      completionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
      },
      totalHours: {
        type: Number,
        default: 0,
      },
      averageDuration: {
        type: Number,
        default: 0,
      },
      sessionsPerWeek: {
        type: Number,
        default: 0,
      },
    },

    // Learning Progress
    learningProgress: {
      skillsInProgress: {
        type: Number,
        default: 0,
      },
      skillsCompleted: {
        type: Number,
        default: 0,
      },
      skillsStarted: {
        type: Number,
        default: 0,
      },
      averageProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
      },
      totalProgressGain: {
        type: Number,
        default: 0,
      },
      averageLevelImprovement: {
        type: Number,
        default: 0,
      },
    },

    // Skill-Specific Progress
    skillProgress: [
      {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
        },
        startLevel: {
          type: Number,
          default: 0,
        },
        currentLevel: {
          type: Number,
          default: 0,
        },
        targetLevel: {
          type: Number,
          default: 0,
        },
        levelGain: {
          type: Number,
          default: 0,
        },
        hoursLearned: {
          type: Number,
          default: 0,
        },
        sessionsCount: {
          type: Number,
          default: 0,
        },
        averageRating: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
        progressRate: {
          type: Number,
          default: 0,
        },
        lastSessionDate: Date,
        status: {
          type: String,
          enum: ["not_started", "in_progress", "paused", "completed"],
          default: "not_started",
        },
      },
    ],

    // Learning Outcomes
    outcomes: {
      goalsAchieved: {
        type: Number,
        default: 0,
      },
      goalsInProgress: {
        type: Number,
        default: 0,
      },
      goalsAchievementRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
      },
      milestonesReached: {
        type: Number,
        default: 0,
      },
      certificationsEarned: {
        type: Number,
        default: 0,
      },
    },

    // Engagement Metrics
    engagement: {
      loginDays: {
        type: Number,
        default: 0,
      },
      streakDays: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      messagesExchanged: {
        type: Number,
        default: 0,
      },
      materialsReviewed: {
        type: Number,
        default: 0,
      },
      notesCreated: {
        type: Number,
        default: 0,
      },
      questionsAsked: {
        type: Number,
        default: 0,
      },
      engagementScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
    },

    // Tutor Interaction
    tutorMetrics: {
      totalTutors: {
        type: Number,
        default: 0,
      },
      primaryTutors: {
        type: Number,
        default: 0,
      },
      averageTutorRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      tutorFeedbackGiven: {
        type: Number,
        default: 0,
      },
      favoriteSkills: [
        {
          skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
          },
          sessionsCount: Number,
        },
      ],
    },

    // Learning Patterns
    learningPatterns: {
      preferredDays: [
        {
          day: {
            type: String,
            enum: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
          },
          count: Number,
        },
      ],
      preferredHours: [
        {
          hour: Number, // 0-23
          count: Number,
        },
      ],
      averageSessionsPerWeek: {
        type: Number,
        default: 0,
      },
      preferredLearningStyle: {
        type: String,
        enum: ["visual", "auditory", "kinesthetic", "reading_writing", "mixed"],
      },
      peakProductivityTime: {
        type: String,
        enum: ["morning", "afternoon", "evening", "night"],
      },
    },

    // Performance Metrics
    performance: {
      comprehensionScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
      retentionScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
      applicationScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
      overallPerformance: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
      performanceTrend: {
        type: String,
        enum: ["improving", "stable", "declining"],
        default: "stable",
      },
    },

    // Spending and Investment
    spending: {
      totalInvested: {
        type: Number,
        default: 0,
      },
      averageCostPerSession: {
        type: Number,
        default: 0,
      },
      averageCostPerHour: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
      roi: {
        // Return on Investment (subjective, based on progress)
        type: Number,
        default: 0,
      },
    },

    // Achievements
    achievements: [
      {
        type: {
          type: String,
          enum: [
            "sessions_milestone",
            "hours_milestone",
            "skills_milestone",
            "streak",
            "excellence",
            "dedication",
            "improvement",
          ],
        },
        title: String,
        description: String,
        earnedAt: {
          type: Date,
          default: Date.now,
        },
        value: mongoose.Schema.Types.Mixed,
      },
    ],

    // Gamification
    gamification: {
      totalPoints: {
        type: Number,
        default: 0,
      },
      currentLevel: {
        type: Number,
        default: 1,
      },
      pointsToNextLevel: {
        type: Number,
        default: 100,
      },
      badges: [
        {
          id: String,
          name: String,
          earnedAt: Date,
          icon: String,
        },
      ],
      rank: {
        type: String,
        enum: ["beginner", "learner", "dedicated", "expert", "master"],
        default: "beginner",
      },
    },

    // Growth Metrics
    growth: {
      sessionGrowth: {
        type: Number, // percentage
        default: 0,
      },
      progressGrowth: {
        type: Number, // percentage
        default: 0,
      },
      engagementGrowth: {
        type: Number, // percentage
        default: 0,
      },
      skillGrowth: {
        type: Number, // percentage
        default: 0,
      },
    },

    // Comparative Rankings (optional, for motivation)
    rankings: {
      overallRank: Number,
      percentile: Number,
      categoryRanks: [
        {
          category: String,
          rank: Number,
          totalLearners: Number,
        },
      ],
    },

    // Recommendations (AI-generated or rule-based)
    recommendations: [
      {
        type: {
          type: String,
          enum: [
            "skill_suggestion",
            "tutor_suggestion",
            "schedule_optimization",
            "learning_strategy",
            "resource",
          ],
        },
        priority: {
          type: String,
          enum: ["high", "medium", "low"],
        },
        title: String,
        description: String,
        actionable: Boolean,
        generatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Metadata
    metadata: {
      lastCalculated: {
        type: Date,
        default: Date.now,
      },
      dataQuality: {
        type: String,
        enum: ["complete", "partial", "estimated"],
        default: "complete",
      },
      notes: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound Indexes
LearningAnalyticsSchema.index({ learner: 1, "period.startDate": -1 });
LearningAnalyticsSchema.index({
  learner: 1,
  "period.type": 1,
  "period.startDate": -1,
});
LearningAnalyticsSchema.index({ "period.startDate": 1, "period.endDate": 1 });
LearningAnalyticsSchema.index({ "performance.overallPerformance": -1 });
LearningAnalyticsSchema.index({ "learningProgress.averageProgress": -1 });

// Virtual for overall learning score
LearningAnalyticsSchema.virtual("learningScore").get(function () {
  const progressWeight = 0.4;
  const engagementWeight = 0.3;
  const performanceWeight = 0.3;

  return (
    this.learningProgress.averageProgress * progressWeight +
    (this.engagement.engagementScore / 10) * engagementWeight +
    (this.performance.overallPerformance / 10) * performanceWeight
  );
});

// Static method to calculate analytics for a learner
LearningAnalyticsSchema.statics.calculateForLearner = async function (
  learnerId,
  periodType,
  startDate,
  endDate
) {
  const Session = mongoose.model("Session");
  const User = mongoose.model("User");

  // Get all sessions in the period
  const sessions = await Session.find({
    learner: learnerId,
    scheduledDate: {
      $gte: startDate,
      $lte: endDate,
    },
  }).populate("tutor skill");

  // Get learner data
  const learner = await User.findById(learnerId);

  // Calculate session metrics
  const sessionMetrics = {
    total: sessions.length,
    completed: sessions.filter((s) => s.status === "completed").length,
    cancelled: sessions.filter((s) => s.status === "cancelled").length,
    noShow: sessions.filter((s) => s.status === "no_show").length,
    totalHours: sessions.reduce(
      (sum, s) => sum + (s.actualDuration || s.duration) / 60,
      0
    ),
  };

  sessionMetrics.completionRate =
    sessionMetrics.total > 0
      ? sessionMetrics.completed / sessionMetrics.total
      : 0;
  sessionMetrics.averageDuration =
    sessionMetrics.completed > 0
      ? sessions
          .filter((s) => s.status === "completed")
          .reduce((sum, s) => sum + (s.actualDuration || s.duration), 0) /
        sessionMetrics.completed
      : 0;

  // Calculate learning progress from user's learning skills
  const learningProgress = {
    skillsInProgress: learner.learningSkills.filter(
      (s) => s.currentLevel < s.targetLevel
    ).length,
    skillsCompleted: learner.learningSkills.filter(
      (s) => s.currentLevel >= s.targetLevel
    ).length,
    skillsStarted: learner.learningSkills.length,
  };

  const totalProgress = learner.learningSkills.reduce((sum, skill) => {
    const progress =
      skill.targetLevel > 0 ? skill.currentLevel / skill.targetLevel : 0;
    return sum + Math.min(progress, 1);
  }, 0);

  learningProgress.averageProgress =
    learner.learningSkills.length > 0
      ? totalProgress / learner.learningSkills.length
      : 0;

  // Calculate skill-specific progress
  const skillProgress = learner.learningSkills.map((skill) => {
    const skillSessions = sessions.filter(
      (s) => s.skill._id.toString() === skill.skillId.toString()
    );

    return {
      skill: skill.skillId,
      currentLevel: skill.currentLevel,
      targetLevel: skill.targetLevel,
      hoursLearned: skill.hoursLearned || 0,
      sessionsCount: skillSessions.length,
      progressRate:
        skill.targetLevel > 0 ? skill.currentLevel / skill.targetLevel : 0,
      status:
        skill.currentLevel === 0
          ? "not_started"
          : skill.currentLevel >= skill.targetLevel
          ? "completed"
          : "in_progress",
    };
  });

  // Calculate spending
  const spending = {
    totalInvested: sessions.reduce(
      (sum, s) => sum + (s.pricing?.totalAmount || 0),
      0
    ),
  };
  spending.averageCostPerSession =
    sessionMetrics.total > 0
      ? spending.totalInvested / sessionMetrics.total
      : 0;
  spending.averageCostPerHour =
    sessionMetrics.totalHours > 0
      ? spending.totalInvested / sessionMetrics.totalHours
      : 0;

  // Calculate tutor metrics
  const uniqueTutors = new Set(sessions.map((s) => s.tutor._id.toString()));
  const tutorMetrics = {
    totalTutors: uniqueTutors.size,
  };

  // Create analytics document
  const analytics = {
    learner: learnerId,
    period: {
      type: periodType,
      startDate,
      endDate,
      year: startDate.getFullYear(),
      month: startDate.getMonth() + 1,
    },
    sessionMetrics,
    learningProgress,
    skillProgress,
    spending,
    tutorMetrics,
    metadata: {
      lastCalculated: new Date(),
      dataQuality: "complete",
    },
  };

  return analytics;
};

// Instance method to generate insights
LearningAnalyticsSchema.methods.generateInsights = function () {
  const insights = [];

  // Progress insight
  if (this.learningProgress.averageProgress >= 0.7) {
    insights.push({
      type: "success",
      category: "progress",
      message: `Excellent progress! You're ${(
        this.learningProgress.averageProgress * 100
      ).toFixed(0)}% of the way to your learning goals.`,
    });
  } else if (this.learningProgress.averageProgress < 0.3) {
    insights.push({
      type: "tip",
      category: "progress",
      message:
        "Consider scheduling more sessions to accelerate your learning progress.",
    });
  }

  // Engagement insight
  if (this.engagement.streakDays >= 7) {
    insights.push({
      type: "success",
      category: "engagement",
      message: `Amazing! You've maintained a ${this.engagement.streakDays}-day learning streak!`,
    });
  }

  // Session completion insight
  if (this.sessionMetrics.completionRate < 0.8) {
    insights.push({
      type: "warning",
      category: "sessions",
      message: `Your session completion rate is ${(
        this.sessionMetrics.completionRate * 100
      ).toFixed(
        1
      )}%. Try to attend all scheduled sessions for better progress.`,
    });
  }

  // Performance insight
  if (this.performance.performanceTrend === "improving") {
    insights.push({
      type: "success",
      category: "performance",
      message:
        "Your learning performance is improving! Keep up the great work!",
    });
  }

  return insights;
};

const LearningAnalytics = mongoose.model(
  "LearningAnalytics",
  LearningAnalyticsSchema
);

module.exports = LearningAnalytics;
