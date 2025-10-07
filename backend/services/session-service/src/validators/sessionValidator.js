const Joi = require("joi");

const sessionSchema = Joi.object({
  participants: Joi.object({
    teacher: Joi.string().hex().length(24).required(),
    learner: Joi.string().hex().length(24).required(),
  }).required(),
  skill: Joi.string().hex().length(24).required(),
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().max(1000).optional(),
  objectives: Joi.array().items(Joi.string().trim()).optional(),
  schedule: Joi.object({
    startTime: Joi.date().min("now").required(),
    endTime: Joi.date().greater(Joi.ref("startTime")).required(),
    timezone: Joi.string().default("UTC"),
    duration: Joi.number().min(15).max(480).required(), // 15 minutes to 8 hours
    buffer: Joi.object({
      before: Joi.number().min(0).max(60).default(5),
      after: Joi.number().min(0).max(60).default(5),
    }).optional(),
  }).required(),
  sessionType: Joi.string()
    .valid("one-on-one", "group", "workshop")
    .default("one-on-one"),
  pricing: Joi.object({
    amount: Joi.number().min(0).required(),
    currency: Joi.string().length(3).default("USD"),
    paymentMethod: Joi.string()
      .valid("hourly", "session", "package")
      .default("hourly"),
  }).optional(),
  requirements: Joi.object({
    materials: Joi.array().items(Joi.string()).optional(),
    prerequisites: Joi.array().items(Joi.string()).optional(),
    equipment: Joi.array().items(Joi.string()).optional(),
  }).optional(),
});

const sessionUpdateSchema = Joi.object({
  title: Joi.string().trim().max(200).optional(),
  description: Joi.string().max(1000).optional(),
  objectives: Joi.array().items(Joi.string().trim()).optional(),
  schedule: Joi.object({
    startTime: Joi.date().min("now").optional(),
    endTime: Joi.date().optional(),
    timezone: Joi.string().optional(),
    duration: Joi.number().min(15).max(480).optional(),
    buffer: Joi.object({
      before: Joi.number().min(0).max(60).optional(),
      after: Joi.number().min(0).max(60).optional(),
    }).optional(),
  }).optional(),
  requirements: Joi.object({
    materials: Joi.array().items(Joi.string()).optional(),
    prerequisites: Joi.array().items(Joi.string()).optional(),
    equipment: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  reason: Joi.string().max(500).optional(), // For cancellation/rescheduling
});

const validateSession = (req, res, next) => {
  const { error } = sessionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

const validateSessionUpdate = (req, res, next) => {
  const { error } = sessionUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

module.exports = {
  validateSession,
  validateSessionUpdate,
};
