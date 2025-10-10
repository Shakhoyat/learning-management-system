# Teaching Analytics Database Models - Complete Documentation

## 📋 Overview

This document provides comprehensive documentation for the teaching analytics system implemented in the LMS. The system includes four major models designed to track, analyze, and report on teaching and learning activities.

---

## 🎯 Analytics Models

### 1. TeachingAnalytics Model
**File:** `backend/src/models/TeachingAnalytics.js`

Tracks detailed performance metrics for tutors including sessions, student outcomes, ratings, earnings, and growth metrics.

#### Key Features:
- **Session Metrics**: Total, completed, cancelled sessions, completion rates
- **Student Metrics**: Total students, retention rates, satisfaction scores
- **Performance Ratings**: Overall and category-specific ratings (communication, knowledge, punctuality, effectiveness, preparation)
- **Earnings Analysis**: Gross/net earnings, hourly rates, growth tracking
- **Skill Performance**: Per-skill breakdown of sessions, hours, ratings, earnings
- **Engagement Tracking**: Response times, messages, materials shared, booking requests
- **Schedule Utilization**: Available vs booked slots, peak hours and days
- **Quality Indicators**: Preparation, consistency, and professionalism scores
- **Growth Metrics**: Session, student, earnings, and rating growth percentages
- **Achievements**: Milestones and badges earned
- **Rankings**: Comparative rankings among tutors

#### Schema Structure:
```javascript
{
  tutor: ObjectId,
  period: {
    type: "daily" | "weekly" | "monthly" | "quarterly" | "yearly",
    startDate: Date,
    endDate: Date,
    year: Number,
    month: Number,
    week: Number,
    day: Number
  },
  sessionMetrics: {
    total: Number,
    completed: Number,
    cancelled: Number,
    noShow: Number,
    completionRate: Number (0-1),
    totalHours: Number,
    averageDuration: Number (minutes)
  },
  studentMetrics: {
    totalStudents: Number,
    newStudents: Number,
    returningStudents: Number,
    retentionRate: Number (0-1),
    averageStudentSatisfaction: Number (0-5),
    studentsByLevel: {
      beginner: Number,
      intermediate: Number,
      advanced: Number
    }
  },
  ratings: {
    overall: {
      average: Number (0-5),
      total: Number,
      distribution: { fiveStar, fourStar, threeStar, twoStar, oneStar }
    },
    categories: {
      communication: Number,
      knowledge: Number,
      punctuality: Number,
      effectiveness: Number,
      preparation: Number
    },
    trend: "improving" | "stable" | "declining"
  },
  earnings: {
    gross: Number,
    platformFees: Number,
    net: Number,
    currency: String,
    averageHourlyRate: Number,
    projectedMonthlyEarnings: Number,
    earningsGrowth: Number (percentage)
  },
  skillPerformance: [{
    skill: ObjectId,
    sessionsCount: Number,
    hoursTeaching: Number,
    averageRating: Number,
    studentsCount: Number,
    earnings: Number,
    completionRate: Number
  }],
  engagement: {
    responseTime: { average, median },
    messagesExchanged: Number,
    materialShared: Number,
    profileViews: Number,
    bookingRequests: {
      total: Number,
      accepted: Number,
      declined: Number,
      acceptanceRate: Number
    }
  },
  scheduleMetrics: {
    availableSlots: Number,
    bookedSlots: Number,
    utilizationRate: Number,
    peakHours: [{ hour, count }],
    peakDays: [{ day, count }]
  },
  studentOutcomes: {
    totalStudentsImproved: Number,
    averageProgressGain: Number,
    studentsReachingGoals: Number,
    goalsAchievementRate: Number,
    repeatStudentRate: Number
  },
  qualityMetrics: {
    preparationScore: Number (0-10),
    consistencyScore: Number (0-10),
    professionalismScore: Number (0-10),
    overallQualityScore: Number (0-10)
  },
  growth: {
    sessionGrowth: Number (percentage),
    studentGrowth: Number (percentage),
    earningsGrowth: Number (percentage),
    ratingGrowth: Number (percentage)
  },
  achievements: [{
    type: "sessions_milestone" | "students_milestone" | "earnings_milestone" | ...,
    title: String,
    description: String,
    earnedAt: Date,
    value: Mixed
  }],
  rankings: {
    overallRank: Number,
    categoryRank: Number,
    percentile: Number,
    skillRankings: [{ skill, rank, totalTutors }]
  }
}
```

#### Methods:

