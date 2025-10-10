const User = require("../models/User");
const Skill = require("../models/Skill");
const Session = require("../models/Session");
const logger = require("../utils/logger");
const { PAGINATION } = require("../config/constants");

// Get all users with filtering and pagination
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      role,
      skills,
      location,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = { "auth.isActive": true };

    if (role) {
      query.role = role;
    }

    if (skills) {
      const skillIds = skills.split(",");
      query.$or = [
        { "teachingSkills.skillId": { $in: skillIds } },
        { "learningSkills.skillId": { $in: skillIds } },
      ];
    }

    if (location) {
      query.$or = [
        { "location.country": new RegExp(location, "i") },
        { "location.city": new RegExp(location, "i") },
      ];
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { bio: new RegExp(search, "i") },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const users = await User.find(query)
      .populate("teachingSkills.skillId", "name category difficulty")
      .populate("learningSkills.skillId", "name category difficulty")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-auth.passwordHash -auth.refreshTokens");

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve users",
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate("teachingSkills.skillId", "name category difficulty")
      .populate("learningSkills.skillId", "name category difficulty")
      .select("-auth.passwordHash -auth.refreshTokens");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if user's profile is public or if requester has permission
    if (
      user.privacySettings.profileVisibility === "private" &&
      (!req.user || req.user._id.toString() !== user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        error: "Profile is private",
      });
    }

    // Get user statistics
    const stats = await getUserStats(id);

    res.json({
      success: true,
      data: {
        user,
        stats,
      },
    });
  } catch (error) {
    logger.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve user",
    });
  }
};

// Update user profile (admin only or own profile)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check permission
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    // Remove sensitive fields
    delete updates.auth;
    delete updates._id;

    // Only admin can change role
    if (updates.role && req.user.role !== "admin") {
      delete updates.role;
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("teachingSkills.skillId", "name category difficulty")
      .populate("learningSkills.skillId", "name category difficulty")
      .select("-auth.passwordHash -auth.refreshTokens");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    logger.info(`User updated: ${user.email} by ${req.user.email}`);

    res.json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    logger.error("Update user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user",
    });
  }
};

// Delete user (admin only or own account)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check permission
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Soft delete - deactivate account
    user.auth.isActive = false;
    await user.save();

    logger.info(`User deactivated: ${user.email} by ${req.user.email}`);

    res.json({
      success: true,
      message: "User account deactivated successfully",
    });
  } catch (error) {
    logger.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete user",
    });
  }
};

// Add teaching skill
exports.addTeachingSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { skillId, level, hourlyRate, availability } = req.body;

    // Check permission
    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: "Skill not found",
      });
    }

    // Check if skill already exists in teaching skills
    const existingSkill = user.teachingSkills.find(
      (ts) => ts.skillId.toString() === skillId
    );

    if (existingSkill) {
      // Update existing skill
      existingSkill.level = level;
      existingSkill.hourlyRate = hourlyRate;
      existingSkill.availability = availability;
    } else {
      // Add new skill
      user.teachingSkills.push({
        skillId,
        level,
        hourlyRate,
        availability,
      });
    }

    await user.save();

    // Update skill statistics
    await updateSkillStats(skillId);

    const populatedUser = await User.findById(id)
      .populate("teachingSkills.skillId", "name category difficulty")
      .select("-auth.passwordHash -auth.refreshTokens");

    res.json({
      success: true,
      message: "Teaching skill added successfully",
      data: { user: populatedUser },
    });
  } catch (error) {
    logger.error("Add teaching skill error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add teaching skill",
    });
  }
};

// Remove teaching skill
exports.removeTeachingSkill = async (req, res) => {
  try {
    const { id, skillId } = req.params;

    // Check permission
    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Remove skill
    user.teachingSkills = user.teachingSkills.filter(
      (ts) => ts.skillId.toString() !== skillId
    );

    await user.save();

    // Update skill statistics
    await updateSkillStats(skillId);

    const populatedUser = await User.findById(id)
      .populate("teachingSkills.skillId", "name category difficulty")
      .select("-auth.passwordHash -auth.refreshTokens");

    res.json({
      success: true,
      message: "Teaching skill removed successfully",
      data: { user: populatedUser },
    });
  } catch (error) {
    logger.error("Remove teaching skill error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove teaching skill",
    });
  }
};

