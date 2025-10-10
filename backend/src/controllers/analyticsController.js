const TeachingAnalytics = require("../models/TeachingAnalytics");
const LearningAnalytics = require("../models/LearningAnalytics");
const { Assessment, AssessmentAttempt } = require("../models/Assessment");
const AnalyticsReport = require("../models/AnalyticsReport");
const User = require("../models/User");
const Session = require("../models/Session");
const logger = require("../utils/logger");

/**
 * Get detailed teaching analytics for a tutor
 * GET /api/analytics/teaching
 */
exports.getTeachingAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      period = "monthly",
      startDate,
      endDate,
      includePrevious = false,
    } = req.query;

    // Verify user is a tutor
    const user = await User.findById(userId);
    if (!user || user.role !== "tutor") {
      return res.status(403).json({
        success: false,
        error: "Only tutors can access teaching analytics",
      });
    }

    // Calculate date range
    let periodStart, periodEnd;
    if (startDate && endDate) {
      periodStart = new Date(startDate);
      periodEnd = new Date(endDate);
    } else {
      periodEnd = new Date();
      periodStart = new Date();

      switch (period) {
        case "daily":
          periodStart.setDate(periodStart.getDate() - 1);
          break;
        case "weekly":
          periodStart.setDate(periodStart.getDate() - 7);
          break;
        case "monthly":
        default:
          periodStart.setMonth(periodStart.getMonth() - 1);
          break;
        case "quarterly":
          periodStart.setMonth(periodStart.getMonth() - 3);
          break;
        case "yearly":
          periodStart.setFullYear(periodStart.getFullYear() - 1);
          break;
      }
    }

    // Get or calculate analytics
    let analytics = await TeachingAnalytics.findOne({
      tutor: userId,
      "period.startDate": { $lte: periodStart },
      "period.endDate": { $gte: periodEnd },
    }).populate("skillPerformance.skill", "name category");

    // If no analytics found, calculate them
    if (!analytics) {
      logger.info(`Calculating teaching analytics for user ${userId}`);
      const analyticsData = await TeachingAnalytics.calculateForTutor(
        userId,
        period,
        periodStart,
        periodEnd
      );
      analytics = new TeachingAnalytics(analyticsData);
      await analytics.save();
    }

    // Get previous period for comparison if requested
    let previousAnalytics = null;
    if (includePrevious) {
      const prevPeriodEnd = new Date(periodStart);
      const prevPeriodStart = new Date(prevPeriodEnd);
      const daysDiff = Math.ceil(
        (periodEnd - periodStart) / (1000 * 60 * 60 * 24)
      );
      prevPeriodStart.setDate(prevPeriodStart.getDate() - daysDiff);

      previousAnalytics = await TeachingAnalytics.findOne({
        tutor: userId,
        "period.startDate": { $lte: prevPeriodStart },
        "period.endDate": { $gte: prevPeriodEnd },
      });

      if (!previousAnalytics) {
        const prevData = await TeachingAnalytics.calculateForTutor(
          userId,
          period,
          prevPeriodStart,
          prevPeriodEnd
        );
        previousAnalytics = new TeachingAnalytics(prevData);
        await previousAnalytics.save();
      }
    }

    // Generate insights
    const insights = analytics.generateInsights();

    res.json({
      success: true,
      analytics: {
        current: analytics,
        previous: previousAnalytics,
        insights,
        period: {
          type: period,
          startDate: periodStart,
          endDate: periodEnd,
        },
      },
    });
  } catch (error) {
    logger.error("Get teaching analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve teaching analytics",
      message: error.message,
    });
  }
};

/**
 * Get detailed learning analytics for a learner
 * GET /api/analytics/learning
 */