**Static Methods:**
- `calculateForTutor(tutorId, periodType, startDate, endDate)` - Calculates analytics for a specific period

**Instance Methods:**
- `generateInsights()` - Generates actionable insights based on performance data

#### Indexes:
```javascript
{ tutor: 1, "period.startDate": -1 }
{ tutor: 1, "period.type": 1, "period.startDate": -1 }
{ "period.startDate": 1, "period.endDate": 1 }
{ "ratings.overall.average": -1 }
{ "earnings.net": -1 }
```

---

### 2. LearningAnalytics Model
**File:** `backend/src/models/LearningAnalytics.js`

Tracks comprehensive learning journey metrics for students including progress, engagement, performance, and outcomes.

#### Key Features:
- **Session Tracking**: Completed sessions, hours learned, completion rates
- **Learning Progress**: Skills in progress, completed, average progress
- **Skill-Specific Progress**: Per-skill level tracking, progress rates
- **Learning Outcomes**: Goals achieved, certifications earned
- **Engagement Metrics**: Login streaks, materials reviewed, questions asked
- **Tutor Interaction**: Tutor ratings, feedback given
- **Learning Patterns**: Preferred days/hours, learning styles
- **Performance Scores**: Comprehension, retention, application metrics
- **Investment Tracking**: Total spent, cost per session/hour, ROI
- **Gamification**: Points, levels, badges, ranks
- **Personalized Recommendations**: Skill suggestions, tutor matches, learning strategies

#### Schema Structure:
```javascript
{
  learner: ObjectId,
  period: {
    type: "daily" | "weekly" | "monthly" | "quarterly" | "yearly",
    startDate: Date,
    endDate: Date
  },
  sessionMetrics: {
    total, completed, cancelled, noShow,
    completionRate, totalHours, averageDuration,
    sessionsPerWeek
  },
  learningProgress: {
    skillsInProgress: Number,
    skillsCompleted: Number,
    skillsStarted: Number,
    averageProgress: Number (0-1),
    totalProgressGain: Number,
    averageLevelImprovement: Number
  },
  skillProgress: [{
    skill: ObjectId,
    startLevel: Number,
    currentLevel: Number,
    targetLevel: Number,
    levelGain: Number,
    hoursLearned: Number,
    sessionsCount: Number,
    averageRating: Number,
    progressRate: Number,
    lastSessionDate: Date,
    status: "not_started" | "in_progress" | "paused" | "completed"
  }],
  outcomes: {
    goalsAchieved: Number,
    goalsInProgress: Number,
    goalsAchievementRate: Number,
    milestonesReached: Number,
    certificationsEarned: Number
  },
  engagement: {
    loginDays: Number,
    streakDays: Number,
    longestStreak: Number,
    messagesExchanged: Number,
    materialsReviewed: Number,
    notesCreated: Number,
    questionsAsked: Number,
    engagementScore: Number (0-10)
  },
  learningPatterns: {
    preferredDays: [{ day, count }],
    preferredHours: [{ hour, count }],
    averageSessionsPerWeek: Number,
    preferredLearningStyle: String,
    peakProductivityTime: String
  },
  performance: {
    comprehensionScore: Number (0-10),
    retentionScore: Number (0-10),
    applicationScore: Number (0-10),
    overallPerformance: Number (0-10),
    performanceTrend: "improving" | "stable" | "declining"
  },
  spending: {
    totalInvested: Number,
    averageCostPerSession: Number,
    averageCostPerHour: Number,
    currency: String,
    roi: Number
  },
  gamification: {
    totalPoints: Number,
    currentLevel: Number,
    pointsToNextLevel: Number,
    badges: [{ id, name, earnedAt, icon }],
    rank: "beginner" | "learner" | "dedicated" | "expert" | "master"
  },
  recommendations: [{
    type: "skill_suggestion" | "tutor_suggestion" | "schedule_optimization" | ...,
    priority: "high" | "medium" | "low",
    title: String,
    description: String,
    actionable: Boolean
  }]
}
```

#### Methods:

**Static Methods:**
- `calculateForLearner(learnerId, periodType, startDate, endDate)` - Calculates learning analytics

**Instance Methods:**
- `generateInsights()` - Generates personalized learning insights

#### Virtuals:
- `learningScore` - Overall learning score (weighted combination of progress, engagement, performance)

---

### 3. Assessment & AssessmentAttempt Models
**File:** `backend/src/models/Assessment.js`

Comprehensive assessment system supporting quizzes, tests, assignments, and evaluations with auto-grading capabilities.

#### Assessment Model Features:
- **Multiple Question Types**: Multiple choice, true/false, short answer, essay, coding, matching, ordering, fill-in-blank
- **Flexible Configuration**: Time limits, passing scores, attempt limits, question shuffling
- **Rich Content**: Hints, explanations, resources, learning objectives
- **Auto-Grading**: Automatic grading for objective questions
- **Rubric Support**: Custom grading rubrics for subjective questions
- **Statistics Tracking**: Aggregate performance metrics, question analytics
- **Publishing Control**: Draft, published, archived states with date-based availability

#### AssessmentAttempt Model Features:
- **Attempt Tracking**: Multiple attempts with versioning
- **Time Management**: Start/end times, time spent per question
- **Answer Recording**: Flexible answer storage for all question types
- **Auto & Manual Grading**: Hybrid grading system
- **Score Calculation**: Raw scores, percentages, letter grades
- **Detailed Feedback**: Per-question and overall feedback
- **Performance Insights**: Strengths, weaknesses, recommendations
- **Integrity Features**: IP tracking, cheating detection flags

#### Schema Highlights:

**Assessment:**
```javascript
{
  title: String,
  description: String,
  type: "quiz" | "test" | "assignment" | "practice" | "evaluation" | ...,
  skill: ObjectId,
  session: ObjectId,
  createdBy: ObjectId,
  config: {
    difficulty: "beginner" | "intermediate" | "advanced" | "expert",
    timeLimit: Number (minutes),
    passingScore: Number (0-100),
    attemptsAllowed: Number,
    shuffleQuestions: Boolean,
    showCorrectAnswers: Boolean
  },
  questions: [{
    questionId: String,
    type: "multiple_choice" | "true_false" | "short_answer" | "essay" | "coding" | ...,
    question: String,
    points: Number,
    options: [{ optionId, text, isCorrect }],
    correctAnswers: [String],
    codingConfig: { language, starterCode, testCases },
    explanation: String,
    hints: [String]
  }],
  grading: {
    totalPoints: Number,
    autoGrade: Boolean,
    partialCredit: Boolean,
    rubric: [{ criterion, maxPoints, description }]
  },
  statistics: {
    totalAttempts: Number,
    uniqueStudents: Number,
    averageScore: Number,
    averageTimeSpent: Number,
    passRate: Number,
    questionStatistics: [{ questionId, timesAnswered, correctAnswers, successRate }]
  }
}
```

**AssessmentAttempt:**
```javascript
{
  assessment: ObjectId,
  student: ObjectId,
  session: ObjectId,
  attemptNumber: Number,
  status: "not_started" | "in_progress" | "submitted" | "graded" | "expired",
  startedAt: Date,
  submittedAt: Date,
  timeSpent: Number (seconds),
  answers: [{
    questionId: String,
    answer: Mixed,
    timeSpent: Number,
    isCorrect: Boolean,
    pointsEarned: Number,
    autoGraded: Boolean,
    feedback: String
  }],
  score: {
    rawScore: Number,
    percentage: Number (0-100),
    passed: Boolean,
    grade: "A+" | "A" | "A-" | ... | "F"
  },
  gradedBy: ObjectId,
  feedback: {
    tutor: { comment, recommendations },
    student: { difficulty, comment }
  },
  performance: {
    strengths: [String],
    weaknesses: [String],
    areasForImprovement: [String],
    recommendedResources: [{ title, url, type }]
  }
}
```

#### Methods:

**AssessmentAttempt Methods:**
- `calculateScore(assessmentData)` - Calculates final score and grade
- `autoGradeObjectiveQuestions(assessmentData)` - Auto-grades multiple choice, true/false, short answer

**Static Methods:**
- `getStudentPerformance(studentId, skillId)` - Gets comprehensive student performance summary

---

### 4. AnalyticsReport Model
**File:** `backend/src/models/AnalyticsReport.js`

Generates comprehensive, exportable reports for various analytics needs with scheduling and sharing capabilities.

#### Key Features:
- **Multiple Report Types**: Teaching performance, learning progress, financial, student outcomes, engagement, skills analysis
- **Flexible Scoping**: Individual, skill, category, or platform-wide reports
- **Time Periods**: Daily, weekly, monthly, quarterly, yearly, or custom
- **Comparative Analysis**: Period-over-period comparisons, benchmarking
- **Rich Visualizations**: Charts data for line, bar, pie, area, scatter, heatmap
- **KPI Tracking**: Key performance indicators with targets and trends
- **Automated Insights**: AI-generated insights and recommendations
- **Export Formats**: JSON, PDF, Excel, CSV
- **Scheduling**: Automated report generation and distribution
- **Access Control**: Private, shared, or public visibility

#### Schema Structure:
```javascript
{
  reportId: String (unique),
  title: String,
  type: "teaching_performance" | "learning_progress" | "financial" | ...,
  scope: {
    type: "individual" | "skill" | "category" | "platform",
    targetUser: ObjectId,
    targetSkill: ObjectId,
    targetCategory: String
  },
  period: {
    type: "daily" | "weekly" | "monthly" | ...,
    startDate: Date,
    endDate: Date,
    comparisonPeriod: { startDate, endDate }
  },
  teachingPerformance: {
    summary: { totalSessions, completedSessions, totalHours, totalStudents, ... },
    sessionBreakdown: { byStatus, bySkill, byDay },
    studentMetrics: { new, returning, retentionRate, satisfactionScore },
    ratings: { overall, breakdown, trend },
    growth: { sessionsGrowth, studentsGrowth, earningsGrowth, ratingGrowth }
  },
  learningProgress: {
    summary: { totalSessions, skillsInProgress, skillsCompleted, ... },
    skillBreakdown: [{ skill, currentLevel, targetLevel, progress, ... }],
    performance: { assessmentsCompleted, averageScore, passRate, ... },
    engagement: { streakDays, loginFrequency, engagementScore }
  },
  financial: {
    summary: { totalRevenue, totalExpenses, netIncome, platformFees },
    revenue: { byMonth, bySkill, byStudent },
    projections: { nextMonth, nextQuarter, yearEnd },
    growth: { monthOverMonth, quarterOverQuarter, yearOverYear }
  },
  insights: [{
    type: "success" | "warning" | "tip" | "alert" | "info",
    category: String,
    title: String,
    description: String,
    priority: "high" | "medium" | "low",
    actionable: Boolean,
    recommendedAction: String
  }],
  kpis: [{
    name: String,
    value: Mixed,
    unit: String,
    trend: "up" | "down" | "stable",
    changePercentage: Number,
    target: Mixed,
    status: "on_track" | "at_risk" | "off_track" | "exceeded"
  }],
  visualizations: [{
    type: "line_chart" | "bar_chart" | "pie_chart" | ...,
    title: String,
    data: Mixed,
    config: Mixed
  }],
  metadata: {
    generatedBy: ObjectId,
    generatedAt: Date,
    status: "generating" | "completed" | "failed" | "scheduled",
    format: "json" | "pdf" | "excel" | "csv",
    fileUrl: String,
    expiresAt: Date,
    scheduleConfig: { frequency, recipients, nextRun }
  },
  access: {
    visibility: "private" | "shared" | "public",
    sharedWith: [{ user, permissions, sharedAt }]
  }
}
```

#### Methods:

**Static Methods:**
- `generateReportId()` - Generates unique report ID
- `createTeachingPerformanceReport(tutorId, startDate, endDate)` - Creates teaching performance report

**Instance Methods:**
- `generateInsights()` - Auto-generates insights from report data

---

## 🔄 Data Flow

### 1. Real-time Analytics Collection
```
Session Activity → TeachingAnalytics/LearningAnalytics → Aggregated Metrics
```

### 2. Assessment Flow
```
Create Assessment → Student Attempts → Auto/Manual Grading → Performance Analytics
```

### 3. Report Generation
```
Request Report → Aggregate Analytics Data → Generate Visualizations → Create Report → Export/Share
```

---

## 📊 Usage Examples

### Calculate Teaching Analytics
```javascript
const TeachingAnalytics = require('./models/TeachingAnalytics');

// Calculate monthly analytics for a tutor
const startDate = new Date('2025-10-01');
const endDate = new Date('2025-10-31');

const analytics = await TeachingAnalytics.calculateForTutor(
  tutorId,
  'monthly',
  startDate,
  endDate
);

// Save to database
const analyticsDoc = new TeachingAnalytics(analytics);
await analyticsDoc.save();

// Generate insights
const insights = analyticsDoc.generateInsights();
console.log(insights);
```

### Calculate Learning Analytics
```javascript
const LearningAnalytics = require('./models/LearningAnalytics');

const analytics = await LearningAnalytics.calculateForLearner(
  learnerId,
  'monthly',
  startDate,
  endDate
);

const analyticsDoc = new LearningAnalytics(analytics);
await analyticsDoc.save();
```

