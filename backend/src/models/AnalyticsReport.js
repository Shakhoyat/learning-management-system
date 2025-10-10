const mongoose = require("mongoose");

/**
 * Analytics Report Model
 * Generates comprehensive reports for tutors, learners, and administrators
 * Supports various report types and formats
 */
const AnalyticsReportSchema = new mongoose.Schema(
  {
    // Report Identification
    reportId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,

    // Report Type
    type: {
      type: String,
      enum: [
        "teaching_performance",
        "learning_progress",
        "financial",
        "student_outcomes",
        "engagement",
        "skills_analysis",
        "comparative",
        "platform_overview",
        "custom",
      ],
      required: true,
    },

    // Scope
    scope: {
      type: {
        type: String,
        enum: ["individual", "skill", "category", "platform"],
        required: true,
      },
      targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      targetSkill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
      targetCategory: String,
    },

    // Time Period
    period: {
      type: {
        type: String,
        enum: ["daily", "weekly", "monthly", "quarterly", "yearly", "custom"],
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
      comparisonPeriod: {
        startDate: Date,
        endDate: Date,
      },
    },

    // Report Data - Teaching Performance
    teachingPerformance: {
      summary: {
        totalSessions: Number,
        completedSessions: Number,
        totalHours: Number,
        totalStudents: Number,
        averageRating: Number,
        grossEarnings: Number,
        netEarnings: Number,
      },
      sessionBreakdown: {
        byStatus: [
          {
            status: String,
            count: Number,
            percentage: Number,
          },
        ],
        bySkill: [
          {
            skill: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Skill",
            },
            sessionsCount: Number,
            hours: Number,
            earnings: Number,
          },
        ],
        byDay: [
          {
            day: String,
            count: Number,
          },
        ],
      },
      studentMetrics: {
        new: Number,
        returning: Number,
        retentionRate: Number,
        satisfactionScore: Number,
        outcomesAchieved: Number,
      },
      ratings: {
        overall: Number,
        breakdown: {
          communication: Number,
          knowledge: Number,
          punctuality: Number,
          effectiveness: Number,
        },
        trend: [
          {
            date: Date,
            rating: Number,
          },
        ],
      },
      growth: {
        sessionsGrowth: Number,
        studentsGrowth: Number,
        earningsGrowth: Number,
        ratingGrowth: Number,
      },
    },

    // Report Data - Learning Progress
    learningProgress: {
      summary: {
        totalSessions: Number,
        completedSessions: Number,
        totalHours: Number,
        skillsInProgress: Number,
        skillsCompleted: Number,
        averageProgress: Number,
        totalInvested: Number,
      },
      skillBreakdown: [
        {
          skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
          },
          currentLevel: Number,
          targetLevel: Number,
          progress: Number,
          hoursLearned: Number,
          sessionsCount: Number,
          lastSession: Date,
        },
      ],
      performance: {
        assessmentsCompleted: Number,
        averageScore: Number,
        passRate: Number,
        improvementRate: Number,
      },
      engagement: {
        streakDays: Number,
        loginFrequency: String,
        avgSessionsPerWeek: Number,
        engagementScore: Number,
      },
      tutorFeedback: [
        {
          tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          sessionsCount: Number,
          averageRating: Number,
          keyFeedback: [String],
        },
      ],
    },

    // Report Data - Financial
    financial: {
      summary: {
        totalRevenue: Number,
        totalExpenses: Number,
        netIncome: Number,
        platformFees: Number,
        processingFees: Number,
      },
      revenue: {
        byMonth: [
          {
            month: String,
            amount: Number,
          },
        ],
        bySkill: [
          {
            skill: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Skill",
            },
            amount: Number,
            percentage: Number,
          },
        ],
        byStudent: [
          {
            student: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            amount: Number,
            sessionsCount: Number,
          },
        ],
      },
      expenses: {
        total: Number,
        breakdown: [
          {
            category: String,
            amount: Number,
            percentage: Number,
          },
        ],
      },
      projections: {
        nextMonth: Number,
        nextQuarter: Number,
        yearEnd: Number,
      },
      growth: {
        monthOverMonth: Number,
        quarterOverQuarter: Number,
        yearOverYear: Number,
      },
    },

    // Report Data - Student Outcomes
    studentOutcomes: {
      summary: {
        totalStudents: Number,
        studentsImproved: Number,
        averageImprovement: Number,
        goalsAchieved: Number,
        satisfactionRate: Number,
      },
      outcomesBreakdown: [
        {
          student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
          },
          initialLevel: Number,
          currentLevel: Number,
          improvement: Number,
          sessionsCompleted: Number,
          goalAchieved: Boolean,
        },
      ],
      skillImpact: [
        {
          skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
          },
          studentsCount: Number,
          averageImprovement: Number,
          successRate: Number,
        },
      ],
    },

    // Report Data - Engagement
    engagement: {
      summary: {
        activeUsers: Number,
        totalSessions: Number,
        averageSessionDuration: Number,
        messagesExchanged: Number,
        materialsShared: Number,
      },
      userActivity: {
        daily: [
          {
            date: Date,
            activeUsers: Number,
            sessions: Number,
          },
        ],
        byHour: [
          {
            hour: Number,
            count: Number,
          },
        ],
        byDay: [
          {
            day: String,
            count: Number,
          },
        ],
      },
      retention: {
        weeklyRetention: Number,
        monthlyRetention: Number,
        churnRate: Number,
      },
    },

    // Insights and Recommendations
    insights: [
      {
        type: {
          type: String,
          enum: ["success", "warning", "tip", "alert", "info"],
        },
        category: String,
        title: String,
        description: String,
        priority: {
          type: String,
          enum: ["high", "medium", "low"],
        },
        actionable: Boolean,
        recommendedAction: String,
      },
    ],

    // Key Performance Indicators
    kpis: [
      {
        name: String,
        value: mongoose.Schema.Types.Mixed,
        unit: String,
        trend: {
          type: String,
          enum: ["up", "down", "stable"],
        },
        changePercentage: Number,
        target: mongoose.Schema.Types.Mixed,
        status: {
          type: String,
          enum: ["on_track", "at_risk", "off_track", "exceeded"],
        },
      },
    ],

    // Charts and Visualizations
    visualizations: [
      {
        type: {
          type: String,
          enum: [
            "line_chart",
            "bar_chart",
            "pie_chart",
            "area_chart",
            "scatter_plot",
            "heatmap",
          ],
        },
        title: String,
        data: mongoose.Schema.Types.Mixed,
        config: mongoose.Schema.Types.Mixed,
      },
    ],

    // Comparative Analysis
    comparison: {
      enabled: {
        type: Boolean,
        default: false,
      },
      previousPeriod: mongoose.Schema.Types.Mixed,
      percentageChanges: mongoose.Schema.Types.Mixed,
      benchmark: {
        type: String,
        enum: [
          "platform_average",
          "category_average",
          "top_performers",
          "custom",
        ],
      },
      benchmarkData: mongoose.Schema.Types.Mixed,
    },

    // Report Metadata
    metadata: {
      generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      generatedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["generating", "completed", "failed", "scheduled"],
        default: "generating",
      },
      format: {
        type: String,
        enum: ["json", "pdf", "excel", "csv"],
        default: "json",
      },
      fileUrl: String,
      expiresAt: Date,
      isScheduled: {
        type: Boolean,
        default: false,
      },
      scheduleConfig: {
        frequency: {
          type: String,
          enum: ["daily", "weekly", "monthly", "quarterly"],
        },
        recipients: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        nextRun: Date,
      },
    },

    // Access Control
    access: {
      visibility: {
        type: String,
        enum: ["private", "shared", "public"],
        default: "private",
      },
      sharedWith: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          permissions: {
            type: String,
            enum: ["view", "edit", "admin"],
            default: "view",
          },
          sharedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },

    // Report Configuration
    config: {
      includeCharts: {
        type: Boolean,
        default: true,
      },
      includeInsights: {
        type: Boolean,
        default: true,
      },
      includeComparison: {
        type: Boolean,
        default: false,
      },
      customFilters: mongoose.Schema.Types.Mixed,
      customMetrics: [String],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
AnalyticsReportSchema.index({ reportId: 1 });
AnalyticsReportSchema.index({ "scope.targetUser": 1, type: 1 });
AnalyticsReportSchema.index({ type: 1, "period.startDate": -1 });
AnalyticsReportSchema.index({ "metadata.generatedAt": -1 });
AnalyticsReportSchema.index({ "metadata.status": 1 });

// Virtual for report duration
AnalyticsReportSchema.virtual("duration").get(function () {
  const start = new Date(this.period.startDate);
  const end = new Date(this.period.endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return days;
});

// Static method to generate report ID
AnalyticsReportSchema.statics.generateReportId = function () {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `RPT-${timestamp}-${randomStr}`.toUpperCase();
};

// Static method to create teaching performance report
AnalyticsReportSchema.statics.createTeachingPerformanceReport = async function (
  tutorId,
  startDate,
  endDate
) {
  const TeachingAnalytics = mongoose.model("TeachingAnalytics");

  // Get analytics data
  const analytics = await TeachingAnalytics.findOne({
    tutor: tutorId,
    "period.startDate": { $lte: startDate },
    "period.endDate": { $gte: endDate },
  });

  if (!analytics) {
    throw new Error("Analytics data not found for the specified period");
  }

  const report = new this({
    reportId: this.generateReportId(),
    title: `Teaching Performance Report`,
    type: "teaching_performance",
    scope: {
      type: "individual",
      targetUser: tutorId,
    },
    period: {
      type: "custom",
      startDate,
      endDate,
    },
    teachingPerformance: {
      summary: {
        totalSessions: analytics.sessionMetrics.total,
        completedSessions: analytics.sessionMetrics.completed,
        totalHours: analytics.sessionMetrics.totalHours,
        totalStudents: analytics.studentMetrics.totalStudents,
        averageRating: analytics.ratings.overall.average,
        grossEarnings: analytics.earnings.gross,
        netEarnings: analytics.earnings.net,
      },
      ratings: {
        overall: analytics.ratings.overall.average,
        breakdown: analytics.ratings.categories,
      },
      growth: analytics.growth,
    },
    metadata: {
      status: "completed",
    },
  });

  await report.save();
  return report;
};

// Method to generate insights
AnalyticsReportSchema.methods.generateInsights = function () {
  const insights = [];

  // Teaching performance insights
  if (this.teachingPerformance) {
    const { summary, growth } = this.teachingPerformance;

    if (summary.averageRating >= 4.5) {
      insights.push({
        type: "success",
        category: "performance",
        title: "Excellent Teaching Quality",
        description: `Your average rating of ${summary.averageRating.toFixed(
          1
        )} is outstanding!`,
        priority: "high",
        actionable: false,
      });
    }

    if (growth.earningsGrowth > 20) {
      insights.push({
        type: "success",
        category: "financial",
        title: "Strong Revenue Growth",
        description: `Your earnings grew by ${growth.earningsGrowth.toFixed(
          1
        )}% this period.`,
        priority: "high",
        actionable: false,
      });
    }

    if (summary.completedSessions / summary.totalSessions < 0.8) {
      insights.push({
        type: "warning",
        category: "sessions",
        title: "Session Completion Rate Below Target",
        description: "Consider reviewing your scheduling and availability.",
        priority: "medium",
        actionable: true,
        recommendedAction: "Review and optimize your schedule",
      });
    }
  }

  // Learning progress insights
  if (this.learningProgress) {
    const { summary, performance } = this.learningProgress;

    if (summary.averageProgress >= 0.7) {
      insights.push({
        type: "success",
        category: "progress",
        title: "Great Learning Progress",
        description: `You're ${(summary.averageProgress * 100).toFixed(
          0
        )}% of the way to your goals!`,
        priority: "high",
        actionable: false,
      });
    }

    if (performance.averageScore >= 85) {
      insights.push({
        type: "success",
        category: "performance",
        title: "Excellent Assessment Performance",
        description: `Your average assessment score is ${performance.averageScore.toFixed(
          1
        )}%`,
        priority: "high",
        actionable: false,
      });
    }
  }

  this.insights = insights;
  return insights;
};

const AnalyticsReport = mongoose.model(
  "AnalyticsReport",
  AnalyticsReportSchema
);

module.exports = AnalyticsReport;
