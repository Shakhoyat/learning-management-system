const request = require("supertest");
const app = require("../../src/app");
const { User, Skill } = require("../../../shared/database");
const mongoose = require("mongoose");

describe("Matching API Integration Tests", () => {
  let authToken;
  let testUser;
  let testSkill;
  let testTeacher;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(
      process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/lms_test"
    );

    // Create test data
    testSkill = await Skill.create({
      name: "JavaScript Programming",
      description: "Learn JavaScript fundamentals",
      category: "Programming",
      subcategory: "Web Development",
      difficultyLevel: 3,
      averageLearningHours: 40,
      status: "active",
    });

    testUser = await User.create({
      personal: {
        name: "Test Learner",
        email: "learner@test.com",
        languages: ["English"],
        timezone: "UTC",
      },
      account: {
        password: "hashedpassword",
        role: "learner",
      },
      skills: {
        learning: [
          {
            skillId: testSkill._id,
            level: 2,
            status: "active",
          },
        ],
      },
    });

    testTeacher = await User.create({
      personal: {
        name: "Test Teacher",
        email: "teacher@test.com",
        languages: ["English"],
        timezone: "UTC",
      },
      account: {
        password: "hashedpassword",
        role: "teacher",
      },
      skills: {
        teaching: [
          {
            skillId: testSkill._id,
            level: 5,
            hoursTaught: 100,
            rating: 4.5,
            totalReviews: 20,
            pricing: {
              individual: { rate: 50, currency: "USD" },
            },
            availability: {
              hoursPerWeek: 20,
              timezone: "UTC",
            },
          },
        ],
      },
    });

    // Mock authentication
    authToken = "Bearer mock-jwt-token";
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Skill.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/matching/find-teachers", () => {
    it("should find matching teachers for a skill", async () => {
      // Mock authentication middleware
      const originalAuth =
        require("../../../shared/middleware/auth").authenticate;
      require("../../../shared/middleware/auth").authenticate = (
        req,
        res,
        next
      ) => {
        req.user = { id: testUser._id };
        next();
      };

      const response = await request(app)
        .post("/api/matching/find-teachers")
        .set("Authorization", authToken)
        .send({
          skillId: testSkill._id.toString(),
          preferences: {
            maxPrice: 100,
            minRating: 4.0,
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.matches).toBeInstanceOf(Array);

      // Restore original auth
      require("../../../shared/middleware/auth").authenticate = originalAuth;
    });

    it("should return 400 for missing skillId", async () => {
      require("../../../shared/middleware/auth").authenticate = (
        req,
        res,
        next
      ) => {
        req.user = { id: testUser._id };
        next();
      };

      const response = await request(app)
        .post("/api/matching/find-teachers")
        .set("Authorization", authToken)
        .send({
          preferences: { maxPrice: 100 },
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/matching/skill-recommendations", () => {
    it("should return skill recommendations", async () => {
      require("../../../shared/middleware/auth").authenticate = (
        req,
        res,
        next
      ) => {
        req.user = { id: testUser._id };
        next();
      };

      const response = await request(app)
        .get("/api/matching/skill-recommendations")
        .set("Authorization", authToken)
        .query({ limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.recommendations).toBeInstanceOf(Array);
    });
  });

  describe("POST /api/matching/compatibility-score", () => {
    it("should calculate compatibility score", async () => {
      require("../../../shared/middleware/auth").authenticate = (
        req,
        res,
        next
      ) => {
        req.user = { id: testUser._id };
        next();
      };

      const response = await request(app)
        .post("/api/matching/compatibility-score")
        .set("Authorization", authToken)
        .send({
          teacherId: testTeacher._id.toString(),
          skillId: testSkill._id.toString(),
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.overallCompatibility).toBeDefined();
      expect(response.body.data.detailedScores).toBeDefined();
    });
  });

  describe("POST /api/matching/batch-match", () => {
    it("should process batch matching request", async () => {
      require("../../../shared/middleware/auth").authenticate = (
        req,
        res,
        next
      ) => {
        req.user = { id: testUser._id };
        next();
      };

      const response = await request(app)
        .post("/api/matching/batch-match")
        .set("Authorization", authToken)
        .send({
          skillIds: [testSkill._id.toString()],
          preferences: { maxPrice: 100 },
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.results).toBeInstanceOf(Array);
    });

    it("should return 400 for too many skills", async () => {
      require("../../../shared/middleware/auth").authenticate = (
        req,
        res,
        next
      ) => {
        req.user = { id: testUser._id };
        next();
      };

      const skillIds = Array(15).fill(testSkill._id.toString());

      const response = await request(app)
        .post("/api/matching/batch-match")
        .set("Authorization", authToken)
        .send({ skillIds });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/matching/health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/api/matching/health");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("healthy");
    });
  });

  describe("Rate Limiting", () => {
    it("should apply rate limiting", async () => {
      require("../../../shared/middleware/auth").authenticate = (
        req,
        res,
        next
      ) => {
        req.user = { id: testUser._id };
        next();
      };

      // Make multiple requests quickly
      const promises = Array(60)
        .fill()
        .map(() =>
          request(app)
            .post("/api/matching/find-teachers")
            .set("Authorization", authToken)
            .send({ skillId: testSkill._id.toString() })
        );

      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter((r) => r.status === 429);

      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    }, 10000);
  });
});
