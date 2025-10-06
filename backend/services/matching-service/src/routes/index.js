const express = require("express");
const MatchingController = require("../controllers/MatchingController");
const { authenticate, authorize } = require("../../../shared/middleware/auth");
const { validateRequest } = require("../../../shared/middleware/validation");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const matchingController = new MatchingController();

// Rate limiting for matching endpoints
const matchingRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    success: false,
    message: "Too many matching requests, please try again later",
  },
});

// Validation schemas
const findTeachersSchema = {
  body: {
    type: "object",
    required: ["skillId"],
    properties: {
      skillId: { type: "string", minLength: 24, maxLength: 24 },
      preferences: {
        type: "object",
        properties: {
          maxPrice: { type: "number", minimum: 0 },
          minRating: { type: "number", minimum: 0, maximum: 5 },
          languagePreferences: {
            type: "array",
            items: { type: "string" },
          },
          timezonePreference: { type: "string" },
          experienceLevel: {
            type: "string",
            enum: ["beginner", "intermediate", "advanced"],
          },
          sessionType: {
            type: "string",
            enum: ["individual", "group", "both"],
          },
          availability: {
            type: "object",
            properties: {
              daysOfWeek: {
                type: "array",
                items: { type: "string" },
              },
              timeSlots: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};

const compatibilityScoreSchema = {
  body: {
    type: "object",
    required: ["teacherId", "skillId"],
    properties: {
      teacherId: { type: "string", minLength: 24, maxLength: 24 },
      skillId: { type: "string", minLength: 24, maxLength: 24 },
    },
  },
};

const batchMatchSchema = {
  body: {
    type: "object",
    required: ["skillIds"],
    properties: {
      skillIds: {
        type: "array",
        minItems: 1,
        maxItems: 10,
        items: { type: "string", minLength: 24, maxLength: 24 },
      },
      preferences: {
        type: "object",
        properties: {
          maxPrice: { type: "number", minimum: 0 },
          minRating: { type: "number", minimum: 0, maximum: 5 },
        },
      },
    },
  },
};

const algorithmWeightsSchema = {
  body: {
    type: "object",
    required: ["weights"],
    properties: {
      weights: {
        type: "object",
        required: ["contentBased", "collaborative", "availability", "realTime"],
        properties: {
          contentBased: { type: "number", minimum: 0, maximum: 1 },
          collaborative: { type: "number", minimum: 0, maximum: 1 },
          availability: { type: "number", minimum: 0, maximum: 1 },
          realTime: { type: "number", minimum: 0, maximum: 1 },
        },
      },
    },
  },
};

/**
 * @swagger
 * components:
 *   schemas:
 *     MatchPreferences:
 *       type: object
 *       properties:
 *         maxPrice:
 *           type: number
 *           description: Maximum hourly rate
 *         minRating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           description: Minimum teacher rating
 *         languagePreferences:
 *           type: array
 *           items:
 *             type: string
 *           description: Preferred languages
 *         timezonePreference:
 *           type: string
 *           description: Preferred timezone
 *         experienceLevel:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Learner's experience level
 */

/**
 * @swagger
 * /api/matching/find-teachers:
 *   post:
 *     summary: Find matching teachers for a skill
 *     tags: [Matching]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillId
 *             properties:
 *               skillId:
 *                 type: string
 *                 description: ID of the skill to find teachers for
 *               preferences:
 *                 $ref: '#/components/schemas/MatchPreferences'
 *     responses:
 *       200:
 *         description: Successfully found matching teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     matches:
 *                       type: array
 *                       items:
 *                         type: object
 *                     totalCount:
 *                       type: number
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/find-teachers",
  matchingRateLimit,
  authenticate,
  validateRequest(findTeachersSchema),
  matchingController.findTeachers.bind(matchingController)
);

/**
 * @swagger
 * /api/matching/skill-recommendations:
 *   get:
 *     summary: Get personalized skill recommendations
 *     tags: [Matching]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of recommendations to return
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by skill category
 *     responses:
 *       200:
 *         description: Successfully retrieved skill recommendations
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/skill-recommendations",
  matchingRateLimit,
  authenticate,
  matchingController.getSkillRecommendations.bind(matchingController)
);

/**
 * @swagger
 * /api/matching/compatibility-score:
 *   post:
 *     summary: Get compatibility score between learner and teacher
 *     tags: [Matching]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - skillId
 *             properties:
 *               teacherId:
 *                 type: string
 *                 description: ID of the teacher
 *               skillId:
 *                 type: string
 *                 description: ID of the skill
 *     responses:
 *       200:
 *         description: Successfully calculated compatibility score
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/compatibility-score",
  matchingRateLimit,
  authenticate,
  validateRequest(compatibilityScoreSchema),
  matchingController.getCompatibilityScore.bind(matchingController)
);

/**
 * @swagger
 * /api/matching/batch-match:
 *   post:
 *     summary: Find teachers for multiple skills in batch
 *     tags: [Matching]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillIds
 *             properties:
 *               skillIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 10
 *                 description: Array of skill IDs to find teachers for
 *               preferences:
 *                 $ref: '#/components/schemas/MatchPreferences'
 *     responses:
 *       200:
 *         description: Successfully processed batch matching
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/batch-match",
  matchingRateLimit,
  authenticate,
  validateRequest(batchMatchSchema),
  matchingController.batchMatch.bind(matchingController)
);

/**
 * @swagger
 * /api/matching/analytics:
 *   get:
 *     summary: Get matching analytics and insights (Admin only)
 *     tags: [Matching]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           default: 7d
 *         description: Analytics timeframe (7d, 30d, 90d)
 *     responses:
 *       200:
 *         description: Successfully retrieved analytics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get(
  "/analytics",
  authenticate,
  authorize(["admin", "super_admin"]),
  matchingController.getMatchingAnalytics.bind(matchingController)
);

/**
 * @swagger
 * /api/matching/algorithm-weights:
 *   put:
 *     summary: Update matching algorithm weights (Admin only)
 *     tags: [Matching]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weights
 *             properties:
 *               weights:
 *                 type: object
 *                 required:
 *                   - contentBased
 *                   - collaborative
 *                   - availability
 *                   - realTime
 *                 properties:
 *                   contentBased:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 1
 *                   collaborative:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 1
 *                   availability:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 1
 *                   realTime:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 1
 *     responses:
 *       200:
 *         description: Successfully updated algorithm weights
 *       400:
 *         description: Invalid weights (must sum to 1.0)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.put(
  "/algorithm-weights",
  authenticate,
  authorize(["admin", "super_admin"]),
  validateRequest(algorithmWeightsSchema),
  matchingController.updateAlgorithmWeights.bind(matchingController)
);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Matching service is healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Service status endpoint
router.get("/status", authenticate, async (req, res) => {
  try {
    const status = {
      service: "matching-service",
      status: "operational",
      timestamp: new Date().toISOString(),
      components: {
        matchingEngine: "operational",
        database: "operational",
        cache: "operational",
        mlModel: "loading", // This would check actual ML model status
      },
      metrics: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      },
    };

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking service status",
      error: error.message,
    });
  }
});

module.exports = router;
