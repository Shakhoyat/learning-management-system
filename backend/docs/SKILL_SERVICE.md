# Skill Service Documentation

## Overview
The Skill Service manages the comprehensive skills database, competency tracking, assessments, and skill-related operations. It serves as the foundation for the matching and learning systems.

## Service Details
- **Port**: 3003
- **Base URL**: `http://localhost:3003`
- **API Prefix**: `/api/skills`

## Features
- 🎯 Comprehensive skills database
- 📊 Skill competency levels and assessments
- 🏷️ Skill categories and taxonomy
- 🔍 Advanced skill search and filtering
- 📈 Skill popularity and demand analytics
- 🏆 Skill certifications and badges
- 🎓 Learning paths and prerequisites
- 📝 Skill assessments and quizzes

---

## API Endpoints

### 🎯 Skills Management

#### Get All Skills

**GET** `/api/skills`

Get paginated list of all available skills.

##### Query Parameters
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Results per page
- `category` (string) - Filter by skill category
- `level` (string) - Filter by difficulty level
- `search` (string) - Search skills by name or description
- `sort` (string) - Sort by: `name`, `popularity`, `demand`, `recent`

##### Response
```javascript
{
  "success": true,
  "data": {
    "skills": [
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "React.js",
        "slug": "reactjs",
        "description": "A JavaScript library for building user interfaces",
        "category": {
          "id": "507f1f77bcf86cd799439200",
          "name": "Web Development",
          "slug": "web-development"
        },
        "subcategory": {
          "id": "507f1f77bcf86cd799439201",
          "name": "Frontend Frameworks",
          "slug": "frontend-frameworks"
        },
        "difficulty": "intermediate",
        "tags": ["javascript", "frontend", "ui", "components"],
        "prerequisites": [
          {
            "skillId": "507f1f77bcf86cd799439013",
            "skillName": "JavaScript",
            "required": true
          },
          {
            "skillId": "507f1f77bcf86cd799439014",
            "skillName": "HTML/CSS",
            "required": true
          }
        ],
        "relatedSkills": [
          {
            "skillId": "507f1f77bcf86cd799439015",
            "skillName": "Vue.js",
            "relationshipType": "alternative"
          },
          {
            "skillId": "507f1f77bcf86cd799439016",
            "skillName": "Next.js",
            "relationshipType": "builds_upon"
          }
        ],
        "stats": {
          "totalTeachers": 245,
          "totalLearners": 1520,
          "averagePrice": 4500, // $45.00 per hour
          "averageRating": 4.7,
          "demandScore": 0.89,
          "popularityRank": 5
        },
        "learningPath": {
          "estimatedHours": 40,
          "milestones": [
            "Understanding Components",
            "State Management",
            "Hooks and Effects",
            "Advanced Patterns"
          ]
        },
        "metadata": {
          "createdAt": "2025-01-01T00:00:00.000Z",
          "updatedAt": "2025-10-07T00:00:00.000Z",
          "isActive": true,
          "isFeatured": true
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 15,
      "totalSkills": 298,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "categories": [
        {
          "id": "507f1f77bcf86cd799439200",
          "name": "Web Development",
          "count": 85
        },
        {
          "id": "507f1f77bcf86cd799439202",
          "name": "Data Science",
          "count": 42
        }
      ],
      "levels": [
        {"name": "beginner", "count": 120},
        {"name": "intermediate", "count": 135},
        {"name": "advanced", "count": 43}
      ]
    }
  }
}
```

#### Get Skill Details

**GET** `/api/skills/:skillId`

Get detailed information about a specific skill.

