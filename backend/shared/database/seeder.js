const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const { User, Skill, Session, Transaction, Review } = require("./index");

// Sample skills data
const skillsData = [
  {
    name: "JavaScript Programming",
    description:
      "Learn modern JavaScript programming including ES6+, async programming, and frameworks",
    category: "Programming",
    subcategory: "Frontend",
    difficultyLevel: 6,
    averageLearningHours: 80,
    tags: ["javascript", "programming", "web-development", "frontend"],
    keywords: ["js", "ecmascript", "node", "react", "vue"],
    prerequisites: [],
    relatedSkills: [],
  },
  {
    name: "Python Programming",
    description:
      "Master Python programming for web development, data science, and automation",
    category: "Programming",
    subcategory: "Backend",
    difficultyLevel: 5,
    averageLearningHours: 60,
    tags: ["python", "programming", "backend", "data-science"],
    keywords: ["py", "django", "flask", "pandas", "numpy"],
    prerequisites: [],
    relatedSkills: [],
  },
  {
    name: "React Development",
    description:
      "Build modern web applications with React, hooks, and state management",
    category: "Programming",
    subcategory: "Frontend",
    difficultyLevel: 7,
    averageLearningHours: 100,
    tags: ["react", "frontend", "javascript", "ui"],
    keywords: ["jsx", "hooks", "redux", "components"],
    prerequisites: [],
    relatedSkills: [],
  },
  {
    name: "Digital Marketing",
    description:
      "Learn digital marketing strategies, SEO, social media, and analytics",
    category: "Marketing",
    subcategory: "Digital",
    difficultyLevel: 4,
    averageLearningHours: 40,
    tags: ["marketing", "seo", "social-media", "analytics"],
    keywords: ["google-ads", "facebook-ads", "content-marketing"],
    prerequisites: [],
    relatedSkills: [],
  },
  {
    name: "Data Science",
    description: "Data analysis, machine learning, and statistical modeling",
    category: "Technology",
    subcategory: "Data",
    difficultyLevel: 8,
    averageLearningHours: 120,
    tags: ["data-science", "machine-learning", "statistics", "python"],
    keywords: ["ml", "ai", "pandas", "scikit-learn", "tensorflow"],
    prerequisites: [],
    relatedSkills: [],
  },
  {
    name: "UI/UX Design",
    description:
      "User interface and user experience design principles and tools",
    category: "Design",
    subcategory: "Digital",
    difficultyLevel: 6,
    averageLearningHours: 70,
    tags: ["design", "ui", "ux", "figma", "adobe"],
    keywords: ["wireframes", "prototyping", "user-research"],
    prerequisites: [],
    relatedSkills: [],
  },
];

