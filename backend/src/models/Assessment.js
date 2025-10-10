const mongoose = require("mongoose");

/**
 * Assessment Model
 * Tracks quizzes, tests, assignments, and evaluations
 * for measuring student progress and understanding
 */
const AssessmentSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: [
        "quiz",
        "test",
        "assignment",
        "practice",
        "evaluation",
        "self_assessment",
        "peer_review",
      ],
      required: true,
    },

    // Related Entities
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
      index: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Assessment Configuration
    config: {
      difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert"],
        required: true,
      },
      timeLimit: {
        // in minutes, null = no time limit
        type: Number,
        default: null,
      },
      passingScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 70,
      },
      attemptsAllowed: {
        type: Number,
        default: 1, // -1 = unlimited
      },
      shuffleQuestions: {
        type: Boolean,
        default: false,
      },
      shuffleAnswers: {
        type: Boolean,
        default: false,
      },
      showCorrectAnswers: {
        type: Boolean,
        default: true, // After completion
      },
      showScore: {
        type: Boolean,
        default: true,
      },
    },

    // Questions
    questions: [
      {
        questionId: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: [
            "multiple_choice",
            "true_false",
            "short_answer",
            "essay",
            "coding",
            "matching",
            "ordering",
            "fill_blank",
          ],
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        points: {
          type: Number,
          required: true,
          default: 1,
        },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
        },

        // Multiple choice / True-False options
        options: [
          {
            optionId: String,
            text: String,
            isCorrect: Boolean,
          },
        ],

        // For short answer / essay
        correctAnswers: [String], // Acceptable answers
        sampleAnswer: String,

        // For coding questions
        codingConfig: {
          language: String,
          starterCode: String,
          testCases: [
            {
              input: mongoose.Schema.Types.Mixed,
              expectedOutput: mongoose.Schema.Types.Mixed,
              isHidden: Boolean, // Hidden test cases
            },
          ],
        },

        // For matching questions
        pairs: [
          {
            left: String,
            right: String,
          },
        ],

        // For ordering questions
        correctOrder: [String],

        // Explanation and hints
        explanation: String,
        hints: [String],
        resources: [
          {
            title: String,
            url: String,
            type: String,
          },
        ],

        // Metadata
        tags: [String],
        learningObjective: String,
      },
    ],

    // Grading Configuration
    grading: {
      totalPoints: {
        type: Number,
        required: true,
      },
      autoGrade: {
        type: Boolean,
        default: true, // Auto-grade for objective questions
      },
      partialCredit: {
        type: Boolean,
        default: false,
      },
      rubric: [
        {
          criterion: String,
          maxPoints: Number,
          description: String,
        },
      ],
    },

    // Publishing and Availability
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: Date,
    availableFrom: Date,
    availableUntil: Date,

    // Target Audience
    targetAudience: {
      minLevel: {
        type: Number,
        min: 1,
        max: 10,
      },
      maxLevel: {
        type: Number,
        min: 1,
        max: 10,
      },
      prerequisites: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
        },
      ],
    },

    // Statistics (aggregated from attempts)
    statistics: {
      totalAttempts: {
        type: Number,
        default: 0,
      },
      uniqueStudents: {
        type: Number,
        default: 0,
      },
      averageScore: {
        type: Number,
        default: 0,
      },
      averageTimeSpent: {
        // in minutes
        type: Number,
        default: 0,
      },
      passRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
      },
      questionStatistics: [
        {
          questionId: String,
          timesAnswered: Number,
          correctAnswers: Number,
          averageTimeSpent: Number,
          successRate: Number,
        },
      ],
    },

    // Tags and Categorization
    tags: [String],
    category: String,
    learningObjectives: [String],

    // Metadata
    version: {
      type: Number,
      default: 1,
    },
    metadata: {
      estimatedDuration: Number, // in minutes
      difficulty: String,
      lastModified: Date,
      modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Assessment Attempt Model
 * Tracks individual student attempts at assessments
 */
const AssessmentAttemptSchema = new mongoose.Schema(
  {
    // References
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },

    // Attempt Details
    attemptNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "submitted", "graded", "expired"],
      default: "not_started",
    },

    // Timing
    startedAt: Date,
    submittedAt: Date,
    timeSpent: {
      // in seconds
      type: Number,
      default: 0,
    },
    expiresAt: Date, // For timed assessments

    // Answers
    answers: [
      {
        questionId: String,
        answer: mongoose.Schema.Types.Mixed, // Can be string, array, object
        timeSpent: Number, // in seconds
        isCorrect: Boolean,
        pointsEarned: {
          type: Number,
          default: 0,
        },
        autoGraded: {
          type: Boolean,
          default: false,
        },
        feedback: String,
      },
    ],

    // Scoring
    score: {
      rawScore: {
        type: Number,
        default: 0,
      },
      percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      passed: {
        type: Boolean,
        default: false,
      },
      grade: {
        type: String,
        enum: [
          "A+",
          "A",
          "A-",
          "B+",
          "B",
          "B-",
          "C+",
          "C",
          "C-",
          "D",
          "F",
          "Pass",
          "Fail",
        ],
      },
    },

    // Grading
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    gradedAt: Date,
    gradingNotes: String,
    rubricScores: [
      {
        criterion: String,
        pointsEarned: Number,
        maxPoints: Number,
        feedback: String,
      },
    ],

    // Feedback
    feedback: {
      tutor: {
        comment: String,
        submittedAt: Date,
        recommendations: [String],
      },
      student: {
        difficulty: {
          type: String,
          enum: ["too_easy", "just_right", "too_hard"],
        },
        comment: String,
        submittedAt: Date,
      },
    },

    // Performance Insights
    performance: {
      strengths: [String],
      weaknesses: [String],
      areasForImprovement: [String],
      recommendedResources: [
        {
          title: String,
          url: String,
          type: String,
        },
      ],
    },

    // Metadata
    ipAddress: String,
    userAgent: String,
    metadata: {
      browser: String,
      device: String,
      cheatingFlags: [
        {
          type: String,
          timestamp: Date,
          description: String,
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for Assessment
AssessmentSchema.index({ skill: 1, status: 1 });
AssessmentSchema.index({ createdBy: 1, status: 1 });
AssessmentSchema.index({ "config.difficulty": 1 });
AssessmentSchema.index({ tags: 1 });
AssessmentSchema.index({ createdAt: -1 });

// Indexes for AssessmentAttempt
AssessmentAttemptSchema.index({ assessment: 1, student: 1 });
AssessmentAttemptSchema.index({ student: 1, status: 1 });
AssessmentAttemptSchema.index({ session: 1 });
AssessmentAttemptSchema.index({ submittedAt: -1 });

// Virtual for question count
AssessmentSchema.virtual("questionCount").get(function () {
  return this.questions.length;
});

// Virtual for is expired
AssessmentAttemptSchema.virtual("isExpired").get(function () {
  return this.expiresAt && this.expiresAt < new Date();
});

// Method to calculate score
AssessmentAttemptSchema.methods.calculateScore = function (assessmentData) {
  let totalPoints = 0;
  let earnedPoints = 0;

  this.answers.forEach((answer) => {
    const question = assessmentData.questions.find(
      (q) => q.questionId === answer.questionId
    );
    if (question) {
      totalPoints += question.points;
      earnedPoints += answer.pointsEarned || 0;
    }
  });

  this.score.rawScore = earnedPoints;
  this.score.percentage =
    totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  this.score.passed =
    this.score.percentage >= assessmentData.config.passingScore;

  // Assign letter grade
  if (this.score.percentage >= 97) this.score.grade = "A+";
  else if (this.score.percentage >= 93) this.score.grade = "A";
  else if (this.score.percentage >= 90) this.score.grade = "A-";
  else if (this.score.percentage >= 87) this.score.grade = "B+";
  else if (this.score.percentage >= 83) this.score.grade = "B";
  else if (this.score.percentage >= 80) this.score.grade = "B-";
  else if (this.score.percentage >= 77) this.score.grade = "C+";
  else if (this.score.percentage >= 73) this.score.grade = "C";
  else if (this.score.percentage >= 70) this.score.grade = "C-";
  else if (this.score.percentage >= 60) this.score.grade = "D";
  else this.score.grade = "F";

  return this.score;
};

// Method to auto-grade objective questions
AssessmentAttemptSchema.methods.autoGradeObjectiveQuestions = function (
  assessmentData
) {
  this.answers.forEach((answer) => {
    const question = assessmentData.questions.find(
      (q) => q.questionId === answer.questionId
    );

    if (!question) return;

    // Auto-grade multiple choice and true/false
    if (question.type === "multiple_choice" || question.type === "true_false") {
      const correctOptions = question.options.filter((opt) => opt.isCorrect);
      const selectedOptions = Array.isArray(answer.answer)
        ? answer.answer
        : [answer.answer];

      const isCorrect =
        correctOptions.length === selectedOptions.length &&
        correctOptions.every((opt) => selectedOptions.includes(opt.optionId));

      answer.isCorrect = isCorrect;
      answer.pointsEarned = isCorrect ? question.points : 0;
      answer.autoGraded = true;
    }

    // Auto-grade short answer (exact match)
    if (question.type === "short_answer" && question.correctAnswers) {
      const normalizedAnswer = answer.answer?.toString().toLowerCase().trim();
      const isCorrect = question.correctAnswers.some(
        (correct) => correct.toLowerCase().trim() === normalizedAnswer
      );

      answer.isCorrect = isCorrect;
      answer.pointsEarned = isCorrect ? question.points : 0;
      answer.autoGraded = true;
    }
  });

  return this.calculateScore(assessmentData);
};

// Static method to get student performance summary
AssessmentAttemptSchema.statics.getStudentPerformance = async function (
  studentId,
  skillId = null
) {
  const matchStage = {
    student: mongoose.Types.ObjectId(studentId),
    status: "graded",
  };

  const attempts = await this.find(matchStage)
    .populate("assessment")
    .sort({ submittedAt: -1 });

  const filteredAttempts = skillId
    ? attempts.filter(
        (att) => att.assessment.skill.toString() === skillId.toString()
      )
    : attempts;

  const totalAttempts = filteredAttempts.length;
  const averageScore =
    totalAttempts > 0
      ? filteredAttempts.reduce((sum, att) => sum + att.score.percentage, 0) /
        totalAttempts
      : 0;
  const passedAttempts = filteredAttempts.filter(
    (att) => att.score.passed
  ).length;
  const passRate = totalAttempts > 0 ? passedAttempts / totalAttempts : 0;

  return {
    totalAttempts,
    averageScore,
    passRate,
    recentAttempts: filteredAttempts.slice(0, 5),
    performanceTrend: filteredAttempts.slice(0, 10).map((att) => ({
      date: att.submittedAt,
      score: att.score.percentage,
    })),
  };
};

// Update assessment statistics after attempt
AssessmentAttemptSchema.post("save", async function () {
  if (this.status === "graded" || this.status === "submitted") {
    const Assessment = mongoose.model("Assessment");

    const attempts = await this.constructor.find({
      assessment: this.assessment,
      status: { $in: ["graded", "submitted"] },
    });

    const uniqueStudents = new Set(
      attempts.map((att) => att.student.toString())
    );

    const totalAttempts = attempts.length;
    const averageScore =
      totalAttempts > 0
        ? attempts.reduce((sum, att) => sum + att.score.percentage, 0) /
          totalAttempts
        : 0;
    const passedCount = attempts.filter((att) => att.score.passed).length;
    const averageTime =
      totalAttempts > 0
        ? attempts.reduce((sum, att) => sum + (att.timeSpent || 0), 0) /
          totalAttempts /
          60
        : 0;

    await Assessment.findByIdAndUpdate(this.assessment, {
      "statistics.totalAttempts": totalAttempts,
      "statistics.uniqueStudents": uniqueStudents.size,
      "statistics.averageScore": averageScore,
      "statistics.averageTimeSpent": averageTime,
      "statistics.passRate":
        totalAttempts > 0 ? passedCount / totalAttempts : 0,
    });
  }
});

const Assessment = mongoose.model("Assessment", AssessmentSchema);
const AssessmentAttempt = mongoose.model(
  "AssessmentAttempt",
  AssessmentAttemptSchema
);

module.exports = { Assessment, AssessmentAttempt };