##### Response
```javascript
{
  "success": true,
  "data": {
    "skill": {
      "id": "507f1f77bcf86cd799439012",
      "name": "React.js",
      "slug": "reactjs",
      "description": "A JavaScript library for building user interfaces with component-based architecture",
      "longDescription": "React.js is a powerful JavaScript library developed by Facebook for building interactive user interfaces. It uses a component-based architecture that promotes reusability and maintainability...",
      "category": {
        "id": "507f1f77bcf86cd799439200",
        "name": "Web Development",
        "slug": "web-development",
        "description": "Skills related to web application development"
      },
      "subcategory": {
        "id": "507f1f77bcf86cd799439201",
        "name": "Frontend Frameworks",
        "slug": "frontend-frameworks"
      },
      "difficulty": "intermediate",
      "tags": ["javascript", "frontend", "ui", "components", "spa"],
      "prerequisites": [
        {
          "skillId": "507f1f77bcf86cd799439013",
          "skillName": "JavaScript",
          "required": true,
          "description": "Strong understanding of ES6+ features"
        },
        {
          "skillId": "507f1f77bcf86cd799439014",
          "skillName": "HTML/CSS",
          "required": true,
          "description": "Basic knowledge of web markup and styling"
        }
      ],
      "learningOutcomes": [
        "Build interactive user interfaces",
        "Manage component state effectively",
        "Handle user events and data flow",
        "Implement routing in single-page applications",
        "Optimize performance with React best practices"
      ],
      "skillLevels": {
        "beginner": {
          "description": "Can create basic React components and understand JSX",
          "competencies": [
            "Create functional components",
            "Understand JSX syntax",
            "Handle basic props",
            "Use basic hooks (useState, useEffect)"
          ],
          "estimatedHours": 15
        },
        "intermediate": {
          "description": "Can build complex applications with state management",
          "competencies": [
            "Implement complex state management",
            "Create custom hooks",
            "Handle side effects efficiently",
            "Optimize component performance"
          ],
          "estimatedHours": 25
        },
        "advanced": {
          "description": "Can architect large-scale React applications",
          "competencies": [
            "Design application architecture",
            "Implement advanced patterns",
            "Performance optimization",
            "Testing strategies"
          ],
          "estimatedHours": 40
        }
      },
      "assessments": [
        {
          "id": "507f1f77bcf86cd799439300",
          "title": "React Fundamentals Quiz",
          "type": "quiz",
          "level": "beginner",
          "questions": 20,
          "duration": 30, // minutes
          "passingScore": 80
        },
        {
          "id": "507f1f77bcf86cd799439301",
          "title": "Build a Todo App",
          "type": "project",
          "level": "intermediate",
          "estimatedTime": 120, // minutes
          "requirements": [
            "CRUD operations",
            "State management",
            "Component composition"
          ]
        }
      ],
      "certifications": [
        {
          "id": "507f1f77bcf86cd799439400",
          "name": "React Developer Certification",
          "issuer": "React Training",
          "description": "Official React certification",
          "requirements": ["Pass all assessments", "Complete project"],
          "validityPeriod": 24 // months
        }
      ],
      "resources": [
        {
          "type": "documentation",
          "title": "Official React Documentation",
          "url": "https://reactjs.org/docs",
          "description": "Comprehensive official documentation"
        },
        {
          "type": "course",
          "title": "React - The Complete Guide",
          "url": "https://example.com/course",
          "description": "Popular online course",
          "rating": 4.8
        },
        {
          "type": "book",
          "title": "Learning React",
          "author": "Alex Banks",
          "isbn": "978-1491954621"
        }
      ],
      "marketData": {
        "averageSalary": {
          "junior": 65000,
          "mid": 85000,
          "senior": 110000,
          "currency": "USD"
        },
        "jobOpenings": 15420,
        "growthRate": 0.23, // 23% YoY growth
        "demandTrend": "increasing",
        "topCompanies": ["Facebook", "Netflix", "Airbnb", "Uber"]
      }
    }
  }
}
```

#### Create New Skill

**POST** `/api/skills`

Create a new skill entry (Admin only).

##### Request Body
```javascript
{
  "name": "Vue.js",
  "slug": "vuejs",
  "description": "Progressive JavaScript framework for building user interfaces",
  "longDescription": "Vue.js is a progressive framework for building user interfaces...",
  "categoryId": "507f1f77bcf86cd799439200",
  "subcategoryId": "507f1f77bcf86cd799439201",
  "difficulty": "intermediate",
  "tags": ["javascript", "frontend", "framework"],
  "prerequisites": [
    {
      "skillId": "507f1f77bcf86cd799439013",
      "required": true
    }
  ],
  "learningOutcomes": [
    "Build reactive web applications",
    "Implement component-based architecture"
  ],
  "estimatedLearningTime": {
    "beginner": 20,
    "intermediate": 35,
    "advanced": 50
  }
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Skill created successfully",
  "data": {
    "skill": {
      "id": "507f1f77bcf86cd799439017",
      "name": "Vue.js",
      "slug": "vuejs",
      // ... other skill properties
      "createdAt": "2025-10-07T00:00:00.000Z"
    }
  }
}
```

