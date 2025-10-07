const mongoose = require("mongoose");

// Simplified Skill Schema
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
    keywords: [String], // For search functionality

    // Skill Relationships
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
          default: 5,
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

    // Learning Path
    learningPath: [
      {
        level: {
          type: Number,
          min: 1,
          max: 10,
        },
        title: String,
        description: String,
        milestones: [
          {
            title: String,
            description: String,
            estimatedHours: Number,
          },
        ],
      },
    ],

    // Industry and Market Data
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
    },

    trendingScore: {
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 50,
      },
      weeklyChange: {
        type: Number,
        default: 0,
      },
      monthlyChange: {
        type: Number,
        default: 0,
      },
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
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      completionRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      averageSessionDuration: {
        type: Number,
        default: 0,
      },
    },

    // Pricing Information
    marketPricing: {
      averageHourlyRate: {
        type: Number,
        default: 0,
      },
      minRate: {
        type: Number,
        default: 0,
      },
      maxRate: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },

    // Content and Resources
    resources: [
      {
        type: {
          type: String,
          enum: [
            "video",
            "article",
            "book",
            "course",
            "tutorial",
            "documentation",
          ],
        },
        title: String,
        url: String,
        description: String,
        difficulty: {
          type: Number,
          min: 1,
          max: 10,
        },
        estimatedTime: Number, // in minutes
      },
    ],

    // Status and Visibility
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "coming_soon"],
      default: "public",
    },

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance and search
SkillSchema.index({ name: 1 });
SkillSchema.index({ category: 1, subcategory: 1 });
SkillSchema.index({ keywords: 1 });
SkillSchema.index({ difficulty: 1 });
SkillSchema.index({ "stats.totalTeachers": -1 });
SkillSchema.index({ "stats.totalLearners": -1 });
SkillSchema.index({ "stats.averageRating": -1 });
SkillSchema.index({ "trendingScore.score": -1 });
SkillSchema.index({ "industryDemand.score": -1 });
SkillSchema.index({ isActive: 1, visibility: 1 });

// Text search index
SkillSchema.index({
  name: "text",
  description: "text",
  keywords: "text",
  category: "text",
  subcategory: "text",
});

// Virtual for popularity score
SkillSchema.virtual("popularityScore").get(function () {
  return (
    this.stats.totalLearners * 0.6 +
    this.stats.averageRating * 20 +
    this.stats.totalSessions * 0.1
  );
});

// Methods
SkillSchema.methods.getPrerequisiteTree = async function () {
  const prerequisites = [];

  for (const prereq of this.prerequisites) {
    const skill = await this.model("Skill").findById(prereq.skillId);
    if (skill) {
      prerequisites.push({
        skill,
        required: prereq.required,
        minimumLevel: prereq.minimumLevel,
      });
    }
  }

  return prerequisites;
};

SkillSchema.methods.updateStats = function (updates) {
  Object.assign(this.stats, updates);
  return this.save();
};

module.exports = mongoose.model("Skill", SkillSchema);
