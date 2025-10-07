# Notification Service Documentation

## Overview
The Notification Service handles all communication channels including email, SMS, push notifications, and in-app notifications. It provides templates, scheduling, delivery tracking, and user preference management.

## Service Details
- **Port**: 3007
- **Base URL**: `http://localhost:3007`
- **API Prefix**: `/api/notifications`

## Features
- 📧 Email notifications with templates
- 📱 SMS notifications
- 🔔 Push notifications (web & mobile)
- 💬 In-app notifications
- ⏰ Scheduled delivery
- 📊 Delivery tracking and analytics
- ⚙️ User notification preferences
- 🎯 Targeted campaigns
- 📝 Template management

---

## API Endpoints

### 📬 Send Notifications

#### Send Single Notification

**POST** `/api/notifications/send`

Send a notification through specified channel(s).

##### Request Body
```javascript
{
  "type": "session_reminder", // Notification type
  "channels": ["email", "push"], // Delivery channels
  "recipients": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "email": "student@example.com",
      "phone": "+1234567890",
      "pushTokens": ["device_token_123"]
    }
  ],
  "data": {
    "sessionId": "507f1f77bcf86cd799439050",
    "sessionTitle": "React Fundamentals - Lesson 1",
    "teacherName": "John Doe",
    "startTime": "2025-10-07T14:00:00.000Z",
    "meetingLink": "https://meet.example.com/session/abc123"
  },
  "scheduling": {
    "sendAt": "2025-10-07T13:30:00.000Z", // Optional: schedule for later
    "timezone": "America/New_York"
  },
  "options": {
    "priority": "high", // low, normal, high, urgent
    "respectUserPreferences": true,
    "trackOpens": true,
    "trackClicks": true
  }
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Notification sent successfully",
  "data": {
    "notificationId": "507f1f77bcf86cd799439100",
    "status": "sent", // sent, scheduled, failed, partial
    "recipients": 1,
    "channels": {
      "email": {
        "status": "sent",
        "messageId": "email_msg_123",
        "deliveredAt": "2025-10-07T13:31:15.000Z"
      },
      "push": {
        "status": "sent",
        "messageId": "push_msg_456",
        "deliveredAt": "2025-10-07T13:31:12.000Z"
      }
    },
    "trackingId": "track_789abc",
    "scheduledFor": null
  }
}
```

#### Send Bulk Notifications

**POST** `/api/notifications/bulk`

Send notifications to multiple recipients efficiently.

##### Request Body
```javascript
{
  "type": "course_announcement",
  "template": "course_update",
  "channels": ["email", "in_app"],
  "recipients": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "email": "student1@example.com",
      "customData": {
        "courseName": "React Masterclass",
        "studentName": "Alice Johnson"
      }
    },
    {
      "userId": "507f1f77bcf86cd799439012",
      "email": "student2@example.com",
      "customData": {
        "courseName": "Vue.js Basics",
        "studentName": "Bob Smith"
      }
    }
  ],
  "commonData": {
    "instructorName": "Dr. Sarah Wilson",
    "announcementDate": "2025-10-07",
    "unsubscribeLink": "{{unsubscribe_url}}"
  },
  "options": {
    "batchSize": 100,
    "delayBetweenBatches": 1000, // milliseconds
    "respectUserPreferences": true
  }
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Bulk notification queued successfully",
  "data": {
    "campaignId": "campaign_507f1f77bcf86cd799439101",
    "totalRecipients": 1250,
    "estimatedDeliveryTime": "2025-10-07T14:15:00.000Z",
    "batchInfo": {
      "totalBatches": 13,
      "batchSize": 100,
      "processingStarted": true
    },
    "trackingUrl": "/api/notifications/campaigns/campaign_507f1f77bcf86cd799439101/status"
  }
}
```

---

### 📭 In-App Notifications

#### Get User Notifications

**GET** `/api/notifications/inbox`

Get user's in-app notifications with pagination.

