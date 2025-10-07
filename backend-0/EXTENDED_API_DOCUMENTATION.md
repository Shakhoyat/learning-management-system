# Extended Backend Services API Documentation

## Overview

The Learning Management System backend has been extended with four additional services that provide comprehensive functionality for skills, sessions, payments, and notifications.

## Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Gateway (Port 3000)                     │
├─────────────────────────────────────────────────────────────┤
│  Auth Service (3001)    │    User Service (3002)           │
│  ✅ FULLY IMPLEMENTED   │    ✅ FULLY IMPLEMENTED            │
├─────────────────────────────────────────────────────────────┤
│  Skill Service (3003)   │    Matching Service (3004)       │
│  ✅ NEWLY IMPLEMENTED   │    ✅ FULLY IMPLEMENTED            │
├─────────────────────────────────────────────────────────────┤
│  Session Service (3005) │    Payment Service (3006)        │
│  ✅ NEWLY IMPLEMENTED   │    ✅ NEWLY IMPLEMENTED           │
├─────────────────────────────────────────────────────────────┤
│              Notification Service (3007)                    │
│              ✅ NEWLY IMPLEMENTED                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Skill Service (Port 3003)

**Base URL**: `http://localhost:3003/api/skills`

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all skills with pagination and filtering |
| GET | `/search` | Search skills by name, description, or keywords |
| GET | `/categories/:category` | Get skills by category |
| GET | `/popular` | Get popular skills based on learner count |
| GET | `/statistics` | Get skill statistics and distributions |
| GET | `/:id` | Get skill by ID with full details |
| GET | `/:id/tree` | Get skill tree (prerequisites and related) |
| GET | `/:id/prerequisites` | Get skill prerequisites |
| GET | `/:id/path` | Get learning path for a skill |

### Protected Endpoints (Authentication Required)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/` | Create new skill | admin, teacher |
| PUT | `/:id` | Update skill | admin, teacher |
| DELETE | `/:id` | Delete skill | admin |

### Example Usage

```bash
# Get all skills
curl "http://localhost:3003/api/skills?page=1&limit=10&category=programming"

# Search skills
curl "http://localhost:3003/api/skills/search?q=javascript&difficulty=3"

# Get skill tree
curl "http://localhost:3003/api/skills/60f7b3b3e1b3c8a4d8e9f1a2/tree"
```

---

## 📅 Session Service (Port 3005)

**Base URL**: `http://localhost:3005/api/sessions`

### All Endpoints Require Authentication

| Method | Endpoint | Description | Special Permissions |
|--------|----------|-------------|-------------------|
| POST | `/` | Create new session | - |
| GET | `/` | Get sessions (filtered by user access) | admin sees all |
| GET | `/my-sessions` | Get current user's sessions | - |
| GET | `/upcoming` | Get upcoming sessions | - |
| GET | `/history` | Get session history | - |
| GET | `/statistics` | Get session statistics | - |
| GET | `/:id` | Get session by ID | participants only |
| PUT | `/:id` | Update session | participants only |
| DELETE | `/:id` | Delete session | teacher/admin only |

### Session Management

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/:id/join` | Join session | participants only |
| POST | `/:id/leave` | Leave session | participants only |
| POST | `/:id/start` | Start session | teacher only |
| POST | `/:id/end` | End session | teacher only |
| POST | `/:id/pause` | Pause session | teacher only |
| POST | `/:id/resume` | Resume session | teacher only |
| POST | `/:id/cancel` | Cancel session | participants only |
| POST | `/:id/reschedule` | Reschedule session | participants only |

### Example Usage

```bash
# Create session
curl -X POST "http://localhost:3005/api/sessions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "participants": {
      "teacher": "60f7b3b3e1b3c8a4d8e9f1a2",
      "learner": "60f7b3b3e1b3c8a4d8e9f1a3"
    },
    "skill": "60f7b3b3e1b3c8a4d8e9f1a4",
    "title": "JavaScript Fundamentals",
    "schedule": {
      "startTime": "2025-10-08T10:00:00Z",
      "endTime": "2025-10-08T11:00:00Z",
      "duration": 60
    }
  }'

# Join session
curl -X POST "http://localhost:3005/api/sessions/SESSION_ID/join" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 💳 Payment Service (Port 3006)

