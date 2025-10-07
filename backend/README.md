# Learning Management System - Backend

A comprehensive backend API for a learning management system built with Node.js, Express, and MongoDB.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (Admin, Tutor, Learner)
  - Email verification and password reset
  - Secure password hashing with bcrypt

- **User Management**
  - User profiles with skills and preferences
  - Tutor application and approval system
  - Location-based services
  - Notification preferences

- **Skills System**
  - Hierarchical skill categories
  - Skill prerequisites and relationships
  - Difficulty levels and experience requirements
  - Skill approval workflow

- **Session Management**
  - Session booking and scheduling
  - Multiple session formats (online, in-person, hybrid)
  - Session lifecycle management
  - Automated reminders and notifications

- **Payment Processing**
  - Multiple payment methods support
  - Payment history and analytics
  - Refund management
  - Revenue tracking

- **Matching Algorithm**
  - Intelligent tutor-learner matching
  - Location-based matching
  - Skill compatibility analysis
  - Availability matching

- **Notification System**
  - Multi-channel notifications (email, in-app, SMS, push)
  - Customizable notification preferences
  - Automated session reminders
  - System announcements

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston
- **Email**: Nodemailer
- **Security**: Helmet, CORS, bcrypt
- **Environment**: dotenv

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/learning-platform
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   EMAIL_PROVIDER=smtp
   # ... (see .env.example for all variables)
   ```

5. Seed the database with sample data:
   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:seed` - Seed database with sample data

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/verify-email` | Verify email address |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |
| GET | `/api/users/tutors` | Get all tutors |
| POST | `/api/users/apply-tutor` | Apply to become tutor |
| PUT | `/api/users/approve-tutor/:id` | Approve tutor (Admin only) |

### Skills Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | Get all skills |
| POST | `/api/skills` | Create new skill |
| GET | `/api/skills/:id` | Get skill by ID |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |
| GET | `/api/skills/categories` | Get skill categories |

### Sessions Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions` | Get user sessions |
| POST | `/api/sessions` | Book new session |
| GET | `/api/sessions/:id` | Get session details |
| PUT | `/api/sessions/:id` | Update session |
| DELETE | `/api/sessions/:id` | Cancel session |
| POST | `/api/sessions/:id/complete` | Mark session complete |

### Payments Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments` | Get payment history |
| POST | `/api/payments/process` | Process payment |
| POST | `/api/payments/refund` | Request refund |
| GET | `/api/payments/analytics` | Get payment analytics |

### Matching Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/matching/find-tutors` | Find matching tutors |
| POST | `/api/matching/recommend-skills` | Get skill recommendations |
| GET | `/api/matching/compatibility/:tutorId` | Check compatibility |

### Notifications Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications |
| PUT | `/api/notifications/:id/read` | Mark notification as read |
| PUT | `/api/notifications/read-all` | Mark all as read |
| DELETE | `/api/notifications/:id` | Delete notification |

## Database Models

### User Model
- Personal information and contact details
- Authentication credentials
- Role and status management
- Skills and location data
- Notification preferences

### Skill Model
- Skill information and categorization
- Prerequisites and relationships
- Difficulty and experience levels
- Approval status

### Session Model
- Session scheduling and details
- Participant information
- Session format and location
- Status tracking and history

### Payment Model
- Payment transaction details
- Multiple payment methods
- Status and refund tracking
- Analytics data

### Notification Model
- Multi-channel notification support
- Delivery status tracking
- Priority and categorization
- Expiration management

## Security Features

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control
- **Input Validation**: Joi schema validation
- **Password Security**: bcrypt hashing
- **Rate Limiting**: Express rate limiting
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers

## Logging

The application uses Winston for structured logging:
- Console output in development
- File logging in production
- Error tracking and monitoring
- Request/response logging

## Error Handling

Centralized error handling with:
- Custom error classes
- Validation error formatting
- Database error handling
- Graceful error responses

## Environment Configuration

Key environment variables:
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - JWT signing secret
- `EMAIL_*` - Email service configuration
- `FRONTEND_URL` - Frontend application URL

## Sample Data

The seeder script creates:
- Admin user (admin@example.com / admin123)
- Sample tutors and learners
- Skill categories and skills
- Sample sessions and payments

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass
5. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.