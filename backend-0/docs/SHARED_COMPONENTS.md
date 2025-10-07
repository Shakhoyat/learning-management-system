# Shared Components Documentation

## Overview
The Shared Components provide common functionality, utilities, database models, middleware, and configurations used across all microservices in the learning management system. This promotes code reuse, consistency, and maintainability.

## Directory Structure
```
shared/
├── package.json
├── cache/              # Redis caching utilities
├── config/             # Environment and service configurations
├── constants/          # Application constants and enums
├── database/           # Database connection and models
├── events/             # Event emitters and handlers
├── logger/             # Centralized logging system
├── middleware/         # Express middleware functions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
└── validators/         # Input validation schemas
```

---

## 🗄️ Database Module

### Connection Management

#### Database Connection (`database/connection.js`)

```javascript
const mongoose = require('mongoose');
const logger = require('../logger');

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = 5;
  }
  
  async connect(uri, options = {}) {
    const defaultOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    };
    
    try {
      await mongoose.connect(uri, { ...defaultOptions, ...options });
      this.isConnected = true;
      this.retryCount = 0;
      
      logger.info('Database connected successfully', {
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      });
      
      // Set up connection event handlers
      this.setupEventHandlers();
      
      return mongoose.connection;
    } catch (error) {
      this.isConnected = false;
      logger.error('Database connection failed', { error: error.message });
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        const delay = Math.pow(2, this.retryCount) * 1000; // Exponential backoff
        
        logger.info(`Retrying database connection in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.connect(uri, options);
      }
      
      throw error;
    }
  }
  
  setupEventHandlers() {
    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      logger.warn('Database disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      this.isConnected = true;
      logger.info('Database reconnected');
    });
    
    mongoose.connection.on('error', (error) => {
      logger.error('Database error', { error: error.message });
    });
  }
  
  async disconnect() {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('Database disconnected gracefully');
    }
  }
  
  getStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }
}

module.exports = new DatabaseConnection();
```

### Database Models

#### User Model (`database/models/User.js`)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format']
  },
  
  // Authentication
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Role and Permissions
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin', 'super_admin'],
    default: 'student'
  },
  permissions: [{
    type: String,
    enum: [
      'read_users', 'write_users', 'delete_users',
      'read_sessions', 'write_sessions', 'delete_sessions',
      'read_payments', 'write_payments', 'refund_payments',
      'read_analytics', 'manage_system'
    ]
  }],
  
  // Profile Information
  avatar: {
    url: String,
    publicId: String // For Cloudinary
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  location: {
    country: String,
    state: String,
    city: String,
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  
  // Social Links
  socialLinks: {
    linkedin: String,
    github: String,
    website: String,
    twitter: String
  },
  
  // Student-specific fields
  studentProfile: {
    learningGoals: [String],
    currentLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    interestedSkills: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    }],
    completedCourses: [{
      courseId: mongoose.Schema.Types.ObjectId,
      completedAt: Date,
      certificateId: String
    }],
    totalSessionsAttended: {
      type: Number,
      default: 0
    },
    totalAmountSpent: {
      type: Number,
      default: 0
    }
  },
  
  // Teacher-specific fields
  teacherProfile: {
    expertise: [{
      skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
      },
      level: {
        type: String,
        enum: ['intermediate', 'advanced', 'expert']
      },
      yearsOfExperience: Number,
      certifications: [String]
    }],
    hourlyRate: {
      type: Number,
      min: 1000, // $10.00 minimum
      max: 50000 // $500.00 maximum
    },
    availability: {
      timezone: String,
      schedule: {
        monday: { available: Boolean, slots: [String] },
        tuesday: { available: Boolean, slots: [String] },
        wednesday: { available: Boolean, slots: [String] },
        thursday: { available: Boolean, slots: [String] },
        friday: { available: Boolean, slots: [String] },
        saturday: { available: Boolean, slots: [String] },
        sunday: { available: Boolean, slots: [String] }
      }
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    totalSessionsCompleted: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDocuments: [{
      type: String,
      url: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      }
    }]
  },
  
  // Account Status
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned', 'pending_verification'],
    default: 'active'
  },
  lastLoginAt: Date,
  lastActiveAt: Date,
  
  // Preferences
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      showProfile: {
        type: Boolean,
        default: true
      },
      showLocation: {
        type: Boolean,
        default: false
      },
      allowMessages: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'teacherProfile.expertise.skillId': 1 });
userSchema.index({ 'location.country': 1, 'location.state': 1 });

// Virtual fields
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('isTeacher').get(function() {
  return this.role === 'teacher';
});

userSchema.virtual('isStudent').get(function() {
  return this.role === 'student';
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

userSchema.methods.updateLastActivity = function() {
  this.lastActiveAt = new Date();
  return this.save({ validateBeforeSave: false });
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findTeachersBySkill = function(skillId) {
  return this.find({
    role: 'teacher',
    status: 'active',
    'teacherProfile.expertise.skillId': skillId
  });
};

module.exports = mongoose.model('User', userSchema);
```

