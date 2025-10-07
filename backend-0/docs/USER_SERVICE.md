# User Service Documentation

## Overview
The User Service manages all user-related operations including profile management, skill tracking, preferences, and user data analytics. It serves as the central hub for user information across the platform.

## Service Details
- **Port**: 3002
- **Base URL**: `http://localhost:3002`
- **API Prefix**: `/api/users`

## Features
- 👤 Complete user profile management
- 🎯 Skills and competency tracking
- 📊 Learning progress analytics
- 🔍 Advanced user search and filtering
- 📁 Document and file management
- ⚙️ User preferences and settings
- 📈 Achievement and badge system
- 🌐 Multi-language support

## API Endpoints

### Authentication Required
All endpoints require valid JWT token unless specified otherwise.

---

### 👤 Profile Management

#### Get User Profile

**GET** `/api/users/profile`

Get current user's complete profile.

##### Response
```javascript
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "role": "student",
      "personal": {
        "name": {
          "first": "John",
          "last": "Doe",
          "display": "John D."
        },
        "avatar": "https://cdn.example.com/avatars/user123.jpg",
        "bio": "Passionate learner interested in web development",
        "phone": "+1234567890",
        "dateOfBirth": "1990-01-01",
        "gender": "male",
        "languages": ["English", "Spanish"],
        "timezone": "America/New_York",
        "location": {
          "country": "United States",
          "state": "New York",
          "city": "New York",
          "coordinates": {
            "lat": 40.7128,
            "lng": -74.0060
          }
        }
      },
      "skills": {
        "learning": [
          {
            "skillId": "507f1f77bcf86cd799439012",
            "skillName": "React.js",
            "level": "beginner",
            "progress": 0.35,
            "startedAt": "2025-01-15T00:00:00.000Z",
            "targetCompletionDate": "2025-03-15T00:00:00.000Z"
          }
        ],
        "teaching": [
          {
            "skillId": "507f1f77bcf86cd799439013",
            "skillName": "JavaScript",
            "level": "expert",
            "experience": 5,
            "certifications": ["MongoDB Certified Developer"],
            "hourlyRate": 45.00,
            "availability": ["Monday 9-12", "Friday 14-17"],
            "studentsCount": 25,
            "rating": 4.8
          }
        ]
      },
      "preferences": {
        "learningStyle": "visual",
        "communicationStyle": "direct",
        "availability": {
          "timezone": "America/New_York",
          "schedule": {
            "monday": ["09:00-12:00", "14:00-17:00"],
            "tuesday": ["10:00-16:00"],
            "friday": ["09:00-11:00"]
          }
        },
        "notifications": {
          "email": true,
          "sms": false,
          "push": true,
          "sessionReminders": true,
          "marketingEmails": false
        }
      },
      "stats": {
        "sessionsCompleted": 15,
        "hoursLearned": 45.5,
        "hoursTaught": 120.0,
        "averageRating": 4.7,
        "achievements": ["First Session", "5 Sessions Completed"],
        "badges": ["JavaScript Enthusiast", "Helpful Teacher"]
      },
      "metadata": {
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-10-07T00:00:00.000Z",
        "lastActiveAt": "2025-10-07T00:00:00.000Z",
        "profileCompleteness": 0.85
      }
    }
  }
}
```

#### Update User Profile

**PUT** `/api/users/profile`

Update user profile information.

##### Request Body
```javascript
{
  "personal": {
    "name": {
      "first": "John",
      "last": "Doe",
      "display": "Johnny"
    },
    "bio": "Updated bio text here",
    "phone": "+1234567890",
    "languages": ["English", "French"],
    "timezone": "America/New_York",
    "location": {
      "country": "United States",
      "state": "California",
      "city": "San Francisco"
    }
  },
  "preferences": {
    "learningStyle": "hands-on",
    "communicationStyle": "casual",
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    }
  }
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* Updated user object */ },
    "changes": ["personal.bio", "personal.location", "preferences.learningStyle"]
  }
}
```

---

### 📷 Avatar Management

#### Upload Avatar

**POST** `/api/users/avatar`

Upload user profile picture.

##### Request
- Content-Type: `multipart/form-data`
- File field: `avatar`
- Supported formats: JPG, PNG, GIF
- Max size: 5MB

##### Response
```javascript
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatarUrl": "https://cdn.example.com/avatars/user123_1638360000.jpg",
    "thumbnailUrl": "https://cdn.example.com/avatars/thumbnails/user123_1638360000.jpg"
  }
}
```

#### Delete Avatar

**DELETE** `/api/users/avatar`

Remove user's current avatar.