// Add learning skill
exports.addLearningSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { skillId, currentLevel, targetLevel, preferredLearningStyle } =
      req.body;

    // Check permission
    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: "Skill not found",
      });
    }

    // Check if skill already exists in learning skills
    const existingSkill = user.learningSkills.find(
      (ls) => ls.skillId.toString() === skillId
    );

    if (existingSkill) {
      // Update existing skill
      existingSkill.currentLevel = currentLevel;
      existingSkill.targetLevel = targetLevel;
      existingSkill.preferredLearningStyle = preferredLearningStyle;
    } else {
      // Add new skill
      user.learningSkills.push({
        skillId,
        currentLevel,
        targetLevel,
        preferredLearningStyle,
      });
    }

    await user.save();

    // Update skill statistics
    await updateSkillStats(skillId);

    const populatedUser = await User.findById(id)
      .populate("learningSkills.skillId", "name category difficulty")
      .select("-auth.passwordHash -auth.refreshTokens");

    res.json({
      success: true,
      message: "Learning skill added successfully",
      data: { user: populatedUser },
    });
  } catch (error) {
    logger.error("Add learning skill error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add learning skill",
    });
  }
};

// Remove learning skill
exports.removeLearningSkill = async (req, res) => {
  try {
    const { id, skillId } = req.params;

    // Check permission
    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Remove skill
    user.learningSkills = user.learningSkills.filter(
      (ls) => ls.skillId.toString() !== skillId
    );

    await user.save();

    // Update skill statistics
    await updateSkillStats(skillId);

    const populatedUser = await User.findById(id)
      .populate("learningSkills.skillId", "name category difficulty")
      .select("-auth.passwordHash -auth.refreshTokens");

    res.json({
      success: true,
      message: "Learning skill removed successfully",
      data: { user: populatedUser },
    });
  } catch (error) {
    logger.error("Remove learning skill error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove learning skill",
    });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    const stats = await getUserStats(id);

    res.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    logger.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve user statistics",
    });
  }
};

// Helper function to get user statistics
async function getUserStats(userId) {
  try {
    const [sessionStats, teachingStats, learningStats] = await Promise.all([
      Session.getUserStats(userId),
      Session.aggregate([
        {
          $match: {
            tutor: new User.base.Types.ObjectId(userId),
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            totalHours: { $sum: { $divide: ["$actualDuration", 60] } },
            totalEarnings: { $sum: "$pricing.totalAmount" },
            averageRating: { $avg: "$feedback.learner.rating" },
          },
        },
      ]),
      Session.aggregate([
        {
          $match: {
            learner: new User.base.Types.ObjectId(userId),
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            totalHours: { $sum: { $divide: ["$actualDuration", 60] } },
            totalSpent: { $sum: "$pricing.totalAmount" },
            averageRating: { $avg: "$feedback.tutor.rating" },
          },
        },
      ]),
    ]);

    return {
      overall: sessionStats[0] || {
        totalSessions: 0,
        totalHours: 0,
        averageRating: 0,
      },
      teaching: teachingStats[0] || {
        totalSessions: 0,
        totalHours: 0,
        totalEarnings: 0,
        averageRating: 0,
      },
      learning: learningStats[0] || {
        totalSessions: 0,
        totalHours: 0,
        totalSpent: 0,
        averageRating: 0,
      },
    };
  } catch (error) {
    logger.error("Get user stats helper error:", error);
    return {
      overall: { totalSessions: 0, totalHours: 0, averageRating: 0 },
      teaching: {
        totalSessions: 0,
        totalHours: 0,
        totalEarnings: 0,
        averageRating: 0,
      },
      learning: {
        totalSessions: 0,
        totalHours: 0,
        totalSpent: 0,
        averageRating: 0,
      },
    };
  }
}

// Helper function to update skill statistics
async function updateSkillStats(skillId) {
  try {
    const [teacherCount, learnerCount] = await Promise.all([
      User.countDocuments({ "teachingSkills.skillId": skillId }),
      User.countDocuments({ "learningSkills.skillId": skillId }),
    ]);

    await Skill.findByIdAndUpdate(skillId, {
      "stats.totalTeachers": teacherCount,
      "stats.totalLearners": learnerCount,
    });
  } catch (error) {
    logger.error("Update skill stats error:", error);
  }
}