---

### 🏷️ Categories Management

#### Get All Categories

**GET** `/api/skills/categories`

Get all skill categories with hierarchy.

##### Response
```javascript
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "507f1f77bcf86cd799439200",
        "name": "Web Development",
        "slug": "web-development",
        "description": "Skills related to web application development",
        "icon": "🌐",
        "subcategories": [
          {
            "id": "507f1f77bcf86cd799439201",
            "name": "Frontend Frameworks",
            "slug": "frontend-frameworks",
            "skillCount": 25
          },
          {
            "id": "507f1f77bcf86cd799439202",
            "name": "Backend Technologies",
            "slug": "backend-technologies",
            "skillCount": 30
          }
        ],
        "skillCount": 85,
        "popularSkills": [
          {
            "id": "507f1f77bcf86cd799439012",
            "name": "React.js",
            "learnerCount": 1520
          }
        ]
      },
      {
        "id": "507f1f77bcf86cd799439203",
        "name": "Data Science",
        "slug": "data-science",
        "description": "Skills for data analysis and machine learning",
        "icon": "📊",
        "subcategories": [
          {
            "id": "507f1f77bcf86cd799439204",
            "name": "Machine Learning",
            "slug": "machine-learning",
            "skillCount": 15
          }
        ],
        "skillCount": 42
      }
    ],
    "totalCategories": 12,
    "totalSkills": 298
  }
}
```

#### Get Skills by Category

**GET** `/api/skills/categories/:categoryId/skills`

Get skills within a specific category.

##### Query Parameters
- `subcategory` (string) - Filter by subcategory
- `level` (string) - Filter by difficulty level
- `page` (number, default: 1)
- `limit` (number, default: 20)

##### Response
```javascript
{
  "success": true,
  "data": {
    "category": {
      "id": "507f1f77bcf86cd799439200",
      "name": "Web Development",
      "description": "Skills related to web application development"
    },
    "skills": [
      // Array of skills in this category
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalSkills": 85
    },
    "subcategories": [
      {
        "id": "507f1f77bcf86cd799439201",
        "name": "Frontend Frameworks",
        "skillCount": 25
      }
    ]
  }
}
```

---

### 📊 Skill Assessments

#### Get Skill Assessments

**GET** `/api/skills/:skillId/assessments`

Get available assessments for a skill.

##### Response
```javascript
{
  "success": true,
  "data": {
    "assessments": [
      {
        "id": "507f1f77bcf86cd799439300",
        "title": "React Fundamentals Quiz",
        "description": "Test your knowledge of React basics",
        "type": "quiz", // quiz, project, practical
        "level": "beginner",
        "duration": 30, // minutes
        "questions": 20,
        "passingScore": 80,
        "attempts": {
          "allowed": 3,
          "used": 0
        },
        "topics": [
          "Components and JSX",
          "Props and State",
          "Event Handling",
          "React Hooks"
        ],
        "prerequisites": [],
        "certification": {
          "eligible": true,
          "certificateId": "507f1f77bcf86cd799439400"
        }
      },
      {
        "id": "507f1f77bcf86cd799439301",
        "title": "Build a Todo Application",
        "description": "Create a functional todo app using React",
        "type": "project",
        "level": "intermediate",
        "estimatedTime": 120, // minutes
        "requirements": [
          "Implement CRUD operations",
          "Use React hooks for state management",
          "Apply proper component composition",
          "Include basic styling"
        ],
        "deliverables": [
          "Working application URL",
          "Source code repository",
          "Brief documentation"
        ],
        "rubric": [
          {
            "criteria": "Functionality",
            "weight": 40,
            "description": "App works as specified"
          },
          {
            "criteria": "Code Quality",
            "weight": 30,
            "description": "Clean, well-structured code"
          },
          {
            "criteria": "UI/UX",
            "weight": 20,
            "description": "User-friendly interface"
          },
          {
            "criteria": "Documentation",
            "weight": 10,
            "description": "Clear setup instructions"
          }
        ]
      }
    ]
  }
}
```

#### Start Assessment

