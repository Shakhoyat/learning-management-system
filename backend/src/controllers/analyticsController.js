const TeachingAnalytics = require("../models/TeachingAnalytics");
const LearningAnalytics = require("../models/LearningAnalytics");
const { Assessment, AssessmentAttempt } = require("../models/Assessment");
const AnalyticsReport = require("../models/AnalyticsReport");
const User = require("../models/User");
const Session = require("../models/Session");
const StudentEngagement = require("../models/StudentEngagement");
const StudentPerformance = require("../models/StudentPerformance");
const AttendanceAssignment = require("../models/AttendanceAssignment");
const mongoose = require("mongoose");
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

/**
 * Get leaderboard with peer comparison
 * GET /api/analytics/leaderboard
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      scope = "global",
      category,
      skillId,
      timeframe = "all-time",
      limit = 20,
    } = req.query;

    // Calculate date range based on timeframe
    let startDate = null;
    if (timeframe !== "all-time") {
      startDate = new Date();
      switch (timeframe) {
        case "weekly":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "monthly":
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case "yearly":
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }
    }

    // Build base query for learner users
    const baseQuery = {
      role: "learner",
      "privacySettings.showInLeaderboard": { $ne: false }, // Respect privacy settings
    };

    // Get all learners with their analytics data
    const learners = await User.find(baseQuery)
      .select("name email avatar reputation learningSkills privacySettings")
      .lean();

    // Calculate scores for each learner
    const leaderboardData = await Promise.all(
      learners.map(async (learner) => {
        let analytics;

        // Get learning analytics based on timeframe
        if (timeframe === "all-time") {
          // Aggregate from all analytics
          const allAnalytics = await LearningAnalytics.find({
            learner: learner._id,
          });

          if (allAnalytics.length === 0) {
            analytics = null;
          } else {
            // Aggregate data
            analytics = {
              sessionMetrics: {
                total: allAnalytics.reduce(
                  (sum, a) => sum + (a.sessionMetrics?.total || 0),
                  0
                ),
                completed: allAnalytics.reduce(
                  (sum, a) => sum + (a.sessionMetrics?.completed || 0),
                  0
                ),
                totalHours: allAnalytics.reduce(
                  (sum, a) => sum + (a.sessionMetrics?.totalHours || 0),
                  0
                ),
              },
              learningProgress: {
                skillsCompleted: allAnalytics.reduce(
                  (sum, a) => sum + (a.learningProgress?.skillsCompleted || 0),
                  0
                ),
                averageProgress:
                  allAnalytics.reduce(
                    (sum, a) =>
                      sum + (a.learningProgress?.averageProgress || 0),
                    0
                  ) / allAnalytics.length,
              },
              gamification: {
                totalPoints: allAnalytics.reduce(
                  (sum, a) => sum + (a.gamification?.totalPoints || 0),
                  0
                ),
                currentLevel:
                  Math.max(
                    ...allAnalytics.map(
                      (a) => a.gamification?.currentLevel || 0
                    )
                  ) || 0,
                badgesEarned: [
                  ...new Set(
                    allAnalytics.flatMap(
                      (a) => a.gamification?.badgesEarned || []
                    )
                  ),
                ].length,
              },
            };
          }
        } else {
          // Get most recent analytics within timeframe
          analytics = await LearningAnalytics.findOne({
            learner: learner._id,
            "period.startDate": { $gte: startDate },
          }).sort({ "period.endDate": -1 });
        }

        // Calculate overall score
        const totalPoints = analytics?.gamification?.totalPoints || 0;
        const totalHours = analytics?.sessionMetrics?.totalHours || 0;
        const skillsCompleted =
          analytics?.learningProgress?.skillsCompleted || 0;
        const averageProgress =
          analytics?.learningProgress?.averageProgress || 0;
        const level = analytics?.gamification?.currentLevel || 0;
        const badges = analytics?.gamification?.badgesEarned || 0;

        // Weighted scoring algorithm
        const score =
          totalPoints * 1.0 +
          totalHours * 2.0 +
          skillsCompleted * 50 +
          averageProgress * 100 +
          level * 30 +
          badges * 20;

        return {
          userId: learner._id.toString(),
          displayName: `Learner #${learner._id.toString().slice(-4)}`, // Anonymized
          avatar: learner.avatar,
          totalPoints,
          level,
          skillsCompleted,
          hoursLearned: Math.round(totalHours * 10) / 10,
          averageProgress: Math.round(averageProgress * 100),
          badges,
          score,
          isCurrentUser: learner._id.toString() === userId.toString(),
        };
      })
    );

    // Filter by category or skill if specified
    let filteredData = leaderboardData;
    if (scope === "category" && category) {
      filteredData = leaderboardData.filter((entry) => {
        const learner = learners.find((l) => l._id.toString() === entry.userId);
        const hasCategory = learner.learningSkills.some(
          (skill) => skill.skillId?.category === category
        );
        return hasCategory;
      });
    } else if (scope === "skill" && skillId) {
      filteredData = leaderboardData.filter((entry) => {
        const learner = learners.find((l) => l._id.toString() === entry.userId);
        const hasSkill = learner.learningSkills.some(
          (skill) => skill.skillId?.toString() === skillId
        );
        return hasSkill;
      });
    }

    // Sort by score (descending)
    filteredData.sort((a, b) => b.score - a.score);

    // Add ranks
    filteredData.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Find user's entry
    const userEntry = filteredData.find((entry) => entry.isCurrentUser);
    const userRank = userEntry ? userEntry.rank : filteredData.length + 1;
    const totalUsers = filteredData.length;
    const percentile =
      totalUsers > 0
        ? Math.round(((totalUsers - userRank + 1) / totalUsers) * 100)
        : 0;

    // Get top N users
    const topUsers = filteredData.slice(0, parseInt(limit));

    // Get nearby users (5 above and 5 below current user)
    let nearbyUsers = [];
    if (userEntry) {
      const startIndex = Math.max(0, userRank - 6);
      const endIndex = Math.min(filteredData.length, userRank + 5);
      nearbyUsers = filteredData.slice(startIndex, endIndex);
    }

    // Get category leaderboards for current user
    const categoryLeaderboards = {};
    if (userEntry) {
      const user = await User.findById(userId).populate(
        "learningSkills.skillId",
        "category"
      );
      const categories = [
        ...new Set(
          user.learningSkills
            .map((skill) => skill.skillId?.category)
            .filter(Boolean)
        ),
      ];

      for (const cat of categories) {
        const categoryData = leaderboardData.filter((entry) => {
          const learner = learners.find(
            (l) => l._id.toString() === entry.userId
          );
          return learner.learningSkills.some(
            (skill) => skill.skillId?.category === cat
          );
        });
        categoryData.sort((a, b) => b.score - a.score);
        const catRank =
          categoryData.findIndex((entry) => entry.isCurrentUser) + 1;
        categoryLeaderboards[cat] = {
          rank: catRank || categoryData.length + 1,
          totalUsers: categoryData.length,
        };
      }
    }

    res.json({
      success: true,
      leaderboard: {
        userRank,
        totalUsers,
        percentile,
        scope,
        timeframe,
        topUsers: topUsers.map((user) => ({
          ...user,
          userId: undefined, // Remove actual userId for privacy
          isCurrentUser: undefined,
          score: undefined, // Hide score calculation
        })),
        userEntry: userEntry
          ? {
              rank: userEntry.rank,
              totalPoints: userEntry.totalPoints,
              level: userEntry.level,
              skillsCompleted: userEntry.skillsCompleted,
              hoursLearned: userEntry.hoursLearned,
              averageProgress: userEntry.averageProgress,
              badges: userEntry.badges,
            }
          : null,
        nearbyUsers: nearbyUsers.map((user) => ({
          ...user,
          userId: undefined,
          score: undefined,
        })),
        categoryLeaderboards,
      },
    });
  } catch (error) {
    logger.error("Get leaderboard error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve leaderboard",
      message: error.message,
    });
  }
};

/**
 * Get student engagement activity heatmap
 * GET /api/analytics/teaching/engagement-heatmap
 */
