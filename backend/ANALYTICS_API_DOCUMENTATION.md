# Analytics API Documentation

## Overview
This document describes all the analytics endpoints available for the Learning Management System frontend.

## Authentication
All analytics endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## User Analytics Endpoints

### 1. Get Comprehensive User Analytics
**Endpoint:** `GET /api/users/analytics`

**Description:** Retrieves comprehensive analytics data for the authenticated user.

**Query Parameters:**
| Parameter | Type | Default | Options | Description |
|-----------|------|---------|---------|-------------|
| `timeframe` | string | `30d` | `7d`, `30d`, `90d`, `1y` | Time period for analytics |
| `metrics` | string | `learning,engagement` | `learning`, `teaching`, `engagement`, `earnings` | Comma-separated metrics to include |

**Request Example:**
```http
GET /api/users/analytics?timeframe=30d&metrics=learning,engagement
Authorization: Bearer <token>
```

**Response Structure:**
```json
{
  "success": true,
  "analytics": {
    "overview": {
      "totalSessions": 45,
      "hoursLearned": 120.5,
      "hoursTaught": 0,
      "averageRating": 4.7,
      "profileViews": 250
    },
    "learningProgress": {
      "skillsInProgress": 3,
      "skillsCompleted": 2,
      "averageProgress": 0.68,
      "timeSpentByCategory": {
        "Programming": 80.5,
        "Design": 25.0,
        "Business": 15.0
      },
      "progressTrend": [
        {
          "date": "2025-10-01T00:00:00.000Z",
          "progress": 0.45
        },
        {
          "date": "2025-10-02T00:00:00.000Z",
          "progress": 0.48
        }
      ]
    },
    "engagement": {
      "loginFrequency": "daily",
      "averageSessionDuration": "2h 30m",
      "messagesExchanged": 145
    }
  }
}
```

**For Tutors** (when `metrics` includes `teaching`):
```json
{
  "teachingPerformance": {
    "studentsAcquired": 15,
    "sessionCompletionRate": 0.94,
    "averageSessionRating": 4.8,
    "earningsByMonth": {
      "2025-09": 1250.00,
      "2025-10": 1500.00
    },
    "popularSkills": [
      {
        "skillId": "skill_id_1",
        "sessionCount": 25
      }
    ]
  }
}
```

---

### 2. Get Learning Progress
**Endpoint:** `GET /api/users/me/progress`

**Description:** Retrieves detailed learning progress for the authenticated user.

**Request Example:**
```http
GET /api/users/me/progress
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "learningSkills": [
      {
        "skill": {
          "_id": "skill_id",
          "name": "JavaScript",
          "category": "Programming"
        },
        "currentLevel": 6,
        "targetLevel": 10,
        "hoursLearned": 45.5,
        "progress": 0.6
      }
    ],
    "totalHours": 120.5,
    "totalSessions": 45,
    "skillsInProgress": 3,
    "averageProgress": 0.68
  }
}
```

---

### 3. Get User Achievements
**Endpoint:** `GET /api/users/me/achievements`

**Description:** Retrieves achievements and gamification progress for the authenticated user.

**Request Example:**
```http
GET /api/users/me/achievements
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "achievements": [
    {
      "id": "first_session",
      "name": "First Steps",
      "description": "Completed your first session",
      "earnedAt": "2025-08-10T14:30:00.000Z",
      "icon": "🎯"
    },
    {
      "id": "ten_sessions",
      "name": "Dedicated Learner",
      "description": "Completed 10 sessions",
      "earnedAt": "2025-09-15T10:00:00.000Z",
      "icon": "🌟"
    }
  ],
  "progress": {
    "totalPoints": 450,
    "currentLevel": 4,
    "pointsToNextLevel": 50
  }
}
```

---

## Session Analytics Endpoints

### 4. Get Session Statistics
**Endpoint:** `GET /api/sessions/statistics`

**Description:** Retrieves session statistics for the authenticated user.

**Request Example:**
```http
GET /api/sessions/statistics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 52,
    "upcoming": 3,
    "completed": 45,
    "cancelled": 4,
    "totalHours": 120.5,
    "averageRating": 4.7
  }
}
```

---

## Implementation Notes

