# Analytics Connection Fix Summary

## Issue Identified
Frontend analytics page was showing "Failed to load data, server error" due to:
1. **Route Order Problem**: Analytics routes in `backend/src/routes/users.js` were placed AFTER the `/:id` route, causing Express to treat "analytics", "me" as user IDs
2. **Endpoint Path Mismatch**: Session stats endpoint was `/stats` but frontend was calling `/statistics`
3. **Response Format Issues**: Minor inconsistencies in how response data was being extracted

## Fixes Applied

### 1. Backend Route Order Fix (`backend/src/routes/users.js`)
**CRITICAL**: Specific routes MUST come before parameterized routes in Express.

```javascript
// ✅ CORRECT ORDER - Specific routes FIRST
router.get("/analytics", authenticate, userController.getUserAnalytics);
router.get("/me/progress", authenticate, userController.getLearningProgress);
router.get("/me/achievements", authenticate, userController.getAchievements);

// Then generic routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.get("/:id/stats", userController.getUserStats);
```

**Why this matters**: Express matches routes in order. If `/:id` comes first, it will match `/analytics` thinking "analytics" is an ID.

### 2. Analytics Service Endpoint Fix (`frontend/src/services/analytics.js`)

```javascript
// Fixed endpoint path
getSessionStats: async () => {
  const response = await api.get("/sessions/stats");  // Was: /sessions/statistics
  return response.stats;
},

// Fixed achievements response extraction
getAchievements: async () => {
  const response = await api.get("/users/me/achievements");
  return response.achievements;  // Was: return response;
},
```

## API Endpoint Reference

### User Analytics Endpoints
All require authentication (`Bearer <token>` in Authorization header)

#### 1. Get User Analytics
```
GET /api/users/analytics?timeframe=30d&metrics=learning,engagement
```

**Query Parameters:**
- `timeframe`: `7d` | `30d` | `90d` | `1y` (default: `30d`)
- `metrics`: Comma-separated list
  - For learners: `learning,engagement`
  - For tutors: `teaching,engagement,earnings`

**Response:**
```json
{
  "success": true,
  "analytics": {
    "overview": {
      "totalSessions": 25,
      "hoursLearned": 37.5,
      "averageRating": 4.7,
      "profileViews": 234
    },
    "learningProgress": {
      "skillsInProgress": 3,
      "skillsCompleted": 2,
      "averageProgress": 0.65,
      "timeSpentByCategory": {
        "Programming": 20.5,
        "Data Science": 17.0
      },
      "progressTrend": [
        { "date": "2025-09-10T00:00:00.000Z", "progress": 0.45 },
        { "date": "2025-09-17T00:00:00.000Z", "progress": 0.52 }
      ]
    },
    "engagement": {
      "loginFrequency": "daily",
      "averageSessionDuration": "1h 30m",
      "messagesExchanged": 145
    }
  }
}
```

#### 2. Get Learning Progress
```
GET /api/users/me/progress
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "skills": [
      {
        "skill": { "_id": "...", "name": "Python", "category": "Programming" },
        "currentLevel": 6,
        "targetLevel": 10,
        "hoursLearned": 25.5,
        "progress": 0.6,
        "status": "in_progress"
      }
    ],
    "overall": {
      "totalHours": 37.5,
      "averageProgress": 0.65,
      "skillsInProgress": 3,
      "skillsCompleted": 2
    }
  }
}
```

#### 3. Get Achievements
```
GET /api/users/me/achievements
```

**Response:**
```json
{
  "success": true,
  "achievements": {
    "level": 5,
    "points": 1275,
    "nextLevelAt": 1500,
    "badges": [
      {
        "id": "first_session",
        "name": "First Session",
        "description": "Completed your first learning session",
        "icon": "🎯",
        "earnedAt": "2025-08-15T14:30:00.000Z"
      }
    ],
    "milestones": {
      "sessionsCompleted": 25,
      "hoursLearned": 37.5,
      "skillsMastered": 2,
      "perfectRatings": 5
    }
  }
}
```

### Session Statistics Endpoint

#### Get Session Stats
```
GET /api/sessions/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 30,
    "upcoming": 5,
    "completed": 22,
    "cancelled": 3,
    "totalHours": 33.5,
    "averageRating": 4.7
  }
}
```

