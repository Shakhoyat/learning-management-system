/**
 * Create Database Indexes for Teaching Analytics Visualization Models
 * Ensures optimal query performance for heatmap and distribution queries
 */

require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/lms-db";

async function createVisualizationIndexes() {
  try {
    console.log(
      "🔧 Creating indexes for Teaching Analytics Visualization models..."
    );

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;

    // ==================================================
    // STUDENT ENGAGEMENT INDEXES
    // ==================================================
    console.log("\n📊 Creating StudentEngagement indexes...");

    await db
      .collection("studentengagements")
      .createIndex(
        { tutor: 1, activityDate: -1 },
        { name: "tutor_activityDate_idx", background: true }
      );

    await db
      .collection("studentengagements")
      .createIndex(
        { student: 1, activityDate: -1 },
        { name: "student_activityDate_idx", background: true }
      );

    await db
      .collection("studentengagements")
      .createIndex(
        { tutor: 1, dayOfWeek: 1, hourOfDay: 1 },
        { name: "tutor_day_hour_idx", background: true }
      );

    await db
      .collection("studentengagements")
      .createIndex(
        { activityDate: 1, tutor: 1 },
        { name: "activityDate_tutor_idx", background: true }
      );

    await db
      .collection("studentengagements")
      .createIndex(
        { tutor: 1, student: 1, activityDate: -1 },
        { name: "tutor_student_date_idx", background: true }
      );

    console.log("   ✅ Created 5 indexes for StudentEngagement");

    // ==================================================
    // STUDENT PERFORMANCE INDEXES
    // ==================================================
    console.log("\n📈 Creating StudentPerformance indexes...");

    await db
      .collection("studentperformances")
      .createIndex(
        { tutor: 1, recordDate: -1 },
        { name: "tutor_recordDate_idx", background: true }
      );

    await db
      .collection("studentperformances")
      .createIndex(
        { student: 1, recordDate: -1 },
        { name: "student_recordDate_idx", background: true }
      );

    await db
      .collection("studentperformances")
      .createIndex(
        { tutor: 1, category: 1, recordDate: -1 },
        { name: "tutor_category_date_idx", background: true }
      );

    await db
      .collection("studentperformances")
      .createIndex(
        { "score.value": 1, tutor: 1 },
        { name: "score_tutor_idx", background: true }
      );

    await db
      .collection("studentperformances")
      .createIndex(
        { tutor: 1, "score.value": 1 },
        { name: "tutor_score_idx", background: true }
      );

    await db
      .collection("studentperformances")
      .createIndex(
        { skill: 1, recordDate: -1 },
        { name: "skill_recordDate_idx", background: true }
      );

    console.log("   ✅ Created 6 indexes for StudentPerformance");

    // ==================================================
    // ATTENDANCE ASSIGNMENT INDEXES
    // ==================================================
    console.log("\n📅 Creating AttendanceAssignment indexes...");

    await db
      .collection("attendanceassignments")
      .createIndex(
        { tutor: 1, date: -1 },
        { name: "tutor_date_idx", background: true }
      );

    await db
      .collection("attendanceassignments")
      .createIndex(
        { student: 1, date: -1 },
        { name: "student_date_idx", background: true }
      );

    await db
      .collection("attendanceassignments")
      .createIndex(
        { tutor: 1, year: 1, month: 1 },
        { name: "tutor_year_month_idx", background: true }
      );

    await db
      .collection("attendanceassignments")
      .createIndex(
        { date: 1, tutor: 1, student: 1 },
        {
          name: "date_tutor_student_unique_idx",
          unique: true,
          background: true,
        }
      );

    await db
      .collection("attendanceassignments")
      .createIndex(
        { tutor: 1, "dailyMetrics.consistencyScore": -1 },
        { name: "tutor_consistency_idx", background: true }
      );

    await db
      .collection("attendanceassignments")
      .createIndex(
        { student: 1, year: 1, weekOfYear: 1 },
        { name: "student_year_week_idx", background: true }
      );

    console.log("   ✅ Created 6 indexes for AttendanceAssignment");

    // ==================================================
    // VERIFY INDEXES
    // ==================================================
    console.log("\n🔍 Verifying all indexes...");

    const engagementIndexes = await db
      .collection("studentengagements")
      .indexes();
    const performanceIndexes = await db
      .collection("studentperformances")
      .indexes();
    const attendanceIndexes = await db
      .collection("attendanceassignments")
      .indexes();

    console.log(`\n📊 StudentEngagement indexes: ${engagementIndexes.length}`);
    engagementIndexes.forEach((idx) => {
      console.log(`   - ${idx.name}`);
    });

    console.log(
      `\n📈 StudentPerformance indexes: ${performanceIndexes.length}`
    );
    performanceIndexes.forEach((idx) => {
      console.log(`   - ${idx.name}`);
    });

    console.log(
      `\n📅 AttendanceAssignment indexes: ${attendanceIndexes.length}`
    );
    attendanceIndexes.forEach((idx) => {
      console.log(`   - ${idx.name}`);
    });

    console.log("\n" + "=".repeat(60));
    console.log("🎉 ALL INDEXES CREATED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n✅ Total indexes created: 17");
    console.log("✅ All visualization queries are now optimized!");
    console.log("\n" + "=".repeat(60));
  } catch (error) {
    console.error("❌ Index creation error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);
  }
}

// Run index creation
createVisualizationIndexes();
