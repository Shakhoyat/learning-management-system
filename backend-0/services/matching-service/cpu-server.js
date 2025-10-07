const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import the simplified CPU-based matching engine
const SimpleCPUMatchingEngine = require("./src/services/SimpleCPUMatchingEngine");

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Initialize matching engine
const matchingEngine = new SimpleCPUMatchingEngine();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "matching-service",
    version: "1.0.0",
    engine: "tensorflow-cpu",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes

/**
 * POST /api/matching/find
 * Find matching teachers for a student
 */
app.post("/api/matching/find", async (req, res) => {
  try {
    const { studentId, skillId, requirements = {} } = req.body;

    if (!studentId || !skillId) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Skill ID are required",
        code: "MISSING_REQUIRED_FIELDS",
      });
    }

    console.log(
      `🔍 Processing matching request for student: ${studentId}, skill: ${skillId}`
    );

    const startTime = Date.now();
    const result = await matchingEngine.findMatches(
      studentId,
      skillId,
      requirements
    );
    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      message: "Matches found successfully",
      data: {
        ...result,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Matching error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to find matches",
      code: "MATCHING_ERROR",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/matching/teachers/:skillId
 * Get available teachers for a specific skill
 */
app.get("/api/matching/teachers/:skillId", async (req, res) => {
  try {
    const { skillId } = req.params;
    const { limit = 20, sortBy = "rating" } = req.query;

    console.log(`👨‍🏫 Getting teachers for skill: ${skillId}`);

    // Mock implementation - replace with actual database query
    const teachers = await matchingEngine.getAvailableTeachers(skillId);

    // Sort teachers
    if (sortBy === "rating") {
      teachers.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "experience") {
      teachers.sort((a, b) => b.experience - a.experience);
    } else if (sortBy === "price") {
      teachers.sort((a, b) => a.hourlyRate - b.hourlyRate);
    }

    const limitedTeachers = teachers.slice(0, parseInt(limit));

    res.json({
      success: true,
      message: "Teachers retrieved successfully",
      data: {
        teachers: limitedTeachers,
        total: teachers.length,
        displayed: limitedTeachers.length,
        sortedBy: sortBy,
      },
    });
  } catch (error) {
    console.error("❌ Error getting teachers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get teachers",
      code: "TEACHERS_ERROR",
    });
  }
});

/**
 * POST /api/matching/recommend
 * Get skill recommendations for a student
 */
app.post("/api/matching/recommend", async (req, res) => {
  try {
    const { studentId, currentSkills = [], interests = [] } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
        code: "MISSING_STUDENT_ID",
      });
    }

    console.log(`💡 Getting recommendations for student: ${studentId}`);

    // Mock recommendations - replace with actual recommendation logic
    const recommendations = [
      {
        skillId: "skill1",
        skillName: "Advanced React Patterns",
        reason: "Based on your JavaScript and React knowledge",
        confidence: 0.85,
        category: "Web Development",
        estimatedTime: "40 hours",
        difficulty: "intermediate",
      },
      {
        skillId: "skill2",
        skillName: "Node.js Backend Development",
        reason: "Perfect next step for full-stack development",
        confidence: 0.78,
        category: "Backend Development",
        estimatedTime: "60 hours",
        difficulty: "intermediate",
      },
    ];

    res.json({
      success: true,
      message: "Recommendations generated successfully",
      data: {
        recommendations,
        basedOn: {
          currentSkills,
          interests,
          learningHistory: "analyzed",
        },
      },
    });
  } catch (error) {
    console.error("❌ Recommendation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
      code: "RECOMMENDATION_ERROR",
    });
  }
});

/**
 * GET /api/matching/stats
 * Get matching service statistics
 */
app.get("/api/matching/stats", (req, res) => {
  res.json({
    success: true,
    data: {
      service: "matching-service",
      engine: "tensorflow-cpu",
      status: matchingEngine.initialized ? "active" : "fallback",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      version: "1.0.0-cpu",
      features: {
        aiMatching: matchingEngine.initialized,
        ruleBasedFallback: true,
        realTimeMatching: true,
        skillRecommendations: true,
      },
    },
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("❌ Unhandled error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    code: "NOT_FOUND",
  });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  await matchingEngine.cleanup();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  await matchingEngine.cleanup();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    console.log("🚀 Starting Matching Service with TensorFlow.js CPU...");

    // Initialize the matching engine
    await matchingEngine.initialize();

    app.listen(PORT, () => {
      console.log(`✅ Matching Service running on port ${PORT}`);
      console.log(
        `🤖 Engine status: ${
          matchingEngine.initialized ? "AI-powered" : "Rule-based fallback"
        }`
      );
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API base: http://localhost:${PORT}/api/matching/`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
