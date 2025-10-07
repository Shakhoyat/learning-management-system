const express = require("express");
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentById,
  getUserPayments,
  getPaymentHistory,
  processRefund,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  getInvoice,
  getPaymentStatistics,
  webhookHandler,
} = require("../controllers/paymentController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/authorization");
const {
  validatePayment,
  validateRefund,
} = require("../validators/paymentValidator");

const router = express.Router();

// Webhook endpoint (no auth required)
router.post("/webhook", webhookHandler);

// Protected routes
router.use(authenticate);

// Payment operations
router.post("/intent", validatePayment, createPaymentIntent);
router.post("/:id/confirm", confirmPayment);
router.get("/:id", getPaymentById);
router.get("/", getUserPayments);
router.get("/history", getPaymentHistory);
router.post(
  "/:id/refund",
  authorize(["admin", "teacher"]),
  validateRefund,
  processRefund
);

// Payment methods
router.get("/methods", getPaymentMethods);
router.post("/methods", addPaymentMethod);
router.delete("/methods/:methodId", removePaymentMethod);
router.put("/methods/:methodId/default", setDefaultPaymentMethod);

// Invoices and reporting
router.get("/:id/invoice", getInvoice);
router.get("/statistics", getPaymentStatistics);

module.exports = router;
