# MongoDB Schema Documentation

## Overview

This document describes the MongoDB schemas for the Skill Exchange Platform. The platform uses a microservices architecture with shared database models for consistency across services.

## Core Models

### 1. User Schema

The User model represents platform users (both teachers and learners) with comprehensive profile information, skill tracking, and reputation system.

#### Key Features:
- **Personal Information**: Name, avatar, timezone, languages, bio, location
- **Authentication**: Secure password hashing, email verification, login attempts tracking
- **Skills Management**: Separate tracking for teaching and learning skills with levels, hours, and ratings
- **Credit System**: Balance, transactions, earnings tracking
- **Reputation System**: Score, badges, reviews, teaching/learning statistics
- **Privacy Settings**: Notification preferences, profile visibility controls

#### Important Fields:
```javascript
{
  personal: {
    name: String,
    email: String (unique),
    avatar: String,
    timezone: String,
    languages: [String],
    bio: String,
    location: { country, city, coordinates }
  },
  skills: {
    teaching: [{
      skillId: ObjectId,
      level: Number (1-10),
      hoursTaught: Number,
      rating: Number (0-5),
      verifications: [Object],
      availability: Object,
      pricing: { hourlyRate, currency }
    }],
    learning: [{
      skillId: ObjectId,
      currentLevel: Number (0-10),
      targetLevel: Number (1-10),
      hoursLearned: Number,
      progressMilestones: [Object],
      learningGoals: [Object]
    }]
  },
  credits: {
    balance: Number,
    earned: Number,
    spent: Number
  },
  reputation: {
    score: Number,
    level: String (bronze|silver|gold|platinum|diamond),
    badges: [Object],
    teachingStats: Object,
    learningStats: Object
  }
}
```

#### Indexes:
- Email (unique)
- Teaching/Learning skill IDs
- Reputation score
- Location coordinates (2dsphere)
- Creation date

### 2. Skill Schema

The Skill model represents skills in a graph structure with relationships, prerequisites, and market analytics.

#### Key Features:
- **Hierarchical Structure**: Prerequisites and skill relationships
- **Market Analytics**: Industry demand and trending scores
- **Learning Metadata**: Difficulty levels, average learning hours, learning paths
- **Platform Statistics**: Teacher/learner counts, session statistics
- **Content Resources**: Links to learning materials and documentation

#### Important Fields:
```javascript
{
  name: String (unique),
  description: String,
  category: String,
  subcategory: String,
  prerequisites: [{
    skillId: ObjectId,
    required: Boolean,
    minimumLevel: Number (1-10)
  }],
  relatedSkills: [{
    skillId: ObjectId,
    relationship: String (complementary|advanced|alternative|foundational|specialized),
    strength: Number (0-1)
  }],
  difficultyLevel: Number (1-10),
  averageLearningHours: Number,
  industryDemand: {
    score: Number (0-100),
    lastUpdated: Date
  },
  trendingScore: {
    score: Number (0-100),
    weeklyChange: Number,
    monthlyChange: Number
  },
  statistics: {
    totalTeachers: Number,
    totalLearners: Number,
    totalSessions: Number,
    averageTeacherRating: Number,
    popularityRank: Number
  }
}
```

#### Methods:
- `getPrerequisiteChain()`: Returns the complete chain of prerequisites
- `getRelatedSkillsGraph(depth)`: Builds a graph of related skills
- `findSimilarSkills(skillId, limit)`: Finds skills with similar tags/keywords
- `getTrendingSkills(limit)`: Returns trending skills by score
- `getSkillsByDemand(category, limit)`: Returns skills by industry demand

### 3. Session Schema

The Session model tracks learning sessions with comprehensive recording, analytics, and feedback capabilities.

#### Key Features:
- **Participant Management**: Teacher and learner tracking
- **Scheduling**: Start/end times, timezone handling, duration tracking
- **Virtual Meeting Room**: Video, whiteboard, chat integration
- **Recording Capabilities**: Video recording with highlights and transcription
- **Materials Sharing**: Document sharing and homework tracking
- **Analytics**: Engagement metrics, attendance tracking, technical issues
- **Financial Integration**: Credit transactions and pricing
- **Feedback System**: Bidirectional reviews and ratings

#### Important Fields:
```javascript
{
  participants: {
    teacher: ObjectId,
    learner: ObjectId
  },
  skill: ObjectId,
  title: String,
  schedule: {
    startTime: Date,
    endTime: Date,
    timezone: String,
    duration: Number (minutes)
  },
  status: String (scheduled|confirmed|started|ongoing|completed|cancelled),
  room: {
    videoRoomId: String,
    whiteboardId: String,
    chatId: String,
    roomSettings: Object
  },
  recording: {
    isRecorded: Boolean,
    url: String,
    duration: Number (seconds),
    highlights: [{
      timestamp: Number,
      title: String,
      note: String,
      createdBy: ObjectId
    }],
    transcription: Object
  },
  analytics: {
    actualStartTime: Date,
    actualEndTime: Date,
    attendanceRate: Object,
    engagementMetrics: Object,
    technicalIssues: [Object]
  },
  pricing: {
    hourlyRate: Number,
    currency: String,
    totalCost: Number
  },
  feedback: {
    fromTeacher: Object,
    fromLearner: Object
  }
}
```

