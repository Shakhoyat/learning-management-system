/**
 * Database Index Creation Script
 *
 * This script creates all necessary indexes for optimal query performance,
 * especially for the new leaderboard feature and enhanced authentication.
 *
 * Run this script after deploying the new code to ensure all indexes exist.
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Import models to ensure indexes are registered
const User = require("./src/models/User");
const LearningAnalytics = require("./src/models/LearningAnalytics");
const TeachingAnalytics = require("./src/models/TeachingAnalytics");
const Session = require("./src/models/Session");
const Skill = require("./src/models/Skill");

const logger = require("./src/utils/logger");

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

async function createIndexes() {
  try {
    log.section("DATABASE INDEX CREATION");

    // Connect to MongoDB
    log.info("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    log.success("Connected to MongoDB");

    // Create indexes for User model
    log.info("\nCreating User model indexes...");
    await User.createIndexes();
    const userIndexes = await User.collection.getIndexes();
    log.success(
      `User model: ${Object.keys(userIndexes).length} indexes created`
    );
    Object.keys(userIndexes).forEach((index) => {
      console.log(`  - ${index}`);
    });

    // Create indexes for LearningAnalytics model
    log.info("\nCreating LearningAnalytics model indexes...");
    await LearningAnalytics.createIndexes();
    const learningIndexes = await LearningAnalytics.collection.getIndexes();
    log.success(
      `LearningAnalytics model: ${
        Object.keys(learningIndexes).length
      } indexes created`
    );
    Object.keys(learningIndexes).forEach((index) => {
      console.log(`  - ${index}`);
    });

    // Create indexes for TeachingAnalytics model
    log.info("\nCreating TeachingAnalytics model indexes...");
    await TeachingAnalytics.createIndexes();
    const teachingIndexes = await TeachingAnalytics.collection.getIndexes();
    log.success(
      `TeachingAnalytics model: ${
        Object.keys(teachingIndexes).length
      } indexes created`
    );
    Object.keys(teachingIndexes).forEach((index) => {
      console.log(`  - ${index}`);
    });

    // Create indexes for Session model
    log.info("\nCreating Session model indexes...");
    await Session.createIndexes();
    const sessionIndexes = await Session.collection.getIndexes();
    log.success(
      `Session model: ${Object.keys(sessionIndexes).length} indexes created`
    );
    Object.keys(sessionIndexes).forEach((index) => {
      console.log(`  - ${index}`);
    });

    // Create indexes for Skill model
    log.info("\nCreating Skill model indexes...");
    await Skill.createIndexes();
    const skillIndexes = await Skill.collection.getIndexes();
    log.success(
      `Skill model: ${Object.keys(skillIndexes).length} indexes created`
    );
    Object.keys(skillIndexes).forEach((index) => {
      console.log(`  - ${index}`);
    });

    // Summary
    log.section("INDEX CREATION SUMMARY");
    const totalIndexes =
      Object.keys(userIndexes).length +
      Object.keys(learningIndexes).length +
      Object.keys(teachingIndexes).length +
      Object.keys(sessionIndexes).length +
      Object.keys(skillIndexes).length;

    log.success(`Total indexes created: ${totalIndexes}`);
    log.success("\nAll database indexes have been successfully created!");
    log.info("\nOptimizations applied:");
    console.log("  ✅ User authentication queries optimized");
    console.log("  ✅ Leaderboard queries optimized");
    console.log("  ✅ Analytics queries optimized");
    console.log("  ✅ Session queries optimized");
    console.log("  ✅ Skill queries optimized");

    // Verify specific leaderboard indexes
    log.section("LEADERBOARD-SPECIFIC INDEXES");
    log.info("Verifying leaderboard optimization indexes...");

    const leaderboardIndexes = [
      "gamification.totalPoints_-1",
      "gamification.currentLevel_-1",
      "sessionMetrics.totalHours_-1",
      "learningProgress.skillsCompleted_-1",
    ];

    leaderboardIndexes.forEach((indexName) => {
      if (learningIndexes[indexName]) {
        log.success(`  ${indexName}`);
      } else {
        log.warning(`  ${indexName} - NOT FOUND`);
      }
    });

    // Verify privacy setting index
    const privacyIndex =
      userIndexes["role_1_privacySettings.showInLeaderboard_1"];
    if (privacyIndex) {
      log.success("  Privacy settings index for leaderboard");
    } else {
      log.warning("  Privacy settings index - NOT FOUND");
    }

    // Database statistics
    log.section("DATABASE STATISTICS");
    const stats = await mongoose.connection.db.stats();
    log.info(`Database: ${mongoose.connection.name}`);
    log.info(`Collections: ${stats.collections}`);
    log.info(`Indexes: ${stats.indexes}`);
    log.info(`Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    log.info(
      `Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`
    );
    log.info(`Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);

    // Close connection
    await mongoose.connection.close();
    log.success("\nDatabase connection closed");

    log.section("✅ SETUP COMPLETE");
    log.success("Your database is now optimized for:");
    console.log("  1. Fast user authentication");
    console.log("  2. Efficient leaderboard queries");
    console.log("  3. Quick analytics data retrieval");
    console.log("  4. Privacy-respecting data access");

    process.exit(0);
  } catch (error) {
    log.error(`Error creating indexes: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the index creation
createIndexes();
