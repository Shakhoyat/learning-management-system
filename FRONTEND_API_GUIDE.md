# Complete API Documentation for Frontend Implementation

## 🎯 Overview

This documentation provides complete API coverage for the Learning Management System frontend implementation. All endpoints are production-ready with proper authentication, validation, and error handling.

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📊 Dashboard & Analytics APIs

### Quick Stats for Dashboard
```
GET /api/users/dashboard-stats
Response: {
  totalEarnings: number,
  upcomingSessions: number,
  skillsTeaching: number,
  studentsCount: number,
  avgRating: number
}
```

### User Analytics
```
GET /api/users/analytics
Response: {
  sessionStats: { completed, upcoming, cancelled },
  skillProgress: { learning: [], teaching: [] },
  earningsStats: { thisMonth, lastMonth, total }
}
```

---

## 🎓 Skills Management

### Core Skill Operations
```
GET /api/skills
Query: page, limit, category, difficulty, search, sortBy
Response: { skills: [], pagination: {}, filters: {} }

GET /api/skills/:id
Response: {
  _id, name, description, category, subcategory,
  difficulty: 1-10,
  prerequisites: [{ skillId, required, minimumLevel }],
  relatedSkills: [{ skillId, relationshipType, strength }],
  stats: { totalTeachers, totalLearners, avgRating },
  metadata: { estimatedLearningTime, industries, tools }
}

POST /api/skills (Admin only)
Body: { name, description, category, difficulty, prerequisites }

PUT /api/skills/:id (Admin only)
DELETE /api/skills/:id (Admin only)
```

### Advanced Skill Features
```
GET /api/skills/search?q=javascript
Response: { skills: [], totalResults: number }

GET /api/skills/categories/:category
Response: { skills: [], category: string, count: number }

GET /api/skills/popular
Response: { skills: [] } // Sorted by stats.totalLearners

GET /api/skills/:id/tree
Response: {
  skill: {},
  prerequisites: [],
  relatedSkills: [],
  learningPath: []
}

GET /api/skills/:id/path
Response: {
  path: [{ level, milestones: [{ title, description, estimatedHours }] }],
  totalHours: number
}
```

---

## 📅 Session Management

### Session Lifecycle
```
POST /api/sessions
Body: {
  teacherId, learnerId, skillId,
  schedule: { startTime, endTime, timezone },
  pricing: { amount, currency },
  type: "individual|group",
  maxParticipants?: number
}
Response: {
  _id, status: "scheduled",
  videoRoom: { roomId, joinUrl, password },
  participants: { teacher: {}, learner: {} }
}

GET /api/sessions
Query: status, upcoming, past, userId
Response: { sessions: [], pagination: {} }

GET /api/sessions/my-sessions
Response: {
  upcoming: [],
  ongoing: [],
  completed: [],
  cancelled: []
}
```

### Session Actions
```
POST /api/sessions/:id/join
Response: {
  sessionData: {},
  videoRoom: { joinUrl, password, roomId },
  isHost: boolean
}

POST /api/sessions/:id/start
Body: {} (Empty)
Response: { success: true, startTime: Date, status: "ongoing" }

POST /api/sessions/:id/end
Body: {} (Empty)
Response: { success: true, endTime: Date, status: "completed", duration: minutes }

POST /api/sessions/:id/cancel
Body: { reason: string }
Response: { success: true, cancellation: { reason, cancelledAt, cancelledBy } }

POST /api/sessions/:id/reschedule
Body: { newStartTime: Date, newEndTime: Date, reason?: string }
Response: { success: true, newSchedule: {}, reschedulingHistory: [] }
```

### Session Analytics
```
GET /api/sessions/statistics
Response: {
  totalSessions: number,
  byStatus: { scheduled, ongoing, completed, cancelled },
  bySkill: [{ skillId, skillName, count }],
  avgDuration: number,
  avgRating: number
}
```

---

## 💳 Payment System

### Payment Processing
```
POST /api/payments/intent
Body: {
  sessionId: string,
  amount: number,
  currency: "USD",
  paymentMethod?: "card|bank_account|paypal"
}
Response: {
  paymentIntentId: string,
  clientSecret: string,
  amount: number,
  status: "pending"
}

POST /api/payments/:id/confirm
Body: {
  paymentMethodId: string,
  billingDetails: {
    name: string,
    email: string,
    address: { line1, city, country, postal_code }
  }
}
Response: {
  success: boolean,
  paymentStatus: "succeeded|failed|processing",
  transactionId: string
}
```

