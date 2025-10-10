/**
 * Complete Database Reset and Seeding Script
 * Cleans the database and seeds all data including visualization data
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const Skill = require("./src/models/Skill");
const Session = require("./src/models/Session");
const Payment = require("./src/models/Payment");
const Notification = require("./src/models/Notification");
const TeachingAnalytics = require("./src/models/TeachingAnalytics");
const LearningAnalytics = require("./src/models/LearningAnalytics");
const { Assessment, AssessmentAttempt } = require("./src/models/Assessment");
const AnalyticsReport = require("./src/models/AnalyticsReport");
const StudentEngagement = require("./src/models/StudentEngagement");
const StudentPerformance = require("./src/models/StudentPerformance");
const AttendanceAssignment = require("./src/models/AttendanceAssignment");
const bcrypt = require("bcryptjs");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/lms-db";

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

async function cleanAndSeedDatabase() {
  try {
    console.log("\n" + "=".repeat(70));
    console.log("🧹 DATABASE CLEANUP AND COMPLETE SEEDING");
    console.log("=".repeat(70));

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("\n✅ Connected to MongoDB");

    // ===== STEP 1: CLEAN DATABASE =====
    console.log("\n🧹 Step 1: Cleaning database...");

    const collections = [
      { model: User, name: "Users" },
      { model: Skill, name: "Skills" },
      { model: Session, name: "Sessions" },
      { model: Payment, name: "Payments" },
      { model: Notification, name: "Notifications" },
      { model: TeachingAnalytics, name: "TeachingAnalytics" },
      { model: LearningAnalytics, name: "LearningAnalytics" },
      { model: Assessment, name: "Assessments" },
      { model: AssessmentAttempt, name: "AssessmentAttempts" },
      { model: AnalyticsReport, name: "AnalyticsReports" },
      { model: StudentEngagement, name: "StudentEngagement" },
      { model: StudentPerformance, name: "StudentPerformance" },
      { model: AttendanceAssignment, name: "AttendanceAssignment" },
    ];

    for (const { model, name } of collections) {
      const count = await model.countDocuments();
      await model.deleteMany({});
      console.log(`   ✓ Cleared ${name}: ${count} documents deleted`);
    }

    console.log("\n✅ Database cleaned successfully!");

    // ===== STEP 2: SEED USERS =====
    console.log("\n👥 Step 2: Seeding users...");

    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create tutors
    const tutors = [];
    for (let i = 1; i <= 5; i++) {
      tutors.push({
        name: `Tutor ${i}`,
        email: `tutor${i}@example.com`,
        auth: {
          passwordHash: hashedPassword,
          emailVerified: true,
          isActive: true,
        },
        role: "tutor",
        bio: `Experienced tutor specializing in various subjects`,
        hourlyRate: random(20, 50),
        avatar: `https://i.pravatar.cc/150?img=${i}`,
        timezone: "UTC",
        location: {
          city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
            i - 1
          ],
          country: "USA",
        },
      });
    }

    const createdTutors = await User.insertMany(tutors);
    console.log(`   ✓ Created ${createdTutors.length} tutors`);

    // Create learners
    const learners = [];
    for (let i = 1; i <= 20; i++) {
      learners.push({
        name: `Student ${i}`,
        email: `student${i}@example.com`,
        auth: {
          passwordHash: hashedPassword,
          emailVerified: true,
          isActive: true,
        },
        role: "learner",
        bio: `Enthusiastic learner eager to gain knowledge`,
        avatar: `https://i.pravatar.cc/150?img=${i + 20}`,
        timezone: "UTC",
        location: {
          city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
            i % 5
          ],
          country: "USA",
        },
      });
    }

    const createdLearners = await User.insertMany(learners);
    console.log(`   ✓ Created ${createdLearners.length} learners`);

    // ===== STEP 3: SEED SKILLS =====
    console.log("\n🎯 Step 3: Seeding skills...");

    const skillsData = [
      {
        name: "JavaScript",
        category: "Programming",
        difficulty: 5,
        averageLearningHours: 40,
        description: "Learn modern JavaScript programming",
      },
      {
        name: "Python",
        category: "Programming",
        difficulty: 3,
        averageLearningHours: 30,
        description: "Introduction to Python programming",
      },
      {
        name: "React",
        category: "Web Development",
        difficulty: 6,
        averageLearningHours: 50,
        description: "Build modern web applications with React",
      },
      {
        name: "Data Science",
        category: "Data Analysis",
        difficulty: 8,
        averageLearningHours: 80,
        description: "Data analysis and machine learning fundamentals",
      },
      {
        name: "Mathematics",
        category: "Academic",
        difficulty: 6,
        averageLearningHours: 60,
        description: "High school and college mathematics",
      },
      {
        name: "English",
        category: "Language",
        difficulty: 4,
        averageLearningHours: 50,
        description: "English language and grammar",
      },
      {
        name: "Graphic Design",
        category: "Design",
        difficulty: 5,
        averageLearningHours: 45,
        description: "Visual design principles and tools",
      },
      {
        name: "SQL",
        category: "Database",
        difficulty: 4,
        averageLearningHours: 25,
        description: "Database querying and management",
      },
      {
        name: "Node.js",
        category: "Backend",
        difficulty: 6,
        averageLearningHours: 40,
        description: "Server-side JavaScript development",
      },
      {
        name: "Machine Learning",
        category: "AI",
        difficulty: 9,
        averageLearningHours: 100,
        description: "Introduction to machine learning",
      },
    ];

    const skills = await Skill.insertMany(skillsData);
    console.log(`   ✓ Created ${skills.length} skills`);

    // Assign skills to tutors
    for (const tutor of createdTutors) {
      const numSkills = random(2, 4);
      const tutorSkills = [];
      for (let i = 0; i < numSkills; i++) {
        tutorSkills.push({
          skillId: skills[random(0, skills.length - 1)]._id,
          level: random(5, 10), // Skill proficiency level 5-10
          hourlyRate: tutor.hourlyRate,
        });
      }
      tutor.teachingSkills = tutorSkills;
      await tutor.save();
    }

    // Assign skills to learners
    for (const learner of createdLearners) {
      const numSkills = random(1, 3);
      const learnerSkills = [];
      for (let i = 0; i < numSkills; i++) {
        learnerSkills.push({
          skillId: skills[random(0, skills.length - 1)]._id,
          currentLevel: random(1, 5), // Current proficiency 1-5
          targetLevel: random(6, 10), // Target proficiency 6-10
          progress: random(10, 80),
        });
      }
      learner.learningSkills = learnerSkills;
      await learner.save();
    }

    console.log(`   ✓ Assigned skills to users`);

    // ===== STEP 4: SEED SESSIONS =====
    console.log("\n📅 Step 4: Seeding sessions...");

    const sessions = [];
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    for (let i = 0; i < 100; i++) {
      const tutor = createdTutors[random(0, createdTutors.length - 1)];
      const learner = createdLearners[random(0, createdLearners.length - 1)];
      const skill = skills[random(0, skills.length - 1)];
      const scheduledDate = randomDate(sixMonthsAgo, now);
      const duration = [30, 60, 90, 120][random(0, 3)];
      const hourlyRate = random(20, 50); // Generate hourly rate
      const totalAmount = (hourlyRate * duration) / 60;

      const statuses = ["completed", "scheduled", "cancelled", "no_show"];
      const weights = [0.7, 0.15, 0.1, 0.05]; // 70% completed
      let status = statuses[0];
      const rand = Math.random();
      let cumulative = 0;
      for (let j = 0; j < weights.length; j++) {
        cumulative += weights[j];
        if (rand < cumulative) {
          status = statuses[j];
          break;
        }
      }

      sessions.push({
        tutor: tutor._id,
        learner: learner._id,
        skill: skill._id,
        title: `${skill.name} Session ${i + 1}`,
        description: `Learning session for ${skill.name}`,
        scheduledDate,
        duration,
        timezone: "UTC",
        status,
        meetingDetails: {
          platform: "zoom",
          meetingUrl: `https://zoom.us/j/${random(1000000, 9999999)}`,
          meetingId: `${random(100, 999)}-${random(100, 999)}-${random(
            100,
            999
          )}`,
        },
        pricing: {
          hourlyRate,
          totalAmount,
          currency: "USD",
          paymentStatus: status === "completed" ? "paid" : "pending",
        },
      });
    }

    const createdSessions = await Session.insertMany(sessions);
    console.log(`   ✓ Created ${createdSessions.length} sessions`);

    // ===== STEP 5: SEED ASSESSMENTS =====
    console.log("\n📝 Step 5: Seeding assessments...");

    const assessments = [];
    const completedSessions = createdSessions.filter(
      (s) => s.status === "completed"
    );

    for (let i = 0; i < Math.min(30, completedSessions.length); i++) {
      const session = completedSessions[i];
      assessments.push({
        title: `Assessment ${i + 1}`,
        description: "Test your knowledge",
        type: ["quiz", "test", "assignment"][random(0, 2)],
        skill: session.skill,
        session: session._id,
        createdBy: session.tutor,
        config: {
          difficulty: ["beginner", "intermediate", "advanced"][random(0, 2)],
          timeLimit: [30, 60, 90][random(0, 2)],
          passingScore: 70,
          attemptsAllowed: random(1, 3),
        },
        questions: [
          {
            questionId: `q${i + 1}_1`,
            type: "multiple_choice",
            question: "Sample question?",
            points: 10,
            options: [
              { optionId: "a", text: "Option A", isCorrect: true },
              { optionId: "b", text: "Option B", isCorrect: false },
            ],
          },
        ],
        grading: {
          totalPoints: 10,
          autoGrade: true,
        },
        status: "published",
      });
    }

    const createdAssessments = await Assessment.insertMany(assessments);
    console.log(`   ✓ Created ${createdAssessments.length} assessments`);

    // ===== STEP 6: SEED VISUALIZATION DATA =====
    console.log("\n📊 Step 6: Seeding visualization data...");

    // Student Engagement
    const engagementRecords = [];
    for (const tutor of createdTutors) {
      const tutorSessions = createdSessions.filter(
        (s) => s.tutor.toString() === tutor._id.toString()
      );
      const tutorLearners = [
        ...new Set(tutorSessions.map((s) => s.learner.toString())),
      ];

      for (const learnerId of tutorLearners) {
        const numRecords = random(20, 60);
        for (let i = 0; i < numRecords; i++) {
          const activityDate = randomDate(sixMonthsAgo, now);
          const dayOfWeek = activityDate.getDay();
          const hourOfDay = random(8, 22);

          engagementRecords.push({
            student: learnerId,
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
            skill: skills[random(0, skills.length - 1)]._id,
          });
        }
      }
    }

    await StudentEngagement.insertMany(engagementRecords);
    console.log(`   ✓ Created ${engagementRecords.length} engagement records`);

    // Student Performance
    const performanceRecords = [];
    for (const tutor of createdTutors) {
      const tutorSessions = createdSessions.filter(
        (s) => s.tutor.toString() === tutor._id.toString()
      );
      const tutorLearners = [
        ...new Set(tutorSessions.map((s) => s.learner.toString())),
      ];

      for (const learnerId of tutorLearners) {
        const categories = ["quiz", "test", "assignment", "overall"];
        for (const category of categories) {
          const numRecords = random(5, 10);
          let previousScore = random(60, 85);

          for (let i = 0; i < numRecords; i++) {
            const recordDate = randomDate(sixMonthsAgo, now);
            const improvement = random(-10, 15);
            let currentScore = Math.max(
              0,
              Math.min(100, previousScore + improvement)
            );

            // Add distribution variation
            const distribution = Math.random();
            if (distribution < 0.1) currentScore = random(0, 60);
            else if (distribution < 0.7) currentScore = random(60, 85);
            else currentScore = random(85, 100);

            performanceRecords.push({
              student: learnerId,
              tutor: tutor._id,
              recordDate,
              academicPeriod: "monthly",
              score: { value: currentScore },
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
              trend: { previousScore },
            });

            previousScore = currentScore;
          }
        }
      }
    }

    await StudentPerformance.insertMany(performanceRecords);
    console.log(
      `   ✓ Created ${performanceRecords.length} performance records`
    );

    // Attendance & Assignment
    const attendanceRecords = [];
    const allDates = [];
    const currentDate = new Date(sixMonthsAgo);
    while (currentDate <= now) {
      allDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    for (const tutor of createdTutors) {
      const tutorSessions = createdSessions.filter(
        (s) => s.tutor.toString() === tutor._id.toString()
      );
      const tutorLearners = [
        ...new Set(tutorSessions.map((s) => s.learner.toString())),
      ];

      for (const learnerId of tutorLearners) {
        for (const date of allDates) {
          const dayOfWeek = date.getDay();
          const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
          const shouldHaveRecord = Math.random() < (isWeekday ? 0.6 : 0.2);

          if (shouldHaveRecord) {
            const recordDate = new Date(date);
            recordDate.setHours(0, 0, 0, 0);

            const isPresent = Math.random() < 0.85;
            const punctuality = isPresent
              ? ["on_time", "late", "very_late"][
                  Math.random() < 0.8 ? 0 : Math.random() < 0.5 ? 1 : 2
                ]
              : undefined;

            const numAssignments = isWeekday ? random(0, 2) : random(0, 1);
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
              student: learnerId,
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

            if (punctuality) {
              attendanceData.attendance.punctuality = punctuality;
            }

            attendanceRecords.push(attendanceData);
          }
        }
      }
    }

    await AttendanceAssignment.insertMany(attendanceRecords);
    console.log(`   ✓ Created ${attendanceRecords.length} attendance records`);

    // ===== SUMMARY =====
    console.log("\n" + "=".repeat(70));
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(70));
    console.log("\n📊 Summary:");
    console.log(`   • Tutors: ${createdTutors.length}`);
    console.log(`   • Learners: ${createdLearners.length}`);
    console.log(`   • Skills: ${skills.length}`);
    console.log(`   • Sessions: ${createdSessions.length}`);
    console.log(`   • Assessments: ${createdAssessments.length}`);
    console.log(`   • Engagement Records: ${engagementRecords.length}`);
    console.log(`   • Performance Records: ${performanceRecords.length}`);
    console.log(`   • Attendance Records: ${attendanceRecords.length}`);
    console.log(
      `   • Total Records: ${
        createdTutors.length +
        createdLearners.length +
        skills.length +
        createdSessions.length +
        createdAssessments.length +
        engagementRecords.length +
        performanceRecords.length +
        attendanceRecords.length
      }`
    );

    console.log("\n🔑 Test Credentials:");
    console.log("   Tutor: tutor1@example.com / password123");
    console.log("   Student: student1@example.com / password123");

    console.log("\n✅ Database is ready for use!");
    console.log("=".repeat(70) + "\n");
  } catch (error) {
    console.error("\n❌ Seeding error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("✅ Database connection closed\n");
    process.exit(0);
  }
}

// Run the script
cleanAndSeedDatabase();
