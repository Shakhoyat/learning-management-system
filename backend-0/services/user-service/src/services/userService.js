const User = require("../../../../shared/database/models/User");
const { AppError } = require("../utils/appError");
const { logger } = require("../../../../shared/logger");
const { paginate } = require("../utils/pagination");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");
const mongoose = require("mongoose");

class UserService {
  // Get user by ID with selective field inclusion
  async getUserById(userId, includeFields = null) {
    try {
      let query = User.findById(userId);

      if (includeFields) {
        query = query.select(includeFields);
      } else {
        // Exclude sensitive fields by default
        query = query.select("-auth.passwordHash -auth.refreshTokens");
      }

      const user = await query
        .populate("skills.teaching.skillId", "name category difficulty")
        .populate("skills.learning.skillId", "name category difficulty");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user;
    } catch (error) {
      logger.error("Error getting user by ID:", error);
      throw error;
    }
  }

  // Get detailed user profile
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId)
        .select("-auth.passwordHash -auth.refreshTokens")
        .populate("skills.teaching.skillId", "name category difficulty tags")
        .populate("skills.learning.skillId", "name category difficulty tags")
        .populate("reputation.reviews", "rating comment reviewer createdAt");

      if (!user) {
        throw new AppError("User profile not found", 404);
      }

      return user;
    } catch (error) {
      logger.error("Error getting user profile:", error);
      throw error;
    }
  }

  // Get public profile (limited fields)
  async getPublicProfile(userId) {
    try {
      const user = await User.findById(userId)
        .select(
          `
          personal.name personal.avatar personal.bio personal.location.country 
          personal.location.city personal.languages skills.teaching 
          reputation.score reputation.level reputation.badges 
          reputation.teachingStats status createdAt
        `
        )
        .populate("skills.teaching.skillId", "name category difficulty");

      if (!user || user.status !== "active") {
        throw new AppError("User profile not found or inactive", 404);
      }

      // Check privacy settings
      if (user.settings?.privacy?.profileVisibility === "private") {
        throw new AppError("Profile is private", 403);
      }

      return user;
    } catch (error) {
      logger.error("Error getting public profile:", error);
      throw error;
    }
  }

  // Update user
  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select("-auth.passwordHash -auth.refreshTokens");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user;
    } catch (error) {
      logger.error("Error updating user:", error);
      throw error;
    }
  }

  // Update user profile specifically
  async updateUserProfile(userId, profileData) {
    try {
      const allowedFields = {
        "personal.name": profileData.name,
        "personal.bio": profileData.bio,
        "personal.timezone": profileData.timezone,
        "personal.languages": profileData.languages,
        "personal.location": profileData.location,
      };

      // Remove undefined fields
      Object.keys(allowedFields).forEach((key) => {
        if (allowedFields[key] === undefined) {
          delete allowedFields[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: allowedFields, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select("-auth.passwordHash -auth.refreshTokens");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user;
    } catch (error) {
      logger.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Avatar management
  async uploadAvatar(userId, file) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Delete old avatar if exists
      if (user.personal.avatar) {
        await deleteFromCloudinary(user.personal.avatar);
      }

      // Upload new avatar
      const avatarUrl = await uploadToCloudinary(file, "avatars");

      // Update user with new avatar URL
      user.personal.avatar = avatarUrl;
      user.updatedAt = new Date();
      await user.save();

      return avatarUrl;
    } catch (error) {
      logger.error("Error uploading avatar:", error);
      throw error;
    }
  }

  async deleteAvatar(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (user.personal.avatar) {
        await deleteFromCloudinary(user.personal.avatar);
        user.personal.avatar = null;
        user.updatedAt = new Date();
        await user.save();
      }

      return true;
    } catch (error) {
      logger.error("Error deleting avatar:", error);
      throw error;
    }
  }

  // Skills management
  async getUserSkills(userId) {
    try {
      const user = await User.findById(userId)
        .select("skills")
        .populate("skills.teaching.skillId", "name category difficulty")
        .populate("skills.learning.skillId", "name category difficulty");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user.skills;
    } catch (error) {
      logger.error("Error getting user skills:", error);
      throw error;
    }
  }

  async updateUserSkills(userId, skillsData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            skills: skillsData,
            updatedAt: new Date(),
          },
        },
        { new: true, runValidators: true }
      )
        .select("skills")
        .populate("skills.teaching.skillId", "name category difficulty")
        .populate("skills.learning.skillId", "name category difficulty");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user.skills;
    } catch (error) {
      logger.error("Error updating user skills:", error);
      throw error;
    }
  }

  async addTeachingSkill(userId, skillData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Check if skill already exists
      const existingSkill = user.skills.teaching.find(
        (skill) => skill.skillId.toString() === skillData.skillId
      );

      if (existingSkill) {
        throw new AppError("Teaching skill already exists", 400);
      }

      user.skills.teaching.push(skillData);
      user.updatedAt = new Date();
      await user.save();

      await user.populate(
        "skills.teaching.skillId",
        "name category difficulty"
      );

      return user.skills.teaching[user.skills.teaching.length - 1];
    } catch (error) {
      logger.error("Error adding teaching skill:", error);
      throw error;
    }
  }

  async addLearningSkill(userId, skillData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Check if skill already exists
      const existingSkill = user.skills.learning.find(
        (skill) => skill.skillId.toString() === skillData.skillId
      );

      if (existingSkill) {
        throw new AppError("Learning skill already exists", 400);
      }

      user.skills.learning.push(skillData);
      user.updatedAt = new Date();
      await user.save();

      await user.populate(
        "skills.learning.skillId",
        "name category difficulty"
      );

      return user.skills.learning[user.skills.learning.length - 1];
    } catch (error) {
      logger.error("Error adding learning skill:", error);
      throw error;
    }
  }

  async updateTeachingSkill(userId, skillId, updateData) {
    try {
      const user = await User.findOneAndUpdate(
        {
          _id: userId,
          "skills.teaching.skillId": skillId,
        },
        {
          $set: {
            "skills.teaching.$": { ...updateData, skillId },
            updatedAt: new Date(),
          },
        },
        { new: true }
      ).populate("skills.teaching.skillId", "name category difficulty");

      if (!user) {
        throw new AppError("User or teaching skill not found", 404);
      }

      const updatedSkill = user.skills.teaching.find(
        (skill) => skill.skillId._id.toString() === skillId
      );

      return updatedSkill;
    } catch (error) {
      logger.error("Error updating teaching skill:", error);
      throw error;
    }
  }

  async updateLearningSkill(userId, skillId, updateData) {
    try {
      const user = await User.findOneAndUpdate(
        {
          _id: userId,
          "skills.learning.skillId": skillId,
        },
        {
          $set: {
            "skills.learning.$": { ...updateData, skillId },
            updatedAt: new Date(),
          },
        },
        { new: true }
      ).populate("skills.learning.skillId", "name category difficulty");

      if (!user) {
        throw new AppError("User or learning skill not found", 404);
      }

      const updatedSkill = user.skills.learning.find(
        (skill) => skill.skillId._id.toString() === skillId
      );

      return updatedSkill;
    } catch (error) {
      logger.error("Error updating learning skill:", error);
      throw error;
    }
  }

  async removeTeachingSkill(userId, skillId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { "skills.teaching": { skillId } },
          $set: { updatedAt: new Date() },
        },
        { new: true }
      );

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return true;
    } catch (error) {
      logger.error("Error removing teaching skill:", error);
      throw error;
    }
  }

  async removeLearningSkill(userId, skillId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { "skills.learning": { skillId } },
          $set: { updatedAt: new Date() },
        },
        { new: true }
      );

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return true;
    } catch (error) {
      logger.error("Error removing learning skill:", error);
      throw error;
    }
  }

  // Preferences and settings
  async getUserPreferences(userId) {
    try {
      const user = await User.findById(userId).select("preferences");
      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user.preferences;
    } catch (error) {
      logger.error("Error getting user preferences:", error);
      throw error;
    }
  }

  async updateUserPreferences(userId, preferences) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            preferences,
            updatedAt: new Date(),
          },
        },
        { new: true }
      ).select("preferences");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user.preferences;
    } catch (error) {
      logger.error("Error updating user preferences:", error);
      throw error;
    }
  }

  async getUserSettings(userId) {
    try {
      const user = await User.findById(userId).select("settings");
      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user.settings;
    } catch (error) {
      logger.error("Error getting user settings:", error);
      throw error;
    }
  }

  async updateUserSettings(userId, settings) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            settings,
            updatedAt: new Date(),
          },
        },
        { new: true }
      ).select("settings");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user.settings;
    } catch (error) {
      logger.error("Error updating user settings:", error);
      throw error;
    }
  }

  // Search functionality
  async searchUsers(filters, options) {
    try {
      const { page = 1, limit = 20 } = options;
      const query = this.buildSearchQuery(filters);

      const users = await User.find(query)
        .select(
          `
          personal.name personal.avatar personal.bio personal.location.country 
          personal.location.city skills.teaching reputation.score 
          reputation.level status createdAt
        `
        )
        .populate("skills.teaching.skillId", "name category")
        .sort({ "reputation.score": -1, createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(query);

      return paginate(users, total, page, limit);
    } catch (error) {
      logger.error("Error searching users:", error);
      throw error;
    }
  }

  async searchTeachers(filters, options) {
    try {
      const { page = 1, limit = 20 } = options;
      const query = {
        ...this.buildSearchQuery(filters),
        "skills.teaching": { $exists: true, $ne: [] },
        status: "active",
      };

      const teachers = await User.find(query)
        .select(
          `
          personal.name personal.avatar personal.bio personal.location.country 
          personal.location.city skills.teaching reputation.score 
          reputation.level reputation.teachingStats
        `
        )
        .populate("skills.teaching.skillId", "name category difficulty")
        .sort({
          "reputation.teachingStats.averageRating": -1,
          "reputation.score": -1,
        })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(query);

      return paginate(teachers, total, page, limit);
    } catch (error) {
      logger.error("Error searching teachers:", error);
      throw error;
    }
  }

  async searchPublicUsers(filters, options) {
    try {
      const { page = 1, limit = 20 } = options;
      const query = {
        ...this.buildSearchQuery(filters),
        status: "active",
        "settings.privacy.profileVisibility": { $ne: "private" },
      };

      const users = await User.find(query)
        .select(
          `
          personal.name personal.avatar personal.bio personal.location.country 
          personal.location.city skills.teaching reputation.score reputation.level
        `
        )
        .populate("skills.teaching.skillId", "name category")
        .sort({ "reputation.score": -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(query);

      return paginate(users, total, page, limit);
    } catch (error) {
      logger.error("Error searching public users:", error);
      throw error;
    }
  }

  async getPublicTeachers(filters, options) {
    try {
      const { page = 1, limit = 20 } = options;
      const query = {
        "skills.teaching": { $exists: true, $ne: [] },
        status: "active",
        "settings.privacy.profileVisibility": { $ne: "private" },
      };

      // Add skill filter if provided
      if (filters.skill) {
        query["skills.teaching.skillId"] = filters.skill;
      }

      // Add location filter if provided
      if (filters.country) {
        query["personal.location.country"] = new RegExp(filters.country, "i");
      }

      const teachers = await User.find(query)
        .select(
          `
          personal.name personal.avatar personal.bio personal.location
          skills.teaching reputation.score reputation.level 
          reputation.teachingStats
        `
        )
        .populate("skills.teaching.skillId", "name category difficulty")
        .sort({ "reputation.teachingStats.averageRating": -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(query);

      return paginate(teachers, total, page, limit);
    } catch (error) {
      logger.error("Error getting public teachers:", error);
      throw error;
    }
  }

  // Helper method to build search query
  buildSearchQuery(filters) {
    const query = {};

    if (filters.name) {
      query["personal.name"] = new RegExp(filters.name, "i");
    }

    if (filters.skill) {
      query.$or = [
        { "skills.teaching.skillId": filters.skill },
        { "skills.learning.skillId": filters.skill },
      ];
    }

    if (filters.country) {
      query["personal.location.country"] = new RegExp(filters.country, "i");
    }

    if (filters.city) {
      query["personal.location.city"] = new RegExp(filters.city, "i");
    }

    if (filters.language) {
      query["personal.languages"] = filters.language;
    }

    if (filters.minRating) {
      query["reputation.score"] = { $gte: parseFloat(filters.minRating) };
    }

    return query;
  }

  // Analytics and statistics
  async getLearningProgress(userId) {
    try {
      const user = await User.findById(userId)
        .select("skills.learning reputation.learningStats")
        .populate("skills.learning.skillId", "name category difficulty");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const progress = {
        learningSkills: user.skills.learning,
        totalHours: user.reputation.learningStats.totalHours,
        totalSessions: user.reputation.learningStats.totalSessions,
        skillsInProgress: user.skills.learning.length,
        averageProgress: user.reputation.learningStats.averageProgress,
      };

      return progress;
    } catch (error) {
      logger.error("Error getting learning progress:", error);
      throw error;
    }
  }

  async getUserAnalytics(userId) {
    try {
      const user = await User.findById(userId).select(
        "reputation skills createdAt lastActiveAt"
      );

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const analytics = {
        reputation: user.reputation,
        skillsCount: {
          teaching: user.skills.teaching.length,
          learning: user.skills.learning.length,
        },
        accountAge: Math.floor(
          (new Date() - user.createdAt) / (1000 * 60 * 60 * 24)
        ),
        lastActive: user.lastActiveAt,
      };

      return analytics;
    } catch (error) {
      logger.error("Error getting user analytics:", error);
      throw error;
    }
  }

  async getUserAchievements(userId) {
    try {
      const user = await User.findById(userId).select(
        "reputation.badges reputation.level reputation.score"
      );

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return {
        badges: user.reputation.badges,
        level: user.reputation.level,
        score: user.reputation.score,
      };
    } catch (error) {
      logger.error("Error getting user achievements:", error);
      throw error;
    }
  }

  async getUserReputation(userId) {
    try {
      const user = await User.findById(userId)
        .select("reputation")
        .populate("reputation.reviews", "rating comment reviewer createdAt");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user.reputation;
    } catch (error) {
      logger.error("Error getting user reputation:", error);
      throw error;
    }
  }

  // Admin functions
  async getAllUsers(filters, options) {
    try {
      const { page = 1, limit = 50 } = options;
      const query = {};

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.role) {
        // This would need to be implemented if roles are added to user schema
        query.role = filters.role;
      }

      const users = await User.find(query)
        .select("-auth.passwordHash -auth.refreshTokens")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(query);

      return paginate(users, total, page, limit);
    } catch (error) {
      logger.error("Error getting all users:", error);
      throw error;
    }
  }

  async updateUserStatus(userId, status) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          status,
          updatedAt: new Date(),
        },
        { new: true }
      ).select("-auth.passwordHash -auth.refreshTokens");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user;
    } catch (error) {
      logger.error("Error updating user status:", error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Delete avatar from cloud storage if exists
      if (user.personal.avatar) {
        await deleteFromCloudinary(user.personal.avatar);
      }

      // Soft delete by updating status
      await User.findByIdAndUpdate(userId, {
        status: "deactivated",
        "personal.email": `deleted_${Date.now()}@deleted.com`,
        updatedAt: new Date(),
      });

      return true;
    } catch (error) {
      logger.error("Error deleting user:", error);
      throw error;
    }
  }

  // Public statistics
  async getPublicStats() {
    try {
      const stats = await User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
            totalTeachers: {
              $sum: {
                $cond: [{ $gt: [{ $size: "$skills.teaching" }, 0] }, 1, 0],
              },
            },
            totalLearners: {
              $sum: {
                $cond: [{ $gt: [{ $size: "$skills.learning" }, 0] }, 1, 0],
              },
            },
          },
        },
      ]);

      return (
        stats[0] || {
          totalUsers: 0,
          activeUsers: 0,
          totalTeachers: 0,
          totalLearners: 0,
        }
      );
    } catch (error) {
      logger.error("Error getting public stats:", error);
      throw error;
    }
  }

  async getLeaderboard(type = "reputation", limit = 20) {
    try {
      let sortField;

      switch (type) {
        case "reputation":
          sortField = { "reputation.score": -1 };
          break;
        case "teaching":
          sortField = { "reputation.teachingStats.averageRating": -1 };
          break;
        case "learning":
          sortField = { "reputation.learningStats.totalHours": -1 };
          break;
        default:
          sortField = { "reputation.score": -1 };
      }

      const users = await User.find({ status: "active" })
        .select(
          `
          personal.name personal.avatar reputation.score 
          reputation.level reputation.teachingStats reputation.learningStats
        `
        )
        .sort(sortField)
        .limit(parseInt(limit));

      return users;
    } catch (error) {
      logger.error("Error getting leaderboard:", error);
      throw error;
    }
  }

  async getPopularTeachers(options = {}) {
    try {
      const { limit = 20, skill } = options;
      const query = {
        "skills.teaching": { $exists: true, $ne: [] },
        status: "active",
      };

      if (skill) {
        query["skills.teaching.skillId"] = skill;
      }

      const teachers = await User.find(query)
        .select(
          `
          personal.name personal.avatar skills.teaching 
          reputation.teachingStats reputation.score reputation.level
        `
        )
        .populate("skills.teaching.skillId", "name category")
        .sort({
          "reputation.teachingStats.averageRating": -1,
          "reputation.teachingStats.totalSessions": -1,
        })
        .limit(parseInt(limit));

      return teachers;
    } catch (error) {
      logger.error("Error getting popular teachers:", error);
      throw error;
    }
  }

  async getSkillDistribution() {
    try {
      const distribution = await User.aggregate([
        { $unwind: "$skills.teaching" },
        {
          $group: {
            _id: "$skills.teaching.skillId",
            teacherCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "skills",
            localField: "_id",
            foreignField: "_id",
            as: "skill",
          },
        },
        { $unwind: "$skill" },
        {
          $project: {
            skillName: "$skill.name",
            category: "$skill.category",
            teacherCount: 1,
          },
        },
        { $sort: { teacherCount: -1 } },
        { $limit: 50 },
      ]);

      return distribution;
    } catch (error) {
      logger.error("Error getting skill distribution:", error);
      throw error;
    }
  }

  // Social features (placeholder - would need additional schema)
  async getFollowers(userId, options) {
    // This would require implementing a followers/following system
    // For now, return empty array
    return paginate([], 0, options.page, options.limit);
  }

  async getFollowing(userId, options) {
    // This would require implementing a followers/following system
    // For now, return empty array
    return paginate([], 0, options.page, options.limit);
  }

  async followUser(followerId, followingId) {
    // This would require implementing a followers/following system
    // For now, just return success
    return true;
  }

  async unfollowUser(followerId, followingId) {
    // This would require implementing a followers/following system
    // For now, just return success
    return true;
  }

  async getRecommendedUsers(userId, options) {
    try {
      const { limit = 10, type = "teachers" } = options;

      // Get user's learning skills to recommend teachers
      const user = await User.findById(userId).select("skills.learning");
      if (!user) {
        throw new AppError("User not found", 404);
      }

      const learningSkillIds = user.skills.learning.map(
        (skill) => skill.skillId
      );

      const query = {
        _id: { $ne: userId },
        status: "active",
        "skills.teaching.skillId": { $in: learningSkillIds },
      };

      const recommendations = await User.find(query)
        .select(
          `
          personal.name personal.avatar skills.teaching 
          reputation.score reputation.teachingStats
        `
        )
        .populate("skills.teaching.skillId", "name category")
        .sort({ "reputation.teachingStats.averageRating": -1 })
        .limit(parseInt(limit));

      return recommendations;
    } catch (error) {
      logger.error("Error getting recommended users:", error);
      throw error;
    }
  }

  async getTeachingSkills(userId) {
    try {
      const user = await User.findById(userId)
        .select("skills.teaching")
        .populate("skills.teaching.skillId", "name category difficulty");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user.skills.teaching;
    } catch (error) {
      logger.error("Error getting teaching skills:", error);
      throw error;
    }
  }

  async getUserReviews(userId, options) {
    try {
      // This would require implementing a reviews system
      // For now, return empty array
      return paginate([], 0, options.page, options.limit);
    } catch (error) {
      logger.error("Error getting user reviews:", error);
      throw error;
    }
  }
}

module.exports = new UserService();
