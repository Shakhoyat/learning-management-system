const mongoose = require("mongoose");

/**
 * Attendance and Assignment Tracker Model
 * Tracks submission and attendance patterns over time
 * Optimized for calendar heatmap visualization
 */
const AttendanceAssignmentSchema = new mongoose.Schema(
  {
    // Student and Tutor Reference
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Date Information
    date: {
      type: Date,
      required: true,
      index: true,
    },
    year: {
      type: Number,
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
    },
    day: {
      type: Number,
      min: 1,
      max: 31,
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
    },
    weekOfYear: {
      type: Number,
      min: 1,
      max: 53,
    },

    // Attendance Information
    attendance: {
      present: {
        type: Boolean,
        default: false,
      },
      sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
      punctuality: {
        type: String,
        enum: {
          values: ["on_time", "late", "very_late"],
          message: "{VALUE} is not a valid punctuality status",
        },
        default: undefined,
      },
      minutesLate: {
        type: Number,
        default: 0,
      },
      participationScore: {
        type: Number,
        min: 0,
        max: 10,
      },
    },

    // Assignment Information
    assignments: [
      {
        assignmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Assessment",
        },
        title: String,
        dueDate: Date,
        submittedDate: Date,
        status: {
          type: String,
          enum: ["submitted", "late", "missing", "pending"],
        },
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        submittedOnTime: Boolean,
        daysLate: Number,
      },
    ],

    // Daily Summary Metrics
    dailyMetrics: {
      totalActivities: {
        type: Number,
        default: 0,
      },
      attendanceStatus: {
        type: String,
        enum: ["present", "absent", "partial"],
      },
      assignmentsSubmitted: {
        type: Number,
        default: 0,
      },
      assignmentsDue: {
        type: Number,
        default: 0,
      },
      completionRate: {
        type: Number,
        min: 0,
        max: 100,
      },
      consistencyScore: {
        // 0-100 based on attendance + submissions
        type: Number,
        min: 0,
        max: 100,
      },
    },

    // Skill Reference
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },

    // Streaks
    streakInfo: {
      isStreakDay: {
        type: Boolean,
        default: false,
      },
      streakCount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
AttendanceAssignmentSchema.index({ tutor: 1, date: -1 });
AttendanceAssignmentSchema.index({ student: 1, date: -1 });
AttendanceAssignmentSchema.index({ tutor: 1, year: 1, month: 1 });
AttendanceAssignmentSchema.index(
  { date: 1, tutor: 1, student: 1 },
  { unique: true }
);

/**
 * Pre-save hook: Calculate daily metrics and consistency score
 */
AttendanceAssignmentSchema.pre("save", function (next) {
  // Calculate total activities
  this.dailyMetrics.totalActivities =
    (this.attendance.present ? 1 : 0) + this.assignments.length;

  // Determine attendance status
  if (this.attendance.present) {
    this.dailyMetrics.attendanceStatus = "present";
  } else if (this.assignments.length > 0) {
    this.dailyMetrics.attendanceStatus = "partial";
  } else {
    this.dailyMetrics.attendanceStatus = "absent";
  }

  // Count submitted assignments
  this.dailyMetrics.assignmentsSubmitted = this.assignments.filter(
    (a) => a.status === "submitted" || a.status === "late"
  ).length;

  this.dailyMetrics.assignmentsDue = this.assignments.length;

  // Calculate completion rate
  if (this.dailyMetrics.assignmentsDue > 0) {
    this.dailyMetrics.completionRate =
      (this.dailyMetrics.assignmentsSubmitted /
        this.dailyMetrics.assignmentsDue) *
      100;
  } else {
    this.dailyMetrics.completionRate = this.attendance.present ? 100 : 0;
  }

  // Calculate consistency score (weighted: 60% attendance, 40% assignments)
  const attendanceScore = this.attendance.present ? 60 : 0;
  const assignmentScore = this.dailyMetrics.completionRate * 0.4;
  this.dailyMetrics.consistencyScore = Math.round(
    attendanceScore + assignmentScore
  );

  // Set date components
  const d = new Date(this.date);
  this.year = d.getFullYear();
  this.month = d.getMonth() + 1;
  this.day = d.getDate();
  this.dayOfWeek = d.getDay();
  this.weekOfYear = getWeekNumber(d);

  next();
});

/**
 * Static method: Get calendar heatmap data
 */
AttendanceAssignmentSchema.statics.getCalendarHeatmap = async function (
  tutorId,
  options = {}
) {
  const {
    startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // Default: last 6 months
    endDate = new Date(),
    studentId = null,
  } = options;

  const query = {
    tutor: new mongoose.Types.ObjectId(tutorId),
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  if (studentId) {
    query.student = new mongoose.Types.ObjectId(studentId);
  }

  const records = await this.find(query)
    .populate("student", "name email")
    .sort({ date: 1 });

  // Group by date for heatmap
  const heatmapData = records.map((record) => ({
    date: record.date.toISOString().split("T")[0],
    year: record.year,
    month: record.month,
    day: record.day,
    dayOfWeek: record.dayOfWeek,
    weekOfYear: record.weekOfYear,
    student: record.student,
    attendance: {
      present: record.attendance.present,
      punctuality: record.attendance.punctuality,
      participationScore: record.attendance.participationScore,
    },
    assignments: {
      submitted: record.dailyMetrics.assignmentsSubmitted,
      due: record.dailyMetrics.assignmentsDue,
      completionRate: record.dailyMetrics.completionRate,
    },
    consistencyScore: record.dailyMetrics.consistencyScore,
    totalActivities: record.dailyMetrics.totalActivities,
    isStreakDay: record.streakInfo.isStreakDay,
  }));

  // Calculate statistics
  const stats = {
    totalDays: records.length,
    daysPresent: records.filter((r) => r.attendance.present).length,
    attendanceRate: 0,
    assignmentsSubmitted: records.reduce(
      (sum, r) => sum + r.dailyMetrics.assignmentsSubmitted,
      0
    ),
    assignmentsDue: records.reduce(
      (sum, r) => sum + r.dailyMetrics.assignmentsDue,
      0
    ),
    submissionRate: 0,
    averageConsistency: 0,
    currentStreak: 0,
    longestStreak: 0,
  };

  stats.attendanceRate =
    stats.totalDays > 0
      ? Math.round((stats.daysPresent / stats.totalDays) * 100)
      : 0;

  stats.submissionRate =
    stats.assignmentsDue > 0
      ? Math.round((stats.assignmentsSubmitted / stats.assignmentsDue) * 100)
      : 0;

  stats.averageConsistency =
    records.reduce((sum, r) => sum + r.dailyMetrics.consistencyScore, 0) /
      records.length || 0;

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  for (let i = 0; i < sortedRecords.length; i++) {
    const record = sortedRecords[i];

    if (record.dailyMetrics.consistencyScore >= 70) {
      tempStreak++;
      if (i === sortedRecords.length - 1) {
        currentStreak = tempStreak;
      }
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
  }

  stats.currentStreak = currentStreak;
  stats.longestStreak = Math.max(longestStreak, currentStreak);

  // Identify problematic periods (low consistency weeks)
  const weeklyStats = await this.aggregate([
    { $match: query },
    {
      $group: {
        _id: { year: "$year", week: "$weekOfYear" },
        avgConsistency: { $avg: "$dailyMetrics.consistencyScore" },
        daysTracked: { $sum: 1 },
        attendanceRate: {
          $avg: { $cond: ["$attendance.present", 100, 0] },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.week": 1 } },
  ]);

  const lowConsistencyWeeks = weeklyStats
    .filter((w) => w.avgConsistency < 50)
    .map((w) => ({
      year: w._id.year,
      week: w._id.week,
      avgConsistency: Math.round(w.avgConsistency),
      daysTracked: w.daysTracked,
      attendanceRate: Math.round(w.attendanceRate),
    }));

  return {
    heatmapData,
    statistics: {
      ...stats,
      averageConsistency: Math.round(stats.averageConsistency),
    },
    weeklyStats: weeklyStats.map((w) => ({
      year: w._id.year,
      week: w._id.week,
      avgConsistency: Math.round(w.avgConsistency),
      daysTracked: w.daysTracked,
      attendanceRate: Math.round(w.attendanceRate),
    })),
    insights: generateCalendarInsights(stats, lowConsistencyWeeks),
  };
};

/**
 * Static method: Record attendance from session
 */
AttendanceAssignmentSchema.statics.recordAttendance = async function (
  sessionData
) {
  const { tutor, learner, scheduledDate, status, skill, _id } = sessionData;

  const date = new Date(scheduledDate);
  date.setHours(0, 0, 0, 0);

  const attendanceData = {
    student: learner,
    tutor: tutor,
    date: date,
    attendance: {
      present: status === "completed",
      sessionId: _id,
      punctuality: "on_time",
      minutesLate: 0,
      participationScore: status === "completed" ? 8 : 0,
    },
    assignments: [],
    skill: skill,
  };

  // Use findOneAndUpdate to prevent duplicates
  return await this.findOneAndUpdate(
    { tutor, student: learner, date },
    attendanceData,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

/**
 * Static method: Record assignment submission
 */
AttendanceAssignmentSchema.statics.recordAssignment = async function (
  assessmentAttempt
) {
  const { learner, assessment, createdAt, score } = assessmentAttempt;

  const date = new Date(createdAt);
  date.setHours(0, 0, 0, 0);

  const dueDate = assessment.dueDate ? new Date(assessment.dueDate) : date;
  const submittedOnTime = date <= dueDate;
  const daysLate = submittedOnTime
    ? 0
    : Math.ceil((date - dueDate) / (1000 * 60 * 60 * 24));

  const assignmentData = {
    assignmentId: assessment._id,
    title: assessment.title,
    dueDate: dueDate,
    submittedDate: date,
    status: submittedOnTime ? "submitted" : "late",
    score: score.percentage,
    submittedOnTime,
    daysLate,
  };

  // Find or create record for this date
  let record = await this.findOne({
    student: learner,
    tutor: assessment.createdBy,
    date: date,
  });

  if (!record) {
    record = new this({
      student: learner,
      tutor: assessment.createdBy,
      date: date,
      attendance: { present: false },
      assignments: [assignmentData],
      skill: assessment.skill,
    });
  } else {
    // Add assignment if not already present
    const exists = record.assignments.some(
      (a) => a.assignmentId?.toString() === assessment._id.toString()
    );
    if (!exists) {
      record.assignments.push(assignmentData);
    }
  }

  return await record.save();
};

/**
 * Helper function: Get ISO week number
 */
function getWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

/**
 * Helper function: Generate calendar insights
 */
function generateCalendarInsights(stats, lowConsistencyWeeks) {
  const insights = [];

  // Attendance insights
  if (stats.attendanceRate >= 90) {
    insights.push({
      type: "success",
      category: "attendance",
      message: `Excellent attendance rate of ${stats.attendanceRate}%`,
    });
  } else if (stats.attendanceRate < 70) {
    insights.push({
      type: "warning",
      category: "attendance",
      message: `Low attendance rate of ${stats.attendanceRate}%. Consider attendance interventions.`,
    });
  }

  // Submission insights
  if (stats.submissionRate >= 90) {
    insights.push({
      type: "success",
      category: "assignments",
      message: `Outstanding assignment submission rate of ${stats.submissionRate}%`,
    });
  } else if (stats.submissionRate < 70) {
    insights.push({
      type: "warning",
      category: "assignments",
      message: `Assignment submission rate is ${stats.submissionRate}%. Students may need support.`,
    });
  }

  // Streak insights
  if (stats.currentStreak >= 7) {
    insights.push({
      type: "success",
      category: "consistency",
      message: `Active ${stats.currentStreak}-day consistency streak!`,
    });
  }

  // Low consistency weeks
  if (lowConsistencyWeeks.length > 0) {
    insights.push({
      type: "info",
      category: "consistency",
      message: `${lowConsistencyWeeks.length} weeks with below-average consistency detected`,
      details: lowConsistencyWeeks.slice(0, 3),
    });
  }

  return insights;
}

module.exports = mongoose.model(
  "AttendanceAssignment",
  AttendanceAssignmentSchema
);
