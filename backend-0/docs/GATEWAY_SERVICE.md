# Gateway Service Documentation

## Overview
The Gateway Service acts as the central entry point for all client requests, providing API routing, load balancing, authentication, rate limiting, and service discovery. It implements the API Gateway pattern for the microservices architecture.

## Service Details
- **Port**: 3000
- **Base URL**: `http://localhost:3000`
- **Role**: API Gateway / Reverse Proxy

## Features
- 🌐 Centralized API routing
- ⚖️ Load balancing across service instances
- 🔐 Authentication and authorization
- 🚦 Rate limiting and throttling
- 📊 Request/response logging and metrics
- 🔄 Service discovery and health checks
- 🛡️ CORS and security headers
- 📈 Analytics and monitoring
- 🔧 Request/response transformation

---

## Architecture

### Service Routing Map

| Route Pattern | Target Service | Port | Description |
|---------------|---------------|------|-------------|
| `/api/auth/*` | Auth Service | 3001 | Authentication & authorization |
| `/api/users/*` | User Service | 3002 | User management |
| `/api/skills/*` | Skill Service | 3003 | Skills & assessments |
| `/api/matching/*` | Matching Service | 3004 | Teacher-student matching |
| `/api/sessions/*` | Session Service | 3005 | Session management |
| `/api/payments/*` | Payment Service | 3006 | Payment processing |
| `/api/notifications/*` | Notification Service | 3007 | Notifications |

### Health Check Endpoints

**GET** `/health`

Gateway health status.

```javascript
{
  "status": "healthy",
  "timestamp": "2025-10-07T14:30:00.000Z",
  "uptime": 86400, // seconds
  "version": "1.0.0",
  "services": {
    "auth-service": {
      "status": "healthy",
      "responseTime": 45, // ms
      "lastCheck": "2025-10-07T14:29:55.000Z"
    },
    "user-service": {
      "status": "healthy",
      "responseTime": 32,
      "lastCheck": "2025-10-07T14:29:55.000Z"
    },
    "skill-service": {
      "status": "healthy",
      "responseTime": 28,
      "lastCheck": "2025-10-07T14:29:55.000Z"
    },
    "matching-service": {
      "status": "degraded",
      "responseTime": 156,
      "lastCheck": "2025-10-07T14:29:55.000Z",
      "issues": ["High response time"]
    },
    "session-service": {
      "status": "healthy",
      "responseTime": 41,
      "lastCheck": "2025-10-07T14:29:55.000Z"
    },
    "payment-service": {
      "status": "healthy",
      "responseTime": 38,
      "lastCheck": "2025-10-07T14:29:55.000Z"
    },
    "notification-service": {
      "status": "healthy",
      "responseTime": 52,
      "lastCheck": "2025-10-07T14:29:55.000Z"
    }
  },
  "database": {
    "status": "connected",
    "responseTime": 12,
    "connections": {
      "active": 15,
      "idle": 5
    }
  },
  "cache": {
    "status": "connected",
    "hitRate": 0.87,
    "memory": {
      "used": "245MB",
      "total": "512MB"
    }
  }
}
```

**GET** `/health/services`

Detailed service health information.

```javascript
{
  "status": "partial",
  "services": [
    {
      "name": "auth-service",
      "url": "http://localhost:3001",
      "status": "healthy",
      "responseTime": 45,
      "lastCheck": "2025-10-07T14:29:55.000Z",
      "instances": [
        {
          "id": "auth-1",
          "url": "http://localhost:3001",
          "status": "healthy",
          "load": 0.23
        }
      ],
      "metrics": {
        "requestsPerMinute": 150,
        "errorRate": 0.02,
        "averageResponseTime": 52
      }
    }
  ],
  "summary": {
    "totalServices": 7,
    "healthyServices": 6,
    "degradedServices": 1,
    "unhealthyServices": 0
  }
}
```

---

## API Gateway Features

### 🔐 Authentication & Authorization

#### Token Validation
All requests are automatically validated for JWT tokens.

