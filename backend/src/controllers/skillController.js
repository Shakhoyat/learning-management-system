const Skill = require("../models/Skill");
const User = require("../models/User");
const logger = require("../utils/logger");
const { PAGINATION } = require("../config/constants");

// Get all skills with filtering and pagination
exports.getAllSkills = async (req, res) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      category,
      subcategory,
      difficulty,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      minDifficulty,
      maxDifficulty,
      trending = false,
      popular = false,
    } = req.query;

    // Build query
    const query = { isActive: true, visibility: "public" };

    if (category) {
      query.category = new RegExp(category, "i");
    }

    if (subcategory) {
      query.subcategory = new RegExp(subcategory, "i");
    }

    if (difficulty) {
      query.difficulty = parseInt(difficulty);
    }

    if (minDifficulty || maxDifficulty) {
      query.difficulty = {};
      if (minDifficulty) query.difficulty.$gte = parseInt(minDifficulty);
      if (maxDifficulty) query.difficulty.$lte = parseInt(maxDifficulty);
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    let sortOptions = {};

    if (trending) {
      sortOptions = { "trendingScore.score": -1, createdAt: -1 };
    } else if (popular) {
      sortOptions = { "stats.totalLearners": -1, "stats.averageRating": -1 };
    } else {
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    // Execute query
    const skills = await Skill.find(query)
      .populate("prerequisites.skillId", "name category difficulty")
      .populate("relatedSkills.skillId", "name category difficulty")
      .populate("createdBy", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalSkills = await Skill.countDocuments(query);
    const totalPages = Math.ceil(totalSkills / limit);

    res.json({
      success: true,
      data: {
        skills,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalSkills,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error("Get all skills error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve skills",
    });
  }
};

// Get skill by ID
exports.getSkillById = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id)
      .populate("prerequisites.skillId", "name category difficulty")
      .populate("relatedSkills.skillId", "name category difficulty")
      .populate("createdBy", "name email")
      .populate("lastUpdatedBy", "name email");

    if (!skill || skill.visibility !== "public") {
      return res.status(404).json({
        success: false,
        error: "Skill not found",
      });
    }

    // Get teachers and learners for this skill
    const [teachers, learners] = await Promise.all([
      User.find({ "teachingSkills.skillId": id })
        .select("name avatar reputation.teachingStats")
        .limit(10),
      User.find({ "learningSkills.skillId": id })
        .select("name avatar reputation.learningStats")
        .limit(10),
    ]);

    res.json({
      success: true,
      data: {
        skill,
        teachers,
        learners,
      },
    });
  } catch (error) {
    logger.error("Get skill by ID error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve skill",
    });
  }
};