## Frontend Configuration

### Vite Proxy Setup (`frontend/vite.config.js`)
```javascript
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",  // Backend server
        changeOrigin: true,
      },
    },
  },
});
```

**This means:**
- Frontend runs on: `http://localhost:5173` (Vite default)
- Backend runs on: `http://localhost:3000`
- API calls to `/api/*` are proxied to backend

### API Service Setup (`frontend/src/services/api.js`)
```javascript
const API_BASE_URL = "/api";  // Uses Vite proxy

// Auth token from localStorage
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
```

## Testing the Connection

### 1. Start Backend Server
```powershell
cd backend
npm run dev
```

**Expected output:**
```
🚀 Learning Management System Backend running on port 3000
📊 Health check: http://localhost:3000/health
🔗 API Base URL: http://localhost:3000/api
```

### 2. Start Frontend Server
```powershell
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 3. Test Analytics Endpoints Manually

**Using Browser Console (after login):**
```javascript
// Get access token
const token = localStorage.getItem('accessToken');

// Test analytics endpoint
fetch('/api/users/analytics?timeframe=30d&metrics=learning,engagement', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(console.log);

// Test session stats
fetch('/api/sessions/stats', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(console.log);
```

**Using PowerShell:**
```powershell
# Set your token
$token = "your_access_token_here"

# Test analytics
Invoke-RestMethod -Uri "http://localhost:3000/api/users/analytics?timeframe=30d" `
  -Headers @{"Authorization"="Bearer $token"} `
  -Method Get

# Test session stats
Invoke-RestMethod -Uri "http://localhost:3000/api/sessions/stats" `
  -Headers @{"Authorization"="Bearer $token"} `
  -Method Get
```

## Common Troubleshooting

### Error: "Failed to load data, server error"

**Possible causes:**
1. ✅ Backend not running → Start with `npm run dev`
2. ✅ Not logged in → Check `localStorage.getItem('accessToken')`
3. ✅ Wrong port → Backend should be on 3000, frontend on 5173
4. ✅ CORS issues → Backend has CORS enabled for `http://localhost:5173`

### Error: 401 Unauthorized

**Fix:**
- Ensure you're logged in
- Check token exists: `localStorage.getItem('accessToken')`
- Token might be expired → Login again

### Error: 404 Not Found

**Fix:**
- Check route order in `backend/src/routes/users.js`
- Specific routes MUST be before `/:id` routes
- Verify endpoint paths match between frontend service and backend routes

### Error: Cannot read property 'map' of undefined

**Fix:**
- Backend might be returning empty data
- Check if user has sessions/skills in database
- Analytics page handles null/undefined with optional chaining (`?.`)

## Database Requirements

For analytics to show meaningful data, ensure MongoDB has:

1. **User document** with:
   - `learningSkills` array (for learners)
   - `teachingSkills` array (for tutors)
   - `reputation` stats

2. **Session documents** with:
   - `status`: "scheduled", "completed", "cancelled"
   - `learner` and `tutor` references
   - `scheduledStartTime` dates
   - `actualDuration` or `scheduledDuration`
   - `feedback` with ratings

3. **Skill documents** referenced in sessions

### Seed Database (Optional)
```powershell
cd backend
node seed-database.js
```

## Next Steps

1. ✅ **Routes fixed** - Analytics endpoints now accessible
2. ✅ **Service updated** - Correct endpoint paths
3. ✅ **Response handling** - Proper data extraction

**To verify:**
1. Start both servers (backend + frontend)
2. Login to the application
3. Navigate to Analytics page (`/analytics`)
4. Check browser console for any errors
5. Verify charts are rendering with data

## Production Checklist

Before deploying:
- [ ] Update `FRONTEND_URL` in backend `.env`
- [ ] Configure production CORS origins
- [ ] Set up proper authentication token refresh
- [ ] Add error tracking (e.g., Sentry)
- [ ] Enable API rate limiting per user
- [ ] Add response caching for analytics (5-10 min TTL)
- [ ] Monitor API performance and query times
- [ ] Set up database indexes (already done)
