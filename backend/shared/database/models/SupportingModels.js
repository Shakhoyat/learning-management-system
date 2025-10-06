const mongoose = require('mongoose');

// Transaction Schema for credit system and payments
const TransactionSchema = new mongoose.Schema({
  // Transaction Identification
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Participants
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Transaction Details
  type: {
    type: String,
    enum: [
      'session_payment',      // Payment for a session
      'credit_purchase',      // User buying credits
      'credit_gift',          // Credits gifted to user
      'referral_bonus',       // Bonus for referrals
      'platform_fee',         // Platform commission
      'refund',              // Refund transaction
      'withdrawal',          // Teacher withdrawing earnings
      'bonus',               // Platform bonus/reward
      'penalty'              // Penalty deduction
    ],
    required: true
  },
  
  amount: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Related entities
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  },
  
  // Payment gateway information
  paymentGateway: {
    provider: {
      type: String,
      enum: ['stripe', 'paypal', 'internal'],
      default: 'internal'
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'disputed'],
      default: 'pending'
    },
    fees: {
      type: Number,
      default: 0
    }
  },
  
  // Transaction status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  
  description: {
    type: String,
    required: true
  },
  
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Review Schema for feedback system
const ReviewSchema = new mongoose.Schema({
  // Review participants
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Related session
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  
  // Review type
  reviewType: {
    type: String,
    enum: ['teacher_to_learner', 'learner_to_teacher'],
    required: true
  },
  
  // Ratings
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Detailed ratings (context dependent)
  detailedRatings: {
    // For teacher reviews
    teachingSkill: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    patience: {
      type: Number,
      min: 1,
      max: 5
    },
    preparation: {
      type: Number,
      min: 1,
      max: 5
    },
    
    // For learner reviews
    engagement: {
      type: Number,
      min: 1,
      max: 5
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5
    },
    participation: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Written feedback
  comment: {
    type: String,
    maxlength: 1000
  },
  
  // Specific feedback
  strengths: [String],
  improvementAreas: [String],
  
  // Recommendation
  wouldRecommend: {
    type: Boolean,
    required: true
  },
  
  // Review verification
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Helpfulness rating by other users
  helpfulnessVotes: {
    helpful: {
      type: Number,
      default: 0
    },
    notHelpful: {
      type: Number,
      default: 0
    }
  },
  
  // Response from reviewee
  response: {
    comment: String,
    respondedAt: Date
  },
  
  // Moderation
  isReported: {
    type: Boolean,
    default: false
  },
  
  isHidden: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  type: {
    type: String,
    enum: [
      'session_scheduled',
      'session_reminder',
      'session_cancelled',
      'session_completed',
      'message_received',
      'skill_match_found',
      'payment_received',
      'review_received',
      'credit_low',
      'achievement_unlocked',
      'system_announcement'
    ],
    required: true
  },
  
  title: {
    type: String,
    required: true
  },
  
  message: {
    type: String,
    required: true
  },
  
  // Related entities
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['session', 'user', 'skill', 'transaction', 'review']
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  
  // Notification status
  isRead: {
    type: Boolean,
    default: false
  },
  
  readAt: Date,
  
  // Delivery channels
  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: false
    }
  },
  
  // Delivery status
  deliveryStatus: {
    inApp: {
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date
    },
    email: {
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      opened: {
        type: Boolean,
        default: false
      },
      openedAt: Date
    },
    push: {
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      clicked: {
        type: Boolean,
        default: false
      },
      clickedAt: Date
    }
  },
  
  // Action buttons
  actions: [{
    label: String,
    action: String,
    url: String
  }],
  
  // Priority and scheduling
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  scheduledFor: Date,
  
  expiresAt: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
TransactionSchema.index({ from: 1, createdAt: -1 });
TransactionSchema.index({ to: 1, createdAt: -1 });
TransactionSchema.index({ session: 1 });
TransactionSchema.index({ type: 1, status: 1 });
TransactionSchema.index({ transactionId: 1 });

ReviewSchema.index({ reviewer: 1, createdAt: -1 });
ReviewSchema.index({ reviewee: 1, createdAt: -1 });
ReviewSchema.index({ session: 1 });
ReviewSchema.index({ skill: 1 });
ReviewSchema.index({ overallRating: -1 });

NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ scheduledFor: 1 });
NotificationSchema.index({ expiresAt: 1 });

// Export models
module.exports = {
  Transaction: mongoose.model('Transaction', TransactionSchema),
  Review: mongoose.model('Review', ReviewSchema),
  Notification: mongoose.model('Notification', NotificationSchema)
};