const mongoose = require("mongoose");

// Payment Schema for handling all payment-related operations
const PaymentSchema = new mongoose.Schema(
  {
    // Payment Identification
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    externalPaymentId: {
      type: String, // Stripe payment ID, PayPal transaction ID, etc.
      unique: true,
      sparse: true,
    },

    // Payment Details
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      default: "USD",
      maxlength: 3,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },

    // Payment Status
    status: {
      type: String,
      enum: [
        "pending", // Payment initiated but not confirmed
        "requires_payment_method", // Payment method needed
        "requires_confirmation", // Payment method added, needs confirmation
        "requires_action", // Additional action needed (3D Secure, etc.)
        "processing", // Payment is being processed
        "succeeded", // Payment completed successfully
        "canceled", // Payment was canceled
        "failed", // Payment failed
        "disputed", // Payment disputed/chargeback
        "refunded", // Payment refunded (full or partial)
      ],
      default: "pending",
    },

    // Related Entities
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    // Payment Method Information
    paymentMethod: {
      id: String, // External payment method ID
      type: {
        type: String,
        enum: ["card", "bank_account", "digital_wallet", "crypto"],
        required: true,
      },
      card: {
        brand: String, // visa, mastercard, amex, etc.
        last4: String,
        expMonth: Number,
        expYear: Number,
        fingerprint: String, // Unique identifier for the card
      },
      bankAccount: {
        bankName: String,
        accountType: String,
        last4: String,
        routingNumber: String,
      },
      digitalWallet: {
        provider: String, // paypal, apple_pay, google_pay, etc.
        email: String,
      },
    },

    // Payment Provider Information
    provider: {
      name: {
        type: String,
        enum: ["stripe", "paypal", "square", "mock"],
        required: true,
        default: "mock",
      },
      transactionId: String,
      fee: {
        amount: Number,
        currency: String,
      },
      processingTime: Number, // Time in milliseconds
    },

    // Billing Information
    billing: {
      name: String,
      email: String,
      address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
      phone: String,
    },

    // Refund Information
    refunds: [
      {
        refundId: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        reason: {
          type: String,
          enum: [
            "duplicate",
            "fraudulent",
            "requested_by_customer",
            "expired_uncaptured_charge",
            "failed_charge",
            "general",
          ],
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "succeeded", "failed", "canceled"],
          required: true,
        },
        processedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        processedAt: {
          type: Date,
          default: Date.now,
        },
        externalRefundId: String,
        metadata: mongoose.Schema.Types.Mixed,
      },
    ],

    // Dispute Information
    disputes: [
      {
        disputeId: String,
        amount: Number,
        reason: String,
        status: String,
        evidence: {
          customerCommunication: String,
          receipt: String,
          shippingDocumentation: String,
          uncategorizedFile: String,
          uncategorizedText: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        dueBy: Date,
      },
    ],

    // Metadata and Tracking
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    clientSecret: String, // For frontend payment confirmation
    receiptUrl: String,
    invoiceId: String,

    // Timestamps for payment flow
    timestamps: {
      initiated: {
        type: Date,
        default: Date.now,
      },
      paymentMethodAttached: Date,
      confirmed: Date,
      succeeded: Date,
      failed: Date,
      canceled: Date,
      refunded: Date,
    },

    // Audit Trail
    auditLog: [
      {
        action: {
          type: String,
          enum: [
            "created",
            "payment_method_attached",
            "confirmed",
            "succeeded",
            "failed",
            "canceled",
            "refunded",
            "disputed",
          ],
          required: true,
        },
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        details: mongoose.Schema.Types.Mixed,
        ipAddress: String,
        userAgent: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
PaymentSchema.index({ paymentIntentId: 1 });
PaymentSchema.index({ externalPaymentId: 1 });
PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ sessionId: 1 });
PaymentSchema.index({ teacherId: 1 });
PaymentSchema.index({ status: 1, createdAt: -1 });
PaymentSchema.index({ "provider.name": 1, "provider.transactionId": 1 });
PaymentSchema.index({ createdAt: -1 });

// Virtual for total refunded amount
PaymentSchema.virtual("totalRefunded").get(function () {
  return this.refunds
    .filter((refund) => refund.status === "succeeded")
    .reduce((total, refund) => total + refund.amount, 0);
});

// Virtual for net amount (amount - refunds)
PaymentSchema.virtual("netAmount").get(function () {
  return this.amount - this.totalRefunded;
});

// Methods
PaymentSchema.methods.addRefund = function (refundData) {
  this.refunds.push({
    ...refundData,
    refundId: `re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  });

  // Update status if fully refunded
  if (this.totalRefunded >= this.amount) {
    this.status = "refunded";
  }

  this.addAuditEntry("refunded", refundData.processedBy, {
    amount: refundData.amount,
    reason: refundData.reason,
  });
};

PaymentSchema.methods.addDispute = function (disputeData) {
  this.disputes.push(disputeData);
  this.status = "disputed";

  this.addAuditEntry("disputed", null, disputeData);
};

PaymentSchema.methods.addAuditEntry = function (
  action,
  performedBy,
  details = {}
) {
  this.auditLog.push({
    action,
    performedBy,
    details,
    timestamp: new Date(),
  });
};

// Static methods
PaymentSchema.statics.getRevenueByPeriod = function (
  startDate,
  endDate,
  teacherId = null
) {
  const matchQuery = {
    status: "succeeded",
    "timestamps.succeeded": {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (teacherId) {
    matchQuery.teacherId = mongoose.Types.ObjectId(teacherId);
  }

  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
        totalRefunded: { $sum: "$totalRefunded" },
        netRevenue: { $sum: { $subtract: ["$amount", "$totalRefunded"] } },
        transactionCount: { $sum: 1 },
        averageTransaction: { $avg: "$amount" },
      },
    },
  ]);
};

PaymentSchema.statics.getPaymentStatsByTeacher = function (teacherId) {
  return this.aggregate([
    { $match: { teacherId: mongoose.Types.ObjectId(teacherId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
};

module.exports = mongoose.model("Payment", PaymentSchema);
