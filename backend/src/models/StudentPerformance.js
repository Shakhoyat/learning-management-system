const mongoose = require("mongoose");

/**
 * Student Performance Model
 * Tracks student scores and performance for distribution analysis
 * Optimized for histogram visualization
 */
const StudentPerformanceSchema = new mongoose.Schema(
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

    // Performance Period
    recordDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    academicPeriod: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "semester", "yearly"],
      default: "monthly",
    },

    // Score Information
    score: {
      value: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      grade: {
        type: String,
        enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"],
      },
      percentile: {
        type: Number,
        min: 0,
        max: 100,
      },
    },

    // Performance Category
    category: {
      type: String,
      enum: [
        "quiz",
        "test",
        "assignment",
        "project",
        "attendance",
        "participation",
        "overall",
      ],
      required: true,
    },

    // Related Entities
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      index: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
    },

    // Additional Metrics
    metrics: {
      attemptNumber: {
        type: Number,
        default: 1,
      },
      timeSpent: {
        // in minutes
        type: Number,
      },
      completionRate: {
        type: Number,
        min: 0,
        max: 100,
      },
      difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert"],
      },
    },

    // Trend Analysis
    trend: {
      previousScore: Number,
      improvement: Number, // Percentage change
      direction: {
        type: String,
        enum: ["improving", "stable", "declining"],
      },
    },

    // Metadata
    notes: String,
    isOutlier: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
StudentPerformanceSchema.index({ tutor: 1, recordDate: -1 });
StudentPerformanceSchema.index({ student: 1, recordDate: -1 });
StudentPerformanceSchema.index({ tutor: 1, category: 1, recordDate: -1 });
StudentPerformanceSchema.index({ "score.value": 1, tutor: 1 });

/**
 * Pre-save hook: Calculate grade and detect outliers
 */
StudentPerformanceSchema.pre("save", function (next) {
  // Calculate letter grade
  const score = this.score.value;
  if (score >= 97) this.score.grade = "A+";
  else if (score >= 93) this.score.grade = "A";
  else if (score >= 90) this.score.grade = "A-";
  else if (score >= 87) this.score.grade = "B+";
  else if (score >= 83) this.score.grade = "B";
  else if (score >= 80) this.score.grade = "B-";
  else if (score >= 77) this.score.grade = "C+";
  else if (score >= 73) this.score.grade = "C";
  else if (score >= 70) this.score.grade = "C-";
  else if (score >= 60) this.score.grade = "D";
  else this.score.grade = "F";

  // Calculate trend if previous score exists
  if (this.trend.previousScore !== undefined) {
    const improvement =
      ((score - this.trend.previousScore) / this.trend.previousScore) * 100;
    this.trend.improvement = Math.round(improvement * 10) / 10;

    if (improvement > 5) this.trend.direction = "improving";
    else if (improvement < -5) this.trend.direction = "declining";
    else this.trend.direction = "stable";
  }

  next();
});

/**
 * Static method: Get score distribution histogram
 */