### Payment Management
```
GET /api/payments
Query: status, startDate, endDate, sessionId
Response: {
  payments: [{
    _id, sessionId, amount, currency, status,
    provider: { name, transactionId },
    createdAt, updatedAt
  }],
  pagination: {},
  totalAmount: number
}

GET /api/payments/:id
Response: {
  payment: {},
  session: {},
  refunds: [],
  disputes: []
}

POST /api/payments/:id/refund
Body: { amount?: number, reason: string }
Response: {
  refund: {
    _id, amount, reason, status: "pending|succeeded|failed",
    refundId: string
  }
}
```

### Payment Methods
```
GET /api/payments/methods
Response: {
  methods: [{
    _id, type: "card|bank_account",
    last4: string,
    brand?: string,
    isDefault: boolean
  }]
}

POST /api/payments/methods
Body: {
  type: "card",
  token: string, // From Stripe/payment provider
  billingDetails: {}
}
```

---

## 🔔 Notification System

### User Notifications
```
GET /api/notifications
Query: type, read, priority, page, limit
Response: {
  notifications: [{
    _id, type, title, message, priority,
    data: {}, // Additional context data
    delivery: {
      inApp: { delivered: true, read: false, readAt?: Date },
      email: { delivered: boolean, error?: string },
      push: { delivered: boolean }
    },
    createdAt, expiresAt
  }],
  unreadCount: number
}

GET /api/notifications/unread-count
Response: { count: number }

PUT /api/notifications/:id/read
Response: { success: true, readAt: Date }

PUT /api/notifications/read-all
Response: { success: true, markedCount: number }

DELETE /api/notifications/:id
Response: { success: true }
```

### Notification Preferences
```
GET /api/notifications/settings
Response: {
  channels: {
    inApp: { enabled: true },
    email: { enabled: true, frequency: "immediate|daily|weekly" },
    push: { enabled: false },
    sms: { enabled: false }
  },
  types: {
    sessionReminder: { inApp: true, email: true, push: false },
    paymentReceived: { inApp: true, email: true },
    skillVerified: { inApp: true, email: true },
    newMessage: { inApp: true, push: true }
  }
}

PUT /api/notifications/settings
Body: { channels: {}, types: {} } // Same structure as above
```

### Push Notifications
```
POST /api/notifications/subscribe
Body: {
  endpoint: string,
  keys: { p256dh: string, auth: string },
  userAgent: string
}
Response: { success: true, subscriptionId: string }

POST /api/notifications/unsubscribe
Body: { subscriptionId: string }
```

---

## 👥 User & Profile Management

### User Profile
```
GET /api/users/profile
Response: {
  _id, firstName, lastName, email, avatar,
  role: "student|teacher|admin",
  skills: {
    teaching: [{ skillId, hourlyRate, experience, verified }],
    learning: [{ skillId, currentLevel, targetLevel, progress }]
  },
  availability: {
    timezone: string,
    schedule: [{ day, startTime, endTime, available }]
  },
  preferences: {
    language: string,
    currency: string,
    notifications: {}
  },
  stats: {
    totalSessions, avgRating, totalEarnings,
    completionRate, responseTime
  }
}

PUT /api/users/profile
Body: { firstName?, lastName?, avatar?, preferences?, availability? }

POST /api/users/avatar
Body: FormData with 'avatar' file
Response: { avatarUrl: string }
```

### Skills Management
```
POST /api/users/skills/teaching
Body: { skillId: string, hourlyRate: number, experience: string }

PUT /api/users/skills/teaching/:skillId
Body: { hourlyRate?, experience? }

DELETE /api/users/skills/teaching/:skillId

POST /api/users/skills/learning
Body: { skillId: string, currentLevel: 1-10, targetLevel: 1-10 }

PUT /api/users/skills/learning/:skillId
Body: { currentLevel?, targetLevel?, progress? }
```

---

## 🔍 Search & Discovery

### Teacher Search
```
GET /api/users/teachers
Query: skillId, minRating, maxRate, availability, timezone, page
Response: {
  teachers: [{
    _id, firstName, lastName, avatar,
    skills: [{ skillId, skillName, hourlyRate, experience }],
    stats: { avgRating, totalSessions, responseTime },
    availability: { nextAvailable: Date, timezone: string },
    isOnline: boolean
  }],
  pagination: {},
  filters: { skills: [], priceRange: {}, ratings: [] }
}

GET /api/users/teachers/:id
Response: {
  teacher: {},
  skills: [],
  reviews: [],
  availability: {},
  stats: {}
}
```

