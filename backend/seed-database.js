const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("./src/models/User");
const Skill = require("./src/models/Skill");
const Session = require("./src/models/Session");
const Payment = require("./src/models/Payment");
const Notification = require("./src/models/Notification");

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/learning-management-system"
    );
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Helper function to generate random dates
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const randomPastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
};

const randomFutureDate = (daysAhead) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  return date;
};

// Helper to get a date within next 7 days (for upcoming sessions)
const randomUpcomingDate = () => {
  const date = new Date();
  // Random time between now and 7 days from now
  const hoursAhead = Math.floor(Math.random() * (7 * 24)) + 1;
  date.setHours(date.getHours() + hoursAhead);
  return date;
};

// Skills data
const skillsData = [
  // Programming
  {
    name: "JavaScript",
    description:
      "Modern JavaScript programming including ES6+ features, async/await, and modern frameworks",
    category: "Programming",
    subcategory: "Web Development",
    keywords: ["programming", "web", "frontend", "backend", "nodejs"],
    difficulty: 6,
    averageLearningHours: 150,
  },
  {
    name: "Python",
    description:
      "Python programming for beginners to advanced, including data science, web development, and automation",
    category: "Programming",
    subcategory: "General Purpose",
    keywords: ["programming", "data science", "machine learning", "automation"],
    difficulty: 5,
    averageLearningHours: 120,
  },
  {
    name: "React",
    description:
      "Build modern web applications with React, including hooks, state management, and best practices",
    category: "Programming",
    subcategory: "Frontend Framework",
    keywords: ["web", "frontend", "javascript", "ui", "components"],
    difficulty: 7,
    averageLearningHours: 100,
  },
  {
    name: "Node.js",
    description:
      "Backend development with Node.js, Express, and RESTful API design",
    category: "Programming",
    subcategory: "Backend Development",
    keywords: ["backend", "javascript", "api", "server", "express"],
    difficulty: 7,
    averageLearningHours: 110,
  },
  {
    name: "TypeScript",
    description: "Strongly typed JavaScript for building scalable applications",
    category: "Programming",
    subcategory: "Web Development",
    keywords: ["programming", "javascript", "types", "web"],
    difficulty: 6,
    averageLearningHours: 80,
  },

  // Design
  {
    name: "UI/UX Design",
    description:
      "User interface and user experience design principles, prototyping, and design thinking",
    category: "Design",
    subcategory: "Product Design",
    keywords: ["design", "ux", "ui", "prototyping", "figma"],
    difficulty: 6,
    averageLearningHours: 120,
  },
  {
    name: "Graphic Design",
    description:
      "Visual design principles, typography, color theory, and Adobe Creative Suite",
    category: "Design",
    subcategory: "Visual Design",
    keywords: ["design", "graphics", "adobe", "photoshop", "illustrator"],
    difficulty: 7,
    averageLearningHours: 150,
  },
  {
    name: "Figma",
    description:
      "Modern design tool for creating interfaces, prototypes, and collaborative design",
    category: "Design",
    subcategory: "Design Tools",
    keywords: ["design", "prototyping", "ui", "collaboration"],
    difficulty: 5,
    averageLearningHours: 60,
  },

  // Languages
  {
    name: "English",
    description: "English language for business, conversation, and writing",
    category: "Languages",
    subcategory: "Communication",
    keywords: ["language", "english", "communication", "speaking"],
    difficulty: 6,
    averageLearningHours: 200,
  },
  {
    name: "Spanish",
    description:
      "Spanish language from beginner to advanced conversational skills",
    category: "Languages",
    subcategory: "Communication",
    keywords: ["language", "spanish", "communication", "speaking"],
    difficulty: 6,
    averageLearningHours: 200,
  },

  // Mathematics
  {
    name: "Calculus",
    description:
      "Differential and integral calculus, limits, derivatives, and applications",
    category: "Mathematics",
    subcategory: "Advanced Math",
    keywords: ["math", "calculus", "derivatives", "integrals"],
    difficulty: 8,
    averageLearningHours: 180,
  },
  {
    name: "Statistics",
    description:
      "Statistical analysis, probability, hypothesis testing, and data interpretation",
    category: "Mathematics",
    subcategory: "Data Analysis",
    keywords: ["math", "statistics", "probability", "data"],
    difficulty: 7,
    averageLearningHours: 140,
  },

  // Business
  {
    name: "Digital Marketing",
    description:
      "SEO, social media marketing, content marketing, and analytics",
    category: "Business",
    subcategory: "Marketing",
    keywords: ["marketing", "seo", "social media", "advertising"],
    difficulty: 6,
    averageLearningHours: 100,
  },
  {
    name: "Project Management",
    description: "Agile, Scrum, project planning, and team leadership",
    category: "Business",
    subcategory: "Management",
    keywords: ["management", "agile", "scrum", "leadership"],
    difficulty: 7,
    averageLearningHours: 120,
  },

  // Music
  {
    name: "Guitar",
    description:
      "Guitar playing from basics to advanced techniques, music theory, and songwriting",
    category: "Music",
    subcategory: "Instruments",
    keywords: ["music", "guitar", "instrument", "playing"],
    difficulty: 6,
    averageLearningHours: 200,
  },
  {
    name: "Piano",
    description:
      "Piano playing, music theory, sight reading, and classical/contemporary styles",
    category: "Music",
    subcategory: "Instruments",
    keywords: ["music", "piano", "instrument", "playing"],
    difficulty: 7,
    averageLearningHours: 250,
  },

  // Science
  {
    name: "Data Science",
    description:
      "Data analysis, machine learning, visualization with Python and R",
    category: "Science",
    subcategory: "Data Science",
    keywords: ["data", "science", "python", "machine learning", "analytics"],
    difficulty: 8,
    averageLearningHours: 180,
  },
  {
    name: "Machine Learning",
    description:
      "ML algorithms, neural networks, deep learning, and AI applications",
    category: "Science",
    subcategory: "Artificial Intelligence",
    keywords: ["ai", "ml", "deep learning", "neural networks"],
    difficulty: 9,
    averageLearningHours: 200,
  },

  // Photography
  {
    name: "Photography",
    description: "Camera basics, composition, lighting, and photo editing",
    category: "Photography",
    subcategory: "Visual Arts",
    keywords: ["photography", "camera", "editing", "visual"],
    difficulty: 6,
    averageLearningHours: 100,
  },
  {
    name: "Video Editing",
    description:
      "Video editing with Premiere Pro, Final Cut, color grading, and storytelling",
    category: "Photography",
    subcategory: "Video Production",
    keywords: ["video", "editing", "premiere", "production"],
    difficulty: 7,
    averageLearningHours: 120,
  },
];