exports.getLearningAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      period = "monthly",
      startDate,
      endDate,
      includePrevious = false,
    } = req.query;

    // Verify user is a learner
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Calculate date range
    let periodStart, periodEnd;
    if (startDate && endDate) {
      periodStart = new Date(startDate);
      periodEnd = new Date(endDate);
    } else {
      periodEnd = new Date();
      periodStart = new Date();

      switch (period) {
        case "daily":
          periodStart.setDate(periodStart.getDate() - 1);
          break;
        case "weekly":
          periodStart.setDate(periodStart.getDate() - 7);
          break;
        case "monthly":
        default:
          periodStart.setMonth(periodStart.getMonth() - 1);
          break;
        case "quarterly":
          periodStart.setMonth(periodStart.getMonth() - 3);
          break;
        case "yearly":
          periodStart.setFullYear(periodStart.getFullYear() - 1);
          break;
      }
    }

    // Get or calculate analytics
    let analytics = await LearningAnalytics.findOne({
      learner: userId,
      "period.startDate": { $lte: periodStart },
      "period.endDate": { $gte: periodEnd },
    }).populate("skillProgress.skill", "name category difficulty");

    // If no analytics found, calculate them
    if (!analytics) {
      logger.info(`Calculating learning analytics for user ${userId}`);
      const analyticsData = await LearningAnalytics.calculateForLearner(
        userId,
        period,
        periodStart,
        periodEnd
      );
      analytics = new LearningAnalytics(analyticsData);
      await analytics.save();
    }

    // Get previous period for comparison if requested
    let previousAnalytics = null;
    if (includePrevious) {
      const prevPeriodEnd = new Date(periodStart);
      const prevPeriodStart = new Date(prevPeriodEnd);
      const daysDiff = Math.ceil(
        (periodEnd - periodStart) / (1000 * 60 * 60 * 24)
      );
      prevPeriodStart.setDate(prevPeriodStart.getDate() - daysDiff);

      previousAnalytics = await LearningAnalytics.findOne({
        learner: userId,
        "period.startDate": { $lte: prevPeriodStart },
        "period.endDate": { $gte: prevPeriodEnd },
      });

      if (!previousAnalytics) {
        const prevData = await LearningAnalytics.calculateForLearner(
          userId,
          period,
          prevPeriodStart,
          prevPeriodEnd
        );
        previousAnalytics = new LearningAnalytics(prevData);
        await previousAnalytics.save();
      }
    }

    // Generate insights
    const insights = analytics.generateInsights();

    res.json({
      success: true,
      analytics: {
        current: analytics,
        previous: previousAnalytics,
        insights,
        period: {
          type: period,
          startDate: periodStart,
          endDate: periodEnd,
        },
      },
    });
  } catch (error) {
    logger.error("Get learning analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve learning analytics",
      message: error.message,
    });
  }
};

/**
 * Get analytics overview (auto-detects role)
 * GET /api/analytics/overview
 */
exports.getAnalyticsOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const { period = "monthly" } = req.query;

    // Get analytics based on role
    if (user.role === "tutor") {
      return exports.getTeachingAnalytics(req, res);
    } else {
      return exports.getLearningAnalytics(req, res);
    }
  } catch (error) {
    logger.error("Get analytics overview error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve analytics overview",
    });
  }
};

/**
 * Get analytics history (multiple periods)
 * GET /api/analytics/history
 */
exports.getAnalyticsHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { periods = 6, periodType = "monthly" } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const Model = user.role === "tutor" ? TeachingAnalytics : LearningAnalytics;
    const userField = user.role === "tutor" ? "tutor" : "learner";

    // Get historical analytics
    const history = await Model.find({
      [userField]: userId,
      "period.type": periodType,
    })
      .sort({ "period.startDate": -1 })
      .limit(parseInt(periods))
      .populate(
        user.role === "tutor"
          ? "skillPerformance.skill"
          : "skillProgress.skill",
        "name category"
      );

    res.json({
      success: true,
      history,
      metadata: {
        periods: history.length,
        periodType,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Get analytics history error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve analytics history",
    });
  }
};

/**
 * Get assessment analytics
 * GET /api/analytics/assessments
 */
exports.getAssessmentAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skillId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Get student performance
    const performance = await AssessmentAttempt.getStudentPerformance(
      userId,
      skillId
    );

    // Get recent attempts with details
    const recentAttempts = await AssessmentAttempt.find({
      student: userId,
      status: { $in: ["graded", "submitted"] },
    })
      .populate("assessment", "title type config.difficulty")
      .sort({ submittedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      assessmentAnalytics: {
        performance,
        recentAttempts,
      },
    });
  } catch (error) {
    logger.error("Get assessment analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve assessment analytics",
    });
  }
};

/**
 * Generate analytics report
 * POST /api/analytics/reports
 */
exports.generateReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, period, startDate, endDate, format = "json" } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    let report;

    // Generate report based on type
    if (type === "teaching_performance" && user.role === "tutor") {
      report = await AnalyticsReport.createTeachingPerformanceReport(
        userId,
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      // Create custom report
      const reportId = AnalyticsReport.generateReportId();
      report = new AnalyticsReport({
        reportId,
        title: `${type.replace("_", " ").toUpperCase()} Report`,
        type,
        scope: {
          type: "individual",
          targetUser: userId,
        },
        period: {
          type: period || "custom",
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
        metadata: {
          generatedBy: userId,
          format,
          status: "completed",
        },
      });
      await report.save();
    }

    // Generate insights
    const insights = report.generateInsights();
    report.insights = insights;
    await report.save();

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    logger.error("Generate report error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate report",
      message: error.message,
    });
  }
};

/**
 * Get existing reports
 * GET /api/analytics/reports
 */
exports.getReports = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, limit = 10 } = req.query;

    const query = {
      "scope.targetUser": userId,
    };

    if (type) {
      query.type = type;
    }

    const reports = await AnalyticsReport.find(query)
      .sort({ "metadata.generatedAt": -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    logger.error("Get reports error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve reports",
    });
  }
};

/**
 * Get single report by ID
 * GET /api/analytics/reports/:reportId
 */
exports.getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user._id;

    const report = await AnalyticsReport.findOne({
      reportId,
      "scope.targetUser": userId,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found",
      });
    }

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    logger.error("Get report by ID error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve report",
    });
  }
};

module.exports = exports;