##### Query Parameters
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Results per page
- `status` (string) - Filter by status: `unread`, `read`, `archived`
- `type` (string) - Filter by notification type
- `priority` (string) - Filter by priority level

##### Response
```javascript
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "507f1f77bcf86cd799439102",
        "type": "session_reminder",
        "title": "Upcoming Session: React Fundamentals",
        "message": "Your session with John Doe starts in 30 minutes",
        "priority": "high",
        "status": "unread",
        "data": {
          "sessionId": "507f1f77bcf86cd799439050",
          "teacherId": "507f1f77bcf86cd799439020",
          "actionUrl": "/sessions/507f1f77bcf86cd799439050"
        },
        "actions": [
          {
            "type": "join_session",
            "label": "Join Now",
            "url": "/sessions/507f1f77bcf86cd799439050/join"
          },
          {
            "type": "reschedule",
            "label": "Reschedule",
            "url": "/sessions/507f1f77bcf86cd799439050/reschedule"
          }
        ],
        "createdAt": "2025-10-07T13:30:00.000Z",
        "readAt": null,
        "expiresAt": "2025-10-07T15:00:00.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439103",
        "type": "payment_received",
        "title": "Payment Received",
        "message": "You've received $45.00 for your React session",
        "priority": "normal",
        "status": "read",
        "data": {
          "paymentId": "507f1f77bcf86cd799439080",
          "amount": 4500,
          "sessionId": "507f1f77bcf86cd799439051"
        },
        "actions": [
          {
            "type": "view_payment",
            "label": "View Details",
            "url": "/payments/507f1f77bcf86cd799439080"
          }
        ],
        "createdAt": "2025-10-06T18:45:00.000Z",
        "readAt": "2025-10-06T19:20:00.000Z",
        "expiresAt": null
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalNotifications": 87,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "unread": 12,
      "total": 87,
      "highPriority": 3
    }
  }
}
```

#### Mark Notification as Read

**PUT** `/api/notifications/:notificationId/read`

Mark a specific notification as read.

##### Response
```javascript
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "notificationId": "507f1f77bcf86cd799439102",
    "status": "read",
    "readAt": "2025-10-07T14:15:30.000Z"
  }
}
```

#### Mark All as Read

**PUT** `/api/notifications/mark-all-read`

Mark all user notifications as read.

##### Response
```javascript
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "markedCount": 12,
    "markedAt": "2025-10-07T14:20:00.000Z"
  }
}
```

#### Delete Notification

**DELETE** `/api/notifications/:notificationId`

Delete a specific notification.