```javascript
// Headers required for protected routes
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

#### Role-based Access Control
```javascript
// Route access control examples
{
  "/api/admin/*": ["admin", "super_admin"],
  "/api/payments/admin/*": ["admin", "super_admin"],
  "/api/users/*/profile": ["user", "teacher", "admin", "super_admin"],
  "/api/sessions/*/join": ["student", "teacher"]
}
```

### 🚦 Rate Limiting

#### Default Rate Limits

| User Type | Requests/Minute | Burst Limit |
|-----------|-----------------|-------------|
| Guest | 20 | 5 |
| Student | 100 | 20 |
| Teacher | 150 | 30 |
| Admin | 500 | 100 |

#### Rate Limit Headers
```javascript
// Response headers
{
  "X-RateLimit-Limit": "100",
  "X-RateLimit-Remaining": "87",
  "X-RateLimit-Reset": "1696694400", // Unix timestamp
  "X-RateLimit-Window": "60" // seconds
}
```

#### Rate Limit Exceeded Response
```javascript
{
  "success": false,
  "message": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "data": {
    "limit": 100,
    "window": 60,
    "resetTime": "2025-10-07T14:35:00.000Z",
    "retryAfter": 15 // seconds
  }
}
```

### ⚖️ Load Balancing

#### Service Instance Management

**GET** `/api/gateway/services`

Get current service instances and load distribution.

```javascript
{
  "success": true,
  "data": {
    "services": [
      {
        "name": "auth-service",
        "instances": [
          {
            "id": "auth-1",
            "url": "http://localhost:3001",
            "status": "healthy",
            "load": 0.23,
            "connections": 15,
            "responseTime": 45,
            "uptime": 86400
          }
        ],
        "loadBalancer": {
          "algorithm": "round_robin", // round_robin, least_connections, weighted
          "healthCheckInterval": 30, // seconds
          "failureThreshold": 3
        }
      }
    ]
  }
}
```

#### Load Balancing Algorithms

1. **Round Robin** (Default)
   - Distributes requests evenly across instances
   - Good for services with similar capacity

2. **Least Connections**
   - Routes to instance with fewest active connections
   - Better for long-running requests

3. **Weighted Round Robin**
   - Assigns weights based on instance capacity
   - Handles heterogeneous infrastructure

### 📊 Analytics & Monitoring

#### Request Metrics

**GET** `/api/gateway/metrics`

Get gateway and service metrics.

```javascript
{
  "success": true,
  "data": {
    "gateway": {
      "totalRequests": 158420,
      "requestsPerMinute": 245,
      "averageResponseTime": 156, // ms
      "errorRate": 0.03,
      "uptime": 86400, // seconds
      "memoryUsage": {
        "used": "512MB",
        "total": "1GB",
        "percentage": 50
      },
      "cpuUsage": 0.25
    },
    "services": {
      "auth-service": {
        "totalRequests": 28540,
        "averageResponseTime": 45,
        "errorRate": 0.01,
        "status": "healthy"
      },
      "user-service": {
        "totalRequests": 35280,
        "averageResponseTime": 32,
        "errorRate": 0.02,
        "status": "healthy"
      }
    },
    "endpoints": [
      {
        "path": "/api/auth/login",
        "method": "POST",
        "requests": 1250,
        "averageResponseTime": 89,
        "errorRate": 0.05
      },
      {
        "path": "/api/sessions/create",
        "method": "POST",
        "requests": 450,
        "averageResponseTime": 234,
        "errorRate": 0.01
      }
    ],
    "timeRange": {
      "start": "2025-10-07T13:30:00.000Z",
      "end": "2025-10-07T14:30:00.000Z",
      "duration": 3600 // seconds
    }
  }
}
```

#### Real-time Metrics (WebSocket)

**WebSocket Connection**: `ws://localhost:3000/metrics`

