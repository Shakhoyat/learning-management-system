# API-Frontend Implementation Quick Reference

## 🔄 Database Model to Frontend Component Mapping

| Database Model | Updated Fields | Frontend Components | API Endpoints |
|----------------|----------------|-------------------|---------------|
| **Skill.js** | `difficulty` (1-10), `stats.avgRating`, `relationshipType` | SkillCard, SkillsList, SkillDetails | `/api/skills/*` |
| **Session.js** | `activity.joinedAt`, `cancellation.reason` | SessionCard, SessionManager | `/api/sessions/*` |
| **Payment.js** | New model with full payment processing | PaymentForm, PaymentHistory | `/api/payments/*` |
| **Notification.js** | New model with multi-channel delivery | NotificationCenter, Settings | `/api/notifications/*` |
| **User.js** | Existing - fully compatible | UserProfile, Dashboard | `/api/users/*` |

---

## 🎯 Critical API Updates for Frontend

### Skill Model Changes
```javascript
// OLD API Response (before update)
{
  difficultyLevel: 5,           // ❌ OLD FIELD
  statistics: { avgRating: 4.5 }, // ❌ OLD FIELD
  relatedSkills: [{ relationship: "similar" }] // ❌ OLD FIELD
}

// NEW API Response (updated)
{
  difficulty: 5,                // ✅ NEW FIELD
  stats: { avgRating: 4.5 },    // ✅ NEW FIELD
  relatedSkills: [{ relationshipType: "similar" }] // ✅ NEW FIELD
}
```

### Session Model Enhancements
```javascript
// NEW activity tracking fields
{
  activity: {
    joinedAt: "2025-10-08T10:00:00Z",
    actualStartTime: "2025-10-08T10:05:00Z",
    actualEndTime: "2025-10-08T11:00:00Z",
    rescheduling: [
      {
        previousStartTime: "2025-10-08T09:00:00Z",
        newStartTime: "2025-10-08T10:00:00Z",
        reason: "Teacher unavailable",
        rescheduledAt: "2025-10-07T15:30:00Z"
      }
    ]
  },
  cancellation: {
    cancelledBy: "teacher", // or "learner"
    cancelledAt: "2025-10-07T16:00:00Z",
    reason: "Emergency came up"
  }
}
```

---

## 🔧 Frontend Implementation Checklist

### ✅ Authentication & Security
- [x] JWT token storage and auto-refresh
- [x] Protected route components
- [x] API interceptors for token management
- [x] Login/logout functionality

### ✅ Skills Management
- [x] Skills catalog with filtering (`difficulty` field)
- [x] Skill search and categories
- [x] Skill details with `stats.avgRating`
- [x] Learning path visualization
- [x] Prerequisites and relationships (`relationshipType`)

### ✅ Session Management
- [x] Session creation and scheduling
- [x] Real-time session status updates
- [x] Join session with video integration
- [x] Session actions (start, end, cancel, reschedule)
- [x] Activity tracking display
- [x] Cancellation reason handling

### ✅ Payment Processing
- [x] Stripe integration for payments
- [x] Payment intent creation
- [x] Payment confirmation flow
- [x] Payment history and invoices
- [x] Refund processing
- [x] Payment method management

### ✅ Notification System
- [x] Real-time notification center
- [x] Notification preferences
- [x] Multi-channel delivery status
- [x] Push notification subscription
- [x] Unread count tracking

### ✅ Dashboard & Analytics
- [x] User dashboard with stats
- [x] Earnings and session analytics
- [x] Skill progress tracking
- [x] Performance metrics

---

## 🎨 Updated Component Props

### SkillCard Component Props
```typescript
interface SkillCardProps {
  skill: {
    _id: string;
    name: string;
    description: string;
    category: string;
    difficulty: number; // ✅ Updated: 1-10 scale
    stats: {
      avgRating: number; // ✅ Updated: renamed from averageTeacherRating
      totalTeachers: number;
      totalLearners: number;
    };
    metadata?: {
      estimatedLearningTime: number;
      industries: string[];
      tools: string[];
    };
  };
}
```

### SessionCard Component Props
```typescript
interface SessionCardProps {
  session: {
    _id: string;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    activity?: { // ✅ New field
      joinedAt?: Date;
      actualStartTime?: Date;
      actualEndTime?: Date;
      rescheduling: Array<{
        previousStartTime: Date;
        newStartTime: Date;
        reason: string;
        rescheduledAt: Date;
      }>;
    };
    cancellation?: { // ✅ New field
      cancelledBy: 'teacher' | 'learner';
      cancelledAt: Date;
      reason: string;
    };
    // ... other existing fields
  };
  onJoin: (sessionId: string) => void;
  onCancel: (sessionId: string) => void;
  onReschedule: (sessionId: string) => void;
}
```

---

## 📊 State Management Updates

### Redux Store Structure
```javascript
// Updated store structure for new API fields
const store = {
  skills: {
    items: [], // Uses new difficulty and stats fields
    filters: { difficulty: '', category: '', search: '' }
  },
  sessions: {
    current: null, // Includes activity tracking
    upcoming: [], // With cancellation handling
    history: []
  },
  payments: {
    methods: [],
    history: [],
    currentIntent: null
  },
  notifications: {
    items: [],
    unreadCount: 0,
    preferences: {}
  }
};
```

### API Service Updates
```javascript
// Updated API service methods
class ApiService {
  // Skills with new field names
  async getSkills(filters) {
    const response = await this.get('/api/skills', { params: filters });
    return {
      skills: response.data.skills.map(skill => ({
        ...skill,
        difficulty: skill.difficulty, // ✅ New field
        avgRating: skill.stats.avgRating // ✅ New structure
      }))
    };
  }

  // Sessions with activity tracking
  async getSession(sessionId) {
    const response = await this.get(`/api/sessions/${sessionId}`);
    return {
      ...response.data,
      hasActivity: !!response.data.activity, // ✅ New field check
      isCancelled: !!response.data.cancellation // ✅ New field check
    };
  }

  // Payment processing
  async createPaymentIntent(sessionId, amount) {
    return await this.post('/api/payments/intent', {
      sessionId,
      amount,
      currency: 'USD'
    });
  }

  // Notifications
  async getNotifications(filters = {}) {
    return await this.get('/api/notifications', { params: filters });
  }
}
```

---

## 🚀 Deployment & Testing Guide

### Environment Variables
```bash
# Frontend (.env)
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
REACT_APP_WS_URL=ws://localhost:3007

# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/lms_database
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
PORT_GATEWAY=3000
PORT_AUTH=3001
PORT_USER=3002
PORT_SKILL=3003
PORT_MATCHING=3004
PORT_SESSION=3005
PORT_PAYMENT=3006
PORT_NOTIFICATION=3007
```

### Testing Checklist
```bash
# API Testing
npm run test:api          # Test all API endpoints
npm run test:models       # Test database models
npm run test:integration  # Test service integration

# Frontend Testing
npm run test:components   # Test React components
npm run test:hooks        # Test custom hooks
npm run test:store        # Test Redux store
npm run test:e2e          # End-to-end testing
```

Your API documentation is now fully updated and aligned with all database model changes. The frontend implementation will be smooth with these comprehensive guides! 🎉