#### Session Model (`database/models/Session.js`)

```javascript
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  
  // Participants
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Skill and Learning
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  topics: [String],
  learningObjectives: [String],
  
  // Scheduling
  scheduledAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // minutes
    required: true,
    min: 30,
    max: 240
  },
  timezone: {
    type: String,
    required: true
  },
  
  // Status and Lifecycle
  status: {
    type: String,
    enum: [
      'scheduled',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'no_show',
      'rescheduled'
    ],
    default: 'scheduled'
  },
  
  // Session Details
  meetingLink: String,
  meetingId: String,
  meetingPassword: String,
  recordingUrl: String,
  
  // Collaboration Tools
  collaborationRoom: {
    roomId: String,
    whiteboardData: mongoose.Schema.Types.Mixed,
    codeEditorState: mongoose.Schema.Types.Mixed,
    sharedFiles: [{
      name: String,
      url: String,
      type: String,
      uploadedAt: Date,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },
  
  // Financial
  pricing: {
    hourlyRate: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    platformFee: Number,
    teacherEarnings: Number
  },
  
  // Payment
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending'
    },
    paymentId: String,
    paidAt: Date,
    refundId: String,
    refundedAt: Date,
    refundReason: String
  },
  
  // Session Tracking
  actualStartTime: Date,
  actualEndTime: Date,
  actualDuration: Number, // minutes
  
  // Feedback and Rating
  feedback: {
    studentRating: {
      type: Number,
      min: 1,
      max: 5
    },
    studentComment: {
      type: String,
      maxlength: 1000
    },
    teacherRating: {
      type: Number,
      min: 1,
      max: 5
    },
    teacherComment: {
      type: String,
      maxlength: 1000
    },
    submittedAt: Date
  },
  
  // Follow-up
  followUp: {
    homework: [String],
    nextSteps: [String],
    recommendedResources: [{
      title: String,
      url: String,
      type: String // book, video, article, course
    }],
    nextSessionSuggested: Boolean,
    nextSessionScheduled: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    }
  },
  
  // Metadata
  notes: {
    teacherNotes: String,
    studentNotes: String,
    systemNotes: String
  },
  tags: [String],
  cancellationReason: String,
  reschedulingHistory: [{
    originalDate: Date,
    newDate: Date,
    reason: String,
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requestedAt: Date
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
sessionSchema.index({ student: 1, scheduledAt: -1 });
sessionSchema.index({ teacher: 1, scheduledAt: -1 });
sessionSchema.index({ skill: 1, scheduledAt: -1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ scheduledAt: 1 });

// Virtual fields
sessionSchema.virtual('isUpcoming').get(function() {
  return this.scheduledAt > new Date() && ['scheduled', 'confirmed'].includes(this.status);
});

sessionSchema.virtual('isPast').get(function() {
  return this.scheduledAt < new Date() || ['completed', 'cancelled', 'no_show'].includes(this.status);
});

sessionSchema.virtual('canBeCancelled').get(function() {
  const cancellationDeadline = new Date(this.scheduledAt.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
  return new Date() < cancellationDeadline && ['scheduled', 'confirmed'].includes(this.status);
});

// Methods
sessionSchema.methods.calculateTotalAmount = function() {
  const durationHours = this.duration / 60;
  const subtotal = this.pricing.hourlyRate * durationHours;
  const platformFee = Math.round(subtotal * 0.1); // 10% platform fee
  const teacherEarnings = subtotal - platformFee;
  
  this.pricing.totalAmount = subtotal;
  this.pricing.platformFee = platformFee;
  this.pricing.teacherEarnings = teacherEarnings;
  
  return subtotal;
};

sessionSchema.methods.startSession = function() {
  this.status = 'in_progress';
  this.actualStartTime = new Date();
  return this.save();
};

sessionSchema.methods.endSession = function() {
  this.status = 'completed';
  this.actualEndTime = new Date();
  
  if (this.actualStartTime) {
    this.actualDuration = Math.round((this.actualEndTime - this.actualStartTime) / (1000 * 60));
  }
  
  return this.save();
};

// Static methods
sessionSchema.statics.findUpcomingSessions = function(userId) {
  return this.find({
    $or: [{ student: userId }, { teacher: userId }],
    scheduledAt: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] }
  }).sort({ scheduledAt: 1 });
};

sessionSchema.statics.findSessionsInRange = function(userId, startDate, endDate) {
  return this.find({
    $or: [{ student: userId }, { teacher: userId }],
    scheduledAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ scheduledAt: 1 });
};

module.exports = mongoose.model('Session', sessionSchema);
```