**POST** `/api/skills/assessments/:assessmentId/start`

Start taking an assessment.

##### Response
```javascript
{
  "success": true,
  "message": "Assessment started successfully",
  "data": {
    "attempt": {
      "id": "507f1f77bcf86cd799439500",
      "assessmentId": "507f1f77bcf86cd799439300",
      "userId": "507f1f77bcf86cd799439011",
      "status": "in_progress",
      "startedAt": "2025-10-07T00:00:00.000Z",
      "expiresAt": "2025-10-07T00:30:00.000Z", // 30 minutes from start
      "questions": [
        {
          "id": "q1",
          "question": "What is JSX in React?",
          "type": "multiple_choice",
          "options": [
            "A JavaScript extension that allows HTML-like syntax",
            "A CSS framework for React",
            "A testing library",
            "A state management tool"
          ],
          "points": 5
        },
        {
          "id": "q2",
          "question": "Complete the following React component:",
          "type": "code_completion",
          "code": "function Welcome(props) {\n  return <h1>Hello, {/* FILL THIS */}!</h1>;\n}",
          "points": 10
        }
      ],
      "totalQuestions": 20,
      "totalPoints": 100
    }
  }
}
```

#### Submit Assessment Answer

**POST** `/api/skills/assessments/attempts/:attemptId/answer`

Submit answer for a specific question.

##### Request Body
```javascript
{
  "questionId": "q1",
  "answer": "A JavaScript extension that allows HTML-like syntax",
  "timeSpent": 45 // seconds
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Answer submitted successfully",
  "data": {
    "questionId": "q1",
    "submitted": true,
    "remainingQuestions": 19,
    "timeRemaining": 1755 // seconds
  }
}
```

#### Complete Assessment

**POST** `/api/skills/assessments/attempts/:attemptId/complete`

Complete and submit the assessment.

##### Response
```javascript
{
  "success": true,
  "message": "Assessment completed successfully",
  "data": {
    "result": {
      "id": "507f1f77bcf86cd799439501",
      "attemptId": "507f1f77bcf86cd799439500",
      "score": 85,
      "totalPoints": 100,
      "percentage": 85,
      "passed": true,
      "passingScore": 80,
      "timeSpent": 1245, // seconds
      "breakdown": {
        "correct": 17,
        "incorrect": 3,
        "skipped": 0
      },
      "topicScores": [
        {
          "topic": "Components and JSX",
          "score": 90,
          "questions": 5
        },
        {
          "topic": "Props and State",
          "score": 80,
          "questions": 5
        }
      ],
      "certification": {
        "earned": true,
        "certificateId": "507f1f77bcf86cd799439502",
        "certificateUrl": "/api/skills/certificates/507f1f77bcf86cd799439502"
      },
      "recommendations": [
        "Review state management concepts",
        "Practice with more complex components"
      ],
      "completedAt": "2025-10-07T00:20:45.000Z"
    }
  }
}
```

---

### 🏆 Certificates & Achievements

#### Get User Certificates

**GET** `/api/skills/certificates`

Get user's earned certificates.

##### Response
```javascript
{
  "success": true,
  "data": {
    "certificates": [
      {
        "id": "507f1f77bcf86cd799439502",
        "skill": {
          "id": "507f1f77bcf86cd799439012",
          "name": "React.js"
        },
        "level": "beginner",
        "assessmentScore": 85,
        "earnedAt": "2025-10-07T00:20:45.000Z",
        "expiresAt": "2027-10-07T00:20:45.000Z", // 2 years validity
        "certificateNumber": "CERT-REACT-2025-001234",
        "downloadUrl": "/api/skills/certificates/507f1f77bcf86cd799439502/download",
        "verificationUrl": "/api/skills/certificates/507f1f77bcf86cd799439502/verify",
        "isValid": true
      }
    ],
    "totalCertificates": 5,
    "expiringSoon": [
      {
        "certificateId": "507f1f77bcf86cd799439503",
        "skillName": "JavaScript",
        "expiresAt": "2025-11-15T00:00:00.000Z"
      }
    ]
  }
}
```

#### Download Certificate

**GET** `/api/skills/certificates/:certificateId/download`

Download certificate as PDF.

##### Response
- Content-Type: `application/pdf`
- Professional certificate with skill details, score, and validation information