// Create new skill (admin only)
exports.createSkill = async (req, res) => {
  try {
    const skillData = {
      ...req.body,
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id,
    };

    const skill = new Skill(skillData);
    await skill.save();

    const populatedSkill = await Skill.findById(skill._id)
      .populate("prerequisites.skillId", "name category difficulty")
      .populate("relatedSkills.skillId", "name category difficulty")
      .populate("createdBy", "name email");

    logger.info(`New skill created: ${skill.name} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: { skill: populatedSkill },
    });
  } catch (error) {
    logger.error("Create skill error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create skill",
    });
  }
};

// Update skill (admin only)
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      lastUpdatedBy: req.user._id,
    };

    // Remove immutable fields
    delete updates._id;
    delete updates.createdBy;
    delete updates.createdAt;

    const skill = await Skill.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("prerequisites.skillId", "name category difficulty")
      .populate("relatedSkills.skillId", "name category difficulty")
      .populate("createdBy", "name email")
      .populate("lastUpdatedBy", "name email");

    if (!skill) {
      return res.status(404).json({
        success: false,
        error: "Skill not found",
      });
    }

    logger.info(`Skill updated: ${skill.name} by ${req.user.email}`);

    res.json({
      success: true,
      message: "Skill updated successfully",
      data: { skill },
    });
  } catch (error) {
    logger.error("Update skill error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update skill",
    });
  }
};

// Delete skill (admin only)
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: "Skill not found",
      });
    }

    // Soft delete - mark as inactive
    skill.isActive = false;
    skill.visibility = "private";
    await skill.save();

    logger.info(`Skill deleted: ${skill.name} by ${req.user.email}`);

    res.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    logger.error("Delete skill error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete skill",
    });
  }
};

// Search skills
exports.searchSkills = async (req, res) => {
  try {
    const { query: searchQuery, limit = 20, category, difficulty } = req.query;

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const query = {
      $text: { $search: searchQuery },
      isActive: true,
      visibility: "public",
    };

    if (category) {
      query.category = new RegExp(category, "i");
    }

    if (difficulty) {
      query.difficulty = parseInt(difficulty);
    }

    const skills = await Skill.find(query, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(parseInt(limit))
      .populate("prerequisites.skillId", "name category")
      .populate("relatedSkills.skillId", "name category");

    res.json({
      success: true,
      data: { skills },
    });
  } catch (error) {
    logger.error("Search skills error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search skills",
    });
  }
};

// Get skills by category
exports.getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      subcategory,
      difficulty,
      sortBy = "stats.totalLearners",
      sortOrder = "desc",
    } = req.query;

    const query = {
      category: new RegExp(category, "i"),
      isActive: true,
      visibility: "public",
    };

    if (subcategory) {
      query.subcategory = new RegExp(subcategory, "i");
    }

    if (difficulty) {
      query.difficulty = parseInt(difficulty);
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skills = await Skill.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("prerequisites.skillId", "name category");

    const totalSkills = await Skill.countDocuments(query);
    const totalPages = Math.ceil(totalSkills / limit);

    res.json({
      success: true,
      data: {
        skills,
        category,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalSkills,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error("Get skills by category error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve skills by category",
    });
  }
};

// Get popular skills
exports.getPopularSkills = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const skills = await Skill.find({
      isActive: true,
      visibility: "public",
    })
      .sort({
        "stats.totalLearners": -1,
        "stats.averageRating": -1,
        "stats.totalSessions": -1,
      })
      .limit(parseInt(limit))
      .select("name category difficulty stats marketPricing");

    res.json({
      success: true,
      data: { skills },
    });
  } catch (error) {
    logger.error("Get popular skills error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve popular skills",
    });
  }
};

// Get trending skills
exports.getTrendingSkills = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const skills = await Skill.find({
      isActive: true,
      visibility: "public",
    })
      .sort({
        "trendingScore.score": -1,
        "trendingScore.weeklyChange": -1,
      })
      .limit(parseInt(limit))
      .select("name category difficulty trendingScore stats");

    res.json({
      success: true,
      data: { skills },
    });
  } catch (error) {
    logger.error("Get trending skills error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve trending skills",
    });
  }
};

// Get skill prerequisites
exports.getSkillPrerequisites = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);
    if (!skill || skill.visibility !== "public") {
      return res.status(404).json({
        success: false,
        error: "Skill not found",
      });
    }

    const prerequisites = await skill.getPrerequisiteTree();

    res.json({
      success: true,
      data: { prerequisites },
    });
  } catch (error) {
    logger.error("Get skill prerequisites error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve skill prerequisites",
    });
  }
};

// Get skill learning path
exports.getSkillPath = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);
    if (!skill || skill.visibility !== "public") {
      return res.status(404).json({
        success: false,
        error: "Skill not found",
      });
    }

    // Build learning path including prerequisites
    const path = [];

    // Add prerequisites first
    if (skill.prerequisites.length > 0) {
      const prerequisites = await Skill.find({
        _id: { $in: skill.prerequisites.map((p) => p.skillId) },
      }).select("name category difficulty averageLearningHours");

      path.push(
        ...prerequisites.map((prereq) => ({
          ...prereq.toObject(),
          isPrerequisite: true,
          requiredLevel:
            skill.prerequisites.find(
              (p) => p.skillId.toString() === prereq._id.toString()
            )?.minimumLevel || 5,
        }))
      );
    }

    // Add the main skill
    path.push({
      ...skill.toObject(),
      isMain: true,
    });

    // Add related advanced skills
    if (skill.relatedSkills.length > 0) {
      const relatedAdvanced = await Skill.find({
        _id: {
          $in: skill.relatedSkills
            .filter((r) => r.relationshipType === "advanced")
            .map((r) => r.skillId),
        },
      }).select("name category difficulty averageLearningHours");

      path.push(
        ...relatedAdvanced.map((related) => ({
          ...related.toObject(),
          isAdvanced: true,
        }))
      );
    }

    res.json({
      success: true,
      data: {
        path,
        totalEstimatedHours: path.reduce(
          (sum, skill) => sum + (skill.averageLearningHours || 0),
          0
        ),
      },
    });
  } catch (error) {
    logger.error("Get skill path error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve skill learning path",
    });
  }
};

// Get skill statistics
exports.getSkillStatistics = async (req, res) => {
  try {
    const totalSkills = await Skill.countDocuments({ isActive: true });

    const categoryStats = await Skill.aggregate([
      { $match: { isActive: true, visibility: "public" } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgDifficulty: { $avg: "$difficulty" },
          avgLearningHours: { $avg: "$averageLearningHours" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const difficultyStats = await Skill.aggregate([
      { $match: { isActive: true, visibility: "public" } },
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const trendingStats = await Skill.aggregate([
      { $match: { isActive: true, visibility: "public" } },
      {
        $group: {
          _id: null,
          avgTrendingScore: { $avg: "$trendingScore.score" },
          totalTeachers: { $sum: "$stats.totalTeachers" },
          totalLearners: { $sum: "$stats.totalLearners" },
          totalSessions: { $sum: "$stats.totalSessions" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalSkills,
          ...trendingStats[0],
        },
        categories: categoryStats,
        difficulties: difficultyStats,
      },
    });
  } catch (error) {
    logger.error("Get skill statistics error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve skill statistics",
    });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Skill.distinct("category", {
      isActive: true,
      visibility: "public",
    });

    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const skillCount = await Skill.countDocuments({
          category,
          isActive: true,
          visibility: "public",
        });

        const subcategories = await Skill.distinct("subcategory", {
          category,
          isActive: true,
          visibility: "public",
        });

        return {
          name: category,
          skillCount,
          subcategories: subcategories.filter(Boolean),
        };
      })
    );

    res.json({
      success: true,
      data: { categories: categoriesWithStats },
    });
  } catch (error) {
    logger.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve categories",
    });
  }
};