// Get comprehensive user analytics
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { timeframe = "30d", metrics = "learning,teaching,engagement" } =
      req.query;

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate;
    switch (timeframe) {
      case "7d":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "30d":
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case "90d":
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case "1y":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30));
    }

    const requestedMetrics = metrics.split(",");
    const analytics = {
      overview: {},
    };

    // Get user data
    const user = await User.findById(userId)
      .populate("learningSkills.skillId", "name category")
      .populate("teachingSkills.skillId", "name category");

    // Overview stats (always included)
    const [allSessions, completedSessions] = await Promise.all([
      Session.find({
        $or: [{ learner: userId }, { tutor: userId }],
        scheduledStartTime: { $gte: startDate },
      }),
      Session.find({
        $or: [{ learner: userId }, { tutor: userId }],
        status: "completed",
        scheduledStartTime: { $gte: startDate },
      }),
    ]);

    const totalHours = completedSessions.reduce(
      (sum, session) =>
        sum + (session.actualDuration || session.scheduledDuration || 0) / 60,
      0
    );

    const ratings = completedSessions
      .map((s) => s.feedback?.learner?.rating || s.feedback?.tutor?.rating)
      .filter((r) => r);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    analytics.overview = {
      totalSessions: allSessions.length,
      hoursLearned: user.role === "learner" ? totalHours : 0,
      hoursTaught: user.role === "tutor" ? totalHours : 0,
      averageRating: averageRating,
      profileViews: Math.floor(Math.random() * 500) + 100, // Placeholder
    };

    // Learning Progress Metrics
    if (requestedMetrics.includes("learning") && user.role === "learner") {
      const learningSessions = await Session.find({
        learner: userId,
        scheduledStartTime: { $gte: startDate },
      }).populate("skillId", "name category");

      // Calculate skills in progress and completed
      const skillsInProgress = user.learningSkills.filter(
        (ls) => ls.currentLevel < ls.targetLevel
      ).length;
      const skillsCompleted = user.learningSkills.filter(
        (ls) => ls.currentLevel >= ls.targetLevel
      ).length;

      // Calculate average progress
      const totalProgress = user.learningSkills.reduce((sum, ls) => {
        const progress =
          ls.targetLevel > 0 ? ls.currentLevel / ls.targetLevel : 0;
        return sum + progress;
      }, 0);
      const averageProgress =
        user.learningSkills.length > 0
          ? totalProgress / user.learningSkills.length
          : 0;

      // Time spent by category
      const categoryTime = {};
      learningSessions.forEach((session) => {
        const category = session.skillId?.category || "Other";
        const hours =
          (session.actualDuration || session.scheduledDuration || 0) / 60;
        categoryTime[category] = (categoryTime[category] || 0) + hours;
      });

      // Generate progress trend (daily data points)
      const progressTrend = [];
      const daysToShow =
        timeframe === "7d"
          ? 7
          : timeframe === "30d"
          ? 30
          : timeframe === "90d"
          ? 30
          : 365;
      const interval = timeframe === "1y" ? 12 : 1; // Monthly for 1y, daily otherwise

      for (let i = daysToShow - 1; i >= 0; i -= interval) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Simulate progress increase over time (in production, track this in DB)
        const baseProgress = averageProgress * 0.5;
        const progressIncrement =
          averageProgress * 0.5 * ((daysToShow - i) / daysToShow);

        progressTrend.push({
          date: date.toISOString(),
          progress: Math.min(baseProgress + progressIncrement, 1),
        });
      }

      analytics.learningProgress = {
        skillsInProgress,
        skillsCompleted,
        averageProgress,
        timeSpentByCategory: categoryTime,
        progressTrend,
      };
    }

    // Teaching Performance Metrics
    if (requestedMetrics.includes("teaching") && user.role === "tutor") {
      const teachingSessions = await Session.find({
        tutor: userId,
        scheduledStartTime: { $gte: startDate },
      });

      const completedTeachingSessions = teachingSessions.filter(
        (s) => s.status === "completed"
      );

      const completionRate =
        teachingSessions.length > 0
          ? completedTeachingSessions.length / teachingSessions.length
          : 0;

      const sessionRatings = completedTeachingSessions
        .map((s) => s.feedback?.learner?.rating)
        .filter((r) => r);
      const avgSessionRating =
        sessionRatings.length > 0
          ? sessionRatings.reduce((a, b) => a + b, 0) / sessionRatings.length
          : 0;

      // Unique students
      const uniqueStudents = new Set(
        teachingSessions.map((s) => s.learner.toString())
      );

      // Earnings by month
      const earningsByMonth = {};
      completedTeachingSessions.forEach((session) => {
        const month = new Date(session.scheduledStartTime)
          .toISOString()
          .slice(0, 7);
        earningsByMonth[month] =
          (earningsByMonth[month] || 0) + (session.pricing?.totalAmount || 0);
      });

      // Popular skills
      const skillCounts = {};
      teachingSessions.forEach((session) => {
        const skillId = session.skillId?.toString();
        if (skillId) {
          skillCounts[skillId] = (skillCounts[skillId] || 0) + 1;
        }
      });

      const popularSkills = Object.entries(skillCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([skillId, count]) => ({
          skillId,
          sessionCount: count,
        }));

      analytics.teachingPerformance = {
        studentsAcquired: uniqueStudents.size,
        sessionCompletionRate: completionRate,
        averageSessionRating: avgSessionRating,
        earningsByMonth,
        popularSkills,
      };
    }

    // Engagement Metrics
    if (requestedMetrics.includes("engagement")) {
      // Calculate login frequency (simplified - in production track actual logins)
      const lastLogin = user.auth?.lastLogin;
      let loginFrequency = "occasional";
      if (lastLogin) {
        const daysSinceLogin =
          (Date.now() - new Date(lastLogin)) / (1000 * 60 * 60 * 24);
        if (daysSinceLogin < 1) loginFrequency = "daily";
        else if (daysSinceLogin < 7) loginFrequency = "weekly";
        else if (daysSinceLogin < 30) loginFrequency = "monthly";
      }

      // Average session duration
      const avgDuration =
        completedSessions.length > 0
          ? completedSessions.reduce(
              (sum, s) => sum + (s.actualDuration || s.scheduledDuration || 0),
              0
            ) / completedSessions.length
          : 0;

      const avgDurationStr =
        avgDuration > 0
          ? `${Math.floor(avgDuration / 60)}h ${Math.floor(avgDuration % 60)}m`
          : "N/A";

      analytics.engagement = {
        loginFrequency,
        averageSessionDuration: avgDurationStr,
        messagesExchanged: Math.floor(Math.random() * 200) + 50, // Placeholder - implement messaging later
      };
    }

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    logger.error("Get user analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve analytics",
    });
  }
};

