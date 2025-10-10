/**
 * Analytics Setup Verification Script
 * Verifies that all analytics components are properly configured
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const TeachingAnalytics = require("./src/models/TeachingAnalytics");
const LearningAnalytics = require("./src/models/LearningAnalytics");
const { Assessment, AssessmentAttempt } = require("./src/models/Assessment");
const AnalyticsReport = require("./src/models/AnalyticsReport");
const User = require("./src/models/User");
const Session = require("./src/models/Session");

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
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

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/lms-simplified",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    log.success("MongoDB connected successfully");
  } catch (error) {
    log.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Verify Models
const verifyModels = async () => {
  log.section("VERIFYING ANALYTICS MODELS");

  const models = [
    { name: "TeachingAnalytics", model: TeachingAnalytics },
    { name: "LearningAnalytics", model: LearningAnalytics },
    { name: "Assessment", model: Assessment },
    { name: "AssessmentAttempt", model: AssessmentAttempt },
    { name: "AnalyticsReport", model: AnalyticsReport },
  ];

  for (const { name, model } of models) {
    try {
      const count = await model.countDocuments();
      log.success(`${name}: ${count} documents`);
    } catch (error) {
      log.error(`${name}: Model error - ${error.message}`);
    }
  }
};

// Verify Indexes
const verifyIndexes = async () => {
  log.section("VERIFYING DATABASE INDEXES");

  const collections = [
    { name: "teachinganalytics", model: TeachingAnalytics },
    { name: "learninganalytics", model: LearningAnalytics },
    { name: "assessments", model: Assessment },
    { name: "assessmentattempts", model: AssessmentAttempt },
    { name: "analyticsreports", model: AnalyticsReport },
  ];

  for (const { name, model } of collections) {
    try {
      const indexes = await model.collection.getIndexes();
      log.success(`${name}: ${Object.keys(indexes).length} indexes`);

      // List indexes
      for (const [indexName, indexSpec] of Object.entries(indexes)) {
        const fields = Object.keys(indexSpec.key).join(", ");
        console.log(`  - ${indexName}: ${fields}`);
      }
    } catch (error) {
      log.warning(`${name}: Could not retrieve indexes - ${error.message}`);
    }
  }
};

// Verify Data Integrity
const verifyDataIntegrity = async () => {
  log.section("VERIFYING DATA INTEGRITY");

  try {
    // Check for tutors
    const tutorCount = await User.countDocuments({ role: "tutor" });
    if (tutorCount > 0) {
      log.success(`Found ${tutorCount} tutors`);
    } else {
      log.warning("No tutors found - analytics may be empty");
    }

    // Check for learners
    const learnerCount = await User.countDocuments({ role: "learner" });
    if (learnerCount > 0) {
      log.success(`Found ${learnerCount} learners`);
    } else {
      log.warning("No learners found");
    }

    // Check for sessions
    const sessionCount = await Session.countDocuments();
    if (sessionCount > 0) {
      log.success(`Found ${sessionCount} sessions`);
    } else {
      log.warning("No sessions found - teaching analytics will be limited");
    }

    // Check teaching analytics coverage
    const analyticsWithData = await TeachingAnalytics.countDocuments({
      "sessionMetrics.total": { $gt: 0 },
    });
    log.info(`Teaching analytics with session data: ${analyticsWithData}`);

    // Check for orphaned analytics (tutor doesn't exist)
    const allTeachingAnalytics = await TeachingAnalytics.find().select("tutor");
    let orphanedCount = 0;
    for (const analytics of allTeachingAnalytics) {
      const tutorExists = await User.exists({ _id: analytics.tutor });
      if (!tutorExists) orphanedCount++;
    }

    if (orphanedCount > 0) {
      log.warning(`Found ${orphanedCount} orphaned teaching analytics records`);
    } else {
      log.success("No orphaned analytics records found");
    }
  } catch (error) {
    log.error(`Data integrity check failed: ${error.message}`);
  }
};

// Verify Static Methods
const verifyStaticMethods = async () => {
  log.section("VERIFYING MODEL STATIC METHODS");

  // Test TeachingAnalytics.calculateForTutor
  try {
    const tutor = await User.findOne({ role: "tutor" });
    if (tutor) {
      log.info(
        `Testing TeachingAnalytics.calculateForTutor with tutor: ${tutor.name}`
      );

      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      const analytics = await TeachingAnalytics.calculateForTutor(
        tutor._id,
        "monthly",
        startDate,
        endDate
      );

      if (analytics) {
        log.success("calculateForTutor method works correctly");
        log.info(`  Sessions: ${analytics.sessionMetrics?.total || 0}`);
        log.info(`  Students: ${analytics.studentMetrics?.totalStudents || 0}`);
        log.info(`  Earnings: $${analytics.earnings?.net || 0}`);
      } else {
        log.warning("calculateForTutor returned null");
      }
    } else {
      log.warning("No tutor found to test calculateForTutor");
    }
  } catch (error) {
    log.error(`calculateForTutor test failed: ${error.message}`);
  }

  // Test generateInsights
  try {
    const analytics = await TeachingAnalytics.findOne();
    if (analytics) {
      const insights = analytics.generateInsights();
      if (insights && insights.length > 0) {
        log.success(
          `generateInsights method works: ${insights.length} insights`
        );
      } else {
        log.warning("generateInsights returned no insights");
      }
    }
  } catch (error) {
    log.error(`generateInsights test failed: ${error.message}`);
  }
};

// Verify Sample Data
const verifySampleData = async () => {
  log.section("SAMPLE DATA VERIFICATION");

  try {
    // Get latest teaching analytics
    const latestTeaching = await TeachingAnalytics.findOne()
      .sort({ "period.endDate": -1 })
      .populate("tutor", "name email");

    if (latestTeaching) {
      log.success("Latest Teaching Analytics:");
      console.log(`  Tutor: ${latestTeaching.tutor?.name || "Unknown"}`);
      console.log(
        `  Period: ${
          latestTeaching.period.startDate.toISOString().split("T")[0]
        } to ${latestTeaching.period.endDate.toISOString().split("T")[0]}`
      );
      console.log(`  Sessions: ${latestTeaching.sessionMetrics?.total || 0}`);
      console.log(
        `  Students: ${latestTeaching.studentMetrics?.totalStudents || 0}`
      );
      console.log(
        `  Rating: ${
          latestTeaching.ratings?.overall?.average?.toFixed(2) || "N/A"
        }`
      );
      console.log(
        `  Earnings: $${latestTeaching.earnings?.net?.toLocaleString() || 0}`
      );
    } else {
      log.warning("No teaching analytics found");
    }

    // Get latest learning analytics
    const latestLearning = await LearningAnalytics.findOne()
      .sort({ "period.endDate": -1 })
      .populate("learner", "name email");

    if (latestLearning) {
      log.success("Latest Learning Analytics:");
      console.log(`  Learner: ${latestLearning.learner?.name || "Unknown"}`);
      console.log(
        `  Period: ${
          latestLearning.period.startDate.toISOString().split("T")[0]
        } to ${latestLearning.period.endDate.toISOString().split("T")[0]}`
      );
      console.log(
        `  Sessions: ${latestLearning.sessionMetrics?.totalSessions || 0}`
      );
      console.log(
        `  Progress: ${(
          latestLearning.progressMetrics?.overallProgress || 0
        ).toFixed(1)}%`
      );
    } else {
      log.warning("No learning analytics found");
    }
  } catch (error) {
    log.error(`Sample data verification failed: ${error.message}`);
  }
};

// Generate Summary Report
const generateSummary = async () => {
  log.section("SUMMARY REPORT");

  try {
    const summary = {
      teachingAnalytics: await TeachingAnalytics.countDocuments(),
      learningAnalytics: await LearningAnalytics.countDocuments(),
      assessments: await Assessment.countDocuments(),
      assessmentAttempts: await AssessmentAttempt.countDocuments(),
      analyticsReports: await AnalyticsReport.countDocuments(),
      tutors: await User.countDocuments({ role: "tutor" }),
      learners: await User.countDocuments({ role: "learner" }),
      sessions: await Session.countDocuments(),
    };

    console.log("\n📊 DATABASE STATISTICS:");
    console.table(summary);

    // Recommendations
    log.section("RECOMMENDATIONS");

    if (summary.tutors === 0) {
      log.warning("Create tutor accounts to test teaching analytics");
    }

    if (summary.sessions === 0) {
      log.warning("Create sessions to populate analytics data");
    }

    if (summary.teachingAnalytics === 0) {
      log.warning("Run 'npm run db:seed-analytics' to generate sample data");
    }

    if (summary.teachingAnalytics > 0) {
      log.success("Teaching analytics data is available!");
      log.info("Frontend can now fetch and display analytics");
    }

    // Check for recent analytics
    const recentAnalytics = await TeachingAnalytics.findOne({
      "period.endDate": {
        $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      },
    });

    if (recentAnalytics) {
      log.success("Recent analytics data found (within last 90 days)");
    } else if (summary.teachingAnalytics > 0) {
      log.warning("Analytics data exists but may be outdated");
      log.info("Consider regenerating analytics for recent periods");
    }
  } catch (error) {
    log.error(`Summary generation failed: ${error.message}`);
  }
};

// Main verification function
const runVerification = async () => {
  console.log(`\n${colors.magenta}${"=".repeat(60)}`);
  console.log("📊 ANALYTICS SETUP VERIFICATION");
  console.log(`${"=".repeat(60)}${colors.reset}\n`);

  try {
    await connectDB();
    await verifyModels();
    await verifyIndexes();
    await verifyDataIntegrity();
    await verifyStaticMethods();
    await verifySampleData();
    await generateSummary();

    log.section("VERIFICATION COMPLETE");
    log.success("All checks completed!");
  } catch (error) {
    log.error(`Verification failed: ${error.message}`);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    log.info("Database connection closed");
    process.exit(0);
  }
};

// Run verification
runVerification();