exports.getEngagementHeatmap = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, studentId } = req.query;

    // Verify user is a tutor
    const user = await User.findById(userId);
    if (!user || user.role !== "tutor") {
      return res.status(403).json({
        success: false,
        error: "Only tutors can access engagement heatmap",
      });
    }

    // Set default date range (last 30 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get heatmap data
    const heatmapData = await StudentEngagement.getActivityHeatmap(
      userId,
      start,
      end
    );

    // If specific student requested, get their individual data
    let studentSpecificData = null;
    if (studentId) {
      const studentActivities = await StudentEngagement.find({
        tutor: userId,
        student: studentId,
        activityDate: { $gte: start, $lte: end },
      })
        .populate("student", "name email")
        .sort({ activityDate: -1 });

      studentSpecificData = {
        student: studentActivities[0]?.student,
        totalActivities: studentActivities.length,
        averageEngagement:
          studentActivities.reduce((sum, a) => sum + a.engagementScore, 0) /
            studentActivities.length || 0,
        recentActivities: studentActivities.slice(0, 10).map((a) => ({
          date: a.activityDate,
          dayOfWeek: a.dayOfWeek,
          hour: a.hourOfDay,
          engagementScore: a.engagementScore,
          activities: a.activities,
          duration: a.durationMinutes,
        })),
      };
    }

    res.json({
      success: true,
      data: {
        heatmap: heatmapData.heatmapData,
        summary: heatmapData.summary,
        studentData: studentSpecificData,
        dateRange: {
          start,
          end,
        },
      },
    });
  } catch (error) {
    logger.error("Get engagement heatmap error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve engagement heatmap",
      message: error.message,
    });
  }
};

