# Session Service Documentation

## Overview
The Session Service manages all learning session activities including booking, real-time collaboration, video conferencing, whiteboard sharing, and code collaboration. It provides the core interactive learning experience.

## Service Details
- **Port**: 3005
- **Base URL**: `http://localhost:3005`
- **API Prefix**: `/api/sessions`

## Features
- 📅 Session booking and scheduling
- 🎥 Video conferencing integration
- 💬 Real-time chat and messaging
- 🖼️ Interactive whiteboard
- 👨‍💻 Code collaboration and sharing
- 📱 Screen sharing capabilities
- 🔔 Session notifications and reminders
- 📊 Session analytics and reporting

## WebSocket Events
The service uses Socket.IO for real-time communication on port 3005.

### Connection
```javascript
const socket = io('http://localhost:3005', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

---

## API Endpoints

### 📅 Session Management

#### Create Session

**POST** `/api/sessions`

Create a new learning session.

##### Request Body
```javascript
{
  "teacherId": "507f1f77bcf86cd799439020",
  "skillId": "507f1f77bcf86cd799439012",
  "sessionType": "one-on-one", // one-on-one, group, workshop
  "scheduledTime": "2025-10-08T14:00:00.000Z",
  "duration": 60, // Duration in minutes
  "title": "React Fundamentals - Components and Props",
  "description": "Learn the basics of React components and how to pass props",
  "objectives": [
    "Understand React component structure",
    "Learn to pass and use props",
    "Create reusable components"
  ],
  "price": 45.00,
  "materials": [
    {
      "type": "link",
      "title": "React Documentation",
      "url": "https://reactjs.org/docs"
    },
    {
      "type": "file",
      "title": "Starter Code",
      "fileId": "507f1f77bcf86cd799439050"
    }
  ],
  "requirements": [
    "Basic JavaScript knowledge",
    "Computer with internet connection",
    "Code editor installed"
  ]
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Session created successfully",
  "data": {
    "session": {
      "id": "507f1f77bcf86cd799439060",
      "title": "React Fundamentals - Components and Props",
      "sessionType": "one-on-one",
      "status": "scheduled",
      "teacher": {
        "id": "507f1f77bcf86cd799439020",
        "name": "Jane Smith",
        "avatar": "https://...",
        "rating": 4.8
      },
      "student": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "avatar": "https://..."
      },
      "skill": {
        "id": "507f1f77bcf86cd799439012",
        "name": "React.js",
        "category": "Web Development"
      },
      "schedule": {
        "startTime": "2025-10-08T14:00:00.000Z",
        "endTime": "2025-10-08T15:00:00.000Z",
        "duration": 60,
        "timezone": "America/New_York"
      },
      "pricing": {
        "basePrice": 45.00,
        "platformFee": 4.50,
        "totalPrice": 49.50,
        "currency": "USD"
      },
      "collaboration": {
        "roomId": "session_507f1f77bcf86cd799439060",
        "features": ["video", "audio", "chat", "whiteboard", "codeEditor"],
        "recordingEnabled": false
      },
      "createdAt": "2025-10-07T00:00:00.000Z"
    },
    "paymentRequired": true,
    "paymentUrl": "https://checkout.stripe.com/..."
  }
}
```

#### Get Session Details

**GET** `/api/sessions/:sessionId`

Get detailed information about a specific session.

##### Response
```javascript
{
  "success": true,
  "data": {
    "session": {
      "id": "507f1f77bcf86cd799439060",
      "title": "React Fundamentals - Components and Props",
      "description": "Learn the basics of React components...",
      "status": "in-progress", // scheduled, in-progress, completed, cancelled
      "sessionType": "one-on-one",
      "teacher": { /* Teacher details */ },
      "student": { /* Student details */ },
      "skill": { /* Skill details */ },
      "schedule": { /* Schedule details */ },
      "collaboration": {
        "roomId": "session_507f1f77bcf86cd799439060",
        "joinUrl": "https://meet.example.com/session_507f1f77bcf86cd799439060",
        "features": ["video", "audio", "chat", "whiteboard", "codeEditor"],
        "participants": [
          {
            "userId": "507f1f77bcf86cd799439011",
            "role": "student",
            "joinedAt": "2025-10-08T14:02:00.000Z",
            "isOnline": true
          },
          {
            "userId": "507f1f77bcf86cd799439020",
            "role": "teacher",
            "joinedAt": "2025-10-08T14:00:00.000Z",
            "isOnline": true
          }
        ]
      },
      "materials": [ /* Session materials */ ],
      "objectives": [ /* Learning objectives */ ],
      "notes": {
        "teacherNotes": "Student grasped concepts quickly",
        "studentNotes": "Need to practice more with props",
        "sharedNotes": "Covered components and basic props usage"
      },
      "progress": {
        "objectivesCompleted": 2,
        "totalObjectives": 3,
        "completionPercentage": 0.67
      },
      "recording": {
        "isRecording": false,
        "recordingUrl": null,
        "recordingDuration": 0
      }
    }
  }
}
```

#### Update Session

**PUT** `/api/sessions/:sessionId`

Update session details (only by teacher or before session starts).

##### Request Body
```javascript
{
  "title": "Updated session title",
  "description": "Updated description",
  "scheduledTime": "2025-10-08T15:00:00.000Z",
  "duration": 90,
  "materials": [ /* Updated materials */ ],
  "objectives": [ /* Updated objectives */ ]
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Session updated successfully",
  "data": {
    "session": { /* Updated session object */ },
    "changes": ["title", "scheduledTime", "duration"],
    "notificationsSent": ["student", "reminder_service"]
  }
}
```

#### Cancel Session

**DELETE** `/api/sessions/:sessionId`

Cancel a scheduled session.

##### Request Body
```javascript
{
  "reason": "Personal emergency",
  "refundRequested": true
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Session cancelled successfully",
  "data": {
    "cancellation": {
      "reason": "Personal emergency",
      "cancelledBy": "student",
      "cancelledAt": "2025-10-07T00:00:00.000Z",
      "refundEligible": true,
      "refundAmount": 49.50,
      "refundProcessingTime": "3-5 business days"
    }
  }
}
```

---

### 📋 Session Listing & Search

#### Get User Sessions

**GET** `/api/sessions`

Get sessions for the authenticated user.

##### Query Parameters
- `status` (string) - Filter by status: `scheduled`, `in-progress`, `completed`, `cancelled`
- `role` (string) - Filter by user role: `teacher`, `student`
- `startDate` (date) - Filter sessions from date
- `endDate` (date) - Filter sessions to date
- `skillId` (string) - Filter by skill
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Results per page

##### Response
```javascript
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "507f1f77bcf86cd799439060",
        "title": "React Fundamentals",
        "status": "scheduled",
        "teacher": { /* Teacher info */ },
        "student": { /* Student info */ },
        "skill": { /* Skill info */ },
        "schedule": {
          "startTime": "2025-10-08T14:00:00.000Z",
          "duration": 60
        },
        "price": 45.00
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalSessions": 45,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "scheduled": 5,
      "completed": 38,
      "cancelled": 2,
      "totalHours": 95.5
    }
  }
}
```

#### Get Available Time Slots

**GET** `/api/sessions/availability/:teacherId`

Get teacher's available time slots for booking.

##### Query Parameters
- `date` (date) - Specific date (default: today)
- `days` (number, default: 7) - Number of days to show
- `skillId` (string) - Skill-specific availability

##### Response
```javascript
{
  "success": true,
  "data": {
    "availability": [
      {
        "date": "2025-10-08",
        "slots": [
          {
            "startTime": "09:00",
            "endTime": "10:00",
            "available": true,
            "price": 45.00
          },
          {
            "startTime": "10:00",
            "endTime": "11:00",
            "available": false,
            "reason": "Already booked"
          },
          {
            "startTime": "14:00",
            "endTime": "15:00",
            "available": true,
            "price": 45.00
          }
        ]
      }
    ],
    "timezone": "America/New_York",
    "generatedAt": "2025-10-07T00:00:00.000Z"
  }
}
```

---

### 🎥 Real-time Collaboration

#### Join Session

**POST** `/api/sessions/:sessionId/join`

Join a session for real-time collaboration.

##### Response
```javascript
{
  "success": true,
  "message": "Joined session successfully",
  "data": {
    "collaboration": {
      "roomId": "session_507f1f77bcf86cd799439060",
      "socketUrl": "ws://localhost:3005",
      "joinToken": "jwt_token_for_socket_auth",
      "features": {
        "video": true,
        "audio": true,
        "chat": true,
        "whiteboard": true,
        "codeEditor": true,
        "screenShare": true
      },
      "mediaSettings": {
        "videoEnabled": true,
        "audioEnabled": true,
        "quality": "hd"
      }
    }
  }
}
```

#### Leave Session

**POST** `/api/sessions/:sessionId/leave`

Leave the session collaboration room.

##### Response
```javascript
{
  "success": true,
  "message": "Left session successfully",
  "data": {
    "duration": 3600, // Time spent in seconds
    "leftAt": "2025-10-08T15:00:00.000Z"
  }
}
```

---

### 💬 Chat & Messaging

#### Get Session Messages

**GET** `/api/sessions/:sessionId/messages`

Get chat messages from a session.

##### Query Parameters
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `before` (timestamp) - Messages before timestamp

##### Response
```javascript
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "507f1f77bcf86cd799439070",
        "content": "Let's start with creating a simple component",
        "type": "text", // text, file, code, whiteboard_snapshot
        "sender": {
          "id": "507f1f77bcf86cd799439020",
          "name": "Jane Smith",
          "role": "teacher"
        },
        "timestamp": "2025-10-08T14:05:00.000Z",
        "edited": false,
        "reactions": [
          {
            "emoji": "👍",
            "users": ["507f1f77bcf86cd799439011"],
            "count": 1
          }
        ]
      },
      {
        "id": "507f1f77bcf86cd799439071",
        "content": "```javascript\nfunction HelloWorld() {\n  return <h1>Hello, World!</h1>;\n}\n```",
        "type": "code",
        "language": "javascript",
        "sender": {
          "id": "507f1f77bcf86cd799439020",
          "name": "Jane Smith",
          "role": "teacher"
        },
        "timestamp": "2025-10-08T14:07:00.000Z"
      }
    ],
    "pagination": {
      "hasMore": true,
      "nextCursor": "2025-10-08T14:00:00.000Z"
    }
  }
}
```

#### Send Message

**POST** `/api/sessions/:sessionId/messages`

Send a message to the session chat.

##### Request Body
```javascript
{
  "content": "Great explanation! Can you show another example?",
  "type": "text", // text, code, file
  "language": "javascript", // Required for type: code
  "metadata": { // Optional additional data
    "fileName": "example.js", // For file type
    "fileSize": 1024 // For file type
  }
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "message": {
      "id": "507f1f77bcf86cd799439072",
      "content": "Great explanation! Can you show another example?",
      "type": "text",
      "sender": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "role": "student"
      },
      "timestamp": "2025-10-08T14:10:00.000Z"
    }
  }
}
```

---

### 🖼️ Whiteboard

#### Get Whiteboard State

**GET** `/api/sessions/:sessionId/whiteboard`

Get current whiteboard state and drawings.

##### Response
```javascript
{
  "success": true,
  "data": {
    "whiteboard": {
      "id": "whiteboard_507f1f77bcf86cd799439060",
      "width": 1920,
      "height": 1080,
      "background": "#ffffff",
      "objects": [
        {
          "id": "obj_1",
          "type": "path",
          "data": {
            "points": [[100, 100], [150, 150], [200, 100]],
            "stroke": "#000000",
            "strokeWidth": 2
          },
          "createdBy": "507f1f77bcf86cd799439020",
          "createdAt": "2025-10-08T14:15:00.000Z"
        },
        {
          "id": "obj_2",
          "type": "text",
          "data": {
            "text": "Component Lifecycle",
            "x": 300,
            "y": 200,
            "fontSize": 24,
            "color": "#000000"
          },
          "createdBy": "507f1f77bcf86cd799439020",
          "createdAt": "2025-10-08T14:16:00.000Z"
        }
      ],
      "lastModified": "2025-10-08T14:16:00.000Z"
    }
  }
}
```

#### Save Whiteboard Snapshot

**POST** `/api/sessions/:sessionId/whiteboard/snapshot`

Save current whiteboard state as a snapshot.

##### Request Body
```javascript
{
  "title": "Component Lifecycle Diagram",
  "description": "Visual explanation of React component lifecycle"
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Whiteboard snapshot saved successfully",
  "data": {
    "snapshot": {
      "id": "507f1f77bcf86cd799439080",
      "title": "Component Lifecycle Diagram",
      "imageUrl": "https://cdn.example.com/whiteboards/snapshot_123.png",
      "dataUrl": "https://api.example.com/whiteboards/data/snapshot_123.json",
      "createdAt": "2025-10-08T14:20:00.000Z"
    }
  }
}
```

---

### 👨‍💻 Code Collaboration

#### Get Shared Code

**GET** `/api/sessions/:sessionId/code`

Get shared code documents in the session.

##### Response
```javascript
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "doc_1",
        "title": "App.js",
        "language": "javascript",
        "content": "import React from 'react';\n\nfunction App() {\n  return (\n    <div className=\"App\">\n      <h1>Hello, World!</h1>\n    </div>\n  );\n}\n\nexport default App;",
        "cursors": [
          {
            "userId": "507f1f77bcf86cd799439011",
            "line": 5,
            "column": 25,
            "color": "#ff6b6b"
          }
        ],
        "lastModified": "2025-10-08T14:25:00.000Z",
        "modifiedBy": "507f1f77bcf86cd799439020"
      }
    ],
    "activeDocument": "doc_1"
  }
}
```

#### Update Code Document

**PUT** `/api/sessions/:sessionId/code/:documentId`

Update shared code document content.

##### Request Body
```javascript
{
  "content": "Updated code content here...",
  "cursorPosition": {
    "line": 10,
    "column": 15
  },
  "operation": {
    "type": "insert", // insert, delete, replace
    "startLine": 5,
    "startColumn": 10,
    "endLine": 5,
    "endColumn": 25,
    "text": "const greeting = 'Hello';"
  }
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Code updated successfully",
  "data": {
    "document": {
      "id": "doc_1",
      "content": "Updated content...",
      "lastModified": "2025-10-08T14:30:00.000Z",
      "version": 15
    }
  }
}
```

---

### 📊 Session Analytics

#### Get Session Analytics

**GET** `/api/sessions/:sessionId/analytics`

Get detailed analytics for a completed session.

##### Response
```javascript
{
  "success": true,
  "data": {
    "analytics": {
      "duration": {
        "scheduled": 3600, // 60 minutes in seconds
        "actual": 3900, // 65 minutes actual
        "overtime": 300 // 5 minutes overtime
      },
      "participation": {
        "teacher": {
          "speakingTime": 2400, // 40 minutes
          "messagesCount": 15,
          "whiteboardActions": 25
        },
        "student": {
          "speakingTime": 1200, // 20 minutes
          "messagesCount": 22,
          "questionsAsked": 8
        }
      },
      "engagement": {
        "averageEngagement": 0.85,
        "peakEngagement": 0.94,
        "lowEngagementPeriods": [
          {
            "start": "2025-10-08T14:45:00.000Z",
            "end": "2025-10-08T14:50:00.000Z",
            "reason": "Technical difficulties"
          }
        ]
      },
      "learningObjectives": {
        "planned": 3,
        "achieved": 2,
        "partially_achieved": 1,
        "completionRate": 0.83
      },
      "tools": {
        "video": {
          "enabled": true,
          "qualityIssues": 2,
          "averageQuality": "hd"
        },
        "whiteboard": {
          "used": true,
          "objects_created": 15,
          "snapshots_taken": 2
        },
        "codeEditor": {
          "used": true,
          "files_created": 3,
          "lines_written": 45
        }
      },
      "feedback": {
        "studentRating": 5,
        "teacherRating": 5,
        "overallSatisfaction": 0.95
      }
    }
  }
}
```

---

### 📝 Session Notes & Reviews

#### Add Session Notes

**POST** `/api/sessions/:sessionId/notes`

Add notes during or after the session.

##### Request Body
```javascript
{
  "type": "teacher", // teacher, student, shared
  "content": "Student showed good understanding of React components. Recommend practicing with props in different scenarios.",
  "isPrivate": false,
  "tags": ["react", "components", "beginner"],
  "timestamp": "2025-10-08T14:45:00.000Z" // Optional, defaults to now
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Notes added successfully",
  "data": {
    "note": {
      "id": "507f1f77bcf86cd799439090",
      "type": "teacher",
      "content": "Student showed good understanding...",
      "author": {
        "id": "507f1f77bcf86cd799439020",
        "name": "Jane Smith",
        "role": "teacher"
      },
      "isPrivate": false,
      "tags": ["react", "components", "beginner"],
      "createdAt": "2025-10-08T14:45:00.000Z"
    }
  }
}
```

#### Submit Session Review

**POST** `/api/sessions/:sessionId/review`

Submit review and rating for completed session.

##### Request Body
```javascript
{
  "rating": 5, // 1-5 stars
  "comment": "Excellent session! The teacher explained concepts clearly and provided great examples.",
  "categories": {
    "teaching_quality": 5,
    "communication": 5,
    "preparedness": 5,
    "helpfulness": 5
  },
  "wouldRecommend": true,
  "feedback": {
    "whatWorkedWell": ["Clear explanations", "Good examples", "Patient teaching"],
    "areasForImprovement": ["Could use more practice exercises"],
    "suggestions": ["Maybe provide homework assignments"]
  }
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "review": {
      "id": "507f1f77bcf86cd799439100",
      "rating": 5,
      "comment": "Excellent session!...",
      "categories": { /* Ratings by category */ },
      "reviewer": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John D.", // Anonymized
        "role": "student"
      },
      "submittedAt": "2025-10-08T16:00:00.000Z"
    }
  }
}
```

---

## WebSocket Events

### Connection Events
```javascript
// Connect to session room
socket.emit('join_session', {
  sessionId: '507f1f77bcf86cd799439060',
  role: 'student'
});

