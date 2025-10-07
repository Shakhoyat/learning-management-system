const Skill = require("../../../../shared/database/models/Skill");
const { logger } = require("../../../../shared/logger");

// Get all skills with pagination and filtering
const getAllSkills = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      subcategory,
      difficulty,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const query = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (difficulty) query.difficulty = difficulty;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skills = await Skill.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("prerequisites.skillId", "name category")
      .populate("relatedSkills.skillId", "name category");

    const total = await Skill.countDocuments(query);

    res.json({
      skills,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    logger.error("Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
};

// Get skill by ID
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate("prerequisites.skillId", "name category difficulty")
      .populate("relatedSkills.skillId", "name category difficulty");

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json(skill);
  } catch (error) {
    logger.error("Error fetching skill:", error);
    res.status(500).json({ error: "Failed to fetch skill" });
  }
};

// Create new skill
const createSkill = async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();

    res.status(201).json({
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    logger.error("Error creating skill:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Skill with this name already exists" });
    }
    res.status(500).json({ error: "Failed to create skill" });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json({
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    logger.error("Error updating skill:", error);
    res.status(500).json({ error: "Failed to update skill" });
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    logger.error("Error deleting skill:", error);
    res.status(500).json({ error: "Failed to delete skill" });
  }
};

// Get skills by category
const getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { subcategory, page = 1, limit = 20 } = req.query;

    const query = { category };
    if (subcategory) query.subcategory = subcategory;

    const skills = await Skill.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Skill.countDocuments(query);

    res.json({
      skills,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    logger.error("Error fetching skills by category:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
};

// Search skills
const searchSkills = async (req, res) => {
  try {
    const { q, category, difficulty, page = 1, limit = 20 } = req.query;

    const query = {};
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { keywords: { $in: [new RegExp(q, "i")] } },
      ];
    }
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const skills = await Skill.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Skill.countDocuments(query);

    res.json({
      skills,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    logger.error("Error searching skills:", error);
    res.status(500).json({ error: "Failed to search skills" });
  }
};

// Get skill tree (prerequisites and related skills)
const getSkillTree = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate({
        path: "prerequisites.skillId",
        populate: {
          path: "prerequisites.skillId",
          select: "name category",
        },
      })
      .populate("relatedSkills.skillId", "name category");

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json({
      skill: {
        id: skill._id,
        name: skill.name,
        category: skill.category,
        difficulty: skill.difficulty,
      },
      prerequisites: skill.prerequisites,
      relatedSkills: skill.relatedSkills,
    });
  } catch (error) {
    logger.error("Error fetching skill tree:", error);
    res.status(500).json({ error: "Failed to fetch skill tree" });
  }
};

// Get prerequisites for a skill
const getPrerequisites = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate(
      "prerequisites.skillId",
      "name category difficulty"
    );

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json({ prerequisites: skill.prerequisites });
  } catch (error) {
    logger.error("Error fetching prerequisites:", error);
    res.status(500).json({ error: "Failed to fetch prerequisites" });
  }
};

// Get learning path for a skill
const getSkillPath = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    // Build learning path by traversing prerequisites
    const path = [];
    const visited = new Set();

    const buildPath = async (skillId, level = 0) => {
      if (visited.has(skillId.toString())) return;
      visited.add(skillId.toString());

      const currentSkill = await Skill.findById(skillId).populate(
        "prerequisites.skillId",
        "name category difficulty"
      );

      if (currentSkill) {
        // Add prerequisites first
        for (const prereq of currentSkill.prerequisites) {
          if (prereq.required) {
            await buildPath(prereq.skillId._id, level + 1);
          }
        }

        // Add current skill
        path.push({
          skill: {
            id: currentSkill._id,
            name: currentSkill.name,
            category: currentSkill.category,
            difficulty: currentSkill.difficulty,
          },
          level,
          estimatedTime:
            currentSkill.metadata?.estimatedLearningTime || "Unknown",
        });
      }
    };

    await buildPath(req.params.id);

    res.json({ path: path.reverse() });
  } catch (error) {
    logger.error("Error building skill path:", error);
    res.status(500).json({ error: "Failed to build skill path" });
  }
};

// Get popular skills
const getPopularSkills = async (req, res) => {
  try {
    const { limit = 10, category } = req.query;

    const query = {};
    if (category) query.category = category;

    const skills = await Skill.find(query)
      .sort({ "stats.totalLearners": -1, "stats.avgRating": -1 })
      .limit(parseInt(limit));

    res.json({ popularSkills: skills });
  } catch (error) {
    logger.error("Error fetching popular skills:", error);
    res.status(500).json({ error: "Failed to fetch popular skills" });
  }
};

// Get skill statistics
const getSkillStatistics = async (req, res) => {
  try {
    const totalSkills = await Skill.countDocuments();

    const categoryStats = await Skill.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgDifficulty: { $avg: "$difficulty" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const difficultyStats = await Skill.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalSkills,
      categoryDistribution: categoryStats,
      difficultyDistribution: difficultyStats,
    });
  } catch (error) {
    logger.error("Error fetching skill statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

module.exports = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsByCategory,
  searchSkills,
  getSkillTree,
  getPrerequisites,
  getSkillPath,
  getPopularSkills,
  getSkillStatistics,
};