#### Skill Model (`database/models/Skill.js`)

```javascript
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  longDescription: {
    type: String,
    maxlength: 2000
  },
  
  // Categorization
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillCategory',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillSubcategory'
  },
  tags: [String],
  
  // Difficulty and Learning
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  prerequisites: [{
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    },
    required: {
      type: Boolean,
      default: true
    }
  }],
  learningOutcomes: [String],
  estimatedLearningTime: {
    beginner: Number, // hours
    intermediate: Number,
    advanced: Number
  },
  
  // Market Data
  marketData: {
    averageSalary: {
      junior: Number,
      mid: Number,
      senior: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    jobOpenings: Number,
    growthRate: Number, // percentage
    demandScore: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  
  // Platform Statistics
  stats: {
    totalTeachers: {
      type: Number,
      default: 0
    },
    totalLearners: {
      type: Number,
      default: 0
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    averagePrice: Number,
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    popularityRank: Number
  },
  
  // Status and Metadata
  status: {
    type: String,
    enum: ['active', 'inactive', 'deprecated'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  icon: String,
  color: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
skillSchema.index({ name: 'text', description: 'text' });
skillSchema.index({ category: 1 });
skillSchema.index({ difficulty: 1 });
skillSchema.index({ status: 1 });
skillSchema.index({ 'stats.popularityRank': 1 });

// Virtual fields
skillSchema.virtual('url').get(function() {
  return `/skills/${this.slug}`;
});

// Methods
skillSchema.methods.updateStats = async function() {
  const Session = mongoose.model('Session');
  const User = mongoose.model('User');
  
  // Count teachers
  const teacherCount = await User.countDocuments({
    role: 'teacher',
    'teacherProfile.expertise.skillId': this._id
  });
  
  // Count sessions
  const sessionCount = await Session.countDocuments({
    skill: this._id,
    status: 'completed'
  });
  
  // Calculate average price and rating
  const sessionStats = await Session.aggregate([
    { $match: { skill: this._id, status: 'completed' } },
    {
      $group: {
        _id: null,
        avgPrice: { $avg: '$pricing.hourlyRate' },
        avgRating: { $avg: '$feedback.studentRating' }
      }
    }
  ]);
  
  this.stats.totalTeachers = teacherCount;
  this.stats.totalSessions = sessionCount;
  
  if (sessionStats.length > 0) {
    this.stats.averagePrice = Math.round(sessionStats[0].avgPrice || 0);
    this.stats.averageRating = Math.round((sessionStats[0].avgRating || 0) * 10) / 10;
  }
  
  return this.save();
};

// Static methods
skillSchema.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ 'stats.popularityRank': 1 })
    .limit(limit);
};

skillSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category: categoryId, status: 'active' });
};

skillSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query },
    status: 'active'
  }).sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Skill', skillSchema);
```

---

## 🚀 Cache Module

### Redis Cache Utility (`cache/index.js`)

