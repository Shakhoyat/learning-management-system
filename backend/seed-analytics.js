/**
 * Analytics Data Seeding Script
 * Generates sample teaching and learning analytics data for testing
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./src/models/User");
const Session = require("./src/models/Session");
const Skill = require("./src/models/Skill");
const TeachingAnalytics = require("./src/models/TeachingAnalytics");
const LearningAnalytics = require("./src/models/LearningAnalytics");
const { Assessment, AssessmentAttempt } = require("./src/models/Assessment");
const AnalyticsReport = require("./src/models/AnalyticsReport");

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
    console.log("✅ MongoDB connected for seeding analytics data");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// Helper function to generate random date in range
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Helper function to generate random number in range
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to generate random float
const randomFloat = (min, max, decimals = 2) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

// Generate Teaching Analytics
const generateTeachingAnalytics = async () => {
  console.log("\n📊 Generating Teaching Analytics...");

  try {
    // Get all tutors
    const tutors = await User.find({ role: "tutor" }).limit(10);

    if (tutors.length === 0) {
      console.log("⚠️ No tutors found. Skipping teaching analytics.");
      return;
    }

    const periods = ["weekly", "monthly"];
    const startDate = new Date("2025-07-01");
    const endDate = new Date("2025-10-10");

    let analyticsCount = 0;

    for (const tutor of tutors) {
      // Generate analytics for last 3 months
      for (let i = 0; i < 3; i++) {
        const periodStart = new Date(endDate);
        periodStart.setMonth(periodStart.getMonth() - i - 1);
        periodStart.setDate(1);

        const periodEnd = new Date(periodStart);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        periodEnd.setDate(0);

        // Check if analytics already exists
        const existing = await TeachingAnalytics.findOne({
          tutor: tutor._id,
          "period.startDate": periodStart,
          "period.endDate": periodEnd,
        });

        if (existing) {
          console.log(
            `  ⏭️  Analytics already exists for ${tutor.name} (${
              periodStart.toISOString().split("T")[0]
            })`
          );
          continue;
        }

        const analytics = new TeachingAnalytics({
          tutor: tutor._id,
          period: {
            type: "monthly",
            startDate: periodStart,
            endDate: periodEnd,
            year: periodStart.getFullYear(),
            month: periodStart.getMonth() + 1,
          },
          sessionMetrics: {
            total: randomInt(15, 40),
            completed: randomInt(12, 35),
            cancelled: randomInt(0, 3),
            noShow: randomInt(0, 2),
            completionRate: randomFloat(0.8, 0.98),
            totalHours: randomFloat(30, 80),
            averageDuration: randomInt(45, 90),
          },
          studentMetrics: {
            totalStudents: randomInt(8, 20),
            newStudents: randomInt(2, 8),
            returningStudents: randomInt(5, 15),
            retentionRate: randomFloat(0.7, 0.95),
            averageStudentSatisfaction: randomFloat(4.0, 5.0),
            studentsByLevel: {
              beginner: randomInt(2, 8),
              intermediate: randomInt(3, 10),
              advanced: randomInt(1, 5),
            },
          },
          ratings: {
            overall: {
              average: randomFloat(4.2, 5.0),
              total: randomInt(10, 30),
              distribution: {
                fiveStar: randomInt(8, 20),
                fourStar: randomInt(2, 8),
                threeStar: randomInt(0, 2),
                twoStar: 0,
                oneStar: 0,
              },
            },
            categories: {
              communication: randomFloat(4.3, 5.0),
              knowledge: randomFloat(4.5, 5.0),
              punctuality: randomFloat(4.2, 5.0),
              effectiveness: randomFloat(4.3, 5.0),
              preparation: randomFloat(4.4, 5.0),
            },
            trend:
              randomInt(0, 2) === 0
                ? "improving"
                : randomInt(0, 1) === 0
                ? "stable"
                : "declining",
          },
          earnings: {
            gross: randomFloat(1000, 4000),
            platformFees: randomFloat(150, 600),
            net: randomFloat(850, 3400),
            currency: "USD",
            averageHourlyRate: randomFloat(25, 60),
            projectedMonthlyEarnings: randomFloat(1200, 4500),
            earningsGrowth: randomFloat(-5, 25),
          },
          engagement: {
            responseTime: {
              average: randomInt(15, 180),
              median: randomInt(10, 120),
            },
            messagesExchanged: randomInt(50, 200),
            materialShared: randomInt(10, 40),
            profileViews: randomInt(20, 100),
            bookingRequests: {
              total: randomInt(20, 50),
              accepted: randomInt(15, 45),
              declined: randomInt(0, 5),
              acceptanceRate: randomFloat(0.85, 0.98),
            },
          },
          scheduleMetrics: {
            availableSlots: randomInt(40, 80),
            bookedSlots: randomInt(20, 60),
            utilizationRate: randomFloat(0.5, 0.85),
            peakHours: [
              { hour: 14, count: randomInt(3, 8) },
              { hour: 15, count: randomInt(4, 10) },
              { hour: 18, count: randomInt(5, 12) },
            ],
            peakDays: [
              { day: "Monday", count: randomInt(4, 8) },
              { day: "Wednesday", count: randomInt(5, 10) },
              { day: "Thursday", count: randomInt(4, 9) },
            ],
          },
          studentOutcomes: {
            totalStudentsImproved: randomInt(10, 18),
            averageProgressGain: randomFloat(1.5, 3.5),
            studentsReachingGoals: randomInt(3, 8),
            goalsAchievementRate: randomFloat(0.3, 0.7),
            repeatStudentRate: randomFloat(0.6, 0.9),
          },
          qualityMetrics: {
            preparationScore: randomFloat(7, 10),
            consistencyScore: randomFloat(7.5, 10),
            professionalismScore: randomFloat(8, 10),
            overallQualityScore: randomFloat(7.5, 10),
          },
          growth: {
            sessionGrowth: randomFloat(-5, 30),
            studentGrowth: randomFloat(-3, 25),
            earningsGrowth: randomFloat(-5, 35),
            ratingGrowth: randomFloat(-2, 5),
          },
          achievements: [
            {
              type: "sessions_milestone",
              title: "50 Sessions Completed",
              description: "Completed 50 teaching sessions",
              earnedAt: randomDate(periodStart, periodEnd),
              value: 50,
            },
          ],
          metadata: {
            lastCalculated: new Date(),
            dataQuality: "complete",
          },
        });

        await analytics.save();
        analyticsCount++;
        console.log(
          `  ✅ Created teaching analytics for ${tutor.name} (${
            periodStart.toISOString().split("T")[0]
          })`
        );
      }
    }

    console.log(`\n✅ Created ${analyticsCount} teaching analytics records`);
  } catch (error) {
    console.error("❌ Error generating teaching analytics:", error);
  }
};

// Generate Learning Analytics
const generateLearningAnalytics = async () => {
  console.log("\n📚 Generating Learning Analytics...");

  try {
    // Get all learners
    const learners = await User.find({ role: "learner" }).limit(10);

    if (learners.length === 0) {
      console.log("⚠️ No learners found. Skipping learning analytics.");
      return;
    }

    const endDate = new Date("2025-10-10");
    let analyticsCount = 0;

    for (const learner of learners) {
      // Generate analytics for last 3 months
      for (let i = 0; i < 3; i++) {
        const periodStart = new Date(endDate);
        periodStart.setMonth(periodStart.getMonth() - i - 1);
        periodStart.setDate(1);

        const periodEnd = new Date(periodStart);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        periodEnd.setDate(0);

        // Check if analytics already exists
        const existing = await LearningAnalytics.findOne({
          learner: learner._id,
          "period.startDate": periodStart,
          "period.endDate": periodEnd,
        });

        if (existing) {
          console.log(
            `  ⏭️  Analytics already exists for ${learner.name} (${
              periodStart.toISOString().split("T")[0]
            })`
          );
          continue;
        }

        const skillsInProgress = randomInt(2, 5);
        const skillsCompleted = randomInt(0, 3);

        const analytics = new LearningAnalytics({
          learner: learner._id,
          period: {
            type: "monthly",
            startDate: periodStart,
            endDate: periodEnd,
            year: periodStart.getFullYear(),
            month: periodStart.getMonth() + 1,
          },
          sessionMetrics: {
            total: randomInt(10, 30),
            completed: randomInt(8, 28),
            cancelled: randomInt(0, 2),
            noShow: randomInt(0, 1),
            completionRate: randomFloat(0.85, 0.98),
            totalHours: randomFloat(20, 60),
            averageDuration: randomInt(60, 90),
            sessionsPerWeek: randomFloat(2, 8),
          },
          learningProgress: {
            skillsInProgress,
            skillsCompleted,
            skillsStarted: skillsInProgress + skillsCompleted,
            averageProgress: randomFloat(0.4, 0.85),
            totalProgressGain: randomFloat(2, 6),
            averageLevelImprovement: randomFloat(1, 3),
          },
          outcomes: {
            goalsAchieved: randomInt(1, 4),
            goalsInProgress: randomInt(2, 6),
            goalsAchievementRate: randomFloat(0.3, 0.7),
            milestonesReached: randomInt(2, 8),
            certificationsEarned: randomInt(0, 2),
          },
          engagement: {
            loginDays: randomInt(15, 30),
            streakDays: randomInt(3, 15),
            longestStreak: randomInt(5, 21),
            messagesExchanged: randomInt(30, 150),
            materialsReviewed: randomInt(10, 40),
            notesCreated: randomInt(5, 25),
            questionsAsked: randomInt(8, 30),
            engagementScore: randomFloat(6, 10),
          },
          tutorMetrics: {
            totalTutors: randomInt(2, 5),
            primaryTutors: randomInt(1, 3),
            averageTutorRating: randomFloat(4.2, 5.0),
            tutorFeedbackGiven: randomInt(5, 20),
          },
          learningPatterns: {
            preferredDays: [
              { day: "Monday", count: randomInt(2, 6) },
              { day: "Wednesday", count: randomInt(3, 7) },
              { day: "Saturday", count: randomInt(4, 8) },
            ],
            preferredHours: [
              { hour: 18, count: randomInt(3, 8) },
              { hour: 19, count: randomInt(4, 10) },
              { hour: 20, count: randomInt(3, 7) },
            ],
            averageSessionsPerWeek: randomFloat(2, 6),
            preferredLearningStyle: [
              "visual",
              "auditory",
              "kinesthetic",
              "mixed",
            ][randomInt(0, 3)],
            peakProductivityTime: ["morning", "afternoon", "evening"][
              randomInt(0, 2)
            ],
          },
          performance: {
            comprehensionScore: randomFloat(6, 10),
            retentionScore: randomFloat(6.5, 10),
            applicationScore: randomFloat(6, 9.5),
            overallPerformance: randomFloat(6.5, 9.5),
            performanceTrend: ["improving", "stable", "declining"][
              randomInt(0, 2)
            ],
          },
          spending: {
            totalInvested: randomFloat(500, 2000),
            averageCostPerSession: randomFloat(30, 80),
            averageCostPerHour: randomFloat(25, 60),
            currency: "USD",
            roi: randomFloat(0.5, 1.5),
          },
          gamification: {
            totalPoints: randomInt(200, 1000),
            currentLevel: randomInt(2, 8),
            pointsToNextLevel: randomInt(50, 200),
            badges: [
              {
                id: "first_session",
                name: "First Steps",
                earnedAt: randomDate(periodStart, periodEnd),
                icon: "🎯",
              },
              {
                id: "streak_7",
                name: "Week Warrior",
                earnedAt: randomDate(periodStart, periodEnd),
                icon: "🔥",
              },
            ],
            rank: ["beginner", "learner", "dedicated", "expert"][
              randomInt(0, 3)
            ],
          },
          growth: {
            sessionGrowth: randomFloat(-5, 30),
            progressGrowth: randomFloat(5, 40),
            engagementGrowth: randomFloat(-5, 35),
            skillGrowth: randomFloat(10, 50),
          },
          metadata: {
            lastCalculated: new Date(),
            dataQuality: "complete",
          },
        });

        await analytics.save();
        analyticsCount++;
        console.log(
          `  ✅ Created learning analytics for ${learner.name} (${
            periodStart.toISOString().split("T")[0]
          })`
        );
      }
    }

    console.log(`\n✅ Created ${analyticsCount} learning analytics records`);
  } catch (error) {
    console.error("❌ Error generating learning analytics:", error);
  }
};

// Generate Sample Assessments
const generateAssessments = async () => {
  console.log("\n📝 Generating Sample Assessments...");

  try {
    const skills = await Skill.find().limit(5);
    const tutors = await User.find({ role: "tutor" }).limit(3);

    if (skills.length === 0 || tutors.length === 0) {
      console.log("⚠️ Not enough skills or tutors. Skipping assessments.");
      return;
    }

    let assessmentCount = 0;

    for (let i = 0; i < 5; i++) {
      const skill = skills[randomInt(0, skills.length - 1)];
      const tutor = tutors[randomInt(0, tutors.length - 1)];

      const assessment = new Assessment({
        title: `${skill.name} - Assessment ${i + 1}`,
        description: `Comprehensive assessment for ${skill.name} skill`,
        type: ["quiz", "test", "assignment"][randomInt(0, 2)],
        skill: skill._id,
        createdBy: tutor._id,
        config: {
          difficulty: ["beginner", "intermediate", "advanced"][randomInt(0, 2)],
          timeLimit: randomInt(15, 60),
          passingScore: randomInt(60, 80),
          attemptsAllowed: randomInt(1, 3),
          shuffleQuestions: Math.random() > 0.5,
          showCorrectAnswers: Math.random() > 0.3,
          showScore: true,
        },
        questions: [
          {
            questionId: "q1",
            type: "multiple_choice",
            question: `What is the fundamental concept of ${skill.name}?`,
            points: 5,
            difficulty: "easy",
            options: [
              { optionId: "a", text: "Option A", isCorrect: false },
              { optionId: "b", text: "Correct Answer", isCorrect: true },
              { optionId: "c", text: "Option C", isCorrect: false },
              { optionId: "d", text: "Option D", isCorrect: false },
            ],
            explanation: "This is the correct answer because...",
            hints: ["Think about the basics", "Consider the definition"],
          },
          {
            questionId: "q2",
            type: "short_answer",
            question: `Explain a key benefit of ${skill.name}`,
            points: 10,
            difficulty: "medium",
            correctAnswers: ["efficiency", "productivity", "performance"],
            sampleAnswer: "It improves efficiency and productivity.",
          },
        ],
        grading: {
          totalPoints: 15,
          autoGrade: true,
          partialCredit: false,
        },
        status: "published",
        publishedAt: new Date(),
        statistics: {
          totalAttempts: 0,
          uniqueStudents: 0,
          averageScore: 0,
          averageTimeSpent: 0,
          passRate: 0,
        },
      });

      await assessment.save();
      assessmentCount++;
      console.log(`  ✅ Created assessment: ${assessment.title}`);
    }

    console.log(`\n✅ Created ${assessmentCount} assessments`);
  } catch (error) {
    console.error("❌ Error generating assessments:", error);
  }
};

// Main seeding function
const seedAnalyticsData = async () => {
  console.log("🌱 Starting Analytics Data Seeding...\n");

  await connectDB();

  await generateTeachingAnalytics();
  await generateLearningAnalytics();
  await generateAssessments();

  console.log("\n✅ Analytics data seeding completed!");
  console.log("\n📊 Summary:");
  console.log(`  - Teaching Analytics: Check TeachingAnalytics collection`);
  console.log(`  - Learning Analytics: Check LearningAnalytics collection`);
  console.log(`  - Assessments: Check Assessment collection`);

  await mongoose.connection.close();
  console.log("\n👋 Database connection closed");
};

// Run seeding
seedAnalyticsData().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