**Base URL**: `http://localhost:3006/api/payments`

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhook` | Payment provider webhooks (no auth) |

### Protected Endpoints

| Method | Endpoint | Description | Special Permissions |
|--------|----------|-------------|-------------------|
| POST | `/intent` | Create payment intent | - |
| POST | `/:id/confirm` | Confirm payment | - |
| GET | `/:id` | Get payment details | - |
| GET | `/` | Get user payments | - |
| GET | `/history` | Get payment history | - |
| POST | `/:id/refund` | Process refund | admin, teacher |

### Payment Methods

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/methods` | Get payment methods |
| POST | `/methods` | Add payment method |
| DELETE | `/methods/:methodId` | Remove payment method |
| PUT | `/methods/:methodId/default` | Set default payment method |

### Invoicing

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:id/invoice` | Get invoice for payment |
| GET | `/statistics` | Get payment statistics |

### Example Usage

```bash
# Create payment intent
curl -X POST "http://localhost:3006/api/payments/intent" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50,
    "currency": "USD",
    "sessionId": "60f7b3b3e1b3c8a4d8e9f1a5",
    "description": "Programming lesson payment"
  }'

# Get payment methods
curl "http://localhost:3006/api/payments/methods" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔔 Notification Service (Port 3007)

**Base URL**: `http://localhost:3007/api/notifications`

### All Endpoints Require Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user notifications |
| GET | `/unread-count` | Get unread notification count |
| GET | `/:id` | Get notification by ID |
| PUT | `/:id/read` | Mark notification as read |
| PUT | `/read-all` | Mark all notifications as read |
| DELETE | `/:id` | Delete notification |
| DELETE | `/` | Delete all notifications |

### Settings & Preferences

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings` | Get notification settings |
| PUT | `/settings` | Update notification settings |
| POST | `/subscribe` | Subscribe to push notifications |
| POST | `/unsubscribe` | Unsubscribe from push notifications |

### Admin Endpoints

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/send` | Send notification | admin, system |

### Notification Types

- `session_reminder` - Upcoming session notifications
- `session_started` - Session has started
- `session_ended` - Session has ended
- `payment_success` - Payment processed successfully
- `payment_failed` - Payment processing failed
- `new_message` - New message received
- `achievement_unlocked` - Achievement earned
- `skill_progress` - Skill progress update
- `system_announcement` - System announcements
- `marketing` - Marketing notifications

### Example Usage

```bash
# Get notifications
curl "http://localhost:3007/api/notifications?page=1&limit=10&read=false" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update notification settings
curl -X PUT "http://localhost:3007/api/notifications/settings" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": {
      "sessionReminders": true,
      "paymentNotifications": true,
      "messageAlerts": false
    },
    "push": {
      "sessionReminders": true,
      "paymentNotifications": false,
      "messageAlerts": true
    }
  }'
```

---

## 🚀 Getting Started

### 1. Start Individual Services

```bash
# Start all services
cd backend
npm run dev:all

# Or start individual services
npm run dev:skill-service     # Port 3003
npm run dev:session-service   # Port 3005
npm run dev:payment-service   # Port 3006
npm run dev:notification-service # Port 3007
```

### 2. Health Checks

```bash
curl http://localhost:3003/health  # Skill Service
curl http://localhost:3005/health  # Session Service
curl http://localhost:3006/health  # Payment Service
curl http://localhost:3007/health  # Notification Service
```

### 3. Environment Variables

Ensure these environment variables are set:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/lms_database

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Payment (for production)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## 📊 Service Features Summary

### ✅ Skill Service
- Complete CRUD operations for skills
- Skill categorization and difficulty levels
- Prerequisite and relationship management
- Skill tree visualization
- Learning path generation
- Popular skills tracking
- Advanced search and filtering

### ✅ Session Service
- Comprehensive session lifecycle management
- Real-time session state tracking
- Session scheduling and rescheduling
- Video room integration ready
- Session analytics and reporting
- Multi-participant support
- Cancellation and refund handling

### ✅ Payment Service
- Mock payment processing (Stripe-ready)
- Payment intent creation and confirmation
- Payment method management
- Refund processing
- Invoice generation
- Payment statistics and reporting
- Webhook handling for payment providers

### ✅ Notification Service
- Multi-channel notifications (email, push, in-app)
- Granular notification preferences
- Real-time notification delivery
- Notification history and management
- Push notification subscription management
- Quiet hours and frequency control
- Admin notification broadcasting

---

## 🔄 Integration with Frontend

All services are now ready for frontend integration with:

- **Consistent authentication** using JWT tokens
- **Standardized error handling** with detailed error messages
- **Comprehensive validation** using Joi schemas
- **RESTful API design** following best practices
- **Role-based access control** for different user types
- **Pagination support** for large datasets
- **Real-time capabilities** foundation for future enhancements

The frontend implementation plan can now proceed with full backend support for all major LMS features!