##### Response
```javascript
{
  "success": true,
  "message": "Avatar removed successfully",
  "data": {
    "avatarUrl": null,
    "defaultAvatar": "https://cdn.example.com/avatars/default.png"
  }
}
```

---

### 🎯 Skills Management

#### Get User Skills

**GET** `/api/users/skills`

Get user's learning and teaching skills.

##### Query Parameters
- `type` (string) - Filter by skill type: `learning`, `teaching`, or `all` (default)
- `category` (string) - Filter by skill category
- `level` (string) - Filter by skill level

##### Response
```javascript
{
  "success": true,
  "data": {
    "learning": [
      {
        "skillId": "507f1f77bcf86cd799439012",
        "skillName": "React.js",
        "category": "Web Development",
        "level": "beginner",
        "progress": 0.35,
        "sessionsCompleted": 3,
        "hoursSpent": 12.5,
        "startedAt": "2025-01-15T00:00:00.000Z",
        "targetDate": "2025-03-15T00:00:00.000Z",
        "currentTeacher": {
          "id": "507f1f77bcf86cd799439020",
          "name": "Jane Smith",
          "avatar": "https://...",
          "rating": 4.9
        }
      }
    ],
    "teaching": [
      {
        "skillId": "507f1f77bcf86cd799439013",
        "skillName": "JavaScript",
        "category": "Programming",
        "level": "expert",
        "experience": 5,
        "hourlyRate": 45.00,
        "studentsCount": 25,
        "rating": 4.8,
        "totalEarnings": 2250.00,
        "certifications": ["MongoDB Certified Developer"],
        "availability": ["Monday 9-12", "Friday 14-17"]
      }
    ],
    "stats": {
      "totalLearningSkills": 3,
      "totalTeachingSkills": 2,
      "completedSkills": 1,
      "averageProgress": 0.67
    }
  }
}
```

#### Add Learning Skill

**POST** `/api/users/skills/learning`

Add a new skill to user's learning list.

##### Request Body
```javascript
{
  "skillId": "507f1f77bcf86cd799439012",
  "level": "beginner", // beginner, intermediate, advanced
  "targetCompletionDate": "2025-03-15T00:00:00.000Z",
  "priority": "high", // low, medium, high
  "learningGoals": ["Build a personal portfolio", "Get job-ready"]
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Learning skill added successfully",
  "data": {
    "skill": { /* Added skill object */ },
    "recommendations": {
      "suggestedTeachers": [ /* Teacher recommendations */ ],
      "relatedSkills": [ /* Related skills to learn */ ]
    }
  }
}
```

#### Add Teaching Skill

**POST** `/api/users/skills/teaching`

Add a new skill to user's teaching offerings.

##### Request Body
```javascript
{
  "skillId": "507f1f77bcf86cd799439013",
  "level": "expert",
  "experience": 5,
  "hourlyRate": 45.00,
  "certifications": ["MongoDB Certified Developer"],
  "description": "I teach JavaScript from basics to advanced concepts",
  "methodology": "Hands-on projects with real-world examples",
  "availability": {
    "schedule": {
      "monday": ["09:00-12:00"],
      "friday": ["14:00-17:00"]
    },
    "timezone": "America/New_York"
  }
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Teaching skill added successfully",
  "data": {
    "skill": { /* Added skill object */ },
    "verification": {
      "required": true,
      "steps": ["Upload certificate", "Complete skill assessment"]
    }
  }
}
```

#### Update Skill Progress

**PUT** `/api/users/skills/learning/:skillId/progress`

Update progress for a learning skill.

##### Request Body
```javascript
{
  "progress": 0.65, // 0.0 to 1.0
  "hoursSpent": 20.5,
  "notes": "Completed React components module",
  "milestones": ["Created first component", "Handled state management"]
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "skill": { /* Updated skill object */ },
    "achievements": ["50% Progress Milestone"], // New achievements unlocked
    "nextMilestone": {
      "name": "Advanced Components",
      "progressRequired": 0.75
    }
  }
}
```

---

### 🔍 User Search & Discovery

#### Search Users

**GET** `/api/users/search`

Search for users with advanced filtering.

##### Query Parameters
- `q` (string) - Search query (name, skills, bio)
- `role` (string) - Filter by user role
- `skills` (string) - Comma-separated skill IDs
- `location` (string) - Location filter
- `rating` (number) - Minimum rating
- `availability` (boolean) - Currently available users
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Results per page
- `sort` (string) - Sort by: `rating`, `experience`, `price`, `recent`

