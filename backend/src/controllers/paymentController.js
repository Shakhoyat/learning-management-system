const Payment = require("../models/Payment");
const Session = require("../models/Session");
const User = require("../models/User");
const logger = require("../utils/logger");
const { PAYMENT_STATUS, PAGINATION } = require("../config/constants");
const { sendNotification } = require("../services/notificationService");

// Get all payments with filtering and pagination
exports.getAllPayments = async (req, res) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      status,
      payer,
      recipient,
      dateFrom,
      dateTo,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = {};

    // Check user permissions
    if (req.user.role !== "admin") {
      query.$or = [{ payer: req.user._id }, { recipient: req.user._id }];
    }

    if (status) {
      query.status = status;
    }

    if (payer) {
      query.payer = payer;
    }

    if (recipient) {
      query.recipient = recipient;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const payments = await Payment.find(query)
      .populate("session", "title scheduledDate skill")
      .populate("payer", "name email")
      .populate("recipient", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalPayments = await Payment.countDocuments(query);
    const totalPages = Math.ceil(totalPayments / limit);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalPayments,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error("Get all payments error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve payments",
    });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate("session", "title scheduledDate skill tutor learner")
      .populate("payer", "name email")
      .populate("recipient", "name email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    // Check permission
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== payment.payer.toString() &&
      req.user._id.toString() !== payment.recipient.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    res.json({
      success: true,
      data: { payment },
    });
  } catch (error) {
    logger.error("Get payment by ID error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve payment",
    });
  }
};

// Create new payment
exports.createPayment = async (req, res) => {
  try {
    const {
      sessionId,
      amount,
      currency = "USD",
      paymentMethod,
      description,
    } = req.body;

    // Validate session exists
    const session = await Session.findById(sessionId)
      .populate("tutor", "name email")
      .populate("learner", "name email");

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Check permission (only learner can pay for the session)
    if (req.user._id.toString() !== session.learner._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only the learner can make payment for this session",
      });
    }

    // Check if payment already exists for this session
    const existingPayment = await Payment.findOne({ session: sessionId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        error: "Payment already exists for this session",
      });
    }

    // Calculate fees
    const platformFeeRate = 0.05; // 5% platform fee
    const processingFeeRate = 0.029; // 2.9% processing fee

    const platformFee = amount * platformFeeRate;
    const processingFee = amount * processingFeeRate;
    const totalFees = platformFee + processingFee;
    const netAmount = amount - totalFees;

    // Create payment
    const paymentData = {
      session: sessionId,
      payer: session.learner._id,
      recipient: session.tutor._id,
      amount,
      currency,
      paymentMethod: {
        type: paymentMethod.type,
        details: paymentMethod.details || {},
      },
      fees: {
        platformFee,
        processingFee,
        totalFees,
        netAmount,
      },
      description: description || `Payment for session: ${session.title}`,
      metadata: {
        sessionDate: session.scheduledDate,
        skillName: session.skill?.name,
        tutorName: session.tutor.name,
        learnerName: session.learner.name,
      },
      provider: {
        name: "internal", // In real implementation, this would be stripe, paypal, etc.
      },
    };

    const payment = new Payment(paymentData);
    await payment.save();

    // Process payment (in real implementation, this would integrate with payment processors)
    await processPayment(payment);

    const populatedPayment = await Payment.findById(payment._id)
      .populate("session", "title scheduledDate")
      .populate("payer", "name email")
      .populate("recipient", "name email");

    logger.info(`Payment created: ${payment.paymentId} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: { payment: populatedPayment },
    });
  } catch (error) {
    logger.error("Create payment error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create payment",
    });
  }
};

// Process payment (simulate payment processing)
const processPayment = async (payment) => {
  try {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate random success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      payment.status = PAYMENT_STATUS.COMPLETED;
      payment.processing.processedAt = new Date();
      payment.transactionId = `TXN_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Update session payment status
      await Session.findByIdAndUpdate(payment.session, {
        "pricing.paymentStatus": "paid",
      });

      // Send payment confirmation notification
      await sendNotification({
        recipient: payment.payer,
        type: "payment_received",
        title: "Payment Confirmed",
        message: `Your payment of ${payment.amount} ${payment.currency} has been processed successfully`,
        relatedEntities: { payment: payment._id },
      });

      await sendNotification({
        recipient: payment.recipient,
        type: "payment_received",
        title: "Payment Received",
        message: `You have received a payment of ${payment.fees.netAmount} ${payment.currency}`,
        relatedEntities: { payment: payment._id },
      });
    } else {
      payment.status = PAYMENT_STATUS.FAILED;
      payment.processing.failureReason = "Payment declined by bank";

      // Send payment failure notification
      await sendNotification({
        recipient: payment.payer,
        type: "payment_failed",
        title: "Payment Failed",
        message:
          "Your payment could not be processed. Please try again or use a different payment method.",
        relatedEntities: { payment: payment._id },
      });
    }

    await payment.save();
  } catch (error) {
    logger.error("Process payment error:", error);
    payment.status = PAYMENT_STATUS.FAILED;
    payment.processing.failureReason = "Processing error";
    await payment.save();
  }
};

