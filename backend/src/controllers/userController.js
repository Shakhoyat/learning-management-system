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
