# Enhanced User Service Documentation

## Overview
The User Service has been completely enhanced from a basic implementation to a comprehensive user management system. It now provides a full-featured API for user profile management, skills tracking, preferences, and social features.

## Service Details
- **Port**: 3002
- **Base URL**: `http://localhost:3002`
- **API Prefix**: `/api/users`

## Features Added

### ✅ **Complete User Profile Management**
- Detailed user profiles with personal information
- Avatar upload and management
- Location and timezone support
- Multi-language preferences

### ✅ **Comprehensive Skills System**
- Teaching skills with pricing and availability
- Learning skills with progress tracking
- Skill verification system
- Skill recommendations

### ✅ **Advanced Search & Discovery**
- User search with filters
- Teacher discovery
- Public profiles
- Skill-based matching

### ✅ **Analytics & Progress Tracking**
- Learning progress analytics
- Reputation system
- Achievement tracking
- Performance metrics

### ✅ **Social Features**
- User recommendations
- Follow/unfollow system (placeholder)
- Public leaderboards
- Skill distribution analytics

### ✅ **Admin Features**
- User management
- Status updates
- Analytics dashboard
- Bulk operations

## API Endpoints

### **Public Routes (No Authentication)**

#### Health Check
```
GET /health
```

#### Public Statistics
```
GET /api/users/public/stats
GET /api/users/public/search?name=john&skill=react
GET /api/users/public/teachers?skill=javascript&country=US
```

### **User Profile Management (Authentication Required)**

#### Current User
```
GET /api/users/me
PUT /api/users/me
DELETE /api/users/me

GET /api/users/profile
PUT /api/users/profile
```

#### Avatar Management
```
POST /api/users/profile/avatar (multipart/form-data)
DELETE /api/users/profile/avatar
```

### **Skills Management**

#### User Skills
```
GET /api/users/me/skills
PUT /api/users/me/skills

POST /api/users/me/skills/teaching
POST /api/users/me/skills/learning

PUT /api/users/me/skills/teaching/:skillId
PUT /api/users/me/skills/learning/:skillId

DELETE /api/users/me/skills/teaching/:skillId
DELETE /api/users/me/skills/learning/:skillId
```

### **Preferences & Settings**

```
GET /api/users/me/preferences
PUT /api/users/me/preferences

GET /api/users/me/settings
PUT /api/users/me/settings
```

### **Analytics & Progress**

```
GET /api/users/me/progress
GET /api/users/me/analytics
GET /api/users/me/achievements
GET /api/users/me/reputation
```

### **Search & Discovery**

```
GET /api/users/search?name=john&skill=react&country=US
GET /api/users/teachers/search?skill=javascript&minRating=4
GET /api/users/recommendations?type=teachers&limit=10
```

### **Social Features**

```
GET /api/users/me/followers
GET /api/users/me/following
POST /api/users/follow/:userId
DELETE /api/users/follow/:userId
```

### **Public User Profiles**

```
GET /api/users/:userId
GET /api/users/:userId/public-profile
GET /api/users/:userId/skills
GET /api/users/:userId/teaching-skills
GET /api/users/:userId/reviews
```

### **Statistics & Leaderboards**

```
GET /api/users/stats/leaderboard?type=reputation&limit=20
GET /api/users/stats/popular-teachers?skill=react&limit=10
GET /api/users/stats/skill-distribution
```

### **Admin Routes (Admin Role Required)**

```
GET /api/users/admin/all
PUT /api/users/admin/:userId/status
GET /api/users/admin/analytics
DELETE /api/users/admin/:userId
```

## Request/Response Examples

### Create Teaching Skill
```javascript
POST /api/users/me/skills/teaching
{
  "skillId": "507f1f77bcf86cd799439012",
  "level": 8,
  "hourlyRate": 50,
  "hoursPerWeek": 20,
  "availability": {
    "preferredTimeSlots": [
      {
        "day": "monday",
        "startTime": "09:00",
        "endTime": "17:00"
      }
    ]
  }
}
```

### Update Profile
```javascript
PUT /api/users/profile
{
  "name": "John Doe",
  "bio": "Experienced React developer and teacher",
  "timezone": "America/New_York",
  "languages": ["English", "Spanish"],
  "location": {
    "country": "United States",
    "city": "New York",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }
}
```

