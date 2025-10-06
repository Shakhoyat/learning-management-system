# Auth Service Documentation

## Overview
The Auth Service handles all authentication and authorization operations for the Learning Management System. It provides secure user registration, login, token management, and role-based access control.

## Service Details
- **Port**: 3001
- **Base URL**: `http://localhost:3001`
- **API Prefix**: `/api/auth`

## Features
- 🔐 JWT-based authentication
- 🔑 Secure password hashing (bcrypt)
- 👥 Role-based access control (RBAC)
- 🔄 Token refresh mechanism
- 📧 Email verification
- 🔒 Password reset functionality
- 🛡️ Account lockout protection
- 📱 Two-factor authentication (2FA)

## User Roles
- `student` - Can book sessions, leave reviews
- `teacher` - Can offer skills, manage sessions  
- `admin` - Platform administration
- `super_admin` - Full system access

## API Endpoints

---

### 🚀 User Registration

**POST** `/api/auth/register`

Register a new user account.

#### Request Body
```javascript
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "personal": {
    "name": {
      "first": "John",
      "last": "Doe"
    },
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male" // male, female, other, prefer_not_to_say
  },
  "role": "student", // student, teacher
  "agreedToTerms": true,
  "marketingEmails": false
}
```

#### Response
```javascript
{
  "success": true,
  "message": "Registration successful. Please check your email for verification.",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "student",
    "emailVerificationRequired": true
  },
  "timestamp": "2025-10-07T00:00:00.000Z"
}
```

#### Validation Rules
- Email must be valid format and unique
- Password: minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
- Phone number must be valid format
- Date of birth: user must be at least 13 years old

---

### 🔑 User Login

**POST** `/api/auth/login`

Authenticate user and receive access tokens.

#### Request Body
```javascript
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "rememberMe": false, // Optional: extends token expiry
  "deviceInfo": { // Optional: for device tracking
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.1",
    "deviceType": "desktop"
  }
}
```

#### Response
```javascript
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "role": "student",
      "personal": {
        "name": {
          "first": "John",
          "last": "Doe"
        },
        "avatar": "https://...",
        "emailVerified": true
      },
      "lastLogin": "2025-10-07T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 604800, // 7 days in seconds
      "tokenType": "Bearer"
    }
  },
  "timestamp": "2025-10-07T00:00:00.000Z"
}
```

---

### 🔄 Token Refresh

**POST** `/api/auth/refresh`

Refresh expired access token using refresh token.

#### Request Body
```javascript
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Response
```javascript
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 604800
  }
}
```

---

### 🚪 Logout

**POST** `/api/auth/logout`

Logout user and invalidate tokens.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Request Body
```javascript
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...", // Optional
  "logoutAllDevices": false // Optional: logout from all devices
}
```

#### Response
```javascript
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 📧 Email Verification

**POST** `/api/auth/verify-email`

Verify user email address with verification token.

#### Request Body
```javascript
{
  "token": "email_verification_token_here"
}
```

#### Response
```javascript
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "emailVerified": true,
    "verifiedAt": "2025-10-07T00:00:00.000Z"
  }
}
```

---

### 📧 Resend Verification Email

**POST** `/api/auth/resend-verification`

Resend email verification link.

#### Request Body
```javascript
{
  "email": "user@example.com"
}
```