##### Response
```javascript
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439020",
        "name": "Jane Smith",
        "avatar": "https://...",
        "role": "teacher",
        "bio": "Experienced web developer with 8 years in the industry",
        "location": {
          "country": "United States",
          "city": "San Francisco"
        },
        "skills": [
          {
            "name": "JavaScript",
            "level": "expert",
            "rating": 4.9,
            "hourlyRate": 60.00
          }
        ],
        "stats": {
          "rating": 4.8,
          "studentsCount": 45,
          "sessionsCompleted": 150,
          "responseTime": "< 1 hour"
        },
        "availability": {
          "isOnline": true,
          "nextAvailable": "2025-10-08T09:00:00.000Z"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 94,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "applied": ["role:teacher", "skills:javascript"],
      "available": {
        "locations": ["United States", "Canada", "United Kingdom"],
        "skillCategories": ["Programming", "Design", "Languages"],
        "ratings": [4.0, 4.5, 5.0]
      }
    }
  }
}
```

#### Get User by ID

**GET** `/api/users/:userId`

Get public profile of a specific user.

##### Response
```javascript
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439020",
      "name": "Jane Smith",
      "avatar": "https://...",
      "role": "teacher",
      "bio": "Experienced web developer and passionate educator",
      "location": {
        "country": "United States",
        "city": "San Francisco"
      },
      "skills": {
        "teaching": [ /* Teaching skills with ratings */ ]
      },
      "stats": {
        "rating": 4.8,
        "studentsCount": 45,
        "sessionsCompleted": 150,
        "memberSince": "2024-01-01T00:00:00.000Z"
      },
      "reviews": [
        {
          "id": "507f1f77bcf86cd799439030",
          "rating": 5,
          "comment": "Excellent teacher, very patient and knowledgeable",
          "student": {
            "name": "John D.",
            "avatar": "https://..."
          },
          "skill": "JavaScript",
          "createdAt": "2025-10-01T00:00:00.000Z"
        }
      ],
      "availability": {
        "isOnline": true,
        "schedule": { /* Available time slots */ }
      }
    }
  }
}
```

---

### 📊 Analytics & Statistics

#### Get User Analytics

**GET** `/api/users/analytics`

Get comprehensive user analytics and insights.

##### Query Parameters
- `timeframe` (string, default: "30d") - Time period: 7d, 30d, 90d, 1y
- `metrics` (string) - Specific metrics: `learning`, `teaching`, `engagement`, `earnings`

##### Response
```javascript
{
  "success": true,
  "data": {
    "overview": {
      "totalSessions": 45,
      "hoursLearned": 120.5,
      "hoursTaught": 80.0,
      "totalEarnings": 3600.00,
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
        "Languages": 15.0
      },
      "progressTrend": [
        {"date": "2025-10-01", "progress": 0.45},
        {"date": "2025-10-02", "progress": 0.48}
      ]
    },
    "teachingPerformance": {
      "studentsAcquired": 15,
      "sessionCompletionRate": 0.94,
      "averageSessionRating": 4.8,
      "earningsByMonth": [
        {"month": "2025-09", "earnings": 1200.00},
        {"month": "2025-10", "earnings": 1400.00}
      ],
      "popularSkills": [
        {"skill": "JavaScript", "sessions": 25, "rating": 4.9},
        {"skill": "React", "sessions": 15, "rating": 4.7}
      ]
    },
    "engagement": {
      "loginFrequency": "daily",
      "averageSessionDuration": "2.5 hours",
      "messagesExchanged": 145,
      "forumParticipation": 8
    }
  }
}
```

---

### ⚙️ Preferences & Settings

#### Get User Preferences

**GET** `/api/users/preferences`

Get user's current preferences and settings.

##### Response
```javascript
{
  "success": true,
  "data": {
    "preferences": {
      "general": {
        "language": "en",
        "timezone": "America/New_York",
        "currency": "USD",
        "dateFormat": "MM/DD/YYYY",
        "theme": "light"
      },
      "learning": {
        "learningStyle": "visual",
        "difficultyPreference": "gradual",
        "sessionLength": 60,
        "reminderBefore": 15
      },
      "teaching": {
        "autoAcceptBookings": false,
        "maxStudentsPerWeek": 10,
        "cancellationPolicy": "24-hour",
        "instantBooking": false
      },
      "notifications": {
        "email": {
          "sessionReminders": true,
          "newMessages": true,
          "weeklyProgress": true,
          "marketingEmails": false
        },
        "sms": {
          "sessionReminders": false,
          "urgentMessages": true
        },
        "push": {
          "allNotifications": true,
          "quietHours": {
            "enabled": true,
            "start": "22:00",
            "end": "08:00"
          }
        }
      },
      "privacy": {
        "profileVisibility": "public",
        "showOnlineStatus": true,
        "shareProgressUpdates": true,
        "allowDirectMessages": true
      }
    }
  }
}
```