---

### 📈 Skill Analytics

#### Get Skill Statistics

**GET** `/api/skills/:skillId/stats`

Get comprehensive statistics for a skill.

##### Response
```javascript
{
  "success": true,
  "data": {
    "skill": {
      "id": "507f1f77bcf86cd799439012",
      "name": "React.js"
    },
    "learners": {
      "total": 1520,
      "active": 890,
      "completed": 340,
      "averageProgress": 0.65
    },
    "teachers": {
      "total": 245,
      "active": 180,
      "averageRating": 4.7,
      "averageExperience": 3.2 // years
    },
    "sessions": {
      "totalSessions": 3450,
      "completionRate": 0.92,
      "averageDuration": 65, // minutes
      "averageRating": 4.6
    },
    "pricing": {
      "averageHourlyRate": 4500, // $45.00
      "priceRange": {
        "min": 2000, // $20.00
        "max": 8000  // $80.00
      },
      "priceDistribution": {
        "20-30": 0.15,
        "30-50": 0.60,
        "50-80": 0.25
      }
    },
    "demand": {
      "score": 0.89,
      "trend": "increasing",
      "jobPostings": 15420,
      "searchVolume": 89000,
      "competitionLevel": "high"
    },
    "assessments": {
      "totalAttempts": 2340,
      "averageScore": 78,
      "passRate": 0.73,
      "certificatesIssued": 1708
    },
    "geography": {
      "topCountries": [
        {"country": "United States", "learners": 580},
        {"country": "India", "learners": 290},
        {"country": "United Kingdom", "learners": 185}
      ],
      "topCities": [
        {"city": "San Francisco", "learners": 125},
        {"city": "New York", "learners": 98},
        {"city": "London", "learners": 87}
      ]
    }
  }
}
```

#### Get Trending Skills

**GET** `/api/skills/trending`

Get currently trending skills based on demand and growth.

##### Query Parameters
- `timeframe` (string, default: "7d") - 7d, 30d, 90d
- `category` (string) - Filter by category
- `limit` (number, default: 10)

##### Response
```javascript
{
  "success": true,
  "data": {
    "trending": [
      {
        "skill": {
          "id": "507f1f77bcf86cd799439012",
          "name": "React.js",
          "category": "Web Development"
        },
        "metrics": {
          "demandGrowth": 0.34, // 34% growth
          "learnerGrowth": 0.28,
          "searchGrowth": 0.45,
          "trendScore": 0.89
        },
        "rank": 1,
        "previousRank": 3,
        "rankChange": 2
      }
    ],
    "emerging": [
      {
        "skill": {
          "id": "507f1f77bcf86cd799439018",
          "name": "WebAssembly",
          "category": "Web Development"
        },
        "metrics": {
          "demandGrowth": 1.25, // 125% growth (new/emerging)
          "trendScore": 0.75
        },
        "emergingReason": "High growth in job postings"
      }
    ],
    "declining": [
      {
        "skill": {
          "id": "507f1f77bcf86cd799439019",
          "name": "jQuery",
          "category": "Web Development"
        },
        "metrics": {
          "demandGrowth": -0.15, // 15% decline
          "trendScore": 0.25
        },
        "decliningReason": "Replaced by modern frameworks"
      }
    ]
  }
}
```

---

### 🔍 Search & Recommendations

#### Search Skills

**GET** `/api/skills/search`

Advanced skill search with filters and suggestions.

##### Query Parameters
- `q` (string) - Search query
- `category` (string) - Filter by category
- `level` (string) - Filter by difficulty
- `minPrice` (number) - Minimum hourly rate
- `maxPrice` (number) - Maximum hourly rate
- `rating` (number) - Minimum rating
- `hasTeachers` (boolean) - Only skills with available teachers
- `page` (number, default: 1)
- `limit` (number, default: 20)

