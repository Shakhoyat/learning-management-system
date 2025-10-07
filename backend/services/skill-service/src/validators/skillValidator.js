const Joi = require("joi");

const skillSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  description: Joi.string().max(1000).required(),
  category: Joi.string().trim().required(),
  subcategory: Joi.string().trim().optional(),
  difficulty: Joi.number().min(1).max(10).required(),
  keywords: Joi.array().items(Joi.string().trim()).optional(),
  prerequisites: Joi.array().items(
    Joi.object({
      skillId: Joi.string().hex().length(24).required(),
      required: Joi.boolean().default(true),
      minimumLevel: Joi.number().min(1).max(10).default(5),
    })
  ).optional(),
  relatedSkills: Joi.array().items(
    Joi.object({
      skillId: Joi.string().hex().length(24).required(),
      relationshipType: Joi.string().valid("similar", "complementary", "advanced").default("similar"),
      strength: Joi.number().min(1).max(10).default(5),
    })
  ).optional(),
  metadata: Joi.object({
    estimatedLearningTime: Joi.string().optional(),
    industries: Joi.array().items(Joi.string()).optional(),
    tools: Joi.array().items(Joi.string()).optional(),
    learningResources: Joi.array().items(
      Joi.object({
        type: Joi.string().valid("video", "article", "course", "book", "practice").required(),
        title: Joi.string().required(),
        url: Joi.string().uri().optional(),
        description: Joi.string().optional(),
      })
    ).optional(),
  }).optional(),
});

const skillUpdateSchema = skillSchema.fork(
  ["name", "description", "category", "difficulty"],
  (schema) => schema.optional()
);

const validateSkill = (req, res, next) => {
  const { error } = skillSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

const validateSkillUpdate = (req, res, next) => {
  const { error } = skillUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

module.exports = {
  validateSkill,
  validateSkillUpdate,
};