##### Response
```javascript
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

### ⚙️ User Preferences

#### Get Notification Preferences

**GET** `/api/notifications/preferences`

Get user's notification preferences.

##### Response
```javascript
{
  "success": true,
  "data": {
    "preferences": {
      "channels": {
        "email": {
          "enabled": true,
          "address": "user@example.com",
          "verified": true
        },
        "sms": {
          "enabled": false,
          "phone": "+1234567890",
          "verified": true
        },
        "push": {
          "enabled": true,
          "devices": [
            {
              "deviceId": "device_123",
              "platform": "web",
              "token": "push_token_456",
              "lastActive": "2025-10-07T12:00:00.000Z"
            }
          ]
        },
        "inApp": {
          "enabled": true
        }
      },
      "types": {
        "session_reminders": {
          "email": true,
          "sms": false,
          "push": true,
          "inApp": true,
          "timing": "30_minutes_before" // 5_min, 15_min, 30_min, 1_hour, 2_hours
        },
        "payment_notifications": {
          "email": true,
          "sms": false,
          "push": true,
          "inApp": true
        },
        "course_updates": {
          "email": true,
          "sms": false,
          "push": false,
          "inApp": true
        },
        "system_announcements": {
          "email": false,
          "sms": false,
          "push": false,
          "inApp": true
        },
        "marketing": {
          "email": false,
          "sms": false,
          "push": false,
          "inApp": false
        }
      },
      "quietHours": {
        "enabled": true,
        "startTime": "22:00",
        "endTime": "08:00",
        "timezone": "America/New_York",
        "excludeUrgent": true
      },
      "frequency": {
        "digest": "daily", // off, daily, weekly
        "digestTime": "09:00",
        "maxPerDay": 10
      }
    },
    "lastUpdated": "2025-10-05T10:30:00.000Z"
  }
}
```

#### Update Notification Preferences

**PUT** `/api/notifications/preferences`

Update user's notification preferences.

##### Request Body
```javascript
{
  "channels": {
    "sms": {
      "enabled": true,
      "phone": "+1234567890"
    }
  },
  "types": {
    "session_reminders": {
      "sms": true,
      "timing": "15_minutes_before"
    }
  },
  "quietHours": {
    "enabled": true,
    "startTime": "23:00",
    "endTime": "07:00"
  }
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Notification preferences updated successfully",
  "data": {
    "updatedAt": "2025-10-07T14:25:00.000Z",
    "changesApplied": [
      "SMS notifications enabled",
      "Session reminder timing changed to 15 minutes",
      "Quiet hours updated"
    ]
  }
}
```

---

### 📝 Templates Management

#### Get Notification Templates

**GET** `/api/notifications/templates`

Get available notification templates (Admin only).

##### Query Parameters
- `type` (string) - Filter by notification type
- `channel` (string) - Filter by delivery channel
- `status` (string) - Filter by template status: `active`, `draft`, `archived`

##### Response
```javascript
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "507f1f77bcf86cd799439200",
        "name": "Session Reminder",
        "type": "session_reminder",
        "description": "Reminds users about upcoming sessions",
        "channels": {
          "email": {
            "subject": "Upcoming Session: {{sessionTitle}}",
            "html": "<h1>Session Reminder</h1><p>Your session with {{teacherName}} starts in {{timeUntilSession}}.</p>",
            "text": "Session Reminder: Your session with {{teacherName}} starts in {{timeUntilSession}}."
          },
          "sms": {
            "message": "Reminder: Your {{sessionTitle}} session with {{teacherName}} starts in {{timeUntilSession}}. Join: {{meetingLink}}"
          },
          "push": {
            "title": "Session Starting Soon",
            "body": "{{sessionTitle}} with {{teacherName}} starts in {{timeUntilSession}}",
            "icon": "/icons/session-reminder.png",
            "actions": [
              {
                "action": "join",
                "title": "Join Now"
              },
              {
                "action": "dismiss",
                "title": "Dismiss"
              }
            ]
          },
          "inApp": {
            "title": "Upcoming Session: {{sessionTitle}}",
            "message": "Your session with {{teacherName}} starts in {{timeUntilSession}}",
            "actions": [
              {
                "type": "join_session",
                "label": "Join Now",
                "url": "/sessions/{{sessionId}}/join"
              }
            ]
          }
        },
        "variables": [
          {
            "name": "sessionTitle",
            "description": "Title of the session",
            "required": true,
            "type": "string"
          },
          {
            "name": "teacherName",
            "description": "Name of the teacher",
            "required": true,
            "type": "string"
          },
          {
            "name": "timeUntilSession",
            "description": "Human-readable time until session",
            "required": true,
            "type": "string"
          }
        ],
        "status": "active",
        "version": "1.2",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-09-15T00:00:00.000Z"
      }
    ],
    "totalTemplates": 25
  }
}
```

#### Create Template

**POST** `/api/notifications/templates`

Create a new notification template (Admin only).

##### Request Body
```javascript
{
  "name": "Course Completion",
  "type": "course_completion",
  "description": "Congratulates users on course completion",
  "channels": {
    "email": {
      "subject": "Congratulations! You completed {{courseName}}",
      "html": "<h1>Course Completed!</h1><p>Congratulations {{studentName}} on completing {{courseName}}!</p>",
      "text": "Congratulations {{studentName}} on completing {{courseName}}!"
    },
    "inApp": {
      "title": "Course Completed!",
      "message": "Congratulations on completing {{courseName}}",
      "actions": [
        {
          "type": "view_certificate",
          "label": "View Certificate",
          "url": "/certificates/{{certificateId}}"
        }
      ]
    }
  },
  "variables": [
    {
      "name": "studentName",
      "description": "Student's full name",
      "required": true,
      "type": "string"
    },
    {
      "name": "courseName",
      "description": "Name of completed course",
      "required": true,
      "type": "string"
    }
  ]
}
```

##### Response
```javascript
{
  "success": true,
  "message": "Template created successfully",
  "data": {
    "template": {
      "id": "507f1f77bcf86cd799439201",
      "name": "Course Completion",
      "type": "course_completion",
      "status": "draft",
      "version": "1.0",
      "createdAt": "2025-10-07T14:30:00.000Z"
    }
  }
}
```

---

### 📊 Analytics & Tracking

#### Get Delivery Statistics

**GET** `/api/notifications/analytics/delivery`

Get notification delivery analytics.

##### Query Parameters
- `startDate` (string) - Start date (ISO format)
- `endDate` (string) - End date (ISO format)
- `type` (string) - Filter by notification type
- `channel` (string) - Filter by delivery channel

##### Response
```javascript
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2025-10-01T00:00:00.000Z",
      "endDate": "2025-10-07T23:59:59.999Z"
    },
    "overview": {
      "totalSent": 15420,
      "totalDelivered": 14890,
      "totalFailed": 530,
      "deliveryRate": 0.965,
      "averageDeliveryTime": 2.3 // seconds
    },
    "byChannel": {
      "email": {
        "sent": 8500,
        "delivered": 8245,
        "bounced": 155,
        "opened": 6420,
        "clicked": 1280,
        "unsubscribed": 12,
        "deliveryRate": 0.97,
        "openRate": 0.78,
        "clickRate": 0.20
      },
      "sms": {
        "sent": 2100,
        "delivered": 2085,
        "failed": 15,
        "deliveryRate": 0.993
      },
      "push": {
        "sent": 4200,
        "delivered": 3890,
        "failed": 310,
        "opened": 2340,
        "deliveryRate": 0.926,
        "openRate": 0.60
      },
      "inApp": {
        "sent": 620,
        "delivered": 620,
        "read": 580,
        "clicked": 420,
        "deliveryRate": 1.0,
        "readRate": 0.935
      }
    },
    "byType": {
      "session_reminder": {
        "sent": 5200,
        "deliveryRate": 0.98,
        "engagement": 0.85
      },
      "payment_notification": {
        "sent": 1800,
        "deliveryRate": 0.99,
        "engagement": 0.92
      }
    },
    "trends": {
      "daily": [
        {
          "date": "2025-10-01",
          "sent": 2200,
          "delivered": 2145,
          "deliveryRate": 0.975
        }
      ],
      "hourly": [
        {
          "hour": 9,
          "sent": 450,
          "delivered": 440,
          "deliveryRate": 0.978
        }
      ]
    }
  }
}
```

#### Get Campaign Status

**GET** `/api/notifications/campaigns/:campaignId/status`

Get real-time status of a bulk notification campaign.

##### Response
```javascript
{
  "success": true,
  "data": {
    "campaign": {
      "id": "campaign_507f1f77bcf86cd799439101",
      "name": "Course Announcement - October 2025",
      "type": "course_announcement",
      "status": "processing", // queued, processing, completed, failed, paused
      "createdAt": "2025-10-07T14:00:00.000Z",
      "startedAt": "2025-10-07T14:01:00.000Z",
      "estimatedCompletion": "2025-10-07T14:15:00.000Z"
    },
    "progress": {
      "totalRecipients": 1250,
      "processed": 800,
      "successful": 785,
      "failed": 15,
      "remaining": 450,
      "percentComplete": 64
    },
    "batches": {
      "total": 13,
      "completed": 8,
      "processing": 1,
      "pending": 4,
      "currentBatch": {
        "batchNumber": 9,
        "recipients": 100,
        "startedAt": "2025-10-07T14:12:00.000Z",
        "progress": 0.45
      }
    },
    "delivery": {
      "byChannel": {
        "email": {
          "attempted": 800,
          "delivered": 785,
          "failed": 15
        },
        "inApp": {
          "attempted": 800,
          "delivered": 800,
          "failed": 0
        }
      }
    },
    "errors": [
      {
        "type": "invalid_email",
        "count": 8,
        "message": "Invalid email address format"
      },
      {
        "type": "smtp_error",
        "count": 7,
        "message": "SMTP delivery failed"
      }
    ]
  }
}
```

---

### 🔔 Real-time Updates (WebSocket)

#### Subscribe to Notifications

Connect to WebSocket for real-time notification updates.

**WebSocket Connection**: `ws://localhost:3007/notifications`

