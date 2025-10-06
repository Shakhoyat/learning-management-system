# Learning Management System - Backend API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Service Documentation](#service-documentation)
4. [Getting Started](#getting-started)
5. [Authentication](#authentication)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Testing](#testing)

## Overview

This Learning Management System (LMS) backend follows a **microservices architecture** designed for scalability, maintainability, and fault isolation. Each service is responsible for a specific domain and communicates through well-defined REST APIs.

### Technology Stack
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Caching**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **Process Management**: PM2
- **API Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest

## Architecture

### Service Ports
| Service | Port | Purpose |
|---------|------|---------|
| **Gateway** | `3000` | API Gateway & Load Balancer |
| **Auth Service** | `3001` | Authentication & Authorization |
| **User Service** | `3002` | User Management & Profiles |
| **Skill Service** | `3003` | Skills & Competency Management |
| **Matching Service** | `3004` | AI-Powered Learner-Teacher Matching |
| **Session Service** | `3005` | Learning Session Management |
| **Payment Service** | `3006` | Payment Processing & Billing |
| **Notification Service** | `3007` | Email, SMS & Push Notifications |

### Data Flow
```
Frontend → Gateway (3000) → Service APIs (3001-3007) → MongoDB Atlas
                          ↘ Redis Cache
```

## Service Documentation

### 📖 Detailed Service Guides

1. [**Gateway Service**](./docs/GATEWAY.md) - API routing and load balancing
2. [**Auth Service**](./docs/AUTH_SERVICE.md) - User authentication and authorization
3. [**User Service**](./docs/USER_SERVICE.md) - User profiles and management
4. [**Skill Service**](./docs/SKILL_SERVICE.md) - Skills and competency tracking
5. [**Matching Service**](./docs/MATCHING_SERVICE.md) - AI-powered teacher matching
6. [**Session Service**](./docs/SESSION_SERVICE.md) - Learning session management
7. [**Payment Service**](./docs/PAYMENT_SERVICE.md) - Payment processing
8. [**Notification Service**](./docs/NOTIFICATION_SERVICE.md) - Notification system
9. [**Shared Components**](./docs/SHARED.md) - Common utilities and middleware

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Redis server
- Environment variables configured

### Quick Start
```bash
# Install dependencies for all services
npm run install:all

# Start all services in development mode
npm run dev:all

# Or start with PM2 for production
npm start
```

### Environment Configuration
Copy `.env.example` to `.env` and configure:
```bash
# Database
MONGODB_URI=mongodb+srv://your-connection-string

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# Service URLs (for inter-service communication)
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
# ... etc
```

## Authentication

### JWT Token Structure
All API requests (except public endpoints) require authentication via JWT tokens.

#### Headers
```javascript
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

#### Token Payload
```javascript
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "student|teacher|admin|super_admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### User Roles
- `student` - Can book sessions, leave reviews
- `teacher` - Can offer skills, manage sessions
- `admin` - Platform administration
- `super_admin` - Full system access

## Error Handling

### Standard Error Response
```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)",
  "timestamp": "2025-10-07T00:00:00.000Z"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

### Global Limits
- **Gateway**: 1000 requests per 15 minutes per IP
- **Services**: 100 requests per 15 minutes per IP
- **Matching**: 50 requests per 15 minutes per IP (CPU intensive)

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634567890
```

## Testing

### Running Tests
```bash
# All services
npm run test:all

# Specific service
cd services/auth-service && npm test

# With coverage
npm run test:coverage
```

### API Testing
Use the provided Postman collection or test with curl:
```bash
# Health check
curl http://localhost:3000/health

# Authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

## Development Guidelines

### Code Style
- Use ESLint and Prettier
- Follow REST API conventions
- Implement proper error handling
- Add comprehensive logging
- Write unit tests for all endpoints

### API Design Principles
- RESTful endpoints
- Consistent response format
- Proper HTTP status codes
- Comprehensive input validation
- Rate limiting on all endpoints

---

For detailed implementation guides, refer to the individual service documentation in the `/docs` folder.