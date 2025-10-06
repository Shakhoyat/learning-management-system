# Matching Service Documentation

## Overview
The Matching Service is the AI-powered core of the LMS that connects learners with the most suitable teachers based on skills, preferences, availability, and compatibility factors.

## Service Details
- **Port**: 3004
- **Base URL**: `http://localhost:3004`
- **API Prefix**: `/api/matching`

## Features
- 🤖 AI-powered teacher-learner matching
- 📊 Real-time compatibility scoring
- 🎯 Skill-based recommendations
- 📈 Matching analytics and insights
- 🔄 Batch processing for multiple skills
- ⚡ Redis caching for performance

## API Endpoints

### Authentication Required
All endpoints require valid JWT token in Authorization header.

---

### 🔍 Find Teachers

**POST** `/api/matching/find-teachers`

Find the best teachers for a specific skill.

#### Request Body
```javascript
{
  "skillId": "string", // Required: MongoDB ObjectId
  "preferences": {
    "maxPrice": 50.00,        // Optional: Maximum hourly rate
    "preferredLanguages": ["English", "Spanish"],
    "timeZone": "UTC-5",      // Optional: Preferred time zone
    "availabilityTimes": ["morning", "evening"],
    "teachingStyle": "interactive", // casual, formal, interactive
    "experienceLevel": "intermediate", // beginner, intermediate, expert
    "location": "online"      // online, in-person, hybrid
  }
}
```

#### Response
```javascript
{
  "success": true,
  "data": {
    "matches": [
      {
        "teacherId": "string",
        "teacherInfo": {
          "name": "John Doe",
          "avatar": "https://...",
          "languages": ["English", "Spanish"],
          "location": "New York, NY",
          "verified": true
        },
        "skillInfo": {
          "experienceYears": 5,
          "rating": 4.8,
          "studentsCount": 120,
          "hourlyRate": 45.00,
          "availability": ["Monday 9-12", "Friday 14-17"]
        },
        "matchingScore": {
          "overall": 0.92,
          "breakdown": {
            "skillMatch": 0.95,
            "priceMatch": 0.88,
            "availabilityMatch": 0.94,
            "compatibilityScore": 0.91
          }
        },
        "reasons": [
          "Excellent skill match for JavaScript",
          "Price within your budget",
          "Available during your preferred times"
        ]
      }
    ],
    "totalCount": 15,
    "filters": {
      "appliedFilters": ["price", "language", "availability"],
      "availableFilters": ["experience", "rating", "location"]
    }
  },
  "timestamp": "2025-10-07T00:00:00.000Z"
}
```

---

### 🎯 Skill Recommendations

**GET** `/api/matching/skill-recommendations`

Get personalized skill recommendations based on user profile.

#### Query Parameters
- `limit` (integer, default: 10) - Number of recommendations
- `category` (string) - Filter by skill category

#### Response
```javascript
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "skillId": "string",
        "skillName": "React Native Development",
        "category": "Mobile Development",
        "description": "Build mobile apps with React Native",
        "difficulty": "intermediate",
        "estimatedLearningTime": "3-4 weeks",
        "averagePrice": 40.00,
        "availableTeachers": 25,
        "demandScore": 0.85,
        "careerRelevance": 0.92,
        "matchScore": 0.88,
        "reasons": [
          "Builds on your existing React knowledge",
          "High demand in job market",
          "Complements your web development skills"
        ]
      }
    ],
    "totalCount": 10,
    "userProfile": {
      "currentSkills": 8,
      "experienceLevel": "intermediate",
      "primaryCategories": ["Web Development", "JavaScript"]
    }
  }
}
```

---

### 🎯 Compatibility Score

**POST** `/api/matching/compatibility-score`

Calculate detailed compatibility between a learner and teacher for a specific skill.

#### Request Body
```javascript
{
  "teacherId": "string", // Required
  "skillId": "string"    // Required
}
```

#### Response
```javascript
{
  "success": true,
  "data": {
    "compatibilityScore": 0.89,
    "breakdown": {
      "skillMatch": {
        "score": 0.92,
        "factors": [
          "Teacher has 5 years experience in this skill",
          "Highly rated by previous students",
          "Specializes in beginner to intermediate level"
        ]
      },
      "teachingStyleMatch": {
        "score": 0.85,
        "factors": [
          "Interactive teaching style matches your preference",
          "Uses practical projects in teaching"
        ]
      },
      "scheduleCompatibility": {
        "score": 0.91,
        "factors": [
          "Available during your preferred times",
          "Same time zone"
        ]
      },
      "communicationMatch": {
        "score": 0.88,
        "factors": [
          "Speaks your preferred language",
          "Good communication ratings"
        ]
      }
    },
    "recommendation": "Highly Compatible",
    "confidence": "high"
  }
}
```

---

### 📦 Batch Matching

**POST** `/api/matching/batch-match`

Find teachers for multiple skills in a single request.

#### Request Body
```javascript
{
  "skillIds": ["skill1", "skill2", "skill3"], // Max 10 skills
  "preferences": {
    // Same as find-teachers preferences
  }
}
```

#### Response
```javascript
{
  "success": true,
  "data": {
    "results": [
      {
        "skillId": "skill1",
        "success": true,
        "matches": [], // Top 5 matches for this skill
        "count": 15
      },
      {
        "skillId": "skill2",
        "success": false,
        "error": "No teachers available for this skill",
        "matches": [],
        "count": 0
      }
    ],
    "summary": {
      "totalSkills": 3,
      "successfulMatches": 2,
      "failedMatches": 1,
      "totalTeachersFound": 42
    }
  }
}
```

---

### 📊 Analytics (Admin Only)

**GET** `/api/matching/analytics`