#### Response
```javascript
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

---

### 🔐 Forgot Password

**POST** `/api/auth/forgot-password`

Request password reset email.

#### Request Body
```javascript
{
  "email": "user@example.com"
}
```

#### Response
```javascript
{
  "success": true,
  "message": "Password reset email sent if account exists"
}
```

---

### 🔒 Reset Password

**POST** `/api/auth/reset-password`

Reset password using reset token.

#### Request Body
```javascript
{
  "token": "password_reset_token_here",
  "newPassword": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

#### Response
```javascript
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 🔑 Change Password

**PUT** `/api/auth/change-password`

Change password for authenticated user.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Request Body
```javascript
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

#### Response
```javascript
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 👤 Get Current User

**GET** `/api/auth/me`

Get current authenticated user information.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Response
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
          "last": "Doe"
        },
        "avatar": "https://...",
        "emailVerified": true,
        "phoneVerified": false
      },
      "security": {
        "twoFactorEnabled": false,
        "lastPasswordChange": "2025-10-01T00:00:00.000Z"
      },
      "metadata": {
        "createdAt": "2025-01-01T00:00:00.000Z",
        "lastLogin": "2025-10-07T00:00:00.000Z",
        "loginCount": 25
      }
    }
  }
}
```

---

### 📱 Enable Two-Factor Authentication

**POST** `/api/auth/2fa/enable`

Enable 2FA for user account.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Response
```javascript
{
  "success": true,
  "message": "2FA setup initiated",
  "data": {
    "qrCode": "data:image/png;base64,...", // QR code for authenticator app
    "secret": "JBSWY3DPEHPK3PXP", // Secret key for manual entry
    "backupCodes": [ // One-time backup codes
      "12345678",
      "87654321",
      // ... 8 more codes
    ]
  }
}
```

---

### ✅ Verify Two-Factor Authentication

**POST** `/api/auth/2fa/verify`

Verify and activate 2FA with code from authenticator app.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Request Body
```javascript
{
  "code": "123456" // 6-digit code from authenticator app
}
```

#### Response
```javascript
{
  "success": true,
  "message": "2FA enabled successfully",
  "data": {
    "twoFactorEnabled": true,
    "backupCodes": ["12345678", "87654321"] // Show backup codes one final time
  }
}
```

---

### 🔓 Disable Two-Factor Authentication

**POST** `/api/auth/2fa/disable`

Disable 2FA for user account.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Request Body
```javascript
{
  "password": "CurrentPassword123!",
  "code": "123456" // Current 2FA code or backup code
}
```

#### Response
```javascript
{
  "success": true,
  "message": "2FA disabled successfully"
}
```

---

### 🔐 Validate Token

**POST** `/api/auth/validate`

Validate if a token is still valid (used by other services).

#### Request Body
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Response
```javascript
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "role": "student"
    },
    "permissions": ["read:profile", "write:sessions"]
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
      "field": "email",
      "message": "Email is already registered"
    },
    {
      "field": "password",
      "message": "Password must contain at least 8 characters"
    }
  ]
}
```

### 401 - Unauthorized
```javascript
{
  "success": false,
  "message": "Invalid credentials",
  "code": "INVALID_CREDENTIALS"
}
```

### 403 - Account Locked
```javascript
{
  "success": false,
  "message": "Account temporarily locked due to multiple failed login attempts",
  "code": "ACCOUNT_LOCKED",
  "data": {
    "lockoutExpiresAt": "2025-10-07T01:00:00.000Z",
    "remainingMinutes": 45
  }
}
```

### 422 - Unprocessable Entity
```javascript
{
  "success": false,
  "message": "Email not verified",
  "code": "EMAIL_NOT_VERIFIED",
  "data": {
    "requiresVerification": true
  }
}
```

---

## Security Features

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number
- At least 1 special character (!@#$%^&*)
- Cannot contain common words or email address

### Account Protection
- **Rate Limiting**: 5 login attempts per 15 minutes
- **Account Lockout**: 30 minutes after 5 failed attempts
- **Password History**: Cannot reuse last 5 passwords
- **Session Management**: Automatic logout after inactivity
- **IP Tracking**: Monitor login locations

### Token Security
- **JWT Tokens**: Signed with HS256 algorithm
- **Access Token TTL**: 7 days (configurable)
- **Refresh Token TTL**: 30 days (configurable)
- **Token Blacklisting**: Invalidated tokens stored in Redis
- **Device Tracking**: Track active sessions per device

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/login` | 5 requests | 15 minutes |
| `/register` | 3 requests | 15 minutes |
| `/forgot-password` | 3 requests | 15 minutes |
| `/resend-verification` | 3 requests | 15 minutes |
| General endpoints | 100 requests | 15 minutes |

---

## Integration Examples

### Frontend Login Flow
```javascript
// Login user
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();

// Store tokens securely
localStorage.setItem('accessToken', data.tokens.accessToken);
localStorage.setItem('refreshToken', data.tokens.refreshToken);

// Set up automatic token refresh
setInterval(async () => {
  const refreshResponse = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refreshToken: localStorage.getItem('refreshToken')
    })
  });
  
  if (refreshResponse.ok) {
    const refreshData = await refreshResponse.json();
    localStorage.setItem('accessToken', refreshData.data.accessToken);
  }
}, 6 * 60 * 60 * 1000); // Refresh every 6 hours
```

### Protected API Calls
```javascript
// Make authenticated request
const response = await fetch('/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  }
});

// Handle token expiration
if (response.status === 401) {
  // Token expired, try to refresh
  const refreshResponse = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refreshToken: localStorage.getItem('refreshToken')
    })
  });
  
  if (refreshResponse.ok) {
    // Retry original request with new token
  } else {
    // Redirect to login
    window.location.href = '/login';
  }
}
```

### Service-to-Service Authentication
```javascript
// Validate token from another service
const validateToken = async (token) => {
  const response = await fetch('http://auth-service:3001/api/auth/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  
  const result = await response.json();
  return result.success ? result.data.user : null;
};
```

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String, // unique, indexed
  password: String, // bcrypt hashed
  role: String, // enum: student, teacher, admin, super_admin
  
  personal: {
    name: {
      first: String,
      last: String
    },
    avatar: String,
    phone: String,
    dateOfBirth: Date,
    gender: String
  },
  
  security: {
    emailVerified: Boolean,
    phoneVerified: Boolean,
    twoFactorEnabled: Boolean,
    twoFactorSecret: String,
    backupCodes: [String],
    passwordHistory: [String], // last 5 password hashes
    lastPasswordChange: Date,
    failedLoginAttempts: Number,
    accountLockedUntil: Date
  },
  
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    lastLogin: Date,
    loginCount: Number,
    isActive: Boolean
  }
}
```

### Session Collection (Redis)
```javascript
{
  userId: String,
  deviceId: String,
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  lastActivity: Date,
  refreshToken: String
}
```

---

This documentation covers the complete Auth Service functionality. For implementation details, refer to `/services/auth-service/` source code.