```javascript
const Redis = require('ioredis');
const logger = require('../logger');

class CacheManager {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }
  
  async connect(options = {}) {
    const defaultOptions = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB || 0,
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
    };
    
    try {
      this.client = new Redis({ ...defaultOptions, ...options });
      
      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('Redis connected successfully');
      });
      
      this.client.on('error', (error) => {
        this.isConnected = false;
        logger.error('Redis connection error', { error: error.message });
      });
      
      this.client.on('close', () => {
        this.isConnected = false;
        logger.warn('Redis connection closed');
      });
      
      // Test connection
      await this.client.ping();
      
      return this.client;
    } catch (error) {
      logger.error('Failed to connect to Redis', { error: error.message });
      throw error;
    }
  }
  
  async set(key, value, ttl = 3600) {
    if (!this.isConnected) {
      logger.warn('Cache not available, skipping set operation');
      return false;
    }
    
    try {
      const serializedValue = JSON.stringify(value);
      await this.client.setex(key, ttl, serializedValue);
      return true;
    } catch (error) {
      logger.error('Cache set error', { key, error: error.message });
      return false;
    }
  }
  
  async get(key) {
    if (!this.isConnected) {
      logger.warn('Cache not available, skipping get operation');
      return null;
    }
    
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error', { key, error: error.message });
      return null;
    }
  }
  
  async del(key) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error', { key, error: error.message });
      return false;
    }
  }
  
  async exists(key) {
    if (!this.isConnected) return false;
    
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error', { key, error: error.message });
      return false;
    }
  }
  
  // Cache patterns
  generateKey(prefix, ...parts) {
    return `${prefix}:${parts.join(':')}`;
  }
  
  async cacheUser(userId, userData, ttl = 1800) {
    const key = this.generateKey('user', userId);
    return this.set(key, userData, ttl);
  }
  
  async getUser(userId) {
    const key = this.generateKey('user', userId);
    return this.get(key);
  }
  
  async invalidateUser(userId) {
    const key = this.generateKey('user', userId);
    return this.del(key);
  }
  
  async cacheSession(sessionId, sessionData, ttl = 3600) {
    const key = this.generateKey('session', sessionId);
    return this.set(key, sessionData, ttl);
  }
  
  async getSession(sessionId) {
    const key = this.generateKey('session', sessionId);
    return this.get(key);
  }
  
  // Rate limiting
  async rateLimit(identifier, limit, window) {
    const key = this.generateKey('rate_limit', identifier);
    
    try {
      const current = await this.client.incr(key);
      
      if (current === 1) {
        await this.client.expire(key, window);
      }
      
      return {
        current,
        remaining: Math.max(0, limit - current),
        resetTime: Date.now() + (window * 1000)
      };
    } catch (error) {
      logger.error('Rate limit error', { identifier, error: error.message });
      return { current: 0, remaining: limit, resetTime: Date.now() + (window * 1000) };
    }
  }
  
  async disconnect() {
    if (this.client) {
      await this.client.disconnect();
      this.isConnected = false;
      logger.info('Redis disconnected');
    }
  }
}

module.exports = new CacheManager();
```

---

## 📝 Logger Module

### Centralized Logging (`logger/index.js`)

```javascript
const winston = require('winston');
const path = require('path');

// Custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    });
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'lms-service',
    version: process.env.SERVICE_VERSION || '1.0.0'
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File transports
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'exceptions.log')
    })
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'rejections.log')
    })
  ]
});

// Helper methods
logger.request = (req, res, responseTime) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id
  });
};

logger.auth = (action, userId, details = {}) => {
  logger.info('Authentication Event', {
    action,
    userId,
    ...details
  });
};

logger.payment = (action, paymentId, amount, userId, details = {}) => {
  logger.info('Payment Event', {
    action,
    paymentId,
    amount,
    userId,
    ...details
  });
};

logger.session = (action, sessionId, studentId, teacherId, details = {}) => {
  logger.info('Session Event', {
    action,
    sessionId,
    studentId,
    teacherId,
    ...details
  });
};

module.exports = logger;
```

---

## 🛡️ Middleware Module

### Authentication Middleware (`middleware/auth.js`)

