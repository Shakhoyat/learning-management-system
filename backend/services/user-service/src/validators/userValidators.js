const Joi = require("joi");
const { AppError } = require("../utils/appError");

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return next(new AppError(errorMessage, 400));
    }
    next();
  };
};

// User validation schemas
const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  timezone: Joi.string().default("UTC"),
  languages: Joi.array().items(Joi.string()),
  bio: Joi.string().max(500),
  location: Joi.object({
    country: Joi.string(),
    city: Joi.string(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90),
      longitude: Joi.number().min(-180).max(180),
    }),
  }),
});

const updateUserSchema = Joi.object({
  "personal.name": Joi.string().min(2).max(100),
  "personal.bio": Joi.string().max(500).allow(""),
  "personal.timezone": Joi.string(),
  "personal.languages": Joi.array().items(Joi.string()),
  "personal.location": Joi.object({
    country: Joi.string().allow(""),
    city: Joi.string().allow(""),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90),
      longitude: Joi.number().min(-180).max(180),
    }),
  }),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  bio: Joi.string().max(500).allow(""),
  timezone: Joi.string(),
  languages: Joi.array().items(Joi.string()),
  location: Joi.object({
    country: Joi.string().allow(""),
    city: Joi.string().allow(""),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90),
      longitude: Joi.number().min(-180).max(180),
    }),
  }),
});

const updateSkillsSchema = Joi.object({
  teaching: Joi.array().items(
    Joi.object({
      skillId: Joi.string().hex().length(24).required(),
      level: Joi.number().min(1).max(10).required(),
      hoursTaught: Joi.number().min(0).default(0),
      verifications: Joi.array().items(
        Joi.object({
          type: Joi.string()
            .valid(
              "certificate",
              "degree",
              "work_experience",
              "project",
              "peer_review"
            )
            .required(),
          title: Joi.string(),
          issuedBy: Joi.string(),
          issuedDate: Joi.date(),
          verificationUrl: Joi.string().uri(),
          status: Joi.string()
            .valid("pending", "verified", "rejected")
            .default("pending"),
        })
      ),
      availability: Joi.object({
        hoursPerWeek: Joi.number().min(0),
        preferredTimeSlots: Joi.array().items(
          Joi.object({
            day: Joi.string().valid(
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday"
            ),
            startTime: Joi.string().pattern(
              /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
            ),
            endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          })
        ),
      }),
      pricing: Joi.object({
        hourlyRate: Joi.number().min(0),
        currency: Joi.string().default("USD"),
      }),
    })
  ),
  learning: Joi.array().items(
    Joi.object({
      skillId: Joi.string().hex().length(24).required(),
      currentLevel: Joi.number().min(0).max(10).default(0),
      targetLevel: Joi.number().min(1).max(10).required(),
      hoursLearned: Joi.number().min(0).default(0),
      learningGoals: Joi.array().items(
        Joi.object({
          description: Joi.string(),
          targetDate: Joi.date(),
          completed: Joi.boolean().default(false),
        })
      ),
      preferredLearningStyle: Joi.string().valid(
        "visual",
        "auditory",
        "kinesthetic",
        "reading_writing"
      ),
    })
  ),
});

const addSkillSchema = Joi.object({
  skillId: Joi.string().hex().length(24).required(),
  level: Joi.number().min(1).max(10),
  currentLevel: Joi.number().min(0).max(10),
  targetLevel: Joi.number().min(1).max(10),
  hourlyRate: Joi.number().min(0),
  hoursPerWeek: Joi.number().min(0),
  preferredLearningStyle: Joi.string().valid(
    "visual",
    "auditory",
    "kinesthetic",
    "reading_writing"
  ),
});

const updateSkillSchema = Joi.object({
  level: Joi.number().min(1).max(10),
  currentLevel: Joi.number().min(0).max(10),
  targetLevel: Joi.number().min(1).max(10),
  hourlyRate: Joi.number().min(0),
  hoursPerWeek: Joi.number().min(0),
  hoursTaught: Joi.number().min(0),
  hoursLearned: Joi.number().min(0),
  preferredLearningStyle: Joi.string().valid(
    "visual",
    "auditory",
    "kinesthetic",
    "reading_writing"
  ),
  availability: Joi.object({
    hoursPerWeek: Joi.number().min(0),
    preferredTimeSlots: Joi.array().items(
      Joi.object({
        day: Joi.string().valid(
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday"
        ),
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      })
    ),
  }),
  pricing: Joi.object({
    hourlyRate: Joi.number().min(0),
    currency: Joi.string().default("USD"),
  }),
});

const updatePreferencesSchema = Joi.object({
  learningStyle: Joi.string().valid(
    "visual",
    "auditory",
    "kinesthetic",
    "reading_writing"
  ),
  communicationStyle: Joi.string().valid(
    "formal",
    "casual",
    "direct",
    "indirect"
  ),
  availability: Joi.object({
    timezone: Joi.string(),
    schedule: Joi.object({
      monday: Joi.array().items(Joi.string()),
      tuesday: Joi.array().items(Joi.string()),
      wednesday: Joi.array().items(Joi.string()),
      thursday: Joi.array().items(Joi.string()),
      friday: Joi.array().items(Joi.string()),
      saturday: Joi.array().items(Joi.string()),
      sunday: Joi.array().items(Joi.string()),
    }),
    preferredSessionLength: Joi.number().min(15).max(240),
  }),
  matching: Joi.object({
    maxPrice: Joi.number().min(0),
    preferredLanguages: Joi.array().items(Joi.string()),
    experienceLevel: Joi.string().valid("beginner", "intermediate", "advanced"),
    sessionType: Joi.string().valid("individual", "group", "both"),
  }),
});

// Export validation middlewares
const validateCreateUser = validate(createUserSchema);
const validateUpdateUser = validate(updateUserSchema);
const validateUpdateProfile = validate(updateProfileSchema);
const validateUpdateSkills = validate(updateSkillsSchema);
const validateAddSkill = validate(addSkillSchema);
const validateUpdateSkill = validate(updateSkillSchema);
const validateUpdatePreferences = validate(updatePreferencesSchema);

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateUpdateProfile,
  validateUpdateSkills,
  validateAddSkill,
  validateUpdateSkill,
  validateUpdatePreferences,
};