### Skill Matching
```
POST /api/matching/find-teachers
Body: {
  skillId: string,
  preferredTime?: Date,
  maxHourlyRate?: number,
  minRating?: number
}
Response: {
  matches: [{
    teacher: {},
    compatibility: number, // 0-100
    availableSlots: [{ startTime, endTime }],
    estimatedRate: number
  }]
}
```

---

## 📱 Frontend Implementation Guide

### Authentication Flow
```javascript
// Login
const { token, user } = await api.post('/api/auth/login', { email, password });
localStorage.setItem('token', token);

// Auto-logout on token expiry
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Real-time Updates
```javascript
// WebSocket connection for live notifications
const ws = new WebSocket(`ws://localhost:3007/notifications?token=${token}`);
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  showNotification(notification);
  updateUnreadCount();
};

// Polling for session status updates
const pollSessionStatus = (sessionId) => {
  setInterval(async () => {
    const { status } = await api.get(`/api/sessions/${sessionId}`);
    updateSessionStatus(status);
  }, 5000);
};
```

### Error Handling
```javascript
// Standardized error responses
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    details: [
      { field: "email", message: "Email is required" },
      { field: "password", message: "Password must be at least 8 characters" }
    ]
  }
}

// Frontend error handling
const handleApiError = (error) => {
  if (error.response?.data?.error) {
    const { code, message, details } = error.response.data.error;
    if (details) {
      // Show field-specific errors
      details.forEach(({ field, message }) => {
        setFieldError(field, message);
      });
    } else {
      // Show general error
      showToast(message, 'error');
    }
  }
};
```

### Pagination & Filtering
```javascript
// Reusable pagination hook
const usePagination = (endpoint, filters = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 1) => {
    setLoading(true);
    const response = await api.get(endpoint, {
      params: { ...filters, page, limit: 10 }
    });
    setData(response.data.items);
    setPagination(response.data.pagination);
    setLoading(false);
  };

  return { data, pagination, loading, fetchData };
};
```

### State Management Examples
```javascript
// Redux slice for skills
const skillsSlice = createSlice({
  name: 'skills',
  initialState: {
    items: [],
    filters: { category: '', difficulty: '', search: '' },
    pagination: {},
    loading: false
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSkills: (state, action) => {
      state.items = action.payload.skills;
      state.pagination = action.payload.pagination;
    }
  }
});

// Session management
const sessionSlice = createSlice({
  name: 'sessions',
  initialState: {
    current: null,
    upcoming: [],
    history: []
  },
  reducers: {
    joinSession: (state, action) => {
      state.current = action.payload;
    },
    updateSessionStatus: (state, action) => {
      if (state.current?._id === action.payload.sessionId) {
        state.current.status = action.payload.status;
      }
    }
  }
});
```

---

## 🎨 UI/UX Implementation Guidelines

### Component Structure
```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Pagination/
│   │   └── Toast/
│   ├── layout/           # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Footer/
│   └── features/         # Feature-specific components
│       ├── Auth/
│       ├── Dashboard/
│       ├── Skills/
│       ├── Sessions/
│       ├── Payments/
│       └── Notifications/
├── pages/                # Page components
├── hooks/                # Custom React hooks
├── services/             # API service functions
├── store/                # Redux store and slices
└── utils/                # Utility functions
```

### Design System Colors
```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* Success */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  
  /* Warning */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  
  /* Error */
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  
  /* Neutral */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-500: #6b7280;
  --gray-900: #111827;
}
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
.container {
  @media (min-width: 640px) { /* sm */ }
  @media (min-width: 768px) { /* md */ }
  @media (min-width: 1024px) { /* lg */ }
  @media (min-width: 1280px) { /* xl */ }
}
```

### Loading States
```javascript
// Skeleton components for better UX
const SkillCardSkeleton = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg p-4">
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-2 bg-gray-300 rounded w-full"></div>
  </div>
);

// Loading states for different scenarios
const LoadingStates = {
  button: 'Loading...',
  page: <PageSkeleton />,
  list: <ListSkeleton count={5} />,
  card: <SkillCardSkeleton />
};
```

This comprehensive API documentation provides everything needed for smooth frontend implementation with professional UI/UX patterns. All APIs are covered with proper error handling, authentication, and real-world usage examples.