Get matching analytics and insights.

#### Query Parameters
- `timeframe` (string, default: "7d") - 7d, 30d, 90d

#### Response
```javascript
{
  "success": true,
  "data": {
    "overview": {
      "totalMatches": 1250,
      "successfulConnections": 892,
      "averageMatchingScore": 0.84,
      "topSkillCategories": ["Programming", "Design", "Languages"]
    },
    "trends": {
      "matchingTrends": [
        {"date": "2025-10-01", "matches": 45, "success_rate": 0.78},
        {"date": "2025-10-02", "matches": 52, "success_rate": 0.82}
      ],
      "popularSkills": [
        {"skill": "JavaScript", "requests": 125, "fulfillment_rate": 0.89},
        {"skill": "Python", "requests": 98, "fulfillment_rate": 0.95}
      ]
    },
    "performance": {
      "averageResponseTime": "120ms",
      "cacheHitRate": 0.76,
      "aiModelAccuracy": 0.91
    }
  }
}
```

---

### ⚙️ Update Algorithm Weights (Admin Only)

**PUT** `/api/matching/algorithm-weights`

Update the weights used in the matching algorithm.

#### Request Body
```javascript
{
  "weights": {
    "contentBased": 0.4,    // Content-based filtering weight
    "collaborative": 0.3,   // Collaborative filtering weight
    "availability": 0.15,   // Availability matching weight
    "realTime": 0.15        // Real-time factors weight
  }
}
```

Note: All weights must sum to 1.0

#### Response
```javascript
{
  "success": true,
  "message": "Algorithm weights updated successfully",
  "data": {
    "oldWeights": { /* previous weights */ },
    "newWeights": { /* updated weights */ },
    "effectiveFrom": "2025-10-07T00:00:00.000Z"
  }
}
```

---

## Health & Status Endpoints

### Health Check
**GET** `/health`
```javascript
{
  "success": true,
  "message": "Matching service is healthy",
  "timestamp": "2025-10-07T00:00:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### Service Status
**GET** `/api/matching/status`
```javascript
{
  "success": true,
  "data": {
    "service": "matching-service",
    "status": "operational",
    "timestamp": "2025-10-07T00:00:00.000Z",
    "components": {
      "matchingEngine": "operational",
      "database": "operational",
      "cache": "operational",
      "mlModel": "loading"
    },
    "metrics": {
      "uptime": 3600,
      "memoryUsage": { /* memory stats */ },
      "cpuUsage": { /* cpu stats */ }
    }
  }
}
```

---

## Error Responses

### Common Errors

#### 400 - Bad Request
```javascript
{
  "success": false,
  "message": "Skill ID is required",
  "timestamp": "2025-10-07T00:00:00.000Z"
}
```

#### 401 - Unauthorized
```javascript
{
  "success": false,
  "message": "Authentication required",
  "timestamp": "2025-10-07T00:00:00.000Z"
}
```

#### 429 - Rate Limited
```javascript
{
  "success": false,
  "message": "Too many matching requests, please try again later",
  "retryAfter": 900
}
```

---

## Rate Limiting

- **Matching Requests**: 50 requests per 15 minutes per IP
- **Analytics**: 10 requests per 15 minutes per IP
- **Batch Operations**: 5 requests per 15 minutes per IP

---

## Caching Strategy

### Redis Cache Keys
- `matching:teachers:{skillId}` - Cached teacher list for skill
- `matching:user:{userId}:profile` - User matching profile
- `matching:compatibility:{userId}:{teacherId}` - Compatibility scores
- `matching:recommendations:{userId}` - Skill recommendations

### Cache TTL
- Teacher lists: 1 hour
- User profiles: 30 minutes  
- Compatibility scores: 24 hours
- Recommendations: 2 hours

---

## Algorithm Details

### Matching Algorithm Components

1. **Content-Based Filtering (40% weight)**
   - Skill similarity analysis
   - Teaching experience matching
   - Price range compatibility

2. **Collaborative Filtering (30% weight)**
   - User behavior patterns
   - Similar user preferences
   - Historical success rates

3. **Availability Matching (15% weight)**
   - Time zone alignment
   - Schedule compatibility
   - Preferred time slots

4. **Real-Time Factors (15% weight)**
   - Current online status
   - Response time history
   - Recent activity levels

### Machine Learning Model

The service uses TensorFlow.js for advanced pattern recognition:
- **Model Type**: Neural Network with embedding layers
- **Training Data**: Historical matching success rates
- **Features**: 50+ user and teacher characteristics
- **Accuracy**: ~91% prediction accuracy

---

## Performance Considerations

### Optimization Features
- Redis caching for frequently accessed data
- Async/await for non-blocking operations
- Database query optimization with indexes
- Response compression
- Rate limiting to prevent abuse

### Scalability
- Horizontal scaling support
- Stateless design for load balancing
- Background job processing for heavy computations
- Database connection pooling

---

## Integration Examples

### Frontend Integration
```javascript
// Find teachers for JavaScript skill
const response = await fetch('/api/matching/find-teachers', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    skillId: 'javascript-skill-id',
    preferences: {
      maxPrice: 50,
      preferredLanguages: ['English'],
      timeZone: 'UTC-5'
    }
  })
});

const { data } = await response.json();
console.log(`Found ${data.totalCount} teachers`);
```

### Service-to-Service Communication
```javascript
// From Session Service - get compatibility before booking
const compatibility = await matchingService.getCompatibility(
  learnerId,
  teacherId,
  skillId
);

if (compatibility.score > 0.8) {
  // Proceed with session booking
}
```

---

This documentation covers all aspects of the Matching Service. For implementation details, refer to the source code in `/services/matching-service/`.