// User joined session
socket.on('user_joined', (data) => {
  console.log(`${data.user.name} joined the session`);
});

// User left session
socket.on('user_left', (data) => {
  console.log(`${data.user.name} left the session`);
});
```

### Chat Events
```javascript
// Send message
socket.emit('send_message', {
  content: 'Hello!',
  type: 'text'
});

// Receive message
socket.on('new_message', (message) => {
  console.log('New message:', message);
});

// Typing indicator
socket.emit('typing_start');
socket.emit('typing_stop');

socket.on('user_typing', (data) => {
  console.log(`${data.user.name} is typing...`);
});
```

### Whiteboard Events
```javascript
// Draw on whiteboard
socket.emit('whiteboard_draw', {
  type: 'path',
  data: {
    points: [[100, 100], [150, 150]],
    stroke: '#000000',
    strokeWidth: 2
  }
});

// Receive whiteboard updates
socket.on('whiteboard_update', (data) => {
  // Update whiteboard canvas
});

// Clear whiteboard
socket.emit('whiteboard_clear');
```

### Code Collaboration Events
```javascript
// Code change
socket.emit('code_change', {
  documentId: 'doc_1',
  operation: {
    type: 'insert',
    position: { line: 5, column: 10 },
    text: 'const greeting = "Hello";'
  }
});

