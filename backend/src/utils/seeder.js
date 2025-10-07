const User = require("../models/User");
const Skill = require("../models/Skill");
const bcrypt = require("bcryptjs");
const logger = require("./logger");

// Sample data seeder
const seedDatabase = async () => {
  try {
    logger.info("Starting database seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});

    // Create skills
    const skills = [
      {
        name: "JavaScript",
        description:
          "Modern JavaScript programming language for web development",
        category: "Programming",
        subcategory: "Web Development",
        keywords: [
          "javascript",
          "js",
          "programming",
          "web",
          "frontend",
          "backend",
        ],
        difficulty: 3,
        averageLearningHours: 100,
        industryDemand: { score: 95 },
        trendingScore: { score: 90 },
        isActive: true,
        visibility: "public",
      },
      {
        name: "React",
        description: "React library for building user interfaces",
        category: "Programming",
        subcategory: "Frontend",
        keywords: ["react", "frontend", "ui", "javascript", "library"],
        difficulty: 5,
        averageLearningHours: 80,
        industryDemand: { score: 92 },
        trendingScore: { score: 95 },
        isActive: true,
        visibility: "public",
      },
      {
        name: "Node.js",
        description: "Server-side JavaScript runtime",
        category: "Programming",
        subcategory: "Backend",
        keywords: ["nodejs", "backend", "javascript", "server", "api"],
        difficulty: 6,
        averageLearningHours: 90,
        industryDemand: { score: 88 },
        trendingScore: { score: 85 },
        isActive: true,
        visibility: "public",
      },
      {
        name: "Python",
        description: "Versatile programming language for various applications",
        category: "Programming",
        subcategory: "General",
        keywords: [
          "python",
          "programming",
          "data science",
          "ai",
          "machine learning",
        ],
        difficulty: 4,
        averageLearningHours: 120,
        industryDemand: { score: 94 },
        trendingScore: { score: 92 },
        isActive: true,
        visibility: "public",
      },
      {
        name: "Data Science",
        description: "Extracting insights from data using statistical methods",
        category: "Data Science",
        subcategory: "Analytics",
        keywords: [
          "data science",
          "analytics",
          "statistics",
          "machine learning",
          "python",
        ],
        difficulty: 7,
        averageLearningHours: 200,
        industryDemand: { score: 96 },
        trendingScore: { score: 98 },
        isActive: true,
        visibility: "public",
      },
      {
        name: "Machine Learning",
        description: "Algorithms that learn from data to make predictions",
        category: "Data Science",
        subcategory: "AI/ML",
        keywords: ["machine learning", "ai", "algorithms", "data", "python"],
        difficulty: 8,
        averageLearningHours: 250,
        industryDemand: { score: 97 },
        trendingScore: { score: 99 },
        isActive: true,
        visibility: "public",
      },
      {
        name: "UI/UX Design",
        description: "User interface and user experience design principles",
        category: "Design",
        subcategory: "User Experience",
        keywords: ["ui", "ux", "design", "user experience", "interface"],
        difficulty: 5,
        averageLearningHours: 150,
        industryDemand: { score: 85 },
        trendingScore: { score: 88 },
        isActive: true,
        visibility: "public",
      },
      {
        name: "Digital Marketing",
        description: "Marketing strategies for digital platforms",
        category: "Marketing",
        subcategory: "Digital",
        keywords: [
          "marketing",
          "digital",
          "social media",
          "advertising",
          "seo",
        ],
        difficulty: 4,
        averageLearningHours: 100,
        industryDemand: { score: 82 },
        trendingScore: { score: 85 },
        isActive: true,
        visibility: "public",
      },
    ];

    const createdSkills = await Skill.insertMany(skills);
    logger.info(`Created ${createdSkills.length} skills`);

    // Create users
    const passwordHash = await bcrypt.hash("password123", 12);

    const users = [
      {
        name: "Admin User",
        email: "admin@lms.com",
        role: "admin",
        bio: "System administrator",
        timezone: "UTC",
        auth: {
          passwordHash,
          emailVerified: true,
          isActive: true,
        },
      },
      {
        name: "John Doe",
        email: "john.tutor@lms.com",
        role: "tutor",
        bio: "Experienced JavaScript and React developer with 5+ years of teaching experience",
        timezone: "America/New_York",
        location: {
          country: "United States",
          city: "New York",
        },
        auth: {
          passwordHash,
          emailVerified: true,
          isActive: true,
        },
        teachingSkills: [
          {
            skillId: createdSkills.find((s) => s.name === "JavaScript")._id,
            level: 9,
            hourlyRate: 50,
            hoursTaught: 200,
            rating: 4.8,
            totalReviews: 25,
          },
          {
            skillId: createdSkills.find((s) => s.name === "React")._id,
            level: 8,
            hourlyRate: 60,
            hoursTaught: 150,
            rating: 4.7,
            totalReviews: 18,
          },
        ],
        reputation: {
          score: 85,
          teachingStats: {
            totalSessions: 43,
            totalHours: 350,
            averageRating: 4.75,
            completionRate: 95,
          },
        },
      },
      {
        name: "Sarah Smith",
        email: "sarah.tutor@lms.com",
        role: "tutor",
        bio: "Data scientist and machine learning expert with PhD in Computer Science",
        timezone: "America/Los_Angeles",
        location: {
          country: "United States",
          city: "San Francisco",
        },
        auth: {
          passwordHash,
          emailVerified: true,
          isActive: true,
        },
        teachingSkills: [
          {
            skillId: createdSkills.find((s) => s.name === "Python")._id,
            level: 9,
            hourlyRate: 70,
            hoursTaught: 300,
            rating: 4.9,
            totalReviews: 35,
          },
          {
            skillId: createdSkills.find((s) => s.name === "Data Science")._id,
            level: 10,
            hourlyRate: 90,
            hoursTaught: 250,
            rating: 4.8,
            totalReviews: 22,
          },
          {
            skillId: createdSkills.find((s) => s.name === "Machine Learning")
              ._id,
            level: 10,
            hourlyRate: 100,
            hoursTaught: 180,
            rating: 4.9,
            totalReviews: 15,
          },
        ],
        reputation: {
          score: 95,
          teachingStats: {
            totalSessions: 72,
            totalHours: 730,
            averageRating: 4.87,
            completionRate: 98,
          },
        },
      },
      {
        name: "Mike Johnson",
        email: "mike.learner@lms.com",
        role: "learner",
        bio: "Software engineer looking to expand skills in modern web development",
        timezone: "Europe/London",
        location: {
          country: "United Kingdom",
          city: "London",
        },
        auth: {
          passwordHash,
          emailVerified: true,
          isActive: true,
        },
        learningSkills: [
          {
            skillId: createdSkills.find((s) => s.name === "React")._id,
            currentLevel: 3,
            targetLevel: 7,
            hoursLearned: 20,
            preferredLearningStyle: "visual",
          },
          {
            skillId: createdSkills.find((s) => s.name === "Node.js")._id,
            currentLevel: 2,
            targetLevel: 6,
            hoursLearned: 10,
            preferredLearningStyle: "visual",
          },
        ],
        reputation: {
          score: 35,
          learningStats: {
            totalSessions: 8,
            totalHours: 30,
            skillsLearned: 2,
          },
        },
      },
      {
        name: "Emily Chen",
        email: "emily.learner@lms.com",
        role: "learner",
        bio: "Marketing professional transitioning to data science",
        timezone: "Asia/Singapore",
        location: {
          country: "Singapore",
          city: "Singapore",
        },
        auth: {
          passwordHash,
          emailVerified: true,
          isActive: true,
        },
        learningSkills: [
          {
            skillId: createdSkills.find((s) => s.name === "Python")._id,
            currentLevel: 1,
            targetLevel: 6,
            hoursLearned: 5,
            preferredLearningStyle: "reading_writing",
          },
          {
            skillId: createdSkills.find((s) => s.name === "Data Science")._id,
            currentLevel: 0,
            targetLevel: 7,
            hoursLearned: 0,
            preferredLearningStyle: "visual",
          },
        ],
        reputation: {
          score: 15,
          learningStats: {
            totalSessions: 2,
            totalHours: 5,
            skillsLearned: 1,
          },
        },
      },
    ];

    const createdUsers = await User.insertMany(users);
    logger.info(`Created ${createdUsers.length} users`);

    // Update skill statistics
    for (const skill of createdSkills) {
      const teacherCount = await User.countDocuments({
        "teachingSkills.skillId": skill._id,
      });
      const learnerCount = await User.countDocuments({
        "learningSkills.skillId": skill._id,
      });

      await Skill.findByIdAndUpdate(skill._id, {
        "stats.totalTeachers": teacherCount,
        "stats.totalLearners": learnerCount,
      });
    }

    logger.info("Database seeding completed successfully!");
    logger.info("Sample users:");
    logger.info("  Admin: admin@lms.com / password123");
    logger.info("  Tutor: john.tutor@lms.com / password123");
    logger.info("  Tutor: sarah.tutor@lms.com / password123");
    logger.info("  Learner: mike.learner@lms.com / password123");
    logger.info("  Learner: emily.learner@lms.com / password123");
  } catch (error) {
    logger.error("Database seeding failed:", error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  const connectDB = require("../config/database");

  connectDB()
    .then(() => seedDatabase())
    .then(() => {
      logger.info("Seeding completed, exiting...");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Seeding failed:", error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
