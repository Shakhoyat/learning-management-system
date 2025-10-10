const mongoose = require("mongoose");

/**
 * Teaching Analytics Model
 * Tracks detailed analytics for tutors including session performance,
 * student outcomes, earnings, and engagement metrics
 */
const TeachingAnalyticsSchema = new mongoose.Schema(
  {
    // Tutor Reference
    tutor: {
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
      month: Number, // 1-12
      week: Number, // 1-53
      day: Number, // Day of year (1-366)
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
        // in minutes
        type: Number,
        default: 0,
      },
    },

    // Student Metrics
    studentMetrics: {
      totalStudents: {
        type: Number,
        default: 0,
      },
      newStudents: {
        type: Number,
        default: 0,
      },
      returningStudents: {
        type: Number,
        default: 0,
      },
      retentionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
      },
      averageStudentSatisfaction: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      studentsByLevel: {
        beginner: { type: Number, default: 0 },
        intermediate: { type: Number, default: 0 },
        advanced: { type: Number, default: 0 },
      },
    },

    // Performance Ratings
    ratings: {
      overall: {
        average: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
        total: {
          type: Number,
          default: 0,
        },
        distribution: {
          fiveStar: { type: Number, default: 0 },
          fourStar: { type: Number, default: 0 },
          threeStar: { type: Number, default: 0 },
          twoStar: { type: Number, default: 0 },
          oneStar: { type: Number, default: 0 },
        },
      },
      categories: {
        communication: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
        knowledge: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
        punctuality: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
        effectiveness: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
        preparation: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
      },
      trend: {
        type: String,
        enum: ["improving", "stable", "declining"],
        default: "stable",
      },
    },

    // Earnings and Financial Metrics
    earnings: {
      gross: {
        type: Number,
        default: 0,
      },
      platformFees: {
        type: Number,
        default: 0,
      },
      net: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
      averageHourlyRate: {
        type: Number,
        default: 0,
      },
      projectedMonthlyEarnings: {
        type: Number,
        default: 0,
      },
      earningsGrowth: {
        type: Number, // percentage
        default: 0,
      },
    },

    // Skill-Specific Performance
    skillPerformance: [
      {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
        },
        sessionsCount: {
          type: Number,
          default: 0,
        },
        hoursTeaching: {
          type: Number,
          default: 0,
        },
        averageRating: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
        studentsCount: {
          type: Number,
          default: 0,
        },
        earnings: {
          type: Number,
          default: 0,
        },
        completionRate: {
          type: Number,
          default: 0,
          min: 0,
          max: 1,
        },
      },
    ],

    // Engagement Metrics
    engagement: {
      responseTime: {
        // Average response time in minutes
        average: {
          type: Number,
          default: 0,
        },
        median: {
          type: Number,
          default: 0,
        },
      },
      messagesExchanged: {
        type: Number,
        default: 0,
      },
      materialShared: {
        type: Number,
        default: 0,
      },
      profileViews: {
        type: Number,
        default: 0,
      },
      bookingRequests: {
        total: {
          type: Number,
          default: 0,
        },
        accepted: {
          type: Number,
          default: 0,
        },
        declined: {
          type: Number,
          default: 0,
        },
        acceptanceRate: {
          type: Number,
          default: 0,
          min: 0,
          max: 1,
        },
      },
    },

    // Schedule Utilization
    scheduleMetrics: {
      availableSlots: {
        type: Number,
        default: 0,
      },
      bookedSlots: {
        type: Number,
        default: 0,
      },
      utilizationRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
      },
      peakHours: [
        {
          hour: Number, // 0-23
          count: Number,
        },
      ],
      peakDays: [
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
    },

    // Student Outcomes
    studentOutcomes: {
      totalStudentsImproved: {
        type: Number,
        default: 0,
      },
      averageProgressGain: {
        // Average skill level improvement
        type: Number,
        default: 0,
      },
      studentsReachingGoals: {
        type: Number,
        default: 0,
      },
      goalsAchievementRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
      },
      repeatStudentRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
      },
    },

    // Quality Indicators
    qualityMetrics: {
      preparationScore: {
        // Based on materials shared, notes, etc.
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
      consistencyScore: {
        // Based on schedule adherence, cancellations
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
      professionalismScore: {
        // Based on ratings and feedback
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
      overallQualityScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
    },

    // Growth Metrics
    growth: {
      sessionGrowth: {
        type: Number, // percentage
        default: 0,
      },
      studentGrowth: {
        type: Number, // percentage
        default: 0,
      },
      earningsGrowth: {
        type: Number, // percentage
        default: 0,
      },
      ratingGrowth: {
        type: Number, // percentage
        default: 0,
      },
    },

    // Achievements and Milestones
    achievements: [
      {
        type: {
          type: String,
          enum: [
            "sessions_milestone",
            "students_milestone",
            "earnings_milestone",
            "rating_milestone",
            "hours_milestone",
            "streak",
            "excellence",
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

    // Comparative Rankings
    rankings: {
      overallRank: Number,
      categoryRank: Number, // Rank within primary teaching category
      percentile: Number, // Top X% of tutors
      skillRankings: [
        {
          skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
          },
          rank: Number,
          totalTutors: Number,
        },
      ],
    },

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

// Compound Indexes for efficient querying
TeachingAnalyticsSchema.index({ tutor: 1, "period.startDate": -1 });
TeachingAnalyticsSchema.index({
  tutor: 1,
  "period.type": 1,
  "period.startDate": -1,
});
TeachingAnalyticsSchema.index({ "period.startDate": 1, "period.endDate": 1 });
TeachingAnalyticsSchema.index({ "ratings.overall.average": -1 });
TeachingAnalyticsSchema.index({ "earnings.net": -1 });

// Virtual for formatted period
TeachingAnalyticsSchema.virtual("periodFormatted").get(function () {
  const { type, startDate, endDate } = this.period;
  const start = new Date(startDate).toLocaleDateString();
  const end = new Date(endDate).toLocaleDateString();
  return `${type}: ${start} - ${end}`;
});

// Static method to calculate analytics for a tutor
TeachingAnalyticsSchema.statics.calculateForTutor = async function (
  tutorId,
  periodType,
  startDate,
  endDate
) {
  const Session = mongoose.model("Session");
  const User = mongoose.model("User");

  // Get all sessions in the period
  const sessions = await Session.find({
    tutor: tutorId,
    scheduledDate: {
      $gte: startDate,
      $lte: endDate,
    },
  }).populate("learner skill");

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

  // Calculate student metrics
  const uniqueStudents = new Set(sessions.map((s) => s.learner._id.toString()));
  const studentMetrics = {
    totalStudents: uniqueStudents.size,
    newStudents: 0, // Would need to check previous periods
    returningStudents: 0, // Would need to check previous periods
  };

  // Calculate ratings
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const ratingsData = completedSessions.filter(
    (s) => s.feedback?.learner?.rating
  );

  const ratings = {
    overall: {
      total: ratingsData.length,
      average:
        ratingsData.length > 0
          ? ratingsData.reduce((sum, s) => sum + s.feedback.learner.rating, 0) /
            ratingsData.length
          : 0,
      distribution: {
        fiveStar: ratingsData.filter((s) => s.feedback.learner.rating === 5)
          .length,
        fourStar: ratingsData.filter((s) => s.feedback.learner.rating === 4)
          .length,
        threeStar: ratingsData.filter((s) => s.feedback.learner.rating === 3)
          .length,
        twoStar: ratingsData.filter((s) => s.feedback.learner.rating === 2)
          .length,
        oneStar: ratingsData.filter((s) => s.feedback.learner.rating === 1)
          .length,
      },
    },
  };

  // Calculate earnings
  const earnings = {
    gross: sessions.reduce((sum, s) => sum + (s.pricing?.totalAmount || 0), 0),
    platformFees: sessions.reduce(
      (sum, s) => sum + (s.pricing?.totalAmount || 0) * 0.15,
      0
    ), // Assuming 15% platform fee
  };
  earnings.net = earnings.gross - earnings.platformFees;
  earnings.averageHourlyRate =
    sessionMetrics.totalHours > 0
      ? earnings.gross / sessionMetrics.totalHours
      : 0;

  // Calculate skill performance
  const skillPerformanceMap = new Map();
  sessions.forEach((session) => {
    const skillId = session.skill._id.toString();
    if (!skillPerformanceMap.has(skillId)) {
      skillPerformanceMap.set(skillId, {
        skill: session.skill._id,
        sessionsCount: 0,
        hoursTeaching: 0,
        totalRating: 0,
        ratingCount: 0,
        students: new Set(),
        earnings: 0,
        completed: 0,
      });
    }

    const skillData = skillPerformanceMap.get(skillId);
    skillData.sessionsCount++;
    skillData.hoursTeaching +=
      (session.actualDuration || session.duration) / 60;
    skillData.students.add(session.learner._id.toString());
    skillData.earnings += session.pricing?.totalAmount || 0;

    if (session.status === "completed") {
      skillData.completed++;
      if (session.feedback?.learner?.rating) {
        skillData.totalRating += session.feedback.learner.rating;
        skillData.ratingCount++;
      }
    }
  });

  const skillPerformance = Array.from(skillPerformanceMap.values()).map(
    (skill) => ({
      skill: skill.skill,
      sessionsCount: skill.sessionsCount,
      hoursTeaching: skill.hoursTeaching,
      averageRating:
        skill.ratingCount > 0 ? skill.totalRating / skill.ratingCount : 0,
      studentsCount: skill.students.size,
      earnings: skill.earnings,
      completionRate:
        skill.sessionsCount > 0 ? skill.completed / skill.sessionsCount : 0,
    })
  );

  // Create analytics document
  const analytics = {
    tutor: tutorId,
    period: {
      type: periodType,
      startDate,
      endDate,
      year: startDate.getFullYear(),
      month: startDate.getMonth() + 1,
    },
    sessionMetrics,
    studentMetrics,
    ratings,
    earnings,
    skillPerformance,
    metadata: {
      lastCalculated: new Date(),
      dataQuality: "complete",
    },
  };

  return analytics;
};

// Instance method to generate insights
TeachingAnalyticsSchema.methods.generateInsights = function () {
  const insights = [];

  // Session completion insight
  if (this.sessionMetrics.completionRate < 0.8) {
    insights.push({
      type: "warning",
      category: "sessions",
      message: `Your session completion rate is ${(
        this.sessionMetrics.completionRate * 100
      ).toFixed(1)}%. Consider reviewing your scheduling practices.`,
    });
  }

  // Rating insight
  if (this.ratings.overall.average >= 4.5) {
    insights.push({
      type: "success",
      category: "ratings",
      message: `Excellent work! Your average rating of ${this.ratings.overall.average.toFixed(
        1
      )} puts you in the top tier of tutors.`,
    });
  }

  // Earnings insight
  if (this.growth.earningsGrowth > 0) {
    insights.push({
      type: "success",
      category: "earnings",
      message: `Your earnings grew by ${this.growth.earningsGrowth.toFixed(
        1
      )}% this period!`,
    });
  }

  // Schedule utilization
  if (this.scheduleMetrics.utilizationRate < 0.5) {
    insights.push({
      type: "tip",
      category: "schedule",
      message: `Your schedule utilization is ${(
        this.scheduleMetrics.utilizationRate * 100
      ).toFixed(
        1
      )}%. Consider adding more availability or promoting your profile.`,
    });
  }

  return insights;
};

const TeachingAnalytics = mongoose.model(
  "TeachingAnalytics",
  TeachingAnalyticsSchema
);

module.exports = TeachingAnalytics;