### Search Teachers
```javascript
GET /api/users/teachers/search?skill=react&minRating=4&country=US&page=1&limit=20

Response:
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "507f1f77bcf86cd799439011",
        "personal": {
          "name": "Jane Smith",
          "avatar": "https://...",
          "location": {
            "country": "United States",
            "city": "San Francisco"
          }
        },
        "skills": {
          "teaching": [...]
        },
        "reputation": {
          "score": 4.8,
          "teachingStats": {
            "averageRating": 4.9,
            "totalSessions": 150
          }
        }
      }
    ],
    "pagination": {
      "total": 45,
      "totalPages": 3,
      "currentPage": 1,
      "pageSize": 20,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Validation & Security

### Input Validation
- All endpoints use Joi validation schemas
- File upload size limits (5MB for avatars)
- Data type and format validation
- Required field validation

### Security Features
- JWT authentication middleware
- Role-based authorization
- Rate limiting (configurable per endpoint)
- CORS protection
- Helmet security headers
- Input sanitization

### Error Handling
- Comprehensive error handling middleware
- Detailed error messages in development
- Generic error messages in production
- Proper HTTP status codes
- Error logging

## Database Integration

### User Model Enhancements
The service uses the existing comprehensive User model with:
- Personal information (name, email, avatar, location)
- Authentication data (password hash, tokens)
- Skills (teaching and learning with detailed tracking)
- Reputation system (scores, badges, reviews)
- Preferences and settings
- Social features data

### Indexes
- Email index for fast user lookup
- Skills indexes for matching queries
- Location geo-spatial index
- Reputation score index for leaderboards

## File Upload Support

### Avatar Management
- Cloudinary integration for cloud storage
- Local storage fallback
- Image processing and optimization
- Secure file deletion

### Supported Formats
- Image files only (JPEG, PNG, GIF, WebP)
- Maximum size: 5MB
- Automatic format optimization

## Performance Optimizations

### Database Queries
- Efficient pagination
- Selective field projection
- Proper indexing strategy
- Aggregation pipelines for analytics

### Caching Strategy
- Ready for Redis integration
- Query result caching
- User session caching
- Popular data caching

### Rate Limiting
- General API: 100 requests/15 minutes
- Profile updates: 10 requests/15 minutes  
- Search: 30 requests/minute
- File uploads: Separate limits

## Testing

### Test Coverage
- Unit tests for all major functions
- Integration tests for API endpoints
- Error handling tests
- Authentication tests

### Test Commands
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Deployment

### Environment Variables
```bash
NODE_ENV=production
USER_SERVICE_PORT=3002
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=your-cloud
FRONTEND_URL=https://your-domain.com
```

### Production Considerations
- SSL/TLS encryption
- Environment-specific configurations
- Monitoring and logging
- Load balancing support
- Database connection pooling

## Integration with Other Services

### Auth Service Integration
- JWT token validation
- User authentication flow
- Password management delegation

### Matching Service Integration
- User skill data for teacher matching
- Preference data for compatibility scoring
- Availability information

### Future Integrations
- Session Service: For booking management
- Payment Service: For earnings tracking
- Notification Service: For user alerts

## Migration from Basic Implementation

The enhanced service is backward compatible with the basic implementation:

### Preserved Endpoints
- `GET /health` - Enhanced with more details
- `GET /api/users` - Now requires authentication and returns paginated results

### New Capabilities
- 30+ new endpoints
- Comprehensive user management
- Advanced search and filtering
- Analytics and reporting
- File upload support
- Social features

## Next Steps

1. **Start the Enhanced Service**:
   ```bash
   cd backend/services/user-service
   npm start
   ```

2. **Test the Endpoints**:
   - Use the health check to verify service is running
   - Test public endpoints without authentication
   - Use JWT tokens from auth service for protected endpoints

3. **Frontend Integration**:
   - Update frontend API calls to use new endpoints
   - Implement user profile management UI
   - Add skill management interfaces
   - Create search and discovery features

This enhanced User Service provides a solid foundation for the frontend implementation plan and creates a comprehensive user management system that can scale with the application's needs.