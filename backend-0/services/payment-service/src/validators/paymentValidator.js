const Joi = require("joi");

const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().default("USD"),
  sessionId: Joi.string().hex().length(24).optional(),
  description: Joi.string().max(500).optional(),
  paymentMethodId: Joi.string().optional(),
  metadata: Joi.object().optional(),
});

const refundSchema = Joi.object({
  amount: Joi.number().positive().optional(), // If not provided, refund full amount
  reason: Joi.string()
    .valid(
      "duplicate",
      "fraudulent",
      "requested_by_customer",
      "expired_uncaptured_charge"
    )
    .default("requested_by_customer"),
  metadata: Joi.object().optional(),
});

const paymentMethodSchema = Joi.object({
  type: Joi.string().valid("card", "bank_account", "paypal").required(),
  card: Joi.when("type", {
    is: "card",
    then: Joi.object({
      number: Joi.string().creditCard().required(),
      exp_month: Joi.number().min(1).max(12).required(),
      exp_year: Joi.number().min(new Date().getFullYear()).required(),
      cvc: Joi.string().min(3).max(4).required(),
      name: Joi.string().required(),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
  bank_account: Joi.when("type", {
    is: "bank_account",
    then: Joi.object({
      account_number: Joi.string().required(),
      routing_number: Joi.string().required(),
      account_holder_type: Joi.string()
        .valid("individual", "company")
        .required(),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
});

const validatePayment = (req, res, next) => {
  const { error } = paymentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

const validateRefund = (req, res, next) => {
  const { error } = refundSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

const validatePaymentMethod = (req, res, next) => {
  const { error } = paymentMethodSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

module.exports = {
  validatePayment,
  validateRefund,
  validatePaymentMethod,
};
