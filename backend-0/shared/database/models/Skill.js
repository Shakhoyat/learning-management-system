const mongoose = require("mongoose");

// Skill Schema - Represents skills in a graph structure
const SkillSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },

    // Skill Hierarchy and Relationships
    prerequisites: [
      {
        skillId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
          required: true,
        },
        required: {
          type: Boolean,
          default: true,
        },
        minimumLevel: {
          type: Number,
          min: 1,
          max: 10,
          default: 5,
        },
      },
    ],

    relatedSkills: [
      {
        skillId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
          required: true,
        },
        relationshipType: {
          type: String,
          enum: [
            "similar",
            "complementary",
            "advanced",
            "foundational",
            "specialized",
          ],
          default: "similar",
        },
        strength: {
          type: Number,
          min: 1,
          max: 10,
          default: 5, // 1-10 scale indicating strength of relationship
        },
      },
    ],

    // Learning Metadata
    difficulty: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    averageLearningHours: {
      type: Number,
      required: true,
      min: 1,
    },
    learningPath: [
      {
        level: {
          type: Number,
          min: 1,
          max: 10,
        },
        milestones: [
          {
            title: String,
            description: String,
            estimatedHours: Number,
          },
        ],
      },
    ],

    // Market Analytics
    industryDemand: {
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 50,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
      sources: [String], // Data sources used for calculation
    },

    trendingScore: {
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 50,
      },
      weeklyChange: Number, // Percentage change
      monthlyChange: Number,
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },

    // Platform Statistics
    stats: {
      totalTeachers: {
        type: Number,
        default: 0,
      },
      totalLearners: {
        type: Number,
        default: 0,
      },
      totalSessions: {
        type: Number,
        default: 0,
      },
      avgRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      averageLearningTime: {
        type: Number,
        default: 0,
      },
      completionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      popularityRank: Number,
      growthRate: Number, // Monthly growth in learners
    },

    // Content and Resources
    metadata: {
      estimatedLearningTime: {
        type: String,
        default: "Unknown",
      },
      industries: [String],
      tools: [String],
      learningResources: [
        {
          type: {
            type: String,
            enum: ["video", "article", "course", "book", "practice"],
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
          url: String,
          description: String,
        },
      ],
    },

    resources: [
      {
        type: {
          type: String,
          enum: [
            "article",
            "video",
            "book",
            "course",
            "documentation",
            "practice",
          ],
          required: true,
        },
        title: String,
        url: String,
        difficulty: {
          type: Number,
          min: 1,
          max: 10,
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
        isFree: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Skill Tags and Keywords
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    keywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Verification and Quality
    verification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: Date,
      qualityScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 50,
      },
    },

    // Platform Management
    status: {
      type: String,
      enum: ["active", "deprecated", "under_review", "merged"],
      default: "active",
    },

    // If skill was merged into another skill
    mergedInto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance and search
SkillSchema.index({
  name: "text",
  description: "text",
  tags: "text",
  keywords: "text",
});
SkillSchema.index({ category: 1, subcategory: 1 });
SkillSchema.index({ "stats.popularityRank": 1 });
SkillSchema.index({ "trendingScore.score": -1 });
SkillSchema.index({ "industryDemand.score": -1 });
SkillSchema.index({ difficulty: 1 });
SkillSchema.index({ "verification.isVerified": 1 });
SkillSchema.index({ status: 1 });
SkillSchema.index({ tags: 1 });

// Pre-save middleware
SkillSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Methods
SkillSchema.methods.getPrerequisiteChain = async function () {
  const chain = [];
  const visited = new Set();

  const buildChain = async (skillId) => {
    if (visited.has(skillId.toString())) return;
    visited.add(skillId.toString());

    const skill = await this.constructor
      .findById(skillId)
      .populate("prerequisites.skillId");
    if (skill && skill.prerequisites.length > 0) {
      for (const prereq of skill.prerequisites) {
        await buildChain(prereq.skillId._id);
        chain.push({
          skill: prereq.skillId,
          minimumLevel: prereq.minimumLevel,
          required: prereq.required,
        });
      }
    }
  };

  await buildChain(this._id);
  return chain;
};

SkillSchema.methods.getRelatedSkillsGraph = async function (depth = 2) {
  const graph = { nodes: [], edges: [] };
  const visited = new Set();

  const buildGraph = async (skillId, currentDepth) => {
    if (currentDepth > depth || visited.has(skillId.toString())) return;
    visited.add(skillId.toString());

    const skill = await this.constructor
      .findById(skillId)
      .populate("relatedSkills.skillId");
    if (skill) {
      graph.nodes.push(skill);

      for (const related of skill.relatedSkills) {
        graph.edges.push({
          from: skillId,
          to: related.skillId._id,
          relationship: related.relationship,
          strength: related.strength,
        });

        await buildGraph(related.skillId._id, currentDepth + 1);
      }
    }
  };

  await buildGraph(this._id, 0);
  return graph;
};

// Static methods
SkillSchema.statics.findSimilarSkills = function (skillId, limit = 10) {
  return this.aggregate([
    { $match: { _id: { $ne: mongoose.Types.ObjectId(skillId) } } },
    {
      $addFields: {
        similarity: {
          $add: [
            { $size: { $setIntersection: ["$tags", "$$ROOT.tags"] } },
            { $size: { $setIntersection: ["$keywords", "$$ROOT.keywords"] } },
          ],
        },
      },
    },
    { $sort: { similarity: -1 } },
    { $limit: limit },
  ]);
};

SkillSchema.statics.getTrendingSkills = function (limit = 20) {
  return this.find({ status: "active" })
    .sort({ "trendingScore.score": -1, "stats.growthRate": -1 })
    .limit(limit);
};

SkillSchema.statics.getSkillsByDemand = function (category = null, limit = 20) {
  const query = { status: "active" };
  if (category) query.category = category;

  return this.find(query)
    .sort({ "industryDemand.score": -1, "stats.totalLearners": -1 })
    .limit(limit);
};

module.exports = mongoose.model("Skill", SkillSchema);