/**
 * Get student performance score distribution
 * GET /api/analytics/teaching/score-distribution
 */
exports.getScoreDistribution = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      startDate,
      endDate,
      category = "overall",
      binSize = 10,
    } = req.query;

    // Verify user is a tutor
    const user = await User.findById(userId);
    if (!user || user.role !== "tutor") {
      return res.status(403).json({
        success: false,
        error: "Only tutors can access score distribution",
      });
    }

    // Set default date range (last 90 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Get distribution data
    const distributionData = await StudentPerformance.getScoreDistribution(
      userId,
      {
        startDate: start,
        endDate: end,
        category,
        binSize: parseInt(binSize),
      }
    );

    // Get grade distribution summary
    const allScores = await StudentPerformance.find({
      tutor: userId,
      recordDate: { $gte: start, $lte: end },
    }).select("score.grade");

    const gradeDistribution = allScores.reduce((acc, record) => {
      const grade = record.score.grade;
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        histogram: distributionData.histogram,
        statistics: distributionData.statistics,
        gradeDistribution,
        outliers: distributionData.outliers,
        insights: distributionData.insights,
        dateRange: {
          start,
          end,
        },
        category,
      },
    });
  } catch (error) {
    logger.error("Get score distribution error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve score distribution",
      message: error.message,
    });
  }
};

/**
 * Get attendance and assignment calendar heatmap
 * GET /api/analytics/teaching/calendar-heatmap
 */
exports.getCalendarHeatmap = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, studentId } = req.query;

    // Verify user is a tutor
    const user = await User.findById(userId);
    if (!user || user.role !== "tutor") {
      return res.status(403).json({
        success: false,
        error: "Only tutors can access calendar heatmap",
      });
    }

    // Set default date range (last 6 months)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 180 * 24 * 60 * 60 * 1000);

    // Get calendar heatmap data
    const calendarData = await AttendanceAssignment.getCalendarHeatmap(userId, {
      startDate: start,
      endDate: end,
      studentId: studentId || null,
    });

    // Get monthly summary
    const monthlySummary = await AttendanceAssignment.aggregate([
      {
        $match: {
          tutor: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          avgConsistency: { $avg: "$dailyMetrics.consistencyScore" },
          totalDays: { $sum: 1 },
          daysPresent: {
            $sum: { $cond: ["$attendance.present", 1, 0] },
          },
          assignmentsSubmitted: {
            $sum: "$dailyMetrics.assignmentsSubmitted",
          },
          assignmentsDue: { $sum: "$dailyMetrics.assignmentsDue" },
        },
      },
      {
        $project: {
          year: "$_id.year",
          month: "$_id.month",
          avgConsistency: { $round: ["$avgConsistency", 1] },
          totalDays: 1,
          attendanceRate: {
            $round: [
              { $multiply: [{ $divide: ["$daysPresent", "$totalDays"] }, 100] },
              1,
            ],
          },
          submissionRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$assignmentsSubmitted", "$assignmentsDue"] },
                  100,
                ],
              },
              1,
            ],
          },
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        heatmap: calendarData.heatmapData,
        statistics: calendarData.statistics,
        weeklyStats: calendarData.weeklyStats,
        monthlySummary,
        insights: calendarData.insights,
        dateRange: {
          start,
          end,
        },
      },
    });
  } catch (error) {
    logger.error("Get calendar heatmap error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve calendar heatmap",
      message: error.message,
    });
  }
};

module.exports = exports;