#### Virtual Properties:
- `isUpcoming`: Checks if session is scheduled for the future
- `isActive`: Checks if session is currently ongoing
- `isPast`: Checks if session has ended
- `canBeCancelled`: Checks if session can be cancelled (24+ hours notice)

#### Methods:
- `addHighlight(timestamp, title, note, userId)`: Adds a highlight to recording
- `updateStatus(newStatus, userId)`: Updates session status with analytics tracking
- `getUpcomingSessions(userId, limit)`: Gets upcoming sessions for a user
- `getSessionHistory(userId, page, limit)`: Gets paginated session history
- `getSessionAnalytics(userId, startDate, endDate)`: Gets analytics for date range

### 4. Supporting Models

#### Transaction Model
Handles all financial transactions including session payments, credit purchases, refunds, and platform fees.

```javascript
{
  transactionId: String (unique),
  from: ObjectId (User),
  to: ObjectId (User),
  type: String (session_payment|credit_purchase|refund|etc),
  amount: Number,
  currency: String,
  session: ObjectId,
  paymentGateway: {
    provider: String (stripe|paypal|internal),
    transactionId: String,
    status: String,
    fees: Number
  },
  status: String (pending|completed|failed|cancelled),
  description: String
}
```

#### Review Model
Bidirectional feedback system for teachers and learners.

```javascript
{
  reviewer: ObjectId (User),
  reviewee: ObjectId (User),
  session: ObjectId,
  skill: ObjectId,
  reviewType: String (teacher_to_learner|learner_to_teacher),
  overallRating: Number (1-5),
  detailedRatings: {
    teachingSkill: Number,
    communication: Number,
    patience: Number,
    engagement: Number
  },
  comment: String,
  wouldRecommend: Boolean,
  helpfulnessVotes: Object,
  response: Object
}
```

#### Notification Model
Multi-channel notification system with delivery tracking.

```javascript
{
  recipient: ObjectId (User),
  type: String (session_scheduled|session_reminder|etc),
  title: String,
  message: String,
  relatedEntity: {
    entityType: String,
    entityId: ObjectId
  },
  isRead: Boolean,
  channels: {
    inApp: Boolean,
    email: Boolean,
    push: Boolean
  },
  deliveryStatus: Object,
  priority: String (low|normal|high|urgent),
  scheduledFor: Date,
  expiresAt: Date
}
```

## Database Relationships

### Skill Graph Relationships
- **Prerequisites**: Skills required before learning a skill
- **Related Skills**: Complementary, advanced, or alternative skills
- **Categories**: Hierarchical categorization (category -> subcategory)

### User-Skill Relationships
- **Teaching Skills**: Skills a user can teach with levels, ratings, and availability
- **Learning Skills**: Skills a user wants to learn with current/target levels

### Session Relationships
- **Participants**: Teacher-learner pairs
- **Skills**: The skill being taught/learned
- **Transactions**: Financial exchange for the session
- **Reviews**: Bidirectional feedback

## Performance Considerations

### Indexing Strategy
- **Users**: Email, skill IDs, reputation score, location (geospatial)
- **Skills**: Text search, category, popularity, trending score
- **Sessions**: Participant IDs, dates, status
- **Transactions**: User IDs, type, status
- **Reviews**: Reviewer/reviewee, session, skill
- **Notifications**: Recipient, type, read status

### Data Optimization
- Use MongoDB aggregation pipelines for complex queries
- Implement proper pagination for large datasets
- Cache frequently accessed data (Redis)
- Separate read/write operations where appropriate

## Usage Examples

### Creating a New User
```javascript
const user = new User({
  personal: {
    name: 'John Doe',
    email: 'john@example.com',
    timezone: 'America/New_York'
  },
  auth: {
    passwordHash: hashedPassword,
    emailVerified: false
  }
});
await user.save();
```

### Finding Skills with Prerequisites
```javascript
const skill = await Skill.findById(skillId).populate('prerequisites.skillId');
const prerequisiteChain = await skill.getPrerequisiteChain();
```

### Scheduling a Session
```javascript
const session = new Session({
  participants: {
    teacher: teacherId,
    learner: learnerId
  },
  skill: skillId,
  title: 'JavaScript Fundamentals',
  schedule: {
    startTime: new Date('2024-01-15T10:00:00Z'),
    endTime: new Date('2024-01-15T11:00:00Z'),
    timezone: 'UTC',
    duration: 60
  },
  pricing: {
    hourlyRate: 50,
    currency: 'USD',
    totalCost: 50
  }
});
await session.save();
```

### Getting User Analytics
```javascript
const analytics = await Session.getSessionAnalytics(
  userId,
  new Date('2024-01-01'),
  new Date('2024-01-31')
);
```

This schema design provides a robust foundation for a skill exchange platform with comprehensive tracking, analytics, and relationship management capabilities.