```javascript
// Connect to real-time metrics
const ws = new WebSocket('ws://localhost:3000/metrics');

ws.onmessage = (event) => {
  const metrics = JSON.parse(event.data);
  console.log('Real-time metrics:', metrics);
};

// Example real-time data
{
  "type": "metrics_update",
  "timestamp": "2025-10-07T14:30:15.000Z",
  "data": {
    "requestsPerSecond": 4.2,
    "averageResponseTime": 156,
    "activeConnections": 89,
    "errorRate": 0.03,
    "topEndpoints": [
      {
        "path": "/api/sessions/current",
        "requests": 15,
        "responseTime": 45
      }
    ]
  }
}
```

### 🔧 Request/Response Transformation

#### Request Headers Enhancement
```javascript
// Automatically added headers
{
  "X-Request-ID": "req_507f1f77bcf86cd799439123", // Unique request ID
  "X-Forwarded-For": "192.168.1.100",
  "X-Real-IP": "203.0.113.10",
  "X-User-ID": "507f1f77bcf86cd799439011", // From JWT token
  "X-User-Role": "student",
  "X-Service-Name": "auth-service",
  "X-Gateway-Version": "1.0.0"
}
```

#### Response Headers Enhancement
```javascript
// Automatically added response headers
{
  "X-Request-ID": "req_507f1f77bcf86cd799439123",
  "X-Response-Time": "156ms",
  "X-Service-Name": "auth-service",
  "X-Service-Instance": "auth-1",
  "X-Cache-Status": "MISS", // HIT, MISS, BYPASS
  "X-Gateway-Version": "1.0.0"
}
```

### 🛡️ Security Features

#### CORS Configuration
```javascript
{
  "origin": [
    "http://localhost:3000",
    "https://lms.example.com",
    "https://app.lms.example.com"
  ],
  "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  "allowedHeaders": [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-Request-ID"
  ],
  "credentials": true,
  "maxAge": 86400
}
```

#### Security Headers
```javascript
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

#### IP Whitelisting
```javascript
{
  "allowedIPs": [
    "192.168.1.0/24",   // Local network
    "10.0.0.0/8",       // Internal network
    "203.0.113.0/24"    // Office network
  ],
  "blockedIPs": [
    "198.51.100.50",    // Blocked individual IP
    "192.0.2.0/24"      // Blocked subnet
  ]
}
```

### 🔄 Service Discovery

#### Service Registration

**POST** `/api/gateway/services/register`

Register a new service instance.

```javascript
{
  "name": "auth-service",
  "url": "http://localhost:3001",
  "healthCheckPath": "/health",
  "metadata": {
    "version": "1.2.0",
    "region": "us-east-1",
    "capabilities": ["authentication", "authorization"]
  }
}
```

#### Service Deregistration

**DELETE** `/api/gateway/services/deregister/:instanceId`

Remove a service instance from the registry.

```javascript
{
  "success": true,
  "message": "Service instance deregistered successfully",
  "data": {
    "instanceId": "auth-1",
    "deregisteredAt": "2025-10-07T14:35:00.000Z"
  }
}
```

---

## Configuration

### Environment Variables

```bash
# Gateway Configuration
PORT=3000
NODE_ENV=production

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
SKILL_SERVICE_URL=http://localhost:3003
MATCHING_SERVICE_URL=http://localhost:3004
SESSION_SERVICE_URL=http://localhost:3005
PAYMENT_SERVICE_URL=http://localhost:3006
NOTIFICATION_SERVICE_URL=http://localhost:3007

# Security
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000,https://lms.example.com

# Rate Limiting
RATE_LIMIT_WINDOW=60
RATE_LIMIT_MAX_REQUESTS=100

# Health Check
HEALTH_CHECK_INTERVAL=30
HEALTH_CHECK_TIMEOUT=5000

# Load Balancing
LOAD_BALANCER_ALGORITHM=round_robin
CIRCUIT_BREAKER_THRESHOLD=5
CIRCUIT_BREAKER_TIMEOUT=30000

