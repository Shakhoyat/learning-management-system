# Backend API Reference

**Base URL:** `http://localhost:3000/api`

---

## 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Functionality |
|--------|----------|---------------|
| POST | `/register` | Register new user account with email verification |
| POST | `/login` | Login with credentials, returns access and refresh tokens |
| POST | `/refresh` | Refresh access token using refresh token |
| POST | `/logout` | Logout user and invalidate tokens |
| POST | `/forgot-password` | Send password reset link to user's email |
| POST | `/reset-password` | Reset password using token from email |
| POST | `/verify-email` | Verify user email address with verification token |
| GET | `/me` | Get current authenticated user details |
| PUT | `/profile` | Update current user profile information |
| PUT | `/change-password` | Change password for authenticated user |

---

## 👥 Users (`/api/users`)

| Method | Endpoint | Functionality |
|--------|----------|---------------|
| GET | `/` | Get all users with filtering and pagination |
| GET | `/:id` | Get specific user details by ID |
| GET | `/:id/stats` | Get user statistics (sessions, ratings, etc.) |
| PUT | `/:id` | Update user profile (auth required) |
| DELETE | `/:id` | Delete user account (auth required) |
| GET | `/analytics` | Get comprehensive analytics for current user |
| GET | `/me/progress` | Get learning progress and milestones for current user |
| GET | `/me/achievements` | Get achievements and badges earned by user |
| POST | `/:id/teaching-skills` | Add teaching skill to user profile |
| DELETE | `/:id/teaching-skills/:skillId` | Remove teaching skill from user profile |
| POST | `/:id/learning-skills` | Add learning skill to user profile |
| DELETE | `/:id/learning-skills/:skillId` | Remove learning skill from user profile |

---

## 🎯 Skills (`/api/skills`)

| Method | Endpoint | Functionality |
|--------|----------|---------------|
| GET | `/` | Get all skills with filtering options |
| GET | `/search` | Search skills by name, category, or tags |
| GET | `/categories` | Get all skill categories available |
| GET | `/categories/:category` | Get all skills in specific category |
| GET | `/popular` | Get most popular skills by usage |
| GET | `/trending` | Get trending skills based on recent activity |
| GET | `/statistics` | Get overall skill statistics and distribution |
| GET | `/:id` | Get detailed information about specific skill |
| GET | `/:id/prerequisites` | Get prerequisite skills for a skill |
| GET | `/:id/path` | Get learning path and skill progression |
| POST | `/` | Create new skill (admin only) |
| PUT | `/:id` | Update skill information (admin only) |
| DELETE | `/:id` | Delete skill from system (admin only) |

---

## 📅 Sessions (`/api/sessions`)

| Method | Endpoint | Functionality |
|--------|----------|---------------|
| GET | `/` | Get all sessions with filters (own/enrolled) |
| GET | `/upcoming` | Get upcoming sessions for current user |
| GET | `/stats` | Get session statistics for current user |
| GET | `/:id` | Get detailed information about specific session |
| POST | `/` | Create new teaching session (tutors only) |
| PUT | `/:id` | Update session details (creator only) |
| DELETE | `/:id` | Cancel/delete session (creator only) |
| POST | `/:id/start` | Mark session as started and begin tracking |
| POST | `/:id/complete` | Mark session as completed and record data |
| POST | `/:id/feedback` | Add feedback/rating for completed session |

---

## 💳 Payments (`/api/payments`)

| Method | Endpoint | Functionality |
|--------|----------|---------------|
| GET | `/` | Get all payments for current user |
| GET | `/methods` | Get available payment methods and configurations |
| GET | `/stats` | Get payment statistics for current user |
| GET | `/:id` | Get detailed payment information by ID |
| POST | `/` | Create new payment for session booking |
| POST | `/:id/refund` | Request refund for completed payment |
| POST | `/webhooks` | Handle payment gateway webhooks (public) |
| PUT | `/:id/status` | Update payment status (admin only) |

---

## 🔔 Notifications (`/api/notifications`)

| Method | Endpoint | Functionality |
|--------|----------|---------------|
| GET | `/` | Get all notifications for current user |
| GET | `/unread-count` | Get count of unread notifications |
| GET | `/preferences` | Get user notification preferences and settings |
| PUT | `/preferences` | Update notification preferences for user |
| GET | `/:id` | Get specific notification details by ID |
| PUT | `/:id/read` | Mark single notification as read |
| PUT | `/:id/dismiss` | Mark notification as dismissed/archived |
| PUT | `/read/multiple` | Mark multiple notifications as read |
| PUT | `/read/all` | Mark all notifications as read |
| POST | `/:id/action` | Record action taken on notification |
| DELETE | `/:id` | Delete specific notification permanently |
| POST | `/` | Create new notification (admin only) |
| POST | `/bulk` | Send bulk notifications to multiple users (admin only) |
| GET | `/admin/stats` | Get notification system statistics (admin only) |

---

## 🤝 Matching (`/api/matching`)

| Method | Endpoint | Functionality |
|--------|----------|---------------|
| GET | `/tutors` | Find matching tutors based on skills and criteria |
| GET | `/learners` | Find matching learners for tutors |
| GET | `/skills` | Get skill-based matches for collaboration |
| GET | `/recommendations` | Get recommended skills based on user profile |
| GET | `/stats` | Get matching system statistics and insights |

---

## 📊 Analytics (`/api/analytics`)

| Method | Endpoint | Functionality |
|--------|----------|---------------|
| GET | `/teaching` | Get comprehensive teaching analytics (tutors only) |
| GET | `/learning` | Get comprehensive learning analytics for learners |
| GET | `/overview` | Get analytics overview auto-detecting user role |
| GET | `/history` | Get historical analytics for multiple periods |
| GET | `/assessments` | Get assessment performance and statistics |
| POST | `/reports` | Generate new analytics report with filters |
| GET | `/reports` | Get list of generated reports for user |
| GET | `/reports/:reportId` | Get specific analytics report by ID |
| GET | `/leaderboard` | Get leaderboard with peer comparison and rankings |
| GET | `/teaching/engagement-heatmap` | Get student activity heatmap by day/time (tutors only) |
| GET | `/teaching/score-distribution` | Get student score distribution histogram (tutors only) |
| GET | `/teaching/calendar-heatmap` | Get attendance/assignment calendar heatmap (tutors only) |

---

## 📝 Notes

- **Authentication:** Most endpoints require authentication via Bearer token in Authorization header
- **Pagination:** List endpoints support `page` and `limit` query parameters
- **Filtering:** Use query parameters for filtering results (dates, status, etc.)
- **Rate Limiting:** API has rate limiting enabled for security
- **Error Handling:** All errors return consistent JSON format with error details
