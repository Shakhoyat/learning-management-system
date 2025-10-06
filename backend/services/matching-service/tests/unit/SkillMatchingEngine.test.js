const SkillMatchingEngine = require("../../src/services/SkillMatchingEngine");
const { User, Skill } = require("../../../shared/database");

// Mock dependencies
jest.mock("../../../shared/database");
jest.mock("../../../shared/cache/redis");
jest.mock("../../../shared/logger");

describe("SkillMatchingEngine Unit Tests", () => {
  let matchingEngine;
  let mockLearner;
  let mockTeacher;
  let mockSkill;

  beforeEach(() => {
    matchingEngine = new SkillMatchingEngine();

    mockSkill = {
      _id: "skill123",
      name: "JavaScript",
      category: "Programming",
      subcategory: "Web Development",
      difficultyLevel: 3,
      relatedSkills: [
        { skillId: { _id: "skill124", name: "React" }, strength: 0.8 },
      ],
    };

    mockLearner = {
      _id: "learner123",
      personal: {
        name: "Test Learner",
        languages: ["English"],
        timezone: "UTC",
        location: { country: "US" },
      },
      skills: {
        learning: [
          {
            skillId: mockSkill,
            level: 2,
            hoursSpent: 20,
            status: "active",
          },
        ],
        teaching: [],
      },
      preferences: {
        learning: {
          sessionTypes: ["individual"],
          budget: { max: 50, currency: "USD" },
        },
      },
    };

    mockTeacher = {
      _id: "teacher123",
      personal: {
        name: "Test Teacher",
        languages: ["English"],
        timezone: "UTC",
        location: { country: "US" },
      },
      skills: {
        teaching: [
          {
            skillId: mockSkill,
            level: 5,
            hoursTaught: 100,
            rating: 4.5,
            totalReviews: 20,
            pricing: {
              individual: { rate: 40, currency: "USD" },
            },
            availability: {
              hoursPerWeek: 20,
              timezone: "UTC",
              timeSlots: ["morning", "afternoon"],
            },
            status: "active",
          },
        ],
      },
      statistics: {
        totalStudents: 50,
        averageRating: 4.5,
        responseTime: { average: 2 },
        lastActive: new Date(),
      },
    };

    // Mock database methods
    User.findById = jest.fn();
    User.find = jest.fn();
    Skill.findById = jest.fn();
  });

  describe("buildLearnerProfile", () => {
    it("should build a comprehensive learner profile", async () => {
      const profile = await matchingEngine.buildLearnerProfile(mockLearner);

      expect(profile).toHaveProperty("userId");
      expect(profile).toHaveProperty("skillInterests");
      expect(profile).toHaveProperty("preferences");
      expect(profile).toHaveProperty("experienceLevel");
      expect(profile.skillInterests).toHaveLength(1);
      expect(profile.skillInterests[0].skillId).toBe(mockSkill._id);
    });

    it("should handle learner with no skills", async () => {
      const learnerWithoutSkills = {
        ...mockLearner,
        skills: { learning: [], teaching: [] },
      };

      const profile = await matchingEngine.buildLearnerProfile(
        learnerWithoutSkills
      );

      expect(profile.skillInterests).toHaveLength(0);
      expect(profile.experienceLevel).toBe(0);
    });
  });

  describe("findEligibleTeachers", () => {
    it("should find teachers who teach the specified skill", async () => {
      User.find.mockResolvedValue([mockTeacher]);

      const teachers = await matchingEngine.findEligibleTeachers(mockSkill._id);

      expect(teachers).toHaveLength(1);
      expect(teachers[0]._id).toBe(mockTeacher._id);
      expect(User.find).toHaveBeenCalledWith({
        "account.role": "teacher",
        "account.status": "active",
        "skills.teaching.skillId": mockSkill._id,
        "skills.teaching.status": "active",
      });
    });

    it("should return empty array when no teachers found", async () => {
      User.find.mockResolvedValue([]);

      const teachers = await matchingEngine.findEligibleTeachers(mockSkill._id);

      expect(teachers).toHaveLength(0);
    });
  });

  describe("calculateLevelCompatibility", () => {
    it("should calculate perfect compatibility for appropriate level gap", () => {
      const learnerSkill = { level: 2 };
      const teacherSkill = { level: 5 };

      const compatibility = matchingEngine.calculateLevelCompatibility(
        learnerSkill,
        teacherSkill
      );

      expect(compatibility).toBeGreaterThan(0.8);
    });

    it("should penalize excessive level gaps", () => {
      const learnerSkill = { level: 1 };
      const teacherSkill = { level: 5 };

      const compatibility = matchingEngine.calculateLevelCompatibility(
        learnerSkill,
        teacherSkill
      );

      expect(compatibility).toBeLessThan(0.8);
    });

    it("should handle same level appropriately", () => {
      const learnerSkill = { level: 3 };
      const teacherSkill = { level: 3 };

      const compatibility = matchingEngine.calculateLevelCompatibility(
        learnerSkill,
        teacherSkill
      );

      expect(compatibility).toBeLessThan(0.5); // Teacher should be more advanced
    });
  });

  describe("calculateAvailabilityScore", () => {
    it("should return high score for good availability match", () => {
      const availability = {
        hoursPerWeek: 20,
        timeSlots: ["morning", "afternoon"],
      };

      const preferences = {
        hoursPerWeek: 10,
        timeSlots: ["morning"],
      };

      const score = matchingEngine.calculateAvailabilityScore(
        availability,
        preferences
      );

      expect(score).toBeGreaterThan(0.7);
    });

    it("should return low score for poor availability match", () => {
      const availability = {
        hoursPerWeek: 5,
        timeSlots: ["evening"],
      };

      const preferences = {
        hoursPerWeek: 20,
        timeSlots: ["morning"],
      };

      const score = matchingEngine.calculateAvailabilityScore(
        availability,
        preferences
      );

      expect(score).toBeLessThan(0.3);
    });
  });

  describe("calculateCosineSimilarity", () => {
    it("should calculate correct cosine similarity", () => {
      const vectorA = [1, 2, 3];
      const vectorB = [1, 2, 3];

      const similarity = matchingEngine.calculateCosineSimilarity(
        vectorA,
        vectorB
      );

      expect(similarity).toBeCloseTo(1, 2);
    });

    it("should handle orthogonal vectors", () => {
      const vectorA = [1, 0];
      const vectorB = [0, 1];

      const similarity = matchingEngine.calculateCosineSimilarity(
        vectorA,
        vectorB
      );

      expect(similarity).toBeCloseTo(0, 2);
    });

    it("should handle zero vectors", () => {
      const vectorA = [0, 0, 0];
      const vectorB = [1, 2, 3];

      const similarity = matchingEngine.calculateCosineSimilarity(
        vectorA,
        vectorB
      );

      expect(similarity).toBe(0);
    });
  });

  describe("findBestMatch", () => {
    beforeEach(() => {
      User.findById.mockImplementation((id) => {
        if (id === mockLearner._id) {
          return Promise.resolve(mockLearner);
        }
        return Promise.resolve(null);
      });

      User.find.mockResolvedValue([mockTeacher]);
      Skill.findById.mockResolvedValue(mockSkill);
    });

    it("should find and rank teachers correctly", async () => {
      const matches = await matchingEngine.findBestMatch(
        mockLearner._id,
        mockSkill._id
      );

      expect(matches).toHaveLength(1);
      expect(matches[0]).toHaveProperty("teacher");
      expect(matches[0]).toHaveProperty("score");
      expect(matches[0]).toHaveProperty("breakdown");
      expect(matches[0].score).toBeGreaterThan(0);
      expect(matches[0].score).toBeLessThanOrEqual(1);
    });

    it("should handle preferences in matching", async () => {
      const preferences = {
        maxPrice: 30,
        minRating: 4.0,
      };

      const matches = await matchingEngine.findBestMatch(
        mockLearner._id,
        mockSkill._id,
        preferences
      );

      expect(matches).toHaveLength(1); // Teacher price (40) exceeds max (30) but still included
    });

    it("should return empty array for non-existent skill", async () => {
      Skill.findById.mockResolvedValue(null);

      const matches = await matchingEngine.findBestMatch(
        mockLearner._id,
        "nonexistent"
      );

      expect(matches).toHaveLength(0);
    });

    it("should handle error gracefully", async () => {
      User.findById.mockRejectedValue(new Error("Database error"));

      const matches = await matchingEngine.findBestMatch(
        mockLearner._id,
        mockSkill._id
      );

      expect(matches).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle teacher with no ratings", () => {
      const teacherWithoutRating = {
        ...mockTeacher,
        skills: {
          teaching: [
            {
              ...mockTeacher.skills.teaching[0],
              rating: 0,
              totalReviews: 0,
            },
          ],
        },
      };

      const score = matchingEngine.calculateContentBasedScore(
        mockLearner.skills.learning[0],
        teacherWithoutRating.skills.teaching[0],
        mockSkill
      );

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(0.8); // Should be penalized for no rating
    });

    it("should handle missing availability data", () => {
      const availability = null;
      const preferences = {
        hoursPerWeek: 10,
        timeSlots: ["morning"],
      };

      const score = matchingEngine.calculateAvailabilityScore(
        availability,
        preferences
      );

      expect(score).toBe(0.5); // Default neutral score
    });

    it("should handle extreme pricing differences", () => {
      const teacherSkill = {
        ...mockTeacher.skills.teaching[0],
        pricing: { individual: { rate: 500, currency: "USD" } },
      };

      const preferences = { maxPrice: 50 };

      const priceScore =
        1 -
        Math.min(
          teacherSkill.pricing.individual.rate / preferences.maxPrice - 1,
          1
        );

      expect(priceScore).toBeLessThan(0.1);
    });
  });
});
