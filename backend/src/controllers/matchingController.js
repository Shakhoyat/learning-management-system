const User = require("../models/User");
const Skill = require("../models/Skill");
const Session = require("../models/Session");
const logger = require("../utils/logger");
const { PAGINATION } = require("../config/constants");

// Find tutors for a learner
exports.findTutors = async (req, res) => {
  try {
    const {
      skillId,
      location,
      maxHourlyRate,
      minRating = 0,
      availability,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      sortBy = "reputation.teachingStats.averageRating",
      sortOrder = "desc",
    } = req.query;

    if (!skillId) {
      return res.status(400).json({
        success: false,
        error: "Skill ID is required",
      });
    }

    // Build query for tutors who teach the requested skill
    const query = {
      role: "tutor",
      "auth.isActive": true,
      "teachingSkills.skillId": skillId,
    };

    // Add filters
    if (maxHourlyRate) {
      query["teachingSkills.hourlyRate"] = { $lte: parseFloat(maxHourlyRate) };
    }

    if (minRating > 0) {
      query["reputation.teachingStats.averageRating"] = {
        $gte: parseFloat(minRating),
      };
    }

    if (location) {
      query.$or = [
        { "location.country": new RegExp(location, "i") },
        { "location.city": new RegExp(location, "i") },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Find tutors
    const tutors = await User.find(query)
      .populate("teachingSkills.skillId", "name category difficulty")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-auth.passwordHash -auth.refreshTokens");

    // Filter tutors to only show those who teach the specific skill
    const filteredTutors = tutors
      .map((tutor) => {
        const relevantSkill = tutor.teachingSkills.find(
          (ts) => ts.skillId._id.toString() === skillId
        );

        return {
          ...tutor.toObject(),
          matchingSkill: relevantSkill,
          matchScore: calculateMatchScore(tutor, req.user, skillId),
        };
      })
      .filter((tutor) => tutor.matchingSkill);

    // Sort by match score if requested
    if (sortBy === "matchScore") {
      filteredTutors.sort((a, b) =>
        sortOrder === "asc"
          ? a.matchScore - b.matchScore
          : b.matchScore - a.matchScore
      );
    }

    const totalTutors = await User.countDocuments(query);
    const totalPages = Math.ceil(totalTutors / limit);

    res.json({
      success: true,
      data: {
        tutors: filteredTutors,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalTutors,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error("Find tutors error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to find tutors",
    });
  }
};

// Find learners for a tutor
exports.findLearners = async (req, res) => {
  try {
    const {
      skillId,
      location,
      minLevel = 0,
      maxLevel = 10,
      learningStyle,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query for learners
    const query = {
      role: "learner",
      "auth.isActive": true,
    };

    if (skillId) {
      query["learningSkills.skillId"] = skillId;
      query["learningSkills.currentLevel"] = {
        $gte: parseInt(minLevel),
        $lte: parseInt(maxLevel),
      };
    }

    if (location) {
      query.$or = [
        { "location.country": new RegExp(location, "i") },
        { "location.city": new RegExp(location, "i") },
      ];
    }

    if (learningStyle) {
      query["learningSkills.preferredLearningStyle"] = learningStyle;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Find learners
    const learners = await User.find(query)
      .populate("learningSkills.skillId", "name category difficulty")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-auth.passwordHash -auth.refreshTokens");

    // Add match scores if skill is specified
    const enrichedLearners = learners.map((learner) => {
      const matchScore = skillId
        ? calculateLearnerMatchScore(learner, req.user, skillId)
        : 0;
      return {
        ...learner.toObject(),
        matchScore,
      };
    });

    const totalLearners = await User.countDocuments(query);
    const totalPages = Math.ceil(totalLearners / limit);

    res.json({
      success: true,
      data: {
        learners: enrichedLearners,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalLearners,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error("Find learners error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to find learners",
    });
  }
};

// Get skill matches for user
exports.getSkillMatches = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate("teachingSkills.skillId")
      .populate("learningSkills.skillId");

    const matches = [];

    if (user.role === "learner") {
      // Find tutors for learner's learning skills
      for (const learningSkill of user.learningSkills) {
        const tutors = await User.find({
          role: "tutor",
          "auth.isActive": true,
          "teachingSkills.skillId": learningSkill.skillId._id,
        })
          .populate("teachingSkills.skillId", "name category")
          .limit(5)
          .select("name avatar reputation.teachingStats teachingSkills");

        matches.push({
          skill: learningSkill.skillId,
          currentLevel: learningSkill.currentLevel,
          targetLevel: learningSkill.targetLevel,
          tutors: tutors.map((tutor) => ({
            ...tutor.toObject(),
            matchScore: calculateMatchScore(
              tutor,
              user,
              learningSkill.skillId._id
            ),
          })),
        });
      }
    } else if (user.role === "tutor") {
      // Find learners for tutor's teaching skills
      for (const teachingSkill of user.teachingSkills) {
        const learners = await User.find({
          role: "learner",
          "auth.isActive": true,
          "learningSkills.skillId": teachingSkill.skillId._id,
        })
          .populate("learningSkills.skillId", "name category")
          .limit(5)
          .select("name avatar reputation.learningStats learningSkills");

        matches.push({
          skill: teachingSkill.skillId,
          level: teachingSkill.level,
          hourlyRate: teachingSkill.hourlyRate,
          learners: learners.map((learner) => ({
            ...learner.toObject(),
            matchScore: calculateLearnerMatchScore(
              learner,
              user,
              teachingSkill.skillId._id
            ),
          })),
        });
      }
    }

    res.json({
      success: true,
      data: { matches },
    });
  } catch (error) {
    logger.error("Get skill matches error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get skill matches",
    });
  }
};

// Get recommended skills for user
exports.getRecommendedSkills = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    const user = await User.findById(userId)
      .populate("teachingSkills.skillId")
      .populate("learningSkills.skillId");

    let recommendedSkills = [];

    if (user.role === "learner") {
      // Recommend skills based on current learning skills and prerequisites
      const currentSkillIds = user.learningSkills.map((ls) => ls.skillId._id);

      // Find related skills and prerequisites
      const relatedSkills = await Skill.find({
        $and: [
          { _id: { $nin: currentSkillIds } },
          { isActive: true, visibility: "public" },
          {
            $or: [
              { "relatedSkills.skillId": { $in: currentSkillIds } },
              { "prerequisites.skillId": { $in: currentSkillIds } },
            ],
          },
        ],
      }).limit(parseInt(limit));

      recommendedSkills = relatedSkills.map((skill) => ({
        ...skill.toObject(),
        recommendationReason: "Related to your current learning goals",
        matchScore: calculateSkillRecommendationScore(skill, user),
      }));
    } else if (user.role === "tutor") {
      // Recommend skills based on teaching skills and market demand
      const currentTeachingSkillIds = user.teachingSkills.map(
        (ts) => ts.skillId._id
      );

      // Find high-demand skills in similar categories
      const categories = [
        ...new Set(user.teachingSkills.map((ts) => ts.skillId.category)),
      ];

      const demandSkills = await Skill.find({
        $and: [
          { _id: { $nin: currentTeachingSkillIds } },
          { isActive: true, visibility: "public" },
          { category: { $in: categories } },
        ],
      })
        .sort({ "stats.totalLearners": -1, "industryDemand.score": -1 })
        .limit(parseInt(limit));

      recommendedSkills = demandSkills.map((skill) => ({
        ...skill.toObject(),
        recommendationReason: "High demand in your teaching categories",
        matchScore: skill.stats.totalLearners + skill.industryDemand.score,
      }));
    }

    res.json({
      success: true,
      data: { recommendedSkills },
    });
  } catch (error) {
    logger.error("Get recommended skills error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get recommended skills",
    });
  }
};

// Get matching statistics
exports.getMatchingStats = async (req, res) => {
  try {
    const totalTutors = await User.countDocuments({
      role: "tutor",
      "auth.isActive": true,
    });

    const totalLearners = await User.countDocuments({
      role: "learner",
      "auth.isActive": true,
    });

    const totalSessions = await Session.countDocuments({
      status: { $in: ["completed", "scheduled", "in_progress"] },
    });

    // Top skills by demand
    const topSkillsByDemand = await Skill.find({
      isActive: true,
      visibility: "public",
    })
      .sort({ "stats.totalLearners": -1 })
      .limit(10)
      .select("name category stats.totalLearners stats.totalTeachers");

    // Success rate (completed sessions / total sessions)
    const completedSessions = await Session.countDocuments({
      status: "completed",
    });
    const successRate =
      totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    // Average session rating
    const ratingStats = await Session.aggregate([
      {
        $match: {
          status: "completed",
          "feedback.learner.rating": { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$feedback.learner.rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalTutors,
          totalLearners,
          totalSessions,
          successRate: Math.round(successRate * 100) / 100,
          averageRating: ratingStats[0]?.averageRating || 0,
          totalRatings: ratingStats[0]?.totalRatings || 0,
        },
        topSkillsByDemand,
      },
    });
  } catch (error) {
    logger.error("Get matching stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get matching statistics",
    });
  }
};

// Helper function to calculate match score between tutor and learner
function calculateMatchScore(tutor, learner, skillId) {
  let score = 0;

  // Find the specific teaching skill
  const teachingSkill = tutor.teachingSkills.find(
    (ts) => ts.skillId._id.toString() === skillId.toString()
  );

  if (!teachingSkill) return 0;

  // Teaching experience (30% weight)
  score += (teachingSkill.hoursTaught / 100) * 30;

  // Rating (40% weight)
  score += (teachingSkill.rating / 5) * 40;

  // Skill level match (20% weight)
  const learningSkill = learner.learningSkills?.find(
    (ls) => ls.skillId._id.toString() === skillId.toString()
  );

  if (learningSkill) {
    const levelDifference = Math.abs(
      teachingSkill.level - learningSkill.targetLevel
    );
    score += Math.max(0, (10 - levelDifference) / 10) * 20;
  }

  // Location proximity (10% weight)
  if (tutor.location?.country === learner.location?.country) {
    score += 10;
    if (tutor.location?.city === learner.location?.city) {
      score += 5;
    }
  }

  return Math.min(100, Math.round(score));
}

// Helper function to calculate learner match score for tutors
function calculateLearnerMatchScore(learner, tutor, skillId) {
  let score = 0;

  // Find the specific learning skill
  const learningSkill = learner.learningSkills.find(
    (ls) => ls.skillId._id.toString() === skillId.toString()
  );

  if (!learningSkill) return 0;

  // Learning motivation (based on target level - current level) (40% weight)
  const motivation = learningSkill.targetLevel - learningSkill.currentLevel;
  score += (motivation / 10) * 40;

  // Learning activity (30% weight)
  score += (learner.reputation.learningStats.totalSessions / 50) * 30;

  // Skill level appropriateness (20% weight)
  const teachingSkill = tutor.teachingSkills?.find(
    (ts) => ts.skillId._id.toString() === skillId.toString()
  );

  if (teachingSkill) {
    const levelMatch = teachingSkill.level >= learningSkill.targetLevel;
    score += levelMatch ? 20 : 0;
  }

  // Location proximity (10% weight)
  if (tutor.location?.country === learner.location?.country) {
    score += 10;
  }

  return Math.min(100, Math.round(score));
}

// Helper function to calculate skill recommendation score
function calculateSkillRecommendationScore(skill, user) {
  let score = 0;

  // Industry demand (40% weight)
  score += (skill.industryDemand.score / 100) * 40;

  // Learning demand (30% weight)
  score += (skill.stats.totalLearners / 1000) * 30;

  // Trending score (20% weight)
  score += (skill.trendingScore.score / 100) * 20;

  // Difficulty appropriateness (10% weight)
  const userSkillLevels = user.learningSkills?.map((ls) => ls.currentLevel) || [
    0,
  ];
  const avgUserLevel =
    userSkillLevels.reduce((a, b) => a + b, 0) / userSkillLevels.length;
  const difficultyMatch = Math.abs(skill.difficulty - avgUserLevel) <= 2;
  score += difficultyMatch ? 10 : 0;

  return Math.min(100, Math.round(score));
}