##### Authentication
```javascript
// Send authentication after connection
ws.send(JSON.stringify({
  type: 'authenticate',
  token: 'your_jwt_token'
}));
```

##### Events Received

###### New Notification
```javascript
{
  "type": "new_notification",
  "data": {
    "id": "507f1f77bcf86cd799439105",
    "type": "session_reminder",
    "title": "Session starting in 5 minutes",
    "message": "Your React session with John Doe is about to start",
    "priority": "urgent",
    "actions": [
      {
        "type": "join_session",
        "label": "Join Now",
        "url": "/sessions/507f1f77bcf86cd799439050/join"
      }
    ],
    "createdAt": "2025-10-07T14:55:00.000Z"
  }
}
```

###### Notification Status Update
```javascript
{
  "type": "notification_status",
  "data": {
    "notificationId": "507f1f77bcf86cd799439102",
    "status": "read",
    "readAt": "2025-10-07T14:15:30.000Z"
  }
}
```

---

## Error Responses

### 400 - Invalid Template Variables
```javascript
{
  "success": false,
  "message": "Missing required template variables",
  "code": "MISSING_VARIABLES",
  "data": {
    "missing": ["sessionTitle", "teacherName"],
    "provided": ["sessionId", "startTime"]
  }
}
```

### 429 - Rate Limit Exceeded
```javascript
{
  "success": false,
  "message": "Notification rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "data": {
    "limit": 100,
    "window": "1 hour",
    "resetTime": "2025-10-07T15:00:00.000Z"
  }
}
```

