const Joi = require("joi");
const { logger } = require("../logger");

/**
 * Middleware to validate request data using Joi schemas
 */
const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      logger.warn("Validation error:", errorMessages);

      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errorMessages,
      });
    }

    // Replace the original data with the validated and sanitized data
    req[source] = value;
    next();
  };
};

/**
 * Validate request body
 */
const validateBody = (schema) => validateRequest(schema, "body");

/**
 * Validate request query parameters
 */
const validateQuery = (schema) => validateRequest(schema, "query");

/**
 * Validate request parameters
 */
const validateParams = (schema) => validateRequest(schema, "params");

module.exports = {
  validateRequest,
  validateBody,
  validateQuery,
  validateParams,
};
