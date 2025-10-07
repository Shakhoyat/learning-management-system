const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../../../shared/middleware/auth");
const { authorize } = require("../middleware/authorization");
const {
  validateCreateUser,
  validateUpdateUser,
  validateUpdateProfile,
  validateUpdateSkills,
  validateUpdatePreferences,
  validateAddSkill,
  validateUpdateSkill,
} = require("../validators/userValidators");
const { upload } = require("../middleware/uploadMiddleware");
const rateLimit = require("express-rate-limit");

// Rate limiting for different operations
const profileRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 profile updates per 15 minutes
  message: { error: "Too many profile update attempts" },
});

const searchRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: { error: "Too many search requests" },
});

// Public routes (no authentication required)
router.get("/public/search", searchRateLimit, userController.searchPublicUsers);
router.get(
  "/public/teachers",
  searchRateLimit,
  userController.getPublicTeachers
);
router.get("/public/stats", userController.getPublicStats);

// Admin routes (require admin authorization)
router.get(
  "/admin/all",
  authenticate,
  authorize("admin"),
  userController.getAllUsers
);
router.put(
  "/admin/:userId/status",
  authenticate,
  authorize("admin"),
  userController.updateUserStatus
);
router.get(
  "/admin/analytics",
  authenticate,
  authorize("admin"),
  userController.getUserAnalytics
);
router.delete(
  "/admin/:userId",
  authenticate,
  authorize("admin"),
  userController.deleteUser
);

// Protected routes (require authentication)
router.use(authenticate); // Apply authentication to all routes below

// Profile management
router.get("/profile", userController.getCurrentUserProfile);
router.put(
  "/profile",
  profileRateLimit,
  validateUpdateProfile,
  userController.updateProfile
);
router.post(
  "/profile/avatar",
  upload.single("avatar"),
  userController.uploadAvatar
);
router.delete("/profile/avatar", userController.deleteAvatar);

// User management
router.get("/me", userController.getCurrentUser);
router.put(
  "/me",
  profileRateLimit,
  validateUpdateUser,
  userController.updateCurrentUser
);
router.delete("/me", userController.deleteCurrentUser);

// Skills management
router.get("/me/skills", userController.getUserSkills);
router.put("/me/skills", validateUpdateSkills, userController.updateUserSkills);
router.post(
  "/me/skills/teaching",
  validateAddSkill,
  userController.addTeachingSkill
);
router.post(
  "/me/skills/learning",
  validateAddSkill,
  userController.addLearningSkill
);
router.put(
  "/me/skills/teaching/:skillId",
  validateUpdateSkill,
  userController.updateTeachingSkill
);
router.put(
  "/me/skills/learning/:skillId",
  validateUpdateSkill,
  userController.updateLearningSkill
);
router.delete(
  "/me/skills/teaching/:skillId",
  userController.removeTeachingSkill
);
router.delete(
  "/me/skills/learning/:skillId",
  userController.removeLearningSkill
);

// Preferences and settings
router.get("/me/preferences", userController.getUserPreferences);
router.put(
  "/me/preferences",
  validateUpdatePreferences,
  userController.updateUserPreferences
);
router.get("/me/settings", userController.getUserSettings);
router.put("/me/settings", userController.updateUserSettings);

// Learning progress and analytics
router.get("/me/progress", userController.getLearningProgress);
router.get("/me/analytics", userController.getUserAnalytics);
router.get("/me/achievements", userController.getUserAchievements);
router.get("/me/reputation", userController.getUserReputation);

// Social features
router.get("/me/followers", userController.getFollowers);
router.get("/me/following", userController.getFollowing);
router.post("/follow/:userId", userController.followUser);
router.delete("/follow/:userId", userController.unfollowUser);

// Search and discovery
router.get("/search", searchRateLimit, userController.searchUsers);
router.get("/teachers/search", searchRateLimit, userController.searchTeachers);
router.get("/recommendations", userController.getRecommendedUsers);

// Public user profiles
router.get("/:userId", userController.getUserById);
router.get("/:userId/public-profile", userController.getPublicProfile);
router.get("/:userId/skills", userController.getUserSkillsById);
router.get("/:userId/teaching-skills", userController.getTeachingSkills);
router.get("/:userId/reviews", userController.getUserReviews);

// Statistics and leaderboards
router.get("/stats/leaderboard", userController.getLeaderboard);
router.get("/stats/popular-teachers", userController.getPopularTeachers);
router.get("/stats/skill-distribution", userController.getSkillDistribution);

module.exports = router;
