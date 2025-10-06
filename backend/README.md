# Learning Management System - Backend

## Microservices Architecture Overview

This backend follows a microservices architecture pattern with the following services:

### Services

1. **Auth Service** - Authentication and authorization
2. **User Service** - User management and profiles
3. **Skill Service** - Skills and competency management
4. **Matching Service** - Learner-tutor matching algorithms
5. **Session Service** - Learning session management
6. **Payment Service** - Payment processing and billing
7. **Notification Service** - Email, SMS, and push notifications

### Core Components

- **Gateway** - API Gateway for routing and load balancing
- **Shared** - Common utilities, middleware, and configurations
- **Workers** - Background job processors

## Project Structure

```
backend/
├── services/                  # Microservices
│   ├── auth-service/
│   ├── user-service/
│   ├── skill-service/
│   ├── matching-service/
│   ├── session-service/
│   ├── payment-service/
│   └── notification-service/
├── shared/                    # Shared components
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   ├── database/
│   ├── events/
│   ├── validators/
│   ├── types/
│   ├── constants/
│   ├── logger/
│   └── cache/
├── gateway/                   # API Gateway
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── proxy/
│   └── tests/
└── workers/                   # Background workers
    ├── src/
    │   ├── email-worker/
    │   ├── payment-processor/
    │   ├── analytics-worker/
    │   └── data-sync/
    └── tests/
```

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Message Queue**: Redis
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Process Management**: PM2

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Community Server
- Redis Server
- npm or yarn package manager

### Local Installation

#### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/)

#### 2. Install MongoDB
- Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
- Follow the installation guide for your operating system
- Start MongoDB service:
  ```bash
  # Windows (if installed as service)
  net start MongoDB
  
  # Manual start
  mongod --dbpath C:\data\db
  ```

#### 3. Install Redis
- **Windows**: Download Redis from [github.com/microsoftarchive/redis](https://github.com/microsoftarchive/redis/releases)
- **Alternative**: Use Windows Subsystem for Linux (WSL) and install Redis on Ubuntu
- Start Redis server:
  ```bash
  redis-server
  ```

#### 4. Clone and Setup Project
```bash
git clone <repository-url>
cd learning-management-system/backend
```

#### 5. Install Dependencies for Each Service
```bash
# Install dependencies for all services
cd services/auth-service && npm install && cd ../..
cd services/user-service && npm install && cd ../..
cd services/skill-service && npm install && cd ../..
cd services/matching-service && npm install && cd ../..
cd services/session-service && npm install && cd ../..
cd services/payment-service && npm install && cd ../..
cd services/notification-service && npm install && cd ../..
cd gateway && npm install && cd ..
cd workers && npm install && cd ..
cd shared && npm install && cd ..
```

#### 6. Environment Setup
Create `.env` files for each service with appropriate configuration (see `.env.example` files)

#### 7. Start Services
```bash
# Start each service in separate terminals
cd services/auth-service && npm run dev
cd services/user-service && npm run dev
cd services/skill-service && npm run dev
cd services/matching-service && npm run dev
cd services/session-service && npm run dev
cd services/payment-service && npm run dev
cd services/notification-service && npm run dev
cd gateway && npm run dev
```

### Development

Each service runs independently on different ports:
- Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- User Service: http://localhost:3002
- Skill Service: http://localhost:3003
- Matching Service: http://localhost:3004
- Session Service: http://localhost:3005
- Payment Service: http://localhost:3006
- Notification Service: http://localhost:3007

### Production Deployment

For production, consider using PM2 for process management:
```bash
# Install PM2 globally
npm install -g pm2

# Start all services with PM2
pm2 start ecosystem.config.js
```