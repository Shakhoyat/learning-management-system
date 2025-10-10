const mongoose = require("mongoose");

/**
 * Student Engagement Model
 * Tracks detailed student activity for heatmap visualization
 * Captures day vs. time engagement patterns
 */
const StudentEngagementSchema = new mongoose.Schema(
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

    // Activity Tracking
    activityDate: {
      type: Date,
      required: true,
      index: true,
    },
    dayOfWeek: {
      type: Number, // 0 = Sunday, 6 = Saturday
      required: true,
      min: 0,
      max: 6,
    },
    hourOfDay: {
      type: Number, // 0-23 (24-hour format)
      required: true,
      min: 0,
      max: 23,
    },

    // Activity Types
    activities: {
      sessionAttended: {
        type: Boolean,
        default: false,
      },
      assignmentSubmitted: {
        type: Boolean,
        default: false,
      },
      messagesSent: {
        type: Number,
        default: 0,
      },
      materialViewed: {
        type: Boolean,
        default: false,
      },
      assessmentTaken: {
        type: Boolean,
        default: false,
      },
    },

    // Engagement Score (0-100)
    engagementScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Duration in minutes
    durationMinutes: {
      type: Number,
      default: 0,
    },

    // Related Session
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },

    // Metadata
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
StudentEngagementSchema.index({ tutor: 1, activityDate: -1 });
StudentEngagementSchema.index({ student: 1, activityDate: -1 });
StudentEngagementSchema.index({ tutor: 1, dayOfWeek: 1, hourOfDay: 1 });
StudentEngagementSchema.index({ activityDate: 1, tutor: 1 });

/**
 * Calculate engagement score based on activities
 */
StudentEngagementSchema.pre("save", function (next) {
  let score = 0;
  const { activities, durationMinutes } = this;

  // Session attendance: 30 points
  if (activities.sessionAttended) score += 30;

  // Assignment submission: 25 points
  if (activities.assignmentSubmitted) score += 25;

  // Messages sent: up to 15 points (5 points per message, max 3)
  score += Math.min(activities.messagesSent * 5, 15);

  // Material viewed: 15 points
  if (activities.materialViewed) score += 15;

  // Assessment taken: 15 points
  if (activities.assessmentTaken) score += 15;

  // Bonus for duration (up to 10 points for 60+ minutes)
  if (durationMinutes > 0) {
    score += Math.min((durationMinutes / 60) * 10, 10);
  }

  this.engagementScore = Math.min(score, 100);
  next();
});

/**
 * Static method: Get activity heatmap data for a tutor
 * Returns data optimized for heatmap visualization (day vs. time)
 */
StudentEngagementSchema.statics.getActivityHeatmap = async function (
  tutorId,
  startDate,
  endDate
) {
  const activities = await this.aggregate([
    {
      $match: {
        tutor: new mongoose.Types.ObjectId(tutorId),
        activityDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          dayOfWeek: "$dayOfWeek",
          hourOfDay: "$hourOfDay",
        },
        totalActivities: { $sum: 1 },
        averageEngagement: { $avg: "$engagementScore" },
        totalDuration: { $sum: "$durationMinutes" },
        uniqueStudents: { $addToSet: "$student" },
        sessionCount: {
          $sum: { $cond: ["$activities.sessionAttended", 1, 0] },
        },
        assignmentCount: {
          $sum: { $cond: ["$activities.assignmentSubmitted", 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        dayOfWeek: "$_id.dayOfWeek",
        hourOfDay: "$_id.hourOfDay",
        totalActivities: 1,
        averageEngagement: { $round: ["$averageEngagement", 1] },
        totalDuration: 1,
        uniqueStudents: { $size: "$uniqueStudents" },
        sessionCount: 1,
        assignmentCount: 1,
      },
    },
    {
      $sort: { dayOfWeek: 1, hourOfDay: 1 },
    },
  ]);

  // Create a complete heatmap grid (7 days x 24 hours)
  const heatmapGrid = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const activity = activities.find(
        (a) => a.dayOfWeek === day && a.hourOfDay === hour
      );

      heatmapGrid.push({
        day,
        dayName: dayNames[day],
        hour,
        hourLabel: `${hour.toString().padStart(2, "0")}:00`,
        totalActivities: activity?.totalActivities || 0,
        averageEngagement: activity?.averageEngagement || 0,
        totalDuration: activity?.totalDuration || 0,
        uniqueStudents: activity?.uniqueStudents || 0,
        sessionCount: activity?.sessionCount || 0,
        assignmentCount: activity?.assignmentCount || 0,
      });
    }
  }

  // Calculate peak times
  const peakActivity = activities.sort(
    (a, b) => b.totalActivities - a.totalActivities
  )[0];

  return {
    heatmapData: heatmapGrid,
    summary: {
      totalActivities: activities.reduce(
        (sum, a) => sum + a.totalActivities,
        0
      ),
      averageEngagement:
        activities.reduce((sum, a) => sum + a.averageEngagement, 0) /
          activities.length || 0,
      peakTime: peakActivity
        ? {
            day: dayNames[peakActivity.dayOfWeek],
            hour: `${peakActivity.hourOfDay}:00`,
            activities: peakActivity.totalActivities,
          }
        : null,
      activeDaysHours: activities.length,
    },
  };
};

/**
 * Static method: Record activity from session
 */
StudentEngagementSchema.statics.recordSessionActivity = async function (
  sessionData
) {
  const { tutor, learner, scheduledDate, duration, skill, _id } = sessionData;

  const date = new Date(scheduledDate);
  const engagementData = {
    student: learner,
    tutor: tutor,
    activityDate: date,
    dayOfWeek: date.getDay(),
    hourOfDay: date.getHours(),
    activities: {
      sessionAttended: true,
      assignmentSubmitted: false,
      messagesSent: 0,
      materialViewed: false,
      assessmentTaken: false,
    },
    durationMinutes: duration || 60,
    session: _id,
    skill: skill,
  };

  return await this.create(engagementData);
};

module.exports = mongoose.model("StudentEngagement", StudentEngagementSchema);
