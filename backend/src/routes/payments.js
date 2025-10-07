const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authenticate, authorize } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");

// Webhook routes (public)
router.post("/webhooks", paymentController.handleWebhook);

// Protected routes (authentication required)
router.use(authenticate);

// Payment management
router.get("/", paymentController.getAllPayments);
router.get("/methods", paymentController.getPaymentMethods);
router.get("/stats", paymentController.getPaymentStats);
router.get("/:id", paymentController.getPaymentById);
router.post(
  "/",
  validate(schemas.createPayment),
  paymentController.createPayment
);

// Payment operations
router.post("/:id/refund", paymentController.requestRefund);

// Admin only routes
router.put(
  "/:id/status",
  authorize("admin"),
  paymentController.updatePaymentStatus
);

module.exports = router;