// Sample users data
const usersData = [
  {
    personal: {
      name: "John Smith",
      email: "john.smith@example.com",
      timezone: "America/New_York",
      languages: ["English"],
      bio: "Full-stack developer with 5+ years of experience in JavaScript and Python",
      location: {
        country: "United States",
        city: "New York",
      },
    },
    auth: {
      passwordHash: "",
      emailVerified: true,
    },
    skills: {
      teaching: [],
      learning: [],
    },
    credits: {
      balance: 100,
      earned: 0,
      spent: 0,
    },
    reputation: {
      score: 85,
      level: "silver",
    },
  },
  {
    personal: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      timezone: "Europe/London",
      languages: ["English", "French"],
      bio: "Digital marketing specialist passionate about helping businesses grow online",
      location: {
        country: "United Kingdom",
        city: "London",
      },
    },
    auth: {
      passwordHash: "",
      emailVerified: true,
    },
    skills: {
      teaching: [],
      learning: [],
    },
    credits: {
      balance: 150,
      earned: 0,
      spent: 0,
    },
    reputation: {
      score: 92,
      level: "gold",
    },
  },
  {
    personal: {
      name: "Alex Chen",
      email: "alex.chen@example.com",
      timezone: "Asia/Shanghai",
      languages: ["English", "Mandarin"],
      bio: "Data scientist and machine learning engineer with expertise in Python and R",
      location: {
        country: "China",
        city: "Shanghai",
      },
    },
    auth: {
      passwordHash: "",
      emailVerified: true,
    },
    skills: {
      teaching: [],
      learning: [],
    },
    credits: {
      balance: 200,
      earned: 0,
      spent: 0,
    },
    reputation: {
      score: 88,
      level: "silver",
    },
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/lms_development"
    );
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Session.deleteMany({});
    await Transaction.deleteMany({});
    await Review.deleteMany({});

    // Create skills
    console.log("Creating skills...");
    const createdSkills = await Skill.insertMany(
      skillsData.map((skill) => ({
        ...skill,
        statistics: {
          totalTeachers: Math.floor(Math.random() * 50) + 1,
          totalLearners: Math.floor(Math.random() * 200) + 10,
          totalSessions: Math.floor(Math.random() * 500) + 20,
          averageTeacherRating: 3.5 + Math.random() * 1.5,
          popularityRank: Math.floor(Math.random() * 100) + 1,
        },
        industryDemand: {
          score: Math.floor(Math.random() * 40) + 60,
          lastUpdated: new Date(),
        },
        trendingScore: {
          score: Math.floor(Math.random() * 50) + 50,
          weeklyChange: (Math.random() - 0.5) * 20,
          monthlyChange: (Math.random() - 0.5) * 40,
          lastUpdated: new Date(),
        },
        verification: {
          isVerified: true,
          qualityScore: Math.floor(Math.random() * 30) + 70,
        },
      }))
    );

    console.log(`Created ${createdSkills.length} skills`);

    // Create relationships between skills
    console.log("Creating skill relationships...");

    // JavaScript -> React relationship
    const jsSkill = createdSkills.find(
      (s) => s.name === "JavaScript Programming"
    );
    const reactSkill = createdSkills.find(
      (s) => s.name === "React Development"
    );
    const pythonSkill = createdSkills.find(
      (s) => s.name === "Python Programming"
    );
    const dataSkill = createdSkills.find((s) => s.name === "Data Science");

    if (jsSkill && reactSkill) {
      reactSkill.prerequisites.push({
        skillId: jsSkill._id,
        required: true,
        minimumLevel: 6,
      });
      reactSkill.relatedSkills.push({
        skillId: jsSkill._id,
        relationship: "foundational",
        strength: 0.9,
      });
      await reactSkill.save();

      jsSkill.relatedSkills.push({
        skillId: reactSkill._id,
        relationship: "advanced",
        strength: 0.8,
      });
      await jsSkill.save();
    }

    if (pythonSkill && dataSkill) {
      dataSkill.prerequisites.push({
        skillId: pythonSkill._id,
        required: true,
        minimumLevel: 7,
      });
      dataSkill.relatedSkills.push({
        skillId: pythonSkill._id,
        relationship: "foundational",
        strength: 0.85,
      });
      await dataSkill.save();

      pythonSkill.relatedSkills.push({
        skillId: dataSkill._id,
        relationship: "specialized",
        strength: 0.7,
      });
      await pythonSkill.save();
    }

    // Create users with hashed passwords
    console.log("Creating users...");
    const hashedPassword = await bcrypt.hash("password123", 12);

    const createdUsers = [];
    for (let userData of usersData) {
      userData.auth.passwordHash = hashedPassword;

      // Assign random teaching and learning skills
      const randomTeachingSkills = createdSkills
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);

      const randomLearningSkills = createdSkills
        .filter((skill) => !randomTeachingSkills.includes(skill))
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 2) + 1);

      userData.skills.teaching = randomTeachingSkills.map((skill) => ({
        skillId: skill._id,
        level: Math.floor(Math.random() * 4) + 7, // 7-10 for teachers
        hoursTaught: Math.floor(Math.random() * 100) + 10,
        rating: 3.5 + Math.random() * 1.5,
        totalReviews: Math.floor(Math.random() * 20) + 1,
        availability: {
          hoursPerWeek: Math.floor(Math.random() * 20) + 5,
          preferredTimeSlots: [
            {
              day: "monday",
              startTime: "09:00",
              endTime: "17:00",
            },
            {
              day: "wednesday",
              startTime: "10:00",
              endTime: "18:00",
            },
          ],
        },
        pricing: {
          hourlyRate: Math.floor(Math.random() * 50) + 25,
          currency: "USD",
        },
      }));

      userData.skills.learning = randomLearningSkills.map((skill) => ({
        skillId: skill._id,
        currentLevel: Math.floor(Math.random() * 5) + 1, // 1-5 for learners
        targetLevel: Math.floor(Math.random() * 3) + 7, // 7-9 target
        hoursLearned: Math.floor(Math.random() * 50),
        preferredLearningStyle: [
          "visual",
          "auditory",
          "kinesthetic",
          "reading_writing",
        ][Math.floor(Math.random() * 4)],
      }));

      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }

    console.log(`Created ${createdUsers.length} users`);

    // Create some sample sessions
    console.log("Creating sample sessions...");
    const sessionsData = [];

    for (let i = 0; i < 10; i++) {
      const teacher =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const learner =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];

      if (
        teacher._id.toString() !== learner._id.toString() &&
        teacher.skills.teaching.length > 0
      ) {
        const teachingSkill =
          teacher.skills.teaching[
            Math.floor(Math.random() * teacher.skills.teaching.length)
          ];
        const startTime = new Date(
          Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000
        ); // Random time in next 30 days
        const duration = [60, 90, 120][Math.floor(Math.random() * 3)]; // 1, 1.5, or 2 hours

        sessionsData.push({
          participants: {
            teacher: teacher._id,
            learner: learner._id,
          },
          skill: teachingSkill.skillId,
          title: `Learning ${
            createdSkills.find(
              (s) => s._id.toString() === teachingSkill.skillId.toString()
            )?.name
          }`,
          description: "A focused learning session",
          schedule: {
            startTime: startTime,
            endTime: new Date(startTime.getTime() + duration * 60 * 1000),
            timezone: teacher.personal.timezone,
            duration: duration,
          },
          room: {
            videoRoomId: `room_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            videoProvider: "webrtc",
            whiteboardId: `whiteboard_${Date.now()}`,
            chatId: `chat_${Date.now()}`,
          },
          pricing: {
            hourlyRate: teachingSkill.pricing.hourlyRate,
            currency: "USD",
            totalCost: (duration / 60) * teachingSkill.pricing.hourlyRate,
          },
          status: ["scheduled", "confirmed", "completed"][
            Math.floor(Math.random() * 3)
          ],
        });
      }
    }

    if (sessionsData.length > 0) {
      await Session.insertMany(sessionsData);
      console.log(`Created ${sessionsData.length} sessions`);
    }

    console.log("Database seeding completed successfully!");
    console.log("\n=== Seeded Data Summary ===");
    console.log(`Skills: ${createdSkills.length}`);
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Sessions: ${sessionsData.length}`);
    console.log("\n=== Sample Login Credentials ===");
    console.log("Email: john.smith@example.com");
    console.log("Email: sarah.johnson@example.com");
    console.log("Email: alex.chen@example.com");
    console.log("Password: password123");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