##### Response
```javascript
{
  "success": true,
  "data": {
    "query": "react",
    "results": [
      {
        "skill": {
          "id": "507f1f77bcf86cd799439012",
          "name": "React.js",
          "description": "JavaScript library for building user interfaces",
          "category": "Web Development",
          "difficulty": "intermediate",
          "tags": ["javascript", "frontend", "ui"]
        },
        "match": {
          "score": 0.95,
          "highlights": ["<em>React</em>.js", "JavaScript library"],
          "relevance": "exact_match"
        },
        "availability": {
          "teachers": 245,
          "averagePrice": 4500,
          "averageRating": 4.7,
          "nextAvailable": "2025-10-08T09:00:00.000Z"
        }
      }
    ],
    "suggestions": [
      "React Native",
      "React Testing",
      "Redux"
    ],
    "filters": {
      "appliedFilters": {
        "category": "Web Development",
        "hasTeachers": true
      },
      "availableFilters": {
        "categories": [
          {"name": "Web Development", "count": 25},
          {"name": "Mobile Development", "count": 5}
        ],
        "levels": [
          {"name": "beginner", "count": 10},
          {"name": "intermediate", "count": 18},
          {"name": "advanced", "count": 2}
        ]
      }
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalResults": 30
    }
  }
}
```

#### Get Skill Recommendations

**GET** `/api/skills/recommendations`

Get personalized skill recommendations for the user.

##### Query Parameters
- `type` (string) - Recommendation type: `learning`, `teaching`, `career`
- `limit` (number, default: 10)

##### Response
```javascript
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "skill": {
          "id": "507f1f77bcf86cd799439015",
          "name": "Next.js",
          "category": "Web Development",
          "difficulty": "intermediate"
        },
        "reason": "builds_upon_existing_skills",
        "confidence": 0.87,
        "explanation": "Builds upon your React.js knowledge",
        "prerequisites": {
          "met": ["React.js", "JavaScript"],
          "missing": []
        },
        "benefits": [
          "Server-side rendering capabilities",
          "Better SEO for React applications",
          "Full-stack development potential"
        ],
        "marketData": {
          "demandGrowth": 0.45,
          "averageSalary": 95000,
          "jobOpenings": 8500
        }
      }
    ],
    "learningPath": {
      "currentSkills": ["JavaScript", "React.js"],
      "suggestedNext": ["Next.js", "TypeScript", "Node.js"],
      "careerGoal": "Full-Stack Developer",
      "estimatedTimeToGoal": "6 months"
    }
  }
}
```

---

## Error Responses

### 404 - Skill Not Found
```javascript
{
  "success": false,
  "message": "Skill not found",
  "code": "SKILL_NOT_FOUND"
}
```

### 400 - Invalid Assessment Attempt
```javascript
{
  "success": false,
  "message": "Assessment attempt limit exceeded",
  "code": "ATTEMPT_LIMIT_EXCEEDED",
  "data": {
    "maxAttempts": 3,
    "usedAttempts": 3,
    "resetDate": "2025-10-14T00:00:00.000Z"
  }
}
```

---

## Integration Examples

### Search and Filter Skills
```javascript
const searchSkills = async (query, filters = {}) => {
  const params = new URLSearchParams({
    q: query,
    ...filters,
    page: 1,
    limit: 20
  });
  
  const response = await fetch(`/api/skills/search?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const { data } = await response.json();
  return data.results;
};

// Usage
const reactSkills = await searchSkills('react', {
  category: 'Web Development',
  level: 'intermediate',
  hasTeachers: true
});
```

### Take Skill Assessment
```javascript
const takeAssessment = async (skillId) => {
  // 1. Get available assessments
  const assessmentsResponse = await fetch(`/api/skills/${skillId}/assessments`);
  const { data: assessmentsData } = await assessmentsResponse.json();
  
  const assessment = assessmentsData.assessments[0]; // Take first assessment
  
  // 2. Start assessment
  const startResponse = await fetch(`/api/skills/assessments/${assessment.id}/start`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const { data: attemptData } = await startResponse.json();
  
  // 3. Answer questions
  for (const question of attemptData.attempt.questions) {
    await fetch(`/api/skills/assessments/attempts/${attemptData.attempt.id}/answer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questionId: question.id,
        answer: getAnswerForQuestion(question), // Your logic
        timeSpent: 30
      })
    });
  }
  
  // 4. Complete assessment
  const completeResponse = await fetch(`/api/skills/assessments/attempts/${attemptData.attempt.id}/complete`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const { data: resultData } = await completeResponse.json();
  return resultData.result;
};
```

---

This documentation covers the complete Skill Service functionality. For implementation details, refer to `/services/skill-service/` source code.