### Backend Implementation Details

#### 1. **Progress Tracking**
The system tracks progress based on:
- Completed sessions per skill
- Time spent learning each skill
- Current level vs target level for each skill
- Session completion rates

#### 2. **Achievement System**
Achievements are awarded based on:
- Total sessions completed (1, 10, 50, 100)
- Total hours learned (10h, 50h, 100h, 500h)
- Perfect ratings received
- Consecutive session streaks

Points are calculated as:
- 10 points per completed session
- Bonus points for achievements
- Level = floor(totalPoints / 100) + 1

#### 3. **Data Aggregation**
Analytics data is aggregated from:
- Session collection (completed, cancelled, upcoming)
- User learning/teaching skills
- Session feedback and ratings
- User activity logs

### Performance Considerations

1. **Caching Strategy:**
   - Analytics data can be cached for 5-10 minutes
   - Invalidate cache on session completion or skill updates

2. **Database Indexes:**
   Required indexes for optimal performance:
   ```javascript
   // Sessions collection
   { learner: 1, status: 1, scheduledStartTime: -1 }
   { tutor: 1, status: 1, scheduledStartTime: -1 }
   { status: 1, scheduledStartTime: -1 }
   
   // Users collection
   { _id: 1, "learningSkills.skillId": 1 }
   { _id: 1, "teachingSkills.skillId": 1 }
   ```

3. **Query Optimization:**
   - Use aggregation pipelines for complex calculations
   - Limit data returned based on timeframe
   - Populate only necessary fields

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes:
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (user or resource doesn't exist)
- `500` - Internal Server Error (server-side issue)

---

## Testing Endpoints

### Using cURL:

```bash
# Get analytics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/users/analytics?timeframe=30d&metrics=learning,engagement"

# Get learning progress
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/users/me/progress"

# Get achievements
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/users/me/achievements"

# Get session stats
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/sessions/statistics"
```

### Using Postman:

1. Create a new request
2. Set method to GET
3. Set URL to endpoint
4. Add header: `Authorization: Bearer <your_token>`
5. Add query parameters as needed
6. Send request

---

## Integration with Frontend

### Service Implementation:

```javascript
// frontend/src/services/analytics.js
import api from './api';

export const analyticsService = {
  getUserAnalytics: async (params = {}) => {
    const response = await api.get('/users/analytics', { params });
    return response.analytics;
  },

  getLearningProgress: async () => {
    const response = await api.get('/users/me/progress');
    return response.progress;
  },

  getAchievements: async () => {
    const response = await api.get('/users/me/achievements');
    return response;
  },

  getSessionStats: async () => {
    const response = await api.get('/sessions/statistics');
    return response.stats;
  },
};
```

### Usage in Components:

```javascript
// In Analytics.jsx
const fetchAnalyticsData = async () => {
  try {
    const [analytics, progress, achievements, sessionStats] = await Promise.all([
      analyticsService.getUserAnalytics({
        timeframe: '30d',
        metrics: 'learning,engagement'
      }),
      analyticsService.getLearningProgress(),
      analyticsService.getAchievements(),
      analyticsService.getSessionStats()
    ]);
    
    setAnalyticsData({ analytics, progress, achievements, sessionStats });
  } catch (error) {
    toast.error('Failed to load analytics');
  }
};
```

---

## Future Enhancements

1. **Real-time Analytics:**
   - WebSocket integration for live updates
   - Real-time progress tracking during sessions

2. **Advanced Metrics:**
   - Learning velocity (progress rate over time)
   - Skill retention rates
   - Peer comparison (anonymized)
   - Recommended study times

3. **Export Functionality:**
   - PDF reports
   - CSV data export
   - Email summaries

4. **Predictive Analytics:**
   - Estimated completion dates
   - Suggested learning paths
   - Optimal session scheduling

---

## Support

For issues or questions about the Analytics API:
- Check the logs at `backend/logs/error.log`
- Verify authentication tokens are valid
- Ensure all required fields are populated in the database
- Check MongoDB indexes are created

## Version History

- **v1.0.0** (2025-10-10): Initial analytics implementation
  - User analytics endpoint
  - Learning progress tracking
  - Achievement system
  - Session statistics