// Receive code updates
socket.on('code_update', (data) => {
  // Apply code changes
});

// Cursor position
socket.emit('cursor_move', {
  documentId: 'doc_1',
  position: { line: 10, column: 5 }
});
```

### Video/Audio Events
```javascript
// Toggle video
socket.emit('toggle_video', { enabled: true });

// Toggle audio
socket.emit('toggle_audio', { enabled: false });

// Screen share
socket.emit('start_screen_share');
socket.emit('stop_screen_share');

// Receive media state changes
socket.on('media_state_changed', (data) => {
  console.log('Media state:', data);
});
```

---

## Error Responses

### 400 - Bad Request
```javascript
{
  "success": false,
  "message": "Session time must be in the future",
  "code": "INVALID_SESSION_TIME"
}
```

### 403 - Forbidden
```javascript
{
  "success": false,
  "message": "Cannot join session that hasn't started yet",
  "code": "SESSION_NOT_STARTED",
  "data": {
    "sessionStartTime": "2025-10-08T14:00:00.000Z",
    "currentTime": "2025-10-08T13:45:00.000Z"
  }
}
```

### 409 - Conflict
```javascript
{
  "success": false,
  "message": "Teacher is not available at the requested time",
  "code": "TEACHER_UNAVAILABLE",
  "data": {
    "conflictingSession": "507f1f77bcf86cd799439065",
    "alternativeTimes": ["2025-10-08T15:00:00.000Z", "2025-10-08T16:00:00.000Z"]
  }
}
```

---

## Integration Examples

### Book and Join Session
```javascript
// 1. Create session
const bookingResponse = await fetch('/api/sessions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    teacherId: 'teacher123',
    skillId: 'react-skill',
    scheduledTime: '2025-10-08T14:00:00.000Z',
    duration: 60
  })
});

const { data: sessionData } = await bookingResponse.json();

// 2. Complete payment
await processPayment(sessionData.paymentUrl);

// 3. Join session when it starts
const joinResponse = await fetch(`/api/sessions/${sessionData.session.id}/join`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

const { data: collaborationData } = await joinResponse.json();

// 4. Connect to WebSocket
const socket = io(collaborationData.collaboration.socketUrl, {
  auth: { token: collaborationData.collaboration.joinToken }
});

socket.emit('join_session', {
  sessionId: sessionData.session.id,
  role: 'student'
});
```

### Real-time Collaboration Setup
```javascript
// Set up whiteboard
const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

socket.on('whiteboard_update', (data) => {
  // Render whiteboard changes
  renderWhiteboardObject(ctx, data.object);
});

// Set up code editor
const editor = monaco.editor.create(document.getElementById('code-editor'));

socket.on('code_update', (data) => {
  // Apply code changes
  const model = editor.getModel();
  model.applyEdits([data.operation]);
});

// Set up video
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');

socket.on('media_stream', (stream) => {
  remoteVideo.srcObject = stream;
});
```

---

This documentation covers the complete Session Service functionality. For implementation details, refer to `/services/session-service/` source code.