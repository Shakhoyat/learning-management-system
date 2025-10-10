# 📊 Teaching Analytics System - Quick Start Guide

## Overview

The Teaching Analytics System provides comprehensive tracking and analysis for teaching and learning activities in the LMS. This system includes detailed analytics for tutors, learners, assessments, and generates customizable reports.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Ensure your `.env` file has the MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/lms-simplified
```

### 3. Seed Analytics Data

```bash
npm run db:seed-analytics
```

This will generate sample analytics data including:
- Teaching analytics for all tutors (last 3 months)
- Learning analytics for all learners (last 3 months)  
- Sample assessments with questions

---

## 📦 Models Overview

### 1. TeachingAnalytics

Tracks tutor performance metrics:
- Session statistics (completion rates, hours taught)
- Student metrics (retention, satisfaction)
- Ratings breakdown (communication, knowledge, etc.)
- Earnings analysis (gross, net, growth)
- Skill-specific performance
- Quality scores and rankings

**File:** `src/models/TeachingAnalytics.js`

### 2. LearningAnalytics

Monitors learner progress and engagement:
- Learning progress (skills completed, in progress)
- Session completion and hours learned
- Performance scores (comprehension, retention)
- Engagement metrics (streaks, materials reviewed)
- Investment tracking (ROI)
- Gamification (points, levels, badges)

**File:** `src/models/LearningAnalytics.js`

### 3. Assessment & AssessmentAttempt

Complete assessment system:
- Multiple question types (MCQ, short answer, essay, coding)
- Auto-grading for objective questions
- Manual grading with rubrics
- Performance tracking and insights
- Time management and attempt tracking

**File:** `src/models/Assessment.js`

### 4. AnalyticsReport

Generates comprehensive reports:
- Teaching performance reports
- Learning progress reports
- Financial reports
- Student outcomes analysis
- Scheduled report generation
- Multiple export formats

**File:** `src/models/AnalyticsReport.js`

---

## 💻 Usage Examples

### Calculate Teaching Analytics

```javascript
const TeachingAnalytics = require('./src/models/TeachingAnalytics');

// Define period
const startDate = new Date('2025-10-01');
const endDate = new Date('2025-10-31');

// Calculate analytics for a tutor
const analyticsData = await TeachingAnalytics.calculateForTutor(
  tutorId,
  'monthly',
  startDate,
  endDate
);

// Save to database
const analytics = new TeachingAnalytics(analyticsData);
await analytics.save();

// Generate insights
const insights = analytics.generateInsights();
console.log('Insights:', insights);
```

### Calculate Learning Analytics

```javascript
const LearningAnalytics = require('./src/models/LearningAnalytics');

const analyticsData = await LearningAnalytics.calculateForLearner(
  learnerId,
  'monthly',
  startDate,
  endDate
);

const analytics = new LearningAnalytics(analyticsData);
await analytics.save();

const insights = analytics.generateInsights();
```

### Create an Assessment

```javascript
const { Assessment } = require('./src/models/Assessment');

const assessment = new Assessment({
  title: "JavaScript Fundamentals Quiz",
  description: "Test your JavaScript knowledge",
  type: "quiz",
  skill: skillId,
  createdBy: tutorId,
  config: {
    difficulty: "intermediate",
    timeLimit: 30, // minutes
    passingScore: 70,
    attemptsAllowed: 2,
    shuffleQuestions: true,
    showCorrectAnswers: true
  },
  questions: [
    {
      questionId: "q1",
      type: "multiple_choice",
      question: "What is a closure in JavaScript?",
      points: 5,
      difficulty: "medium",
      options: [
        { optionId: "a", text: "A function inside a function", isCorrect: false },
        { optionId: "b", text: "A function that has access to outer scope", isCorrect: true },
        { optionId: "c", text: "A loop structure", isCorrect: false }
      ],
      explanation: "A closure is a function that has access to its outer scope...",
      hints: ["Think about scope", "Consider function references"]
    },
    {
      questionId: "q2",
      type: "short_answer",
      question: "What does 'async/await' help with?",
      points: 10,
      correctAnswers: ["asynchronous programming", "promises", "async operations"],
      sampleAnswer: "async/await helps handle asynchronous operations"
    }
  ],
  grading: {
    totalPoints: 15,
    autoGrade: true,
    partialCredit: false
  },
  status: "published",
  publishedAt: new Date()
});

await assessment.save();
```

### Student Takes Assessment

```javascript
const { AssessmentAttempt } = require('./src/models/Assessment');

// Create attempt
const attempt = new AssessmentAttempt({
  assessment: assessmentId,
  student: studentId,
  attemptNumber: 1,
  status: "in_progress",
  startedAt: new Date(),
  answers: []
});

await attempt.save();

// Submit answers
attempt.answers = [
  { questionId: "q1", answer: "b", timeSpent: 45 },
  { questionId: "q2", answer: "asynchronous programming", timeSpent: 120 }
];

attempt.submittedAt = new Date();
attempt.timeSpent = 165; // total seconds
attempt.status = "submitted";

// Auto-grade
const assessment = await Assessment.findById(assessmentId);
attempt.autoGradeObjectiveQuestions(assessment);
attempt.status = "graded";
attempt.gradedAt = new Date();

await attempt.save();

console.log('Score:', attempt.score);
// { rawScore: 15, percentage: 100, passed: true, grade: 'A+' }
```

### Generate a Report

```javascript
const AnalyticsReport = require('./src/models/AnalyticsReport');

// Create teaching performance report
const report = await AnalyticsReport.createTeachingPerformanceReport(
  tutorId,
  startDate,
  endDate
);

// Generate insights
const insights = report.generateInsights();
report.insights = insights;

await report.save();

console.log('Report ID:', report.reportId);
console.log('Insights:', insights);
```

---

## 🔍 Common Queries

### Get Top-Rated Tutors

```javascript
const topTutors = await TeachingAnalytics.find({
  "period.type": "monthly",
  "period.month": 10,
  "period.year": 2025
})
  .sort({ "ratings.overall.average": -1 })
  .limit(10)
  .populate("tutor", "name email avatar");

console.log('Top Tutors:', topTutors);
```

### Get Learner Progress Trend

```javascript
const progressTrend = await LearningAnalytics.find({
  learner: learnerId,
  "period.type": "weekly"
})
  .sort({ "period.startDate": 1 })
  .select("period.startDate learningProgress.averageProgress")
  .limit(12);

console.log('Progress Trend:', progressTrend);
```

### Get Student Assessment Performance

```javascript
const { AssessmentAttempt } = require('./src/models/Assessment');

const performance = await AssessmentAttempt.getStudentPerformance(
  studentId,
  skillId // optional
);

console.log('Total Attempts:', performance.totalAttempts);
console.log('Average Score:', performance.averageScore);
console.log('Pass Rate:', performance.passRate);
console.log('Recent Attempts:', performance.recentAttempts);
```

### Get Tutor Earnings by Month

```javascript
const monthlyEarnings = await TeachingAnalytics.find({
  tutor: tutorId,
  "period.type": "monthly"
})
  .sort({ "period.startDate": -1 })
  .select("period.startDate period.endDate earnings.gross earnings.net")
  .limit(6);

console.log('Monthly Earnings:', monthlyEarnings);
```

---

## 📊 Analytics Metrics

### Teaching Analytics Metrics

**Session Metrics:**
- Total sessions, completed, cancelled, no-show
- Completion rate, total hours, average duration

**Student Metrics:**
- Total students, new, returning
- Retention rate, satisfaction score
- Students by level (beginner/intermediate/advanced)

**Ratings:**
- Overall average rating (0-5)
- Category ratings (communication, knowledge, punctuality, effectiveness, preparation)
- Rating distribution (5-star, 4-star, etc.)
- Trend (improving/stable/declining)

**Earnings:**
- Gross earnings, platform fees, net earnings
- Average hourly rate
- Projected monthly earnings
- Earnings growth percentage

**Quality Metrics:**
- Preparation score (0-10)
- Consistency score (0-10)
- Professionalism score (0-10)
- Overall quality score (0-10)

### Learning Analytics Metrics

**Learning Progress:**
- Skills in progress, completed, started
- Average progress (0-1)
- Total progress gain
- Average level improvement

**Performance:**
- Comprehension score (0-10)
- Retention score (0-10)
- Application score (0-10)
- Overall performance (0-10)
- Performance trend (improving/stable/declining)

**Engagement:**
- Login days, streak days, longest streak
- Messages exchanged, materials reviewed
- Notes created, questions asked
- Engagement score (0-10)

**Gamification:**
- Total points, current level
- Points to next level
- Badges earned
- Rank (beginner/learner/dedicated/expert/master)

---

## 🎯 Next Steps

### 1. Create API Endpoints

Create controllers and routes for:
- `GET /api/analytics/teaching/:tutorId` - Get teaching analytics
- `GET /api/analytics/learning/:learnerId` - Get learning analytics
- `POST /api/assessments` - Create assessment
- `POST /api/assessments/:id/attempt` - Submit attempt
- `GET /api/reports/:reportId` - Get report
- `POST /api/reports/generate` - Generate new report

### 2. Frontend Integration

Build dashboard pages:
- Tutor analytics dashboard
- Learner progress dashboard
- Assessment creation interface
- Assessment taking interface
- Report viewer

### 3. Scheduled Jobs

Implement background jobs for:
- Daily analytics calculation
- Weekly report generation
- Monthly performance summaries
- Automated insights generation

### 4. Notifications

Add notifications for:
- Achievement unlocked
- Progress milestones reached
- New report available
- Assessment graded

---

## 📚 Documentation

- **[TEACHING_ANALYTICS_MODELS.md](./TEACHING_ANALYTICS_MODELS.md)** - Complete model documentation
- **[ANALYTICS_IMPLEMENTATION_SUMMARY.md](./ANALYTICS_IMPLEMENTATION_SUMMARY.md)** - Implementation summary
- **[DATABASE_MODELS_ANALYTICS_ASSESSMENT.md](./DATABASE_MODELS_ANALYTICS_ASSESSMENT.md)** - Analytics support analysis

---

## 🔧 Maintenance

### Update Analytics

Run analytics calculations regularly:

```javascript
// Schedule this to run daily
const updateAllAnalytics = async () => {
  const tutors = await User.find({ role: "tutor" });
  const learners = await User.find({ role: "learner" });
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  // Update tutor analytics
  for (const tutor of tutors) {
    const data = await TeachingAnalytics.calculateForTutor(
      tutor._id,
      'daily',
      yesterday,
      today
    );
    await new TeachingAnalytics(data).save();
  }
  
  // Update learner analytics
  for (const learner of learners) {
    const data = await LearningAnalytics.calculateForLearner(
      learner._id,
      'daily',
      yesterday,
      today
    );
    await new LearningAnalytics(data).save();
  }
};
```

### Optimize Queries

Use indexes efficiently:

```javascript
// All models have optimized indexes
// TeachingAnalytics indexes:
{ tutor: 1, "period.startDate": -1 }
{ tutor: 1, "period.type": 1, "period.startDate": -1 }
{ "ratings.overall.average": -1 }
{ "earnings.net": -1 }

// LearningAnalytics indexes:
{ learner: 1, "period.startDate": -1 }
{ learner: 1, "period.type": 1, "period.startDate": -1 }
{ "performance.overallPerformance": -1 }
{ "learningProgress.averageProgress": -1 }
```

---

## 🐛 Troubleshooting

### Analytics Not Calculating

1. Check if sessions exist for the period
2. Verify user has the correct role (tutor/learner)
3. Ensure date range is valid
4. Check for existing analytics (avoid duplicates)

### Assessment Auto-Grading Not Working

1. Verify question type is supported for auto-grading
2. Check if correct answers are properly formatted
3. Ensure `autoGrade` config is set to `true`

### Reports Not Generating

1. Check if analytics data exists for the period
2. Verify user permissions
3. Ensure report type is supported
4. Check for valid date ranges

---

## 📞 Support

For questions or issues:
1. Check the documentation files
2. Review the model schemas
3. Examine the seeding script for examples
4. Test with sample data

---

**Last Updated:** October 10, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