# Monitoring
METRICS_ENABLED=true
LOGGING_LEVEL=info
```

### Gateway Configuration File

```javascript
// gateway.config.js
module.exports = {
  routes: [
    {
      path: '/api/auth/*',
      target: 'http://localhost:3001',
      changeOrigin: true,
      auth: false, // Auth service itself doesn't need auth
      rateLimit: {
        windowMs: 60000,
        max: 20 // Lower limit for auth endpoints
      }
    },
    {
      path: '/api/users/*',
      target: 'http://localhost:3002',
      changeOrigin: true,
      auth: true,
      rateLimit: {
        windowMs: 60000,
        max: 100
      }
    },
    {
      path: '/api/payments/*',
      target: 'http://localhost:3006',
      changeOrigin: true,
      auth: true,
      roles: ['student', 'teacher', 'admin'],
      rateLimit: {
        windowMs: 60000,
        max: 50 // Lower limit for payment operations
      }
    }
  ],
  security: {
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"]
        }
      }
    },
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: true
    }
  },
  monitoring: {
    metrics: {
      enabled: true,
      endpoint: '/api/gateway/metrics'
    },
    healthCheck: {
      endpoint: '/health',
      interval: 30000
    }
  }
};
```

---

## Error Handling

### Service Unavailable
```javascript
{
  "success": false,
  "message": "Service temporarily unavailable",
  "code": "SERVICE_UNAVAILABLE",
  "data": {
    "service": "matching-service",
    "retryAfter": 30, // seconds
    "alternativeEndpoints": [
      "/api/matching/simple"
    ]
  }
}
```

### Gateway Timeout
```javascript
{
  "success": false,
  "message": "Gateway timeout",
  "code": "GATEWAY_TIMEOUT",
  "data": {
    "timeout": 30000, // ms
    "service": "session-service",
    "requestId": "req_507f1f77bcf86cd799439123"
  }
}
```

### Circuit Breaker Open
```javascript
{
  "success": false,
  "message": "Service circuit breaker is open",
  "code": "CIRCUIT_BREAKER_OPEN",
  "data": {
    "service": "payment-service",
    "failureCount": 5,
    "nextAttempt": "2025-10-07T14:40:00.000Z"
  }
}
```

---

## Integration Examples

### Frontend API Client
```javascript
class APIClient {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('X-RateLimit-Reset');
      throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
    }
    
    // Handle service unavailable
    if (response.status === 503) {
      const data = await response.json();
      throw new Error(`Service unavailable: ${data.message}`);
    }
    
    return response.json();
  }
  
  // Service-specific methods
  async auth(endpoint, data) {
    return this.request(`/api/auth${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async users(endpoint, options) {
    return this.request(`/api/users${endpoint}`, options);
  }
  
  async sessions(endpoint, options) {
    return this.request(`/api/sessions${endpoint}`, options);
  }
}

// Usage
const api = new APIClient();

// Login
const loginResult = await api.auth('/login', {
  email: 'user@example.com',
  password: 'password'
});

// Get user profile
const profile = await api.users('/profile');

// Create session
const session = await api.sessions('/create', {
  method: 'POST',
  body: JSON.stringify(sessionData)
});
```

### Health Check Monitoring
```javascript
const monitorGateway = async () => {
  try {
    const health = await fetch('http://localhost:3000/health');
    const data = await health.json();
    
    if (data.status !== 'healthy') {
      console.warn('Gateway health issue:', data);
      
      // Check individual services
      const serviceHealth = await fetch('http://localhost:3000/health/services');
      const services = await serviceHealth.json();
      
      services.services.forEach(service => {
        if (service.status !== 'healthy') {
          console.error(`Service ${service.name} is ${service.status}`);
          // Implement alerting logic here
        }
      });
    }
  } catch (error) {
    console.error('Gateway health check failed:', error);
    // Implement fallback logic
  }
};

// Check every 30 seconds
setInterval(monitorGateway, 30000);
```

---

This documentation covers the complete Gateway Service functionality. For implementation details, refer to `/gateway/` source code.