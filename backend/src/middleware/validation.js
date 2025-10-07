const Joi = require("joi");

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }

    next();
  };
};

// Common validation schemas
const schemas = {
  // User registration
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("learner", "tutor").default("learner"),
    timezone: Joi.string().default("UTC"),
    languages: Joi.array().items(Joi.string()),
    bio: Joi.string().max(500),
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Password reset
  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),

  // Skill creation
  createSkill: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(1000).required(),
    category: Joi.string().required(),
    subcategory: Joi.string(),
    difficulty: Joi.number().min(1).max(10).required(),
    averageLearningHours: Joi.number().min(1).required(),
    prerequisites: Joi.array().items(
      Joi.object({
        skillId: Joi.string().required(),
        required: Joi.boolean().default(true),
        minimumLevel: Joi.number().min(1).max(10).default(5),
      })
    ),
  }),

  // Session creation
  createSession: Joi.object({
    tutorId: Joi.string().required(),
    skillId: Joi.string().required(),
    scheduledDate: Joi.date().min("now").required(),
    duration: Joi.number().min(30).max(180).required(),
    notes: Joi.string().max(500),
    price: Joi.number().min(0),
  }),

  // Payment creation
  createPayment: Joi.object({
    sessionId: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    currency: Joi.string().length(3).default("USD"),
    paymentMethod: Joi.string().required(),
  }),

  // Notification creation
  createNotification: Joi.object({
    recipientId: Joi.string().required(),
    type: Joi.string().valid("email", "sms", "push", "in_app").required(),
    title: Joi.string().max(100).required(),
    message: Joi.string().max(500).required(),
    metadata: Joi.object(),
  }),
};

module.exports = {
  validate,
  schemas,
};