// Get learning progress details
exports.getLearningProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "learningSkills.skillId",
      "name category difficulty"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const sessions = await Session.find({
      learner: userId,
      status: "completed",
    });

    const totalHours = sessions.reduce(
      (sum, session) =>
        sum + (session.actualDuration || session.scheduledDuration || 0) / 60,
      0
    );

    const progress = {
      learningSkills: user.learningSkills.map((ls) => ({
        skill: ls.skillId,
        currentLevel: ls.currentLevel,
        targetLevel: ls.targetLevel,
        hoursLearned: ls.hoursLearned,
        progress: ls.targetLevel > 0 ? ls.currentLevel / ls.targetLevel : 0,
      })),
      totalHours,
      totalSessions: sessions.length,
      skillsInProgress: user.learningSkills.filter(
        (ls) => ls.currentLevel < ls.targetLevel
      ).length,
      averageProgress:
        user.learningSkills.length > 0
          ? user.learningSkills.reduce((sum, ls) => {
              const prog =
                ls.targetLevel > 0 ? ls.currentLevel / ls.targetLevel : 0;
              return sum + prog;
            }, 0) / user.learningSkills.length
          : 0,
    };

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    logger.error("Get learning progress error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve learning progress",
    });
  }
};

// Get user achievements
exports.getAchievements = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    const sessions = await Session.find({
      $or: [{ learner: userId }, { tutor: userId }],
      status: "completed",
    });

    const achievements = [];
    const points = sessions.length * 10;

    // Define achievements based on milestones
    if (sessions.length >= 1) {
      achievements.push({
        id: "first_session",
        name: "First Steps",
        description: "Completed your first session",
        earnedAt: sessions[0].scheduledEndTime,
        icon: "🎯",
      });
    }

    if (sessions.length >= 10) {
      achievements.push({
        id: "ten_sessions",
        name: "Dedicated Learner",
        description: "Completed 10 sessions",
        earnedAt: sessions[9].scheduledEndTime,
        icon: "🌟",
      });
    }

    if (sessions.length >= 50) {
      achievements.push({
        id: "fifty_sessions",
        name: "Expert Level",
        description: "Completed 50 sessions",
        earnedAt: sessions[49].scheduledEndTime,
        icon: "🏆",
      });
    }

    const totalHours = sessions.reduce(
      (sum, s) => sum + (s.actualDuration || s.scheduledDuration || 0) / 60,
      0
    );

    if (totalHours >= 100) {
      achievements.push({
        id: "hundred_hours",
        name: "Century Club",
        description: "Completed 100 hours of learning",
        earnedAt: new Date(),
        icon: "💯",
      });
    }

    // Calculate level based on points
    const level = Math.floor(points / 100) + 1;
    const pointsToNextLevel = level * 100 - points;

    res.json({
      success: true,
      achievements,
      progress: {
        totalPoints: points,
        currentLevel: level,
        pointsToNextLevel,
      },
    });
  } catch (error) {
    logger.error("Get achievements error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve achievements",
    });
  }
};