// Update payment status (admin only or payment webhooks)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionId, reason, metadata } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    // Add status update to history
    await payment.addStatusUpdate(status, reason, metadata);

    if (transactionId) {
      payment.transactionId = transactionId;
    }

    if (status === PAYMENT_STATUS.COMPLETED) {
      payment.processing.processedAt = new Date();

      // Update session payment status
      await Session.findByIdAndUpdate(payment.session, {
        "pricing.paymentStatus": "paid",
      });
    }

    await payment.save();

    logger.info(`Payment status updated: ${payment.paymentId} to ${status}`);

    res.json({
      success: true,
      message: "Payment status updated successfully",
      data: { payment },
    });
  } catch (error) {
    logger.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update payment status",
    });
  }
};

// Request refund
exports.requestRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, amount } = req.body;

    const payment = await Payment.findById(id)
      .populate("session", "title")
      .populate("payer", "name email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    // Check permission
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== payment.payer._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    // Check if payment can be refunded
    if (!payment.canBeRefunded()) {
      return res.status(400).json({
        success: false,
        error: "Payment cannot be refunded (either not completed or too old)",
      });
    }

    // Process refund
    await payment.processRefund(amount || payment.amount, reason, req.user._id);

    logger.info(
      `Refund requested for payment: ${payment.paymentId} by ${req.user.email}`
    );

    res.json({
      success: true,
      message: "Refund requested successfully",
      data: { payment },
    });
  } catch (error) {
    logger.error("Request refund error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to request refund",
    });
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user._id;

    let dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Get user-specific stats
    const userStats = await Payment.getUserPaymentStats(userId);

    // Get overall stats if admin
    let overallStats = null;
    if (req.user.role === "admin") {
      const start = startDate
        ? new Date(startDate)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      overallStats = await Payment.getTotalRevenue(start, end);
    }

    res.json({
      success: true,
      data: {
        userStats: userStats[0] || {
          totalPaid: 0,
          totalReceived: 0,
          transactionCount: 0,
        },
        ...(overallStats && { overallStats: overallStats[0] }),
      },
    });
  } catch (error) {
    logger.error("Get payment stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve payment statistics",
    });
  }
};

// Get payment methods (for user)
exports.getPaymentMethods = async (req, res) => {
  try {
    // In a real implementation, this would fetch saved payment methods
    // from payment processors like Stripe, PayPal, etc.
    const paymentMethods = [
      {
        id: "pm_card_visa",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
      },
      {
        id: "pm_paypal",
        type: "paypal",
        email: req.user.email,
        isDefault: false,
      },
    ];

    res.json({
      success: true,
      data: { paymentMethods },
    });
  } catch (error) {
    logger.error("Get payment methods error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve payment methods",
    });
  }
};

// Webhook handler for payment providers
exports.handleWebhook = async (req, res) => {
  try {
    const { provider, event, data } = req.body;

    logger.info(`Received webhook from ${provider}:`, { event, data });

    // Process webhook based on provider and event type
    switch (provider) {
      case "stripe":
        await handleStripeWebhook(event, data);
        break;
      case "paypal":
        await handlePayPalWebhook(event, data);
        break;
      default:
        logger.warn(`Unknown payment provider webhook: ${provider}`);
    }

    res.json({ success: true });
  } catch (error) {
    logger.error("Webhook handler error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process webhook",
    });
  }
};

// Helper functions for webhook processing
const handleStripeWebhook = async (event, data) => {
  // Stripe webhook processing logic
  logger.info("Processing Stripe webhook:", event);
};

const handlePayPalWebhook = async (event, data) => {
  // PayPal webhook processing logic
  logger.info("Processing PayPal webhook:", event);
};