---

## Integration Examples

### Send Session Reminder
```javascript
const sendSessionReminder = async (sessionData) => {
  const notification = {
    type: 'session_reminder',
    channels: ['email', 'push', 'inApp'],
    recipients: [{
      userId: sessionData.studentId,
      email: sessionData.studentEmail,
      pushTokens: sessionData.pushTokens
    }],
    data: {
      sessionId: sessionData.id,
      sessionTitle: sessionData.title,
      teacherName: sessionData.teacher.name,
      startTime: sessionData.startTime,
      meetingLink: sessionData.meetingLink
    },
    scheduling: {
      sendAt: new Date(sessionData.startTime - 30 * 60 * 1000), // 30 minutes before
      timezone: sessionData.timezone
    },
    options: {
      priority: 'high',
      respectUserPreferences: true
    }
  };
  
  const response = await fetch('/api/notifications/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(notification)
  });
  
  return response.json();
};
```

### Real-time Notification Handler
```javascript
const setupNotificationListener = () => {
  const ws = new WebSocket('ws://localhost:3007/notifications');
  
  ws.onopen = () => {
    // Authenticate
    ws.send(JSON.stringify({
      type: 'authenticate',
      token: localStorage.getItem('authToken')
    }));
  };
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    switch (message.type) {
      case 'new_notification':
        displayNotification(message.data);
        updateNotificationCounter();
        break;
        
      case 'notification_status':
        updateNotificationUI(message.data);
        break;
    }
  };
  
  return ws;
};

const displayNotification = (notification) => {
  // Show browser notification
  if (Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/icons/notification.png',
      actions: notification.actions
    });
  }
  
  // Update in-app notification list
  addToNotificationList(notification);
};
```

---

This documentation covers the complete Notification Service functionality. For implementation details, refer to `/services/notification-service/` source code.