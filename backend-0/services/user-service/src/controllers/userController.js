const User = require("../../../../shared/database/models/User");
const userService = require("../services/userService");
const { logger } = require("../../../../shared/logger");
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { paginate } = require("../utils/pagination");
const { filterObject } = require("../utils/objectUtils");

class UserController {
  // Get current user
  getCurrentUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.user.id);

    res.json({
      success: true,
      data: { user },
      timestamp: new Date().toISOString(),
    });
  });

  // Get current user profile (detailed)
  getCurrentUserProfile = catchAsync(async (req, res) => {
    const profile = await userService.getUserProfile(req.user.id);

    res.json({
      success: true,
      data: { profile },
      timestamp: new Date().toISOString(),
    });
  });

  // Update current user
  updateCurrentUser = catchAsync(async (req, res) => {
    const allowedFields = [
      "personal.name",
      "personal.bio",
      "personal.timezone",
      "personal.languages",
      "personal.location",
    ];

    const filteredBody = filterObject(req.body, allowedFields);
    const updatedUser = await userService.updateUser(req.user.id, filteredBody);

    res.json({
      success: true,
      message: "User updated successfully",
      data: { user: updatedUser },
      timestamp: new Date().toISOString(),
    });
  });

  // Update user profile
  updateProfile = catchAsync(async (req, res) => {
    const updatedProfile = await userService.updateUserProfile(
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { profile: updatedProfile },
      timestamp: new Date().toISOString(),
    });
  });

  // Upload avatar
  uploadAvatar = catchAsync(async (req, res) => {
    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }

    const avatarUrl = await userService.uploadAvatar(req.user.id, req.file);

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      data: { avatarUrl },
      timestamp: new Date().toISOString(),
    });
  });

  // Delete avatar
  deleteAvatar = catchAsync(async (req, res) => {
    await userService.deleteAvatar(req.user.id);

    res.json({
      success: true,
      message: "Avatar deleted successfully",
      timestamp: new Date().toISOString(),
    });
  });

  // Get user by ID
  getUserById = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: { user },
      timestamp: new Date().toISOString(),
    });
  });

  // Get public profile
  getPublicProfile = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const profile = await userService.getPublicProfile(userId);

    if (!profile) {
      throw new AppError("User profile not found", 404);
    }

    res.json({
      success: true,
      data: { profile },
      timestamp: new Date().toISOString(),
    });
  });

  // Skills management
  getUserSkills = catchAsync(async (req, res) => {
    const skills = await userService.getUserSkills(req.user.id);

    res.json({
      success: true,
      data: { skills },
      timestamp: new Date().toISOString(),
    });
  });

  updateUserSkills = catchAsync(async (req, res) => {
    const updatedSkills = await userService.updateUserSkills(
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      message: "Skills updated successfully",
      data: { skills: updatedSkills },
      timestamp: new Date().toISOString(),
    });
  });

  addTeachingSkill = catchAsync(async (req, res) => {
    const skill = await userService.addTeachingSkill(req.user.id, req.body);

    res.json({
      success: true,
      message: "Teaching skill added successfully",
      data: { skill },
      timestamp: new Date().toISOString(),
    });
  });

  addLearningSkill = catchAsync(async (req, res) => {
    const skill = await userService.addLearningSkill(req.user.id, req.body);

    res.json({
      success: true,
      message: "Learning skill added successfully",
      data: { skill },
      timestamp: new Date().toISOString(),
    });
  });

  updateTeachingSkill = catchAsync(async (req, res) => {
    const { skillId } = req.params;
    const updatedSkill = await userService.updateTeachingSkill(
      req.user.id,
      skillId,
      req.body
    );

    res.json({
      success: true,
      message: "Teaching skill updated successfully",
      data: { skill: updatedSkill },
      timestamp: new Date().toISOString(),
    });
  });

  updateLearningSkill = catchAsync(async (req, res) => {
    const { skillId } = req.params;
    const updatedSkill = await userService.updateLearningSkill(
      req.user.id,
      skillId,
      req.body
    );

    res.json({
      success: true,
      message: "Learning skill updated successfully",
      data: { skill: updatedSkill },
      timestamp: new Date().toISOString(),
    });
  });

  removeTeachingSkill = catchAsync(async (req, res) => {
    const { skillId } = req.params;
    await userService.removeTeachingSkill(req.user.id, skillId);

    res.json({
      success: true,
      message: "Teaching skill removed successfully",
      timestamp: new Date().toISOString(),
    });
  });

  removeLearningSkill = catchAsync(async (req, res) => {
    const { skillId } = req.params;
    await userService.removeLearningSkill(req.user.id, skillId);

    res.json({
      success: true,
      message: "Learning skill removed successfully",
      timestamp: new Date().toISOString(),
    });
  });

  // Preferences and settings
  getUserPreferences = catchAsync(async (req, res) => {
    const preferences = await userService.getUserPreferences(req.user.id);

    res.json({
      success: true,
      data: { preferences },
      timestamp: new Date().toISOString(),
    });
  });

  updateUserPreferences = catchAsync(async (req, res) => {
    const updatedPreferences = await userService.updateUserPreferences(
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      message: "Preferences updated successfully",
      data: { preferences: updatedPreferences },
      timestamp: new Date().toISOString(),
    });
  });

  getUserSettings = catchAsync(async (req, res) => {
    const settings = await userService.getUserSettings(req.user.id);

    res.json({
      success: true,
      data: { settings },
      timestamp: new Date().toISOString(),
    });
  });

  updateUserSettings = catchAsync(async (req, res) => {
    const updatedSettings = await userService.updateUserSettings(
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: { settings: updatedSettings },
      timestamp: new Date().toISOString(),
    });
  });

  // Analytics and progress
  getLearningProgress = catchAsync(async (req, res) => {
    const progress = await userService.getLearningProgress(req.user.id);

    res.json({
      success: true,
      data: { progress },
      timestamp: new Date().toISOString(),
    });
  });

  getUserAnalytics = catchAsync(async (req, res) => {
    const { userId } = req.params || { userId: req.user.id };
    const analytics = await userService.getUserAnalytics(userId || req.user.id);

    res.json({
      success: true,
      data: { analytics },
      timestamp: new Date().toISOString(),
    });
  });

  getUserAchievements = catchAsync(async (req, res) => {
    const achievements = await userService.getUserAchievements(req.user.id);

    res.json({
      success: true,
      data: { achievements },
      timestamp: new Date().toISOString(),
    });
  });

  getUserReputation = catchAsync(async (req, res) => {
    const reputation = await userService.getUserReputation(req.user.id);

    res.json({
      success: true,
      data: { reputation },
      timestamp: new Date().toISOString(),
    });
  });

  // Search and discovery
  searchUsers = catchAsync(async (req, res) => {
    const { page = 1, limit = 20, ...filters } = req.query;
    const result = await userService.searchUsers(filters, { page, limit });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  });

  searchTeachers = catchAsync(async (req, res) => {
    const { page = 1, limit = 20, ...filters } = req.query;
    const result = await userService.searchTeachers(filters, { page, limit });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  });

  searchPublicUsers = catchAsync(async (req, res) => {
    const { page = 1, limit = 20, ...filters } = req.query;
    const result = await userService.searchPublicUsers(filters, {
      page,
      limit,
    });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  });

  getPublicTeachers = catchAsync(async (req, res) => {
    const { page = 1, limit = 20, ...filters } = req.query;
    const result = await userService.getPublicTeachers(filters, {
      page,
      limit,
    });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  });

  getRecommendedUsers = catchAsync(async (req, res) => {
    const { limit = 10, type = "teachers" } = req.query;
    const recommendations = await userService.getRecommendedUsers(req.user.id, {
      limit,
      type,
    });

    res.json({
      success: true,
      data: { recommendations },
      timestamp: new Date().toISOString(),
    });
  });

  // Social features
  getFollowers = catchAsync(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const result = await userService.getFollowers(req.user.id, { page, limit });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  });

  getFollowing = catchAsync(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const result = await userService.getFollowing(req.user.id, { page, limit });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  });

  followUser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    await userService.followUser(req.user.id, userId);

    res.json({
      success: true,
      message: "User followed successfully",
      timestamp: new Date().toISOString(),
    });
  });

  unfollowUser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    await userService.unfollowUser(req.user.id, userId);

    res.json({
      success: true,
      message: "User unfollowed successfully",
      timestamp: new Date().toISOString(),
    });
  });

  // Statistics and admin
  getAllUsers = catchAsync(async (req, res) => {
    const { page = 1, limit = 50, ...filters } = req.query;
    const result = await userService.getAllUsers(filters, { page, limit });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  });

  updateUserStatus = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    const updatedUser = await userService.updateUserStatus(userId, status);

    res.json({
      success: true,
      message: "User status updated successfully",
      data: { user: updatedUser },
      timestamp: new Date().toISOString(),
    });
  });

  deleteUser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    await userService.deleteUser(userId);

    res.json({
      success: true,
      message: "User deleted successfully",
      timestamp: new Date().toISOString(),
    });
  });

  deleteCurrentUser = catchAsync(async (req, res) => {
    await userService.deleteUser(req.user.id);

    res.json({
      success: true,
      message: "Account deleted successfully",
      timestamp: new Date().toISOString(),
    });
  });

  // Public statistics
  getPublicStats = catchAsync(async (req, res) => {
    const stats = await userService.getPublicStats();

    res.json({
      success: true,
      data: { stats },
      timestamp: new Date().toISOString(),
    });
  });

  getLeaderboard = catchAsync(async (req, res) => {
    const { type = "reputation", limit = 20 } = req.query;
    const leaderboard = await userService.getLeaderboard(type, limit);

    res.json({
      success: true,
      data: { leaderboard },
      timestamp: new Date().toISOString(),
    });
  });

  getPopularTeachers = catchAsync(async (req, res) => {
    const { limit = 20, skill } = req.query;
    const teachers = await userService.getPopularTeachers({ limit, skill });

    res.json({
      success: true,
      data: { teachers },
      timestamp: new Date().toISOString(),
    });
  });

  getSkillDistribution = catchAsync(async (req, res) => {
    const distribution = await userService.getSkillDistribution();

    res.json({
      success: true,
      data: { distribution },
      timestamp: new Date().toISOString(),
    });
  });

  getUserSkillsById = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const skills = await userService.getUserSkills(userId);

    res.json({
      success: true,
      data: { skills },
      timestamp: new Date().toISOString(),
    });
  });

  getTeachingSkills = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const teachingSkills = await userService.getTeachingSkills(userId);

    res.json({
      success: true,
      data: { teachingSkills },
      timestamp: new Date().toISOString(),
    });
  });

  getUserReviews = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const result = await userService.getUserReviews(userId, { page, limit });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  });
}

module.exports = new UserController();