```javascript
const jwt = require('jsonwebtoken');
const User = require('../database/models/User');
const cache = require('../cache');
const logger = require('../logger');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        code: 'TOKEN_REQUIRED'
      });
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check cache first
    let user = await cache.getUser(decoded.userId);
    
    if (!user) {
      // Fetch from database
      user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }
      
      // Cache user data
      await cache.cacheUser(decoded.userId, user);
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active',
        code: 'ACCOUNT_INACTIVE'
      });
    }
    
    // Update last activity
    await user.updateLastActivity();
    
    // Attach user to request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    logger.error('Authentication error', {
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        data: {
          required: roles,
          current: req.user.role
        }
      });
    }
    
    next();
  };
};

const authorizePermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    const hasPermission = permissions.some(permission => 
      req.user.permissions?.includes(permission)
    );
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Required permissions not found',
        code: 'PERMISSION_DENIED',
        data: {
          required: permissions,
          current: req.user.permissions || []
        }
      });
    }
    
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizePermissions
};
```

### Rate Limiting Middleware (`middleware/rateLimiter.js`)

```javascript
const cache = require('../cache');
const logger = require('../logger');

const createRateLimiter = (options = {}) => {
  const {
    windowMs = 60 * 1000, // 1 minute
    max = 100, // limit each IP/user to 100 requests per windowMs
    message = 'Too many requests, please try again later',
    standardHeaders = true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders = false, // Disable the `X-RateLimit-*` headers
    keyGenerator = (req) => req.ip, // Function to generate keys
    skip = () => false, // Function to skip requests
    handler = (req, res) => {
      res.status(429).json({
        success: false,
        message,
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }
  } = options;
  
  return async (req, res, next) => {
    if (skip(req, res)) {
      return next();
    }
    
    const key = keyGenerator(req);
    const window = Math.floor(windowMs / 1000); // Convert to seconds
    
    try {
      const result = await cache.rateLimit(key, max, window);
      
      if (standardHeaders) {
        res.set({
          'RateLimit-Limit': max,
          'RateLimit-Remaining': result.remaining,
          'RateLimit-Reset': new Date(result.resetTime).toISOString()
        });
      }
      
      if (legacyHeaders) {
        res.set({
          'X-RateLimit-Limit': max,
          'X-RateLimit-Remaining': result.remaining,
          'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000)
        });
      }
      
      if (result.current > max) {
        logger.warn('Rate limit exceeded', {
          key,
          current: result.current,
          limit: max,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });
        
        return handler(req, res);
      }
      
      next();
    } catch (error) {
      logger.error('Rate limiter error', {
        key,
        error: error.message
      });
      
      // If rate limiting fails, allow the request
      next();
    }
  };
};

// Predefined rate limiters
const globalRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit login attempts
  keyGenerator: (req) => `auth:${req.ip}:${req.body.email || ''}`,
  message: 'Too many authentication attempts, please try again later'
});

const apiRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: (req) => {
    // Different limits based on user role
    if (!req.user) return 20; // Guest users
    
    switch (req.user.role) {
      case 'admin':
      case 'super_admin':
        return 500;
      case 'teacher':
        return 200;
      case 'student':
        return 100;
      default:
        return 50;
    }
  },
  keyGenerator: (req) => req.user ? `user:${req.user.id}` : `ip:${req.ip}`,
  message: 'API rate limit exceeded'
});

module.exports = {
  createRateLimiter,
  globalRateLimit,
  authRateLimit,
  apiRateLimit
};
```

---

## 🔧 Utilities Module

### Response Helpers (`utils/response.js`)