// User data with realistic profiles
const usersData = [
  // Tutors
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    password: "password123",
    role: "tutor",
    bio: "PhD in Computer Science with 10+ years of teaching experience. Specialized in web development and data structures.",
    timezone: "America/New_York",
    languages: ["English", "Spanish"],
    location: { country: "USA", city: "New York" },
    teachingSkills: ["JavaScript", "React", "Node.js", "TypeScript"],
  },
  {
    name: "Michael Chen",
    email: "michael.chen@example.com",
    password: "password123",
    role: "tutor",
    bio: "Senior Data Scientist at a Fortune 500 company. Passionate about teaching Python and Machine Learning.",
    timezone: "America/Los_Angeles",
    languages: ["English", "Mandarin"],
    location: { country: "USA", city: "San Francisco" },
    teachingSkills: [
      "Python",
      "Data Science",
      "Machine Learning",
      "Statistics",
    ],
  },
  {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    password: "password123",
    role: "tutor",
    bio: "Professional UI/UX Designer with expertise in Figma and design systems. Former design lead at a tech startup.",
    timezone: "Europe/London",
    languages: ["English", "Spanish"],
    location: { country: "UK", city: "London" },
    teachingSkills: ["UI/UX Design", "Figma", "Graphic Design"],
  },
  {
    name: "Prof. James Wilson",
    email: "james.wilson@example.com",
    password: "password123",
    role: "tutor",
    bio: "Mathematics professor with 15 years of university teaching experience. Making calculus fun and accessible!",
    timezone: "America/Chicago",
    languages: ["English"],
    location: { country: "USA", city: "Chicago" },
    teachingSkills: ["Calculus", "Statistics"],
  },
  {
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    password: "password123",
    role: "tutor",
    bio: "Native Spanish speaker and certified language teacher. Specializing in conversational Spanish and business Spanish.",
    timezone: "Europe/Madrid",
    languages: ["Spanish", "English", "French"],
    location: { country: "Spain", city: "Madrid" },
    teachingSkills: ["Spanish"],
  },
  {
    name: "David Kim",
    email: "david.kim@example.com",
    password: "password123",
    role: "tutor",
    bio: "Full-stack developer and tech entrepreneur. Teaching modern web development with hands-on projects.",
    timezone: "Asia/Seoul",
    languages: ["English", "Korean"],
    location: { country: "South Korea", city: "Seoul" },
    teachingSkills: ["JavaScript", "React", "Node.js", "TypeScript"],
  },
  {
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    password: "password123",
    role: "tutor",
    bio: "Digital marketing expert with 8+ years helping businesses grow online. Google Ads and SEO certified.",
    timezone: "America/Denver",
    languages: ["English"],
    location: { country: "USA", city: "Denver" },
    teachingSkills: ["Digital Marketing"],
  },
  {
    name: "Thomas Mueller",
    email: "thomas.mueller@example.com",
    password: "password123",
    role: "tutor",
    bio: "Certified Scrum Master and PMP. Helping teams deliver projects successfully for over a decade.",
    timezone: "Europe/Berlin",
    languages: ["English", "German"],
    location: { country: "Germany", city: "Berlin" },
    teachingSkills: ["Project Management"],
  },
  {
    name: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    password: "password123",
    role: "tutor",
    bio: "Professional guitarist and music teacher for 12 years. Taught over 500 students of all skill levels.",
    timezone: "America/Los_Angeles",
    languages: ["English"],
    location: { country: "USA", city: "Los Angeles" },
    teachingSkills: ["Guitar"],
  },
  {
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    password: "password123",
    role: "tutor",
    bio: "Classically trained pianist with performance and teaching experience. Making piano accessible to everyone.",
    timezone: "Europe/Vienna",
    languages: ["English", "German"],
    location: { country: "Austria", city: "Vienna" },
    teachingSkills: ["Piano"],
  },

  // Learners
  {
    name: "Alex Thompson",
    email: "alex.thompson@example.com",
    password: "password123",
    role: "learner",
    bio: "Career switcher looking to break into web development. Excited to learn React and build amazing apps!",
    timezone: "America/New_York",
    languages: ["English"],
    location: { country: "USA", city: "Boston" },
    learningSkills: ["JavaScript", "React", "Node.js"],
  },
  {
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    password: "password123",
    role: "learner",
    bio: "Business analyst looking to upskill in data science and Python programming.",
    timezone: "America/Chicago",
    languages: ["English", "Spanish"],
    location: { country: "USA", city: "Austin" },
    learningSkills: ["Python", "Data Science", "Statistics"],
  },
  {
    name: "Oliver Brown",
    email: "oliver.brown@example.com",
    password: "password123",
    role: "learner",
    bio: "Product manager wanting to learn UI/UX design to better communicate with my design team.",
    timezone: "Europe/London",
    languages: ["English"],
    location: { country: "UK", city: "Manchester" },
    learningSkills: ["UI/UX Design", "Figma"],
  },
  {
    name: "Emma Davis",
    email: "emma.davis@example.com",
    password: "password123",
    role: "learner",
    bio: "High school student passionate about mathematics. Preparing for college-level calculus.",
    timezone: "America/Los_Angeles",
    languages: ["English"],
    location: { country: "USA", city: "Seattle" },
    learningSkills: ["Calculus"],
  },
  {
    name: "Lucas Silva",
    email: "lucas.silva@example.com",
    password: "password123",
    role: "learner",
    bio: "Travel enthusiast learning Spanish for my upcoming South America trip!",
    timezone: "America/Sao_Paulo",
    languages: ["Portuguese", "English"],
    location: { country: "Brazil", city: "São Paulo" },
    learningSkills: ["Spanish"],
  },
  {
    name: "Isabella White",
    email: "isabella.white@example.com",
    password: "password123",
    role: "learner",
    bio: "Marketing professional looking to master digital marketing and SEO strategies.",
    timezone: "America/Denver",
    languages: ["English"],
    location: { country: "USA", city: "Phoenix" },
    learningSkills: ["Digital Marketing"],
  },
  {
    name: "William Zhang",
    email: "william.zhang@example.com",
    password: "password123",
    role: "learner",
    bio: "Engineering student diving deep into machine learning and AI.",
    timezone: "America/Los_Angeles",
    languages: ["English", "Mandarin"],
    location: { country: "USA", city: "Stanford" },
    learningSkills: ["Machine Learning", "Python", "Data Science"],
  },
  {
    name: "Ava Johnson",
    email: "ava.johnson@example.com",
    password: "password123",
    role: "learner",
    bio: "Team lead learning project management methodologies to better manage my team.",
    timezone: "America/New_York",
    languages: ["English"],
    location: { country: "USA", city: "New York" },
    learningSkills: ["Project Management"],
  },
  {
    name: "Noah Wilson",
    email: "noah.wilson@example.com",
    password: "password123",
    role: "learner",
    bio: "Music lover finally taking the plunge to learn guitar. Never too late!",
    timezone: "America/Chicago",
    languages: ["English"],
    location: { country: "USA", city: "Nashville" },
    learningSkills: ["Guitar"],
  },
  {
    name: "Mia Anderson",
    email: "mia.anderson@example.com",
    password: "password123",
    role: "learner",
    bio: "Photographer looking to improve my editing skills and learn video production.",
    timezone: "Europe/Paris",
    languages: ["English", "French"],
    location: { country: "France", city: "Paris" },
    learningSkills: ["Photography", "Video Editing"],
  },
];

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    console.log("\n🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Session.deleteMany({});
    await Payment.deleteMany({});
    await Notification.deleteMany({});
    console.log("✅ Existing data cleared");

    // Seed Skills
    console.log("\n📚 Seeding skills...");
    const skills = await Skill.insertMany(skillsData);
    console.log(`✅ Created ${skills.length} skills`);

    // Create skill lookup map
    const skillMap = {};
    skills.forEach((skill) => {
      skillMap[skill.name] = skill._id;
    });

    // Seed Users
    console.log("\n👥 Seeding users...");
    const users = [];

    for (const userData of usersData) {
      const passwordHash = await bcrypt.hash(userData.password, 10);

      const userDoc = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        bio: userData.bio,
        timezone: userData.timezone,
        languages: userData.languages,
        location: userData.location,
        auth: {
          passwordHash,
          emailVerified: true,
          isActive: true,
          lastLogin: randomPastDate(30),
        },
      };

      // Add teaching skills for tutors
      if (userData.role === "tutor" && userData.teachingSkills) {
        userDoc.teachingSkills = userData.teachingSkills.map((skillName) => ({
          skillId: skillMap[skillName],
          level: Math.floor(Math.random() * 3) + 8, // 8-10
          hoursTaught: Math.floor(Math.random() * 200) + 50,
          rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5-5.0
          totalReviews: Math.floor(Math.random() * 50) + 10,
          hourlyRate: Math.floor(Math.random() * 50) + 30, // $30-$80
        }));

        // Add tutor stats
        userDoc.reputation = {
          score: Math.floor(Math.random() * 500) + 100,
          teachingStats: {
            totalSessions: Math.floor(Math.random() * 100) + 20,
            totalHours: Math.floor(Math.random() * 300) + 50,
            averageRating: (Math.random() * 1.5 + 3.5).toFixed(1),
            completionRate: (Math.random() * 20 + 80).toFixed(1),
          },
        };
      }

      // Add learning skills for learners
      if (userData.role === "learner" && userData.learningSkills) {
        userDoc.learningSkills = userData.learningSkills.map((skillName) => ({
          skillId: skillMap[skillName],
          currentLevel: Math.floor(Math.random() * 5) + 1, // 1-5
          targetLevel: Math.floor(Math.random() * 3) + 8, // 8-10
          hoursLearned: Math.floor(Math.random() * 50),
          preferredLearningStyle: [
            "visual",
            "auditory",
            "kinesthetic",
            "reading_writing",
          ][Math.floor(Math.random() * 4)],
        }));

        // Add learner stats
        userDoc.reputation = {
          score: Math.floor(Math.random() * 200) + 50,
          learningStats: {
            totalSessions: Math.floor(Math.random() * 30) + 5,
            totalHours: Math.floor(Math.random() * 100) + 10,
            skillsLearned: userData.learningSkills.length,
          },
        };
      }

      users.push(userDoc);
    }

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Separate tutors and learners
    const tutors = createdUsers.filter((u) => u.role === "tutor");
    const learners = createdUsers.filter((u) => u.role === "learner");

    console.log(`   - ${tutors.length} tutors`);
    console.log(`   - ${learners.length} learners`);

    // Seed Sessions
    console.log("\n📅 Seeding sessions...");
    const sessions = [];
    const sessionStatuses = [
      "scheduled",
      "in_progress",
      "completed",
      "cancelled",
    ];

    // Create sessions for each learner
    for (const learner of learners) {
      const numSessions = Math.floor(Math.random() * 8) + 6; // 6-13 sessions per learner

      for (let i = 0; i < numSessions; i++) {
        // Pick a random tutor
        const tutor = tutors[Math.floor(Math.random() * tutors.length)];

        // Pick a skill the learner wants to learn
        if (learner.learningSkills.length === 0) continue;

        const learnerSkill =
          learner.learningSkills[
            Math.floor(Math.random() * learner.learningSkills.length)
          ];
        const skillId = learnerSkill.skillId;
        const skill = skills.find(
          (s) => s._id.toString() === skillId.toString()
        );

        if (!skill) continue;

        // Check if tutor teaches this skill, if not, add it temporarily for the session
        const teachingSkill = tutor.teachingSkills.find(
          (ts) => ts.skillId.toString() === skillId.toString()
        );
        const hourlyRate =
          teachingSkill?.hourlyRate || Math.floor(Math.random() * 40) + 40; // $40-$80

        const duration = [30, 60, 90, 120][Math.floor(Math.random() * 4)];
        const totalAmount = (hourlyRate * duration) / 60;

        // Determine status based on date
        // 50% past sessions, 40% upcoming (within 7 days), 10% future (beyond 7 days)
        const sessionType = Math.random();
        let status;
        let scheduledDate;

        if (sessionType < 0.5) {
          // Past sessions (50%)
          scheduledDate = randomPastDate(60);
          status = Math.random() > 0.1 ? "completed" : "cancelled";
        } else if (sessionType < 0.9) {
          // Upcoming sessions within next 7 days (40%)
          scheduledDate = randomUpcomingDate();
          status = Math.random() > 0.95 ? "cancelled" : "scheduled";
        } else {
          // Future sessions beyond 7 days (10%)
          scheduledDate = randomFutureDate(30);
          status = Math.random() > 0.9 ? "cancelled" : "scheduled";
        }

        const session = {
          tutor: tutor._id,
          learner: learner._id,
          skill: skillId,
          title: `${skill.name} Session`,
          description: `Learning ${skill.name} with focus on practical applications and best practices.`,
          scheduledDate,
          duration,
          timezone: learner.timezone,
          status,
          objectives: [
            {
              description: "Understand core concepts",
              completed: status === "completed",
            },
            {
              description: "Practice with examples",
              completed: status === "completed",
            },
            { description: "Q&A session", completed: status === "completed" },
          ],
          meetingDetails: {
            platform: ["zoom", "google_meet", "teams"][
              Math.floor(Math.random() * 3)
            ],
            meetingUrl: `https://meet.example.com/${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            meetingId: Math.random().toString(36).substr(2, 11).toUpperCase(),
          },
          pricing: {
            hourlyRate,
            totalAmount,
            currency: "USD",
            paymentStatus:
              status === "completed"
                ? "paid"
                : status === "cancelled"
                ? "refunded"
                : "pending",
          },
        };

        if (status === "completed") {
          const completedAt = new Date(
            scheduledDate.getTime() + duration * 60000
          );
          session.actualStartTime = scheduledDate;
          session.actualEndTime = completedAt;
          session.actualDuration = duration;
          session.sessionNotes = {
            tutor: "Great session! Student showed excellent progress.",
            learner: "Very helpful and informative session.",
          };
          session.feedback = {
            tutor: {
              rating: Math.floor(Math.random() * 2) + 4, // 4-5
              comment: "Engaged learner, asks great questions!",
              submittedAt: new Date(completedAt.getTime() + 3600000),
            },
            learner: {
              rating: Math.floor(Math.random() * 2) + 4, // 4-5
              comment:
                "Excellent tutor! Explained concepts clearly and patiently.",
              submittedAt: new Date(completedAt.getTime() + 3600000),
            },
          };
        }

        sessions.push(session);
      }
    }

    const createdSessions = await Session.insertMany(sessions);
    console.log(`✅ Created ${createdSessions.length} sessions`);

    const statusCounts = sessionStatuses.map((status) => ({
      status,
      count: createdSessions.filter((s) => s.status === status).length,
    }));
    statusCounts.forEach(({ status, count }) => {
      console.log(`   - ${count} ${status} sessions`);
    });

    // Count upcoming sessions (within next 7 days)
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const upcomingSessions = createdSessions.filter(
      (s) =>
        s.status === "scheduled" &&
        s.scheduledDate >= now &&
        s.scheduledDate <= sevenDaysFromNow
    );
    console.log(
      `   ⭐ ${upcomingSessions.length} upcoming sessions (within next 7 days)`
    );

    // Seed Payments for completed sessions
    console.log("\n💳 Seeding payments...");
    const payments = [];
    const completedSessions = createdSessions.filter(
      (s) => s.status === "completed"
    );
    console.log(`   Found ${completedSessions.length} completed sessions`);

    for (const session of completedSessions) {
      if (!session.actualEndTime) {
        console.log(
          `   Skipping session ${session._id} - missing actual end time`
        );
        continue; // Skip if no completion time
      }

      const providerType = ["stripe", "paypal", "square"][
        Math.floor(Math.random() * 3)
      ];
      const platformFee = session.pricing.totalAmount * 0.1; // 10% platform fee
      const processingFee = session.pricing.totalAmount * 0.029 + 0.3; // ~3% + $0.30
      const totalFees = platformFee + processingFee;
      const netAmount = session.pricing.totalAmount - totalFees;

      const payment = {
        paymentId: `PAY-${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`,
        transactionId: `TXN-${Math.random()
          .toString(36)
          .substr(2, 12)
          .toUpperCase()}`,
        session: session._id,
        payer: session.learner,
        recipient: session.tutor,
        amount: session.pricing.totalAmount,
        currency: "USD",
        paymentMethod: {
          type: ["card", "paypal", "stripe"][Math.floor(Math.random() * 3)],
          details: {
            last4: Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0"),
            brand: ["visa", "mastercard", "amex"][
              Math.floor(Math.random() * 3)
            ],
          },
        },
        status: "completed",
        statusHistory: [
          {
            status: "pending",
            timestamp: new Date(session.scheduledDate.getTime() - 86400000),
            reason: "Payment initiated",
          },
          {
            status: "processing",
            timestamp: new Date(session.scheduledDate.getTime() - 3600000),
            reason: "Payment processing",
          },
          {
            status: "completed",
            timestamp: session.actualEndTime,
            reason: "Payment successful",
          },
        ],
        processing: {
          processedAt: session.actualEndTime,
        },
        fees: {
          platformFee,
          processingFee,
          totalFees,
          netAmount,
        },
        provider: {
          name: providerType,
          providerId: `${providerType}_${Math.random()
            .toString(36)
            .substr(2, 16)
            .toUpperCase()}`,
        },
        metadata: {
          sessionTitle: session.title,
          duration: session.duration,
        },
      };

      payments.push(payment);
    }

    if (payments.length > 0) {
      const createdPayments = await Payment.insertMany(payments);
      console.log(`✅ Created ${createdPayments.length} payments`);
    } else {
      console.log(`✅ Created 0 payments (no completed sessions)`);
    }

    // Seed Notifications
    console.log("\n🔔 Seeding notifications...");
    const notifications = [];

    // Create notifications for each user
    for (const user of createdUsers) {
      // Welcome notification
      notifications.push({
        recipient: user._id,
        type: "welcome",
        title: "Welcome to LearnConnect!",
        message: `Hi ${user.name}, welcome to our learning platform. Start exploring and booking sessions today!`,
        priority: "normal",
        category: "system",
        channels: {
          email: { enabled: true, sent: true, sentAt: user.createdAt },
          inApp: {
            enabled: true,
            read: true,
            readAt: new Date(user.createdAt.getTime() + 3600000),
          },
        },
        status: "sent",
      });

      // Session reminders for upcoming sessions
      const userSessions = createdSessions.filter(
        (s) =>
          (s.tutor.toString() === user._id.toString() ||
            s.learner.toString() === user._id.toString()) &&
          s.status === "scheduled"
      );

      userSessions.slice(0, 2).forEach((session) => {
        notifications.push({
          recipient: user._id,
          type: "session_reminder",
          title: "Upcoming Session Reminder",
          message: `You have a ${
            session.title
          } scheduled for ${session.scheduledDate.toLocaleDateString()}`,
          priority: "high",
          category: "session",
          channels: {
            email: { enabled: true, sent: false },
            push: { enabled: true, sent: false },
            inApp: { enabled: true, read: false },
          },
          status: "queued",
          relatedEntities: { session: session._id },
        });
      });

      // Completed session notifications
      const completedUserSessions = createdSessions.filter(
        (s) =>
          (s.tutor.toString() === user._id.toString() ||
            s.learner.toString() === user._id.toString()) &&
          s.status === "completed"
      );

      if (completedUserSessions.length > 0) {
        const recentCompleted = completedUserSessions[0];
        if (recentCompleted.actualEndTime) {
          const isRead = Math.random() > 0.5;
          notifications.push({
            recipient: user._id,
            type: "session_completed",
            title: "Session Completed",
            message: `Your ${recentCompleted.title} has been completed. Don't forget to leave feedback!`,
            priority: "normal",
            category: "session",
            channels: {
              email: {
                enabled: true,
                sent: true,
                sentAt: recentCompleted.actualEndTime,
              },
              inApp: {
                enabled: true,
                read: isRead,
                readAt: isRead
                  ? new Date(recentCompleted.actualEndTime.getTime() + 3600000)
                  : undefined,
              },
            },
            status: "sent",
            relatedEntities: { session: recentCompleted._id },
          });
        }
      }
    }

    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`✅ Created ${createdNotifications.length} notifications`);

    // Summary
    console.log("\n📊 Seeding Summary:");
    console.log("=".repeat(50));
    console.log(`Skills:        ${skills.length}`);
    console.log(
      `Users:         ${createdUsers.length} (${tutors.length} tutors, ${learners.length} learners)`
    );
    console.log(`Sessions:      ${createdSessions.length}`);
    console.log(`Payments:      ${payments.length}`);
    console.log(`Notifications: ${createdNotifications.length}`);
    console.log("=".repeat(50));

    console.log("\n✨ Database seeded successfully!");
    console.log("\n📝 Test Accounts:");
    console.log("Tutor:   sarah.johnson@example.com / password123");
    console.log("Learner: alex.thompson@example.com / password123");
    console.log("\nAll accounts use password: password123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

// Run the seeder
const run = async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.disconnect();
  console.log("\n👋 Disconnected from database");
  process.exit(0);
};

run();