### Create and Grade Assessment
```javascript
const { Assessment, AssessmentAttempt } = require('./models/Assessment');

// Create assessment
const assessment = new Assessment({
  title: "JavaScript Fundamentals Quiz",
  type: "quiz",
  skill: skillId,
  createdBy: tutorId,
  config: {
    difficulty: "intermediate",
    timeLimit: 30,
    passingScore: 70,
    attemptsAllowed: 2
  },
  questions: [
    {
      questionId: "q1",
      type: "multiple_choice",
      question: "What is a closure in JavaScript?",
      points: 5,
      options: [
        { optionId: "a", text: "A function inside a function", isCorrect: false },
        { optionId: "b", text: "A function that returns another function", isCorrect: true }
      ]
    }
  ]
});

await assessment.save();

// Student attempts assessment
const attempt = new AssessmentAttempt({
  assessment: assessment._id,
  student: studentId,
  attemptNumber: 1,
  startedAt: new Date(),
  answers: [
    { questionId: "q1", answer: "b" }
  ]
});

// Auto-grade
attempt.autoGradeObjectiveQuestions(assessment);
attempt.status = "graded";
await attempt.save();
```

### Generate Report
```javascript
const AnalyticsReport = require('./models/AnalyticsReport');

const report = await AnalyticsReport.createTeachingPerformanceReport(
  tutorId,
  startDate,
  endDate
);

// Generate insights
report.generateInsights();
await report.save();

console.log(`Report generated: ${report.reportId}`);
```

---

## 🔍 Query Examples

### Get Top Performing Tutors
```javascript
const topTutors = await TeachingAnalytics.find({
  "period.type": "monthly",
  "period.startDate": { $gte: startDate }
})
  .sort({ "ratings.overall.average": -1 })
  .limit(10)
  .populate("tutor");
```

### Get Student Progress Trend
```javascript
const progress = await LearningAnalytics.find({
  learner: learnerId,
  "period.type": "weekly"
})
  .sort({ "period.startDate": 1 })
  .select("period.startDate learningProgress.averageProgress");
```

### Get Assessment Performance
```javascript
const performance = await AssessmentAttempt.getStudentPerformance(
  studentId,
  skillId
);
```

---

## 📈 Performance Optimization

### Recommended Indexes
All models include optimized indexes for common query patterns:
- Time-based queries
- User-specific queries
- Performance sorting
- Status filtering

### Caching Strategy
- Cache analytics for 5-10 minutes
- Pre-calculate daily aggregates
- Use Redis for frequently accessed metrics

### Batch Processing
- Schedule nightly analytics calculation
- Process in batches to avoid memory issues
- Use background jobs for heavy computations

---

## 🔐 Security Considerations

- **Access Control**: Reports have visibility settings (private/shared/public)
- **Data Privacy**: Personal information is protected
- **Role-Based Access**: Only tutors see teaching analytics, only learners see learning analytics
- **Audit Trail**: All analytics generation is logged

---

## 🚀 Future Enhancements

1. **Machine Learning Integration**
   - Predictive analytics for student success
   - Automated tutor-student matching optimization
   - Churn prediction

2. **Real-time Analytics**
   - Live dashboards using WebSockets
   - Real-time performance updates

3. **Advanced Visualizations**
   - Interactive charts with drill-down
   - Heat maps for schedule optimization
   - Network graphs for skill relationships

4. **Export Enhancements**
   - PDF report generation with charts
   - Excel exports with pivot tables
   - CSV bulk exports

5. **API Endpoints**
   - RESTful API for all analytics
   - GraphQL support for flexible queries
   - Webhook notifications for milestones

---

## 📚 Related Documentation

- [ANALYTICS_API_DOCUMENTATION.md](./ANALYTICS_API_DOCUMENTATION.md) - API endpoints
- [DATABASE_MODELS_REPORT.md](./DATABASE_MODELS_REPORT.md) - Database schema details
- [ANALYTICS_BACKEND_STATUS.md](./ANALYTICS_BACKEND_STATUS.md) - Implementation status

---

## 🤝 Contributing

When adding new analytics features:
1. Update the relevant model schema
2. Add necessary indexes
3. Create calculation methods
4. Update this documentation
5. Add usage examples
6. Test thoroughly with sample data

---

**Last Updated:** October 10, 2025
**Version:** 1.0.0