#### Update Preferences

**PUT** `/api/users/preferences`

Update user preferences and settings.

##### Request Body
```javascript
{
  "general": {
    "language": "es",
    "timezone": "Europe/Madrid",
    "theme": "dark"
  },
  "notifications": {
    "email": {
      "sessionReminders": false,
      "weeklyProgress": false
    }
  },
  "privacy": {
    "profileVisibility": "private"
  }
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "preferences": { /* Updated preferences object */ },
    "changes": ["general.language", "notifications.email.sessionReminders"]
  }
}
```

---

### 🏆 Achievements & Badges

#### Get User Achievements

**GET** `/api/users/achievements`

Get user's achievements and badges.

##### Response
```javascript
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "first_session",
        "name": "First Session",
        "description": "Completed your first learning session",
        "icon": "https://cdn.example.com/badges/first-session.png",
        "earnedAt": "2025-01-20T00:00:00.000Z",
        "rarity": "common",
        "points": 10
      },
      {
        "id": "helpful_teacher",
        "name": "Helpful Teacher",
        "description": "Received 10 five-star reviews",
        "icon": "https://cdn.example.com/badges/helpful-teacher.png",
        "earnedAt": "2025-09-15T00:00:00.000Z",
        "rarity": "rare",
        "points": 50
      }
    ],
    "badges": [
      {
        "id": "javascript_master",
        "name": "JavaScript Master",
        "description": "Completed advanced JavaScript course",
        "icon": "https://cdn.example.com/badges/js-master.png",
        "category": "skill",
        "level": "advanced",
        "earnedAt": "2025-08-10T00:00:00.000Z"
      }
    ],
    "progress": {
      "totalPoints": 450,
      "currentLevel": 8,
      "pointsToNextLevel": 50,
      "nextLevelRewards": ["Profile badge", "Priority support"]
    }
  }
}
```

---

### 📁 Document Management

#### Upload Document

**POST** `/api/users/documents`

Upload user documents (certificates, portfolios, etc.).

##### Request
- Content-Type: `multipart/form-data`
- File field: `document`
- Additional fields: `type`, `title`, `description`

##### Request Body
```javascript
{
  "type": "certificate", // certificate, portfolio, resume, other
  "title": "JavaScript Certification",
  "description": "Official JavaScript certification from XYZ Institute",
  "isPublic": false
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "id": "507f1f77bcf86cd799439040",
      "title": "JavaScript Certification",
      "type": "certificate",
      "fileName": "js_cert_2025.pdf",
      "fileSize": 2048576,
      "mimeType": "application/pdf",
      "url": "https://cdn.example.com/documents/user123/js_cert_2025.pdf",
      "isPublic": false,
      "uploadedAt": "2025-10-07T00:00:00.000Z"
    }
  }
}
```

#### Get User Documents

**GET** `/api/users/documents`

Get user's uploaded documents.

##### Query Parameters
- `type` (string) - Filter by document type
- `public` (boolean) - Filter by visibility

##### Response
```javascript
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "507f1f77bcf86cd799439040",
        "title": "JavaScript Certification",
        "type": "certificate",
        "fileName": "js_cert_2025.pdf",
        "fileSize": 2048576,
        "isPublic": false,
        "uploadedAt": "2025-10-07T00:00:00.000Z",
        "downloadUrl": "https://api.example.com/api/users/documents/507f1f77bcf86cd799439040/download"
      }
    ],
    "totalCount": 5,
    "storageUsed": "15.2 MB",
    "storageLimit": "100 MB"
  }
}
```

---

## Error Responses

### 400 - Bad Request
```javascript
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "personal.phone",
      "message": "Phone number format is invalid"
    }
  ]
}
```

### 404 - User Not Found
```javascript
{
  "success": false,
  "message": "User not found",
  "code": "USER_NOT_FOUND"
}
```

### 413 - File Too Large
```javascript
{
  "success": false,
  "message": "File size exceeds maximum limit of 5MB",
  "code": "FILE_TOO_LARGE"
}
```

---

## Integration Examples

### Update User Profile
```javascript
const updateProfile = async (profileData) => {
  const response = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });
  
  return await response.json();
};
```

### Upload Avatar with Progress
```javascript
const uploadAvatar = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const xhr = new XMLHttpRequest();
  
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const progress = (e.loaded / e.total) * 100;
      onProgress(progress);
    }
  });
  
  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('Upload failed'));
      }
    };
    
    xhr.open('POST', '/api/users/avatar');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
};
```

---

This documentation covers the complete User Service functionality. For implementation details, refer to `/services/user-service/` source code.