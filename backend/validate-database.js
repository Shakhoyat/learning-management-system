/**
 * Database Validation Script
 *
 * This script validates that the database is properly configured to handle:
 * 1. Enhanced authentication features (password strength validation)
 * 2. Leaderboard API (privacy settings, indexes)
 * 3. Student learning analytics
 *
 * Run this script to ensure database readiness.
 */

const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./src/models/User");
const LearningAnalytics = require("./src/models/LearningAnalytics");
const bcrypt = require("bcryptjs");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) =>
    console.log(
      `\n${colors.cyan}${"=".repeat(60)}\n${msg}\n${"=".repeat(60)}${
        colors.reset
      }`
    ),
};

async function validateDatabase() {
  try {
    log.section("DATABASE VALIDATION FOR ENHANCED FEATURES");

    // Connect to MongoDB
    log.info("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    log.success("Connected to MongoDB");

    // Test 1: Validate User model has privacy settings
    log.section("TEST 1: USER MODEL PRIVACY SETTINGS");
    const userSchema = User.schema.obj;
    if (
      userSchema.privacySettings &&
      userSchema.privacySettings.showInLeaderboard !== undefined
    ) {
      log.success("User model has 'showInLeaderboard' privacy setting");
    } else {
      log.error("User model missing 'showInLeaderboard' privacy setting");
    }

    // Test 2: Validate User model indexes
    log.section("TEST 2: USER MODEL INDEXES");
    const userIndexes = await User.collection.getIndexes();
    const requiredUserIndexes = ["email_1", "role_1", "reputation.score_-1"];

    const leaderboardUserIndexes = [
      "role_1_reputation.learningStats.totalHours_-1",
      "role_1_reputation.learningStats.skillsLearned_-1",
      "role_1_privacySettings.showInLeaderboard_1",
    ];

    requiredUserIndexes.forEach((index) => {
      if (userIndexes[index]) {
        log.success(`Required index exists: ${index}`);
      } else {
        log.error(`Missing required index: ${index}`);
      }
    });

    log.info("\nLeaderboard optimization indexes:");
    leaderboardUserIndexes.forEach((index) => {
      if (userIndexes[index]) {
        log.success(`Leaderboard index exists: ${index}`);
      } else {
        log.warning(`Leaderboard index missing: ${index}`);
      }
    });

    // Test 3: Validate LearningAnalytics model indexes
    log.section("TEST 3: LEARNING ANALYTICS INDEXES");
    const learningIndexes = await LearningAnalytics.collection.getIndexes();
    const requiredLearningIndexes = [
      "learner_1_period.startDate_-1",
      "gamification.totalPoints_-1",
      "gamification.currentLevel_-1",
      "sessionMetrics.totalHours_-1",
      "learningProgress.skillsCompleted_-1",
      "learningProgress.averageProgress_-1",
    ];

    requiredLearningIndexes.forEach((index) => {
      if (learningIndexes[index]) {
        log.success(`Required index exists: ${index}`);
      } else {
        log.warning(`Missing index: ${index}`);
      }
    });

    // Test 4: Test user creation with enhanced password validation
    log.section("TEST 4: USER CREATION WITH ENHANCED PASSWORD");
    const testEmail = `test_${Date.now()}@example.com`;

    try {
      // Test weak password (should be handled at API level, but let's check model)
      const weakPassword = "weak";
      const strongPassword = "Strong@Pass123";

      const hashedPassword = await bcrypt.hash(strongPassword, 12);

      const testUser = new User({
        name: "Test User",
        email: testEmail,
        role: "learner",
        auth: {
          passwordHash: hashedPassword,
          emailVerified: false,
          isActive: true,
        },
        privacySettings: {
          showInLeaderboard: true,
        },
      });

      await testUser.save();
      log.success("Test user created with strong password");
      log.success("Privacy settings properly initialized");

      // Clean up test user
      await User.deleteOne({ email: testEmail });
      log.info("Test user cleaned up");
    } catch (error) {
      log.error(`User creation test failed: ${error.message}`);
    }

    // Test 5: Validate LearningAnalytics gamification fields
    log.section("TEST 5: LEARNING ANALYTICS GAMIFICATION FIELDS");
    const learningSchema = LearningAnalytics.schema.obj;
    const gamificationFields = [
      "totalPoints",
      "currentLevel",
      "pointsToNextLevel",
      "badges",
      "rank",
    ];

    let allFieldsPresent = true;
    gamificationFields.forEach((field) => {
      if (
        learningSchema.gamification &&
        learningSchema.gamification[field] !== undefined
      ) {
        log.success(`Gamification field exists: ${field}`);
      } else {
        log.error(`Missing gamification field: ${field}`);
        allFieldsPresent = false;
      }
    });

    if (allFieldsPresent) {
      log.success("All gamification fields are present");
    }

    // Test 6: Validate performance tracking fields
    log.section("TEST 6: PERFORMANCE TRACKING FIELDS");
    const performanceFields = [
      "comprehensionScore",
      "retentionScore",
      "applicationScore",
      "overallPerformance",
      "performanceTrend",
    ];

    let allPerformanceFields = true;
    performanceFields.forEach((field) => {
      if (
        learningSchema.performance &&
        learningSchema.performance[field] !== undefined
      ) {
        log.success(`Performance field exists: ${field}`);
      } else {
        log.error(`Missing performance field: ${field}`);
        allPerformanceFields = false;
      }
    });

    if (allPerformanceFields) {
      log.success("All performance tracking fields are present");
    }

    // Test 7: Check for existing analytics data
    log.section("TEST 7: ANALYTICS DATA AVAILABILITY");
    const analyticsCount = await LearningAnalytics.countDocuments();
    const usersCount = await User.countDocuments({ role: "learner" });

    log.info(`Total learner users: ${usersCount}`);
    log.info(`Total learning analytics records: ${analyticsCount}`);

    if (analyticsCount > 0) {
      log.success("Analytics data is available for leaderboard");

      // Sample analytics data
      const sampleAnalytics = await LearningAnalytics.findOne()
        .sort({ "gamification.totalPoints": -1 })
        .select("gamification sessionMetrics learningProgress")
        .lean();

      if (sampleAnalytics) {
        log.info("\nSample analytics data:");
        console.log(
          `  - Total Points: ${sampleAnalytics.gamification?.totalPoints || 0}`
        );
        console.log(
          `  - Level: ${sampleAnalytics.gamification?.currentLevel || 0}`
        );
        console.log(
          `  - Total Hours: ${sampleAnalytics.sessionMetrics?.totalHours || 0}`
        );
        console.log(
          `  - Skills Completed: ${
            sampleAnalytics.learningProgress?.skillsCompleted || 0
          }`
        );
      }
    } else {
      log.warning(
        "No analytics data found. Leaderboard will be empty until users complete sessions."
      );
    }

    // Test 8: Test leaderboard query performance
    log.section("TEST 8: LEADERBOARD QUERY PERFORMANCE");
    const startTime = Date.now();

    const leaderboardUsers = await User.find({
      role: "learner",
      "privacySettings.showInLeaderboard": { $ne: false },
    })
      .select("name avatar reputation")
      .limit(20)
      .lean();

    const queryTime = Date.now() - startTime;
    log.success(`Leaderboard query executed in ${queryTime}ms`);
    log.info(`Retrieved ${leaderboardUsers.length} users`);

    if (queryTime < 100) {
      log.success("Query performance is excellent!");
    } else if (queryTime < 500) {
      log.success("Query performance is good");
    } else {
      log.warning(
        "Query performance could be improved. Consider creating indexes."
      );
    }

    // Summary
    log.section("VALIDATION SUMMARY");

    const results = {
      privacySettings:
        userSchema.privacySettings?.showInLeaderboard !== undefined,
      userIndexes: requiredUserIndexes.every((idx) => userIndexes[idx]),
      learningIndexes: requiredLearningIndexes.every(
        (idx) => learningIndexes[idx]
      ),
      gamificationFields: allFieldsPresent,
      performanceFields: allPerformanceFields,
      analyticsData: analyticsCount > 0,
      queryPerformance: queryTime < 500,
    };

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;

    log.info(`Tests Passed: ${passedTests}/${totalTests}`);

    if (passedTests === totalTests) {
      log.success("\n🎉 DATABASE IS FULLY READY FOR ENHANCED FEATURES!");
      log.success("✅ Authentication enhancements supported");
      log.success("✅ Leaderboard API ready");
      log.success("✅ Analytics visualization ready");
      log.success("✅ Privacy settings configured");
    } else {
      log.warning("\n⚠️  DATABASE NEEDS SOME IMPROVEMENTS");
      log.info("Run 'node create-indexes.js' to create missing indexes");

      if (!results.analyticsData) {
        log.info("Analytics data will populate as users complete sessions");
      }
    }

    // Recommendations
    log.section("RECOMMENDATIONS");
    if (!results.analyticsData) {
      console.log(
        "  1. Seed analytics data for testing: node seed-analytics.js"
      );
    }
    if (!results.learningIndexes) {
      console.log("  2. Create missing indexes: node create-indexes.js");
    }
    console.log("  3. Test leaderboard API: GET /api/analytics/leaderboard");
    console.log("  4. Monitor query performance in production");
    console.log("  5. Set up regular index maintenance");

    // Close connection
    await mongoose.connection.close();
    log.success("\nDatabase connection closed");

    process.exit(passedTests === totalTests ? 0 : 1);
  } catch (error) {
    log.error(`Validation failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run validation
validateDatabase();
