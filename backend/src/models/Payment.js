const mongoose = require("mongoose");

// Payment Schema
const PaymentSchema = new mongoose.Schema(
  {
    // Payment Identification
    paymentId: {
      type: String,
      unique: true,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values but ensures uniqueness when present
    },

    // Related Entities
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      default: "USD",
      uppercase: true,
    },

    // Payment Method
    paymentMethod: {
      type: {
        type: String,
        enum: [
          "card",
          "bank_transfer",
          "paypal",
          "stripe",
          "wallet",
          "credits",
        ],
        required: true,
      },
      details: {
        // For card payments
        last4: String,
        brand: String, // visa, mastercard, etc.

        // For bank transfers
        bankName: String,
        accountLast4: String,

        // For digital wallets
        walletType: String, // paypal, apple_pay, google_pay

        // Provider-specific data
        providerId: String, // Stripe payment intent ID, PayPal order ID, etc.
      },
    },

    // Payment Status and Processing
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
        "refunded",
        "partially_refunded",
        "disputed",
        "chargeback",
      ],
      default: "pending",
    },

    // Payment Flow Tracking
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "pending",
            "processing",
            "completed",
            "failed",
            "cancelled",
            "refunded",
            "partially_refunded",
            "disputed",
            "chargeback",
          ],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        reason: String,
        metadata: mongoose.Schema.Types.Mixed,
      },
    ],

    // Processing Details
    processing: {
      processedAt: Date,
      processorResponse: mongoose.Schema.Types.Mixed,
      failureReason: String,
      retryCount: {
        type: Number,
        default: 0,
      },
      lastRetryAt: Date,
    },

    // Fees and Breakdown
    fees: {
      platformFee: {
        type: Number,
        default: 0,
      },
      processingFee: {
        type: Number,
        default: 0,
      },
      totalFees: {
        type: Number,
        default: 0,
      },
      netAmount: {
        type: Number,
        required: true,
      },
    },

    // Refund Information
    refund: {
      refundId: String,
      amount: Number,
      reason: String,
      requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      requestedAt: Date,
      processedAt: Date,
      status: {
        type: String,
        enum: ["pending", "approved", "rejected", "processed"],
      },
    },

    // Dispute Information
    dispute: {
      disputeId: String,
      reason: String,
      amount: Number,
      evidence: [
        {
          type: String,
          url: String,
          description: String,
          uploadedAt: Date,
        },
      ],
      status: {
        type: String,
        enum: ["open", "under_review", "won", "lost"],
      },
      createdAt: Date,
      resolvedAt: Date,
    },

    // Payment Provider Integration
    provider: {
      name: {
        type: String,
        enum: ["stripe", "paypal", "square", "internal"],
        required: true,
      },
      providerId: String, // External provider's payment ID
      webhookData: mongoose.Schema.Types.Mixed,
      lastSyncAt: Date,
    },

    // Scheduling and Automation
    scheduled: {
      isScheduled: {
        type: Boolean,
        default: false,
      },
      scheduledFor: Date,
      isRecurring: {
        type: Boolean,
        default: false,
      },
      recurringPattern: {
        frequency: {
          type: String,
          enum: ["weekly", "monthly", "quarterly"],
        },
        interval: Number, // Every X weeks/months
        endDate: Date,
      },
    },

    // Metadata and Additional Info
    description: String,
    metadata: {
      sessionDate: Date,
      skillName: String,
      tutorName: String,
      learnerName: String,
      customData: mongoose.Schema.Types.Mixed,
    },

    // Compliance and Records
    compliance: {
      receiptUrl: String,
      invoiceNumber: String,
      taxAmount: Number,
      taxRate: Number,
      billingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    },

    // Notification Tracking
    notifications: {
      paymentConfirmation: {
        sent: Boolean,
        sentAt: Date,
      },
      receiptDelivered: {
        sent: Boolean,
        sentAt: Date,
      },
      refundNotification: {
        sent: Boolean,
        sentAt: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
PaymentSchema.index({ paymentId: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ session: 1 });
PaymentSchema.index({ payer: 1, createdAt: -1 });
PaymentSchema.index({ recipient: 1, createdAt: -1 });
PaymentSchema.index({ status: 1, createdAt: -1 });
PaymentSchema.index({ "provider.name": 1, "provider.providerId": 1 });
PaymentSchema.index({ createdAt: -1 });

// Virtual for payment age
PaymentSchema.virtual("ageInDays").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Methods
PaymentSchema.methods.canBeRefunded = function () {
  const allowedStatuses = ["completed"];
  const daysSincePayment = this.ageInDays;

  return allowedStatuses.includes(this.status) && daysSincePayment <= 30;
};

PaymentSchema.methods.addStatusUpdate = function (status, reason, metadata) {
  this.status = status;
  this.statusHistory.push({
    status,
    reason,
    metadata,
    timestamp: new Date(),
  });

  return this.save();
};

PaymentSchema.methods.processRefund = function (amount, reason, requestedBy) {
  this.refund = {
    amount: amount || this.amount,
    reason,
    requestedBy,
    requestedAt: new Date(),
    status: "pending",
  };

  return this.addStatusUpdate("refunded", reason);
};

// Static methods
PaymentSchema.statics.getTotalRevenue = function (startDate, endDate) {
  const match = {
    status: "completed",
    createdAt: { $gte: startDate, $lte: endDate },
  };

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
        totalFees: { $sum: "$fees.totalFees" },
        netRevenue: { $sum: "$fees.netAmount" },
        transactionCount: { $sum: 1 },
      },
    },
  ]);
};

PaymentSchema.statics.getUserPaymentStats = function (userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { payer: new mongoose.Types.ObjectId(userId) },
          { recipient: new mongoose.Types.ObjectId(userId) },
        ],
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        totalPaid: {
          $sum: {
            $cond: [
              { $eq: ["$payer", new mongoose.Types.ObjectId(userId)] },
              "$amount",
              0,
            ],
          },
        },
        totalReceived: {
          $sum: {
            $cond: [
              { $eq: ["$recipient", new mongoose.Types.ObjectId(userId)] },
              "$fees.netAmount",
              0,
            ],
          },
        },
        transactionCount: { $sum: 1 },
      },
    },
  ]);
};

// Pre-save middleware
PaymentSchema.pre("save", function (next) {
  // Generate payment ID if not provided
  if (!this.paymentId) {
    this.paymentId = `PAY_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  // Calculate net amount after fees
  if (!this.fees.netAmount) {
    this.fees.netAmount = this.amount - this.fees.totalFees;
  }

  // Add initial status to history if new document
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      reason: "Payment created",
    });
  }

  next();
});

module.exports = mongoose.model("Payment", PaymentSchema);