StudentPerformanceSchema.statics.getScoreDistribution = async function (
  tutorId,
  options = {}
) {
  const {
    startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Default: last 90 days
    endDate = new Date(),
    category = "overall",
    binSize = 10, // Score range per bin
  } = options;

  const query = {
    tutor: new mongoose.Types.ObjectId(tutorId),
    recordDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  if (category !== "all") {
    query.category = category;
  }

  const scores = await this.aggregate([
    { $match: query },
    {
      $bucket: {
        groupBy: "$score.value",
        boundaries: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        default: "Other",
        output: {
          count: { $sum: 1 },
          students: { $addToSet: "$student" },
          averageScore: { $avg: "$score.value" },
          scores: { $push: "$score.value" },
          grades: { $push: "$score.grade" },
        },
      },
    },
  ]);

  // Calculate statistics
  const allScores = await this.find(query).select("score.value");
  const scoreValues = allScores.map((s) => s.score.value);

  const stats = {
    mean: scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length || 0,
    median: 0,
    mode: 0,
    stdDev: 0,
    min: Math.min(...scoreValues),
    max: Math.max(...scoreValues),
    total: scoreValues.length,
  };

  // Calculate median
  const sorted = [...scoreValues].sort((a, b) => a - b);
  stats.median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  // Calculate standard deviation
  const variance =
    scoreValues.reduce((sum, val) => sum + Math.pow(val - stats.mean, 2), 0) /
    scoreValues.length;
  stats.stdDev = Math.sqrt(variance);

  // Calculate mode
  const frequency = {};
  scoreValues.forEach((val) => {
    frequency[val] = (frequency[val] || 0) + 1;
  });
  stats.mode =
    Number(
      Object.keys(frequency).reduce((a, b) =>
        frequency[a] > frequency[b] ? a : b
      )
    ) || 0;

  // Format histogram data
  const histogram = scores.map((bucket) => ({
    range: `${bucket._id}-${bucket._id + 9}`,
    rangeStart: bucket._id,
    rangeEnd: bucket._id + 9,
    count: bucket.count,
    percentage: ((bucket.count / stats.total) * 100).toFixed(1),
    uniqueStudents: bucket.students.length,
    averageScore: Math.round(bucket.averageScore * 10) / 10,
    gradeDistribution: bucket.grades.reduce((acc, grade) => {
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {}),
  }));

  // Identify outliers (scores beyond 2 standard deviations)
  const outliers = await this.find({
    ...query,
    $or: [
      { "score.value": { $lt: stats.mean - 2 * stats.stdDev } },
      { "score.value": { $gt: stats.mean + 2 * stats.stdDev } },
    ],
  })
    .populate("student", "name email")
    .limit(10);

  return {
    histogram,
    statistics: {
      mean: Math.round(stats.mean * 10) / 10,
      median: Math.round(stats.median * 10) / 10,
      mode: stats.mode,
      standardDeviation: Math.round(stats.stdDev * 10) / 10,
      min: stats.min,
      max: stats.max,
      totalRecords: stats.total,
    },
    outliers: outliers.map((o) => ({
      student: o.student,
      score: o.score.value,
      grade: o.score.grade,
      category: o.category,
      date: o.recordDate,
      deviationFromMean: Math.round((o.score.value - stats.mean) * 10) / 10,
    })),
    insights: generateDistributionInsights(stats, histogram),
  };
};

/**
 * Static method: Record performance from assessment
 */
StudentPerformanceSchema.statics.recordAssessmentScore = async function (
  assessmentAttempt
) {
  const { learner, assessment, score, session } = assessmentAttempt;

  // Get previous score for trend analysis
  const previousRecord = await this.findOne({
    student: learner,
    assessment: assessment._id,
  }).sort({ recordDate: -1 });

  const performanceData = {
    student: learner,
    tutor: session?.tutor || assessment.createdBy,
    recordDate: new Date(),
    academicPeriod: "monthly",
    score: {
      value: score.percentage,
      percentile: 0, // Will be calculated
    },
    category: assessment.type,
    skill: assessment.skill,
    session: session?._id,
    assessment: assessment._id,
    metrics: {
      attemptNumber: assessmentAttempt.attemptNumber,
      timeSpent: assessmentAttempt.timeSpent,
      completionRate: assessmentAttempt.completionRate || 100,
      difficulty: assessment.config.difficulty,
    },
    trend: {
      previousScore: previousRecord?.score.value,
    },
  };

  return await this.create(performanceData);
};

/**
 * Helper function: Generate insights
 */
function generateDistributionInsights(stats, histogram) {
  const insights = [];

  // Performance level insight
  if (stats.mean >= 85) {
    insights.push({
      type: "success",
      message: `Excellent class performance with an average of ${stats.mean.toFixed(
        1
      )}%`,
    });
  } else if (stats.mean >= 70) {
    insights.push({
      type: "info",
      message: `Good class performance with an average of ${stats.mean.toFixed(
        1
      )}%`,
    });
  } else {
    insights.push({
      type: "warning",
      message: `Class average is ${stats.mean.toFixed(
        1
      )}%. Consider additional support.`,
    });
  }

  // Distribution spread
  if (stats.stdDev > 20) {
    insights.push({
      type: "warning",
      message: `High variance (${stats.stdDev.toFixed(
        1
      )}) indicates diverse student performance levels`,
    });
  }

  // Grade gaps
  const highPerformers = histogram.filter((h) => h.rangeStart >= 80);
  const lowPerformers = histogram.filter((h) => h.rangeStart < 60);

  if (lowPerformers.length > 0 && highPerformers.length > 0) {
    const gap =
      highPerformers.reduce((sum, h) => sum + h.count, 0) /
      lowPerformers.reduce((sum, h) => sum + h.count, 0);

    if (gap > 2) {
      insights.push({
        type: "info",
        message: "Significant gap between high and low performers detected",
      });
    }
  }

  return insights;
}

module.exports = mongoose.model("StudentPerformance", StudentPerformanceSchema);
