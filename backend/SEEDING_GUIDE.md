# Database Seeding Guide

## Overview
This script seeds the database with comprehensive, realistic test data for the Learning Management System.

## What Gets Seeded

### 1. Skills (20 skills across categories)
- **Programming**: JavaScript, Python, React, Node.js, TypeScript
- **Design**: UI/UX Design, Graphic Design, Figma
- **Languages**: English, Spanish
- **Mathematics**: Calculus, Statistics
- **Business**: Digital Marketing, Project Management
- **Music**: Guitar, Piano
- **Science**: Data Science, Machine Learning
- **Photography**: Photography, Video Editing

### 2. Users (20 users)
- **10 Tutors** with:
  - Realistic profiles and bios
  - Teaching skills with ratings (3.5-5.0)
  - Hourly rates ($30-$80)
  - Teaching statistics
  - Experience (50-250 hours taught)
  
- **10 Learners** with:
  - Learning goals
  - Skill levels (1-5 current, 8-10 target)
  - Preferred learning styles
  - Learning statistics

### 3. Sessions (60-100 sessions)
- **Scheduled** - Upcoming sessions
- **Completed** - Past sessions with feedback
- **Cancelled** - Cancelled sessions
- **In Progress** - Currently ongoing

Each session includes:
- Meeting details (Zoom, Google Meet, Teams)
- Objectives
- Pricing information
- Feedback and ratings (for completed)

### 4. Payments (for completed sessions)
- Payment IDs and transaction IDs
- Payment methods (Card, PayPal, Stripe)
- Status history
- Metadata

### 5. Notifications (100+ notifications)
- Welcome messages
- Session reminders
- Completion notifications
- System announcements

## How to Run

### Method 1: Using Node.js
```bash
cd backend
node seed-database.js
```

### Method 2: Using npm script (if added to package.json)
```bash
cd backend
npm run seed
```

## Test Accounts

After seeding, you can login with these accounts:

### Tutors
- **Email**: sarah.johnson@example.com
- **Password**: password123
- **Specialty**: JavaScript, React, Node.js, TypeScript

- **Email**: michael.chen@example.com
- **Password**: password123
- **Specialty**: Python, Data Science, Machine Learning

- **Email**: emily.rodriguez@example.com
- **Password**: password123
- **Specialty**: UI/UX Design, Figma

### Learners
- **Email**: alex.thompson@example.com
- **Password**: password123
- **Learning**: JavaScript, React, Node.js

- **Email**: sophia.martinez@example.com
- **Password**: password123
- **Learning**: Python, Data Science

- **Email**: oliver.brown@example.com
- **Password**: password123
- **Learning**: UI/UX Design, Figma

**All accounts use the same password**: `password123`

## Data Characteristics

### Realistic Distribution
- 60% of sessions are completed (past)
- 30% are scheduled (future)
- 10% are cancelled
- Ratings range from 3.5 to 5.0 stars
- Session durations: 30, 60, 90, or 120 minutes

### Temporal Spread
- Completed sessions: Last 60 days
- Scheduled sessions: Next 30 days
- Realistic timing for feedback and payments

### Interconnected Data
- Sessions match tutor skills with learner interests
- Payments linked to completed sessions
- Notifications tied to session events
- Proper user relationships

## Features to Test

### For Tutors (sarah.johnson@example.com)
✅ View teaching dashboard with stats
✅ See upcoming and past sessions
✅ Start and complete sessions
✅ View payment history
✅ Check student feedback

### For Learners (alex.thompson@example.com)
✅ Browse and search for tutors
✅ Filter tutors by skills and ratings
✅ View scheduled sessions
✅ Book new sessions
✅ Leave feedback for completed sessions

### Skills Page
✅ Browse 20 different skills
✅ Filter by 8 categories
✅ Search functionality
✅ View skill details and statistics

### Sessions Page
✅ Filter by status (all, upcoming, completed, cancelled)
✅ View session statistics
✅ Session management actions
✅ See meeting details

### Find Tutors Page
✅ Search tutors
✅ Filter by skill, rating, price
✅ Sort by different criteria
✅ View tutor profiles with ratings

## Resetting the Database

The seed script automatically clears all existing data before seeding. To reset:

```bash
node seed-database.js
```

**Warning**: This will delete all existing data including:
- Users
- Skills
- Sessions
- Payments
- Notifications

## Customization

Edit `seed-database.js` to:
- Add more skills in the `skillsData` array
- Add more users in the `usersData` array
- Adjust rating ranges
- Change hourly rates
- Modify session distribution

## Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Make sure MongoDB is running

### Authentication Error
```
MongoServerError: Authentication failed
```
**Solution**: Check your MONGODB_URI in .env file

### Duplicate Key Error
```
E11000 duplicate key error
```
**Solution**: The script already clears data. If error persists, manually drop the database

## Database Stats After Seeding

Expected data volume:
- **Skills**: 20
- **Users**: 20 (10 tutors, 10 learners)
- **Sessions**: 60-100
- **Payments**: 40-60 (for completed sessions)
- **Notifications**: 100-150

Total: ~250-350 documents

## Next Steps After Seeding

1. **Start the backend server**
   ```bash
   npm start
   ```

2. **Start the frontend**
   ```bash
   cd ../frontend
   npm run dev
   ```

3. **Login and test**
   - Use any of the test accounts
   - Navigate through all features
   - Test filtering and searching
   - Book a session
   - Complete a session (as tutor)

4. **Test API endpoints**
   - GET /api/sessions
   - GET /api/matching/tutors
   - GET /api/skills
   - POST /api/sessions (book new session)

Enjoy testing! 🚀
