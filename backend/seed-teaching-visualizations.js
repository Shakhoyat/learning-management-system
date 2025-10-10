/**
 * Seed Teaching Analytics Visualization Data
 * Populates StudentEngagement, StudentPerformance, and AttendanceAssignment models
 * with sample data for heatmap and distribution visualizations
 */

require("dotenv").config();
const mongoose = require("mongoose");
const StudentEngagement = require("./src/models/StudentEngagement");
const StudentPerformance = require("./src/models/StudentPerformance");
const AttendanceAssignment = require("./src/models/AttendanceAssignment");
const User = require("./src/models/User");
const Session = require("./src/models/Session");
const Skill = require("./src/models/Skill");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/lms-db";

// Helper: Random number generator
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: Random date within range
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Helper: Generate date array
const generateDateRange = (start, end) => {
  const dates = [];
  const currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

async function seedVisualizationData() {
  try {
    console.log("🌱 Starting Teaching Analytics Visualization Data Seeding...");

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get tutors, learners, sessions, and skills
    const tutors = await User.find({ role: "tutor" }).limit(5);
    const learners = await User.find({ role: "learner" }).limit(20);
    const sessions = await Session.find().populate("tutor learner skill");
    const skills = await Skill.find().limit(10);

    if (tutors.length === 0 || learners.length === 0) {
      console.log("❌ No tutors or learners found. Please seed users first.");
      return;
    }

    console.log(
      `📊 Found ${tutors.length} tutors, ${learners.length} learners, ${sessions.length} sessions`
    );

    // Clear existing data
    await StudentEngagement.deleteMany({});
    await StudentPerformance.deleteMany({});
    await AttendanceAssignment.deleteMany({});
    console.log("🗑️  Cleared existing visualization data");

    // Date ranges
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 180); // Last 6 months

    const allDates = generateDateRange(startDate, endDate);

    // ==================================================
    // 1. SEED STUDENT ENGAGEMENT (Activity Heatmap)
    // ==================================================
    console.log("\n📈 Seeding Student Engagement data...");
    const engagementRecords = [];

    for (const tutor of tutors) {
      // Get learners for this tutor (from sessions)
      const tutorSessions = sessions.filter(
        (s) => s.tutor._id.toString() === tutor._id.toString()
      );
      const tutorLearners = [
        ...new Set(tutorSessions.map((s) => s.learner._id.toString())),
      ];

      // Generate engagement records for each learner
      for (const learnerId of tutorLearners) {
        const learner = learners.find((l) => l._id.toString() === learnerId);
        if (!learner) continue;

        // Generate 30-90 random engagement records
        const numRecords = random(30, 90);

        for (let i = 0; i < numRecords; i++) {
          const activityDate = randomDate(startDate, endDate);
          const dayOfWeek = activityDate.getDay();
          const hourOfDay = random(8, 22); // Active hours: 8 AM - 10 PM

          // More activity during weekdays and peak hours (10 AM - 8 PM)
          const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
          const isPeakHour = hourOfDay >= 10 && hourOfDay <= 20;
          const activityBonus = (isWeekday ? 0.3 : 0) + (isPeakHour ? 0.3 : 0);

          const shouldHaveActivity = Math.random() < 0.3 + activityBonus;

          if (shouldHaveActivity) {
            const relatedSession = tutorSessions.find(
              (s) =>
                s.learner._id.toString() === learnerId &&
                Math.abs(
                  new Date(s.scheduledDate).getTime() - activityDate.getTime()
                ) <
                  7 * 24 * 60 * 60 * 1000
            );

            engagementRecords.push({
              student: learner._id,
              tutor: tutor._id,
              activityDate,
              dayOfWeek,
              hourOfDay,
              activities: {
                sessionAttended: Math.random() < 0.4,
                assignmentSubmitted: Math.random() < 0.2,
                messagesSent: random(0, 5),
                materialViewed: Math.random() < 0.3,
                assessmentTaken: Math.random() < 0.15,
              },
              durationMinutes: random(15, 120),
              session: relatedSession?._id,
              skill:
                relatedSession?.skill ||
                skills[random(0, skills.length - 1)]._id,
            });
          }
        }
      }
    }

    await StudentEngagement.insertMany(engagementRecords);
    console.log(`✅ Created ${engagementRecords.length} engagement records`);

    // ==================================================
    // 2. SEED STUDENT PERFORMANCE (Score Distribution)
    // ==================================================
    console.log("\n📊 Seeding Student Performance data...");
    const performanceRecords = [];

    for (const tutor of tutors) {
      const tutorSessions = sessions.filter(
        (s) => s.tutor._id.toString() === tutor._id.toString()
      );
      const tutorLearners = [
        ...new Set(tutorSessions.map((s) => s.learner._id.toString())),
      ];

      for (const learnerId of tutorLearners) {
        const learner = learners.find((l) => l._id.toString() === learnerId);
        if (!learner) continue;

        // Generate performance records across different categories
        const categories = ["quiz", "test", "assignment", "project", "overall"];

        for (const category of categories) {
          // Generate 5-15 records per category
          const numRecords = random(5, 15);
          let previousScore = random(60, 85); // Starting score

          for (let i = 0; i < numRecords; i++) {
            const recordDate = randomDate(startDate, endDate);

            // Simulate learning progress with gradual improvement
            const improvement = random(-10, 15);
            const currentScore = Math.max(
              0,
              Math.min(100, previousScore + improvement)
            );

            // Add some variation in score distribution
            // More scores in the 70-90 range (normal distribution)
            let finalScore;
            const distribution = Math.random();
            if (distribution < 0.1) {
              // 10% low performers (0-60)
              finalScore = random(0, 60);
            } else if (distribution < 0.7) {
              // 60% average performers (60-85)
              finalScore = random(60, 85);
            } else {
              // 30% high performers (85-100)
              finalScore = random(85, 100);
            }

            performanceRecords.push({
              student: learner._id,
              tutor: tutor._id,
              recordDate,
              academicPeriod: "monthly",
              score: {
                value: finalScore,
              },
              category,
              skill: skills[random(0, skills.length - 1)]._id,
              metrics: {
                attemptNumber: random(1, 3),
                timeSpent: random(15, 180),
                completionRate: random(70, 100),
                difficulty: ["beginner", "intermediate", "advanced"][
                  random(0, 2)
                ],
              },
              trend: {
                previousScore,
              },
            });

            previousScore = finalScore;
          }
        }
      }
    }

    await StudentPerformance.insertMany(performanceRecords);
    console.log(`✅ Created ${performanceRecords.length} performance records`);

    // ==================================================
    // 3. SEED ATTENDANCE & ASSIGNMENTS (Calendar Heatmap)
    // ==================================================
    console.log("\n📅 Seeding Attendance & Assignment data...");
    const attendanceRecords = [];

    for (const tutor of tutors) {
      const tutorSessions = sessions.filter(
        (s) => s.tutor._id.toString() === tutor._id.toString()
      );
      const tutorLearners = [
        ...new Set(tutorSessions.map((s) => s.learner._id.toString())),
      ];

      for (const learnerId of tutorLearners) {
        const learner = learners.find((l) => l._id.toString() === learnerId);
        if (!learner) continue;

        // Create attendance records for ~60% of days
        for (const date of allDates) {
          const dayOfWeek = date.getDay();
          const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

          // Higher probability on weekdays
          const shouldHaveRecord = Math.random() < (isWeekday ? 0.7 : 0.3);

          if (shouldHaveRecord) {
            const recordDate = new Date(date);
            recordDate.setHours(0, 0, 0, 0);

            // Attendance
            const isPresent = Math.random() < 0.85; // 85% attendance rate
            const punctuality = isPresent
              ? ["on_time", "late", "very_late"][
                  Math.random() < 0.8 ? 0 : Math.random() < 0.5 ? 1 : 2
                ]
              : undefined;

            // Assignments (0-3 per day)
            const numAssignments = isWeekday ? random(0, 3) : random(0, 1);
            const assignments = [];

            for (let i = 0; i < numAssignments; i++) {
              const dueDate = new Date(recordDate);
              dueDate.setDate(dueDate.getDate() - random(0, 3));

              const submittedOnTime = Math.random() < 0.75;
              const submittedDate = submittedOnTime
                ? dueDate
                : new Date(
                    dueDate.getTime() + random(1, 5) * 24 * 60 * 60 * 1000
                  );

              assignments.push({
                title: `Assignment ${i + 1}`,
                dueDate,
                submittedDate,
                status: submittedOnTime ? "submitted" : "late",
                score: random(60, 100),
                submittedOnTime,
                daysLate: submittedOnTime
                  ? 0
                  : Math.ceil(
                      (submittedDate - dueDate) / (1000 * 60 * 60 * 24)
                    ),
              });
            }

            const attendanceData = {
              student: learner._id,
              tutor: tutor._id,
              date: recordDate,
              attendance: {
                present: isPresent,
                minutesLate: punctuality === "late" ? random(5, 15) : 0,
                participationScore: isPresent ? random(6, 10) : 0,
              },
              assignments,
              skill: skills[random(0, skills.length - 1)]._id,
            };

            // Only add punctuality if present
            if (punctuality) {
              attendanceData.attendance.punctuality = punctuality;
            }

            attendanceRecords.push(attendanceData);
          }
        }
      }
    }

    await AttendanceAssignment.insertMany(attendanceRecords);
    console.log(
      `✅ Created ${attendanceRecords.length} attendance/assignment records`
    );

    // ==================================================
    // SUMMARY
    // ==================================================
    console.log("\n" + "=".repeat(60));
    console.log("🎉 SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n📊 Summary:");
    console.log(`   • Student Engagement Records: ${engagementRecords.length}`);
    console.log(
      `   • Student Performance Records: ${performanceRecords.length}`
    );
    console.log(
      `   • Attendance/Assignment Records: ${attendanceRecords.length}`
    );
    console.log(
      `   • Total Records Created: ${
        engagementRecords.length +
        performanceRecords.length +
        attendanceRecords.length
      }`
    );
    console.log("\n✅ Teaching Analytics visualization data is ready!");
    console.log("\n📈 Available Visualizations:");
    console.log("   1. Activity Heatmap (Day vs. Time)");
    console.log("   2. Score Distribution Histogram");
    console.log("   3. Calendar Heatmap (Attendance & Assignments)");
    console.log("\n🚀 You can now test the new API endpoints:");
    console.log("   GET /api/analytics/teaching/engagement-heatmap");
    console.log("   GET /api/analytics/teaching/score-distribution");
    console.log("   GET /api/analytics/teaching/calendar-heatmap");

    console.log("\n" + "=".repeat(60));
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);
  }
}

// Run seeding
seedVisualizationData();