```javascript
const logger = require('../logger');

class ResponseHelper {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    const response = {
      success: true,
      message,
      ...(data && { data })
    };
    
    return res.status(statusCode).json(response);
  }
  
  static error(res, message = 'An error occurred', statusCode = 500, code = null, data = null) {
    const response = {
      success: false,
      message,
      ...(code && { code }),
      ...(data && { data })
    };
    
    // Log error for server errors (5xx)
    if (statusCode >= 500) {
      logger.error('Server error', {
        statusCode,
        message,
        code,
        data
      });
    }
    
    return res.status(statusCode).json(response);
  }
  
  static badRequest(res, message = 'Bad request', code = 'BAD_REQUEST', data = null) {
    return this.error(res, message, 400, code, data);
  }
  
  static unauthorized(res, message = 'Unauthorized', code = 'UNAUTHORIZED') {
    return this.error(res, message, 401, code);
  }
  
  static forbidden(res, message = 'Forbidden', code = 'FORBIDDEN') {
    return this.error(res, message, 403, code);
  }
  
  static notFound(res, message = 'Resource not found', code = 'NOT_FOUND') {
    return this.error(res, message, 404, code);
  }
  
  static conflict(res, message = 'Conflict', code = 'CONFLICT', data = null) {
    return this.error(res, message, 409, code, data);
  }
  
  static unprocessableEntity(res, message = 'Unprocessable entity', code = 'UNPROCESSABLE_ENTITY', data = null) {
    return this.error(res, message, 422, code, data);
  }
  
  static tooManyRequests(res, message = 'Too many requests', code = 'RATE_LIMIT_EXCEEDED', data = null) {
    return this.error(res, message, 429, code, data);
  }
  
  static internalServerError(res, message = 'Internal server error', code = 'INTERNAL_ERROR') {
    return this.error(res, message, 500, code);
  }
  
  static serviceUnavailable(res, message = 'Service unavailable', code = 'SERVICE_UNAVAILABLE') {
    return this.error(res, message, 503, code);
  }
  
  // Pagination helper
  static paginated(res, data, pagination, message = 'Success') {
    return this.success(res, {
      ...data,
      pagination
    }, message);
  }
  
  // Created resource
  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }
  
  // No content
  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ResponseHelper;
```

### Validation Utilities (`utils/validation.js`)

```javascript
const Joi = require('joi');

// Common validation schemas
const commonSchemas = {
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format'),
  email: Joi.string().email().lowercase().trim(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]')).message('Password must contain at least 8 characters with uppercase, lowercase, number and special character'),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).message('Invalid phone format'),
  url: Joi.string().uri(),
  timezone: Joi.string().valid(
    'UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
    'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai',
    'Australia/Sydney', 'Africa/Cairo'
  )
};

// User validation schemas
const userSchemas = {
  register: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    email: commonSchemas.email.required(),
    password: commonSchemas.password.required(),
    role: Joi.string().valid('student', 'teacher').default('student'),
    agreeToTerms: Joi.boolean().valid(true).required()
  }),
  
  login: Joi.object({
    email: commonSchemas.email.required(),
    password: Joi.string().required()
  }),
  
  updateProfile: Joi.object({
    firstName: Joi.string().trim().min(2).max(50),
    lastName: Joi.string().trim().min(2).max(50),
    phone: commonSchemas.phone,
    bio: Joi.string().max(1000),
    dateOfBirth: Joi.date().max('now'),
    gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say'),
    location: Joi.object({
      country: Joi.string(),
      state: Joi.string(),
      city: Joi.string(),
      timezone: commonSchemas.timezone
    }),
    socialLinks: Joi.object({
      linkedin: commonSchemas.url,
      github: commonSchemas.url,
      website: commonSchemas.url,
      twitter: commonSchemas.url
    })
  })
};

// Session validation schemas
const sessionSchemas = {
  create: Joi.object({
    teacherId: commonSchemas.objectId.required(),
    skillId: commonSchemas.objectId.required(),
    title: Joi.string().trim().min(5).max(200).required(),
    description: Joi.string().max(1000),
    scheduledAt: Joi.date().greater('now').required(),
    duration: Joi.number().min(30).max(240).required(),
    timezone: commonSchemas.timezone.required(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
    topics: Joi.array().items(Joi.string()),
    learningObjectives: Joi.array().items(Joi.string())
  }),
  
  update: Joi.object({
    title: Joi.string().trim().min(5).max(200),
    description: Joi.string().max(1000),
    scheduledAt: Joi.date().greater('now'),
    duration: Joi.number().min(30).max(240),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
    topics: Joi.array().items(Joi.string()),
    learningObjectives: Joi.array().items(Joi.string())
  }),
  
  feedback: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(1000)
  })
};

// Validation middleware
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));
      
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        data: { errors }
      });
    }
    
    // Replace req[property] with validated value
    req[property] = value;
    next();
  };
};

module.exports = {
  commonSchemas,
  userSchemas,
  sessionSchemas,
  validate
};
```

---

This documentation covers the complete Shared Components functionality. These modules provide the foundation for all microservices in the learning management system, ensuring consistency, reusability, and maintainability across the entire backend architecture.