const Session = require("../models/Session");
const User = require("../models/User");
const Skill = require("../models/Skill");
const Payment = require("../models/Payment");
const logger = require("../utils/logger");
const { SESSION_STATUS, PAGINATION } = require("../config/constants");
const { sendNotification } = require("../services/notificationService");

// Get all sessions with filtering and pagination
exports.getAllSessions = async (req, res) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      status,
      skill,
      tutor,
      learner,
      dateFrom,
      dateTo,
      sortBy = "scheduledDate",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = {};

    // Check user permissions
    if (req.user.role !== "admin") {
      query.$or = [{ tutor: req.user._id }, { learner: req.user._id }];
    }

    if (status) {
      query.status = status;
    }

    if (skill) {
      query.skill = skill;
    }

    if (tutor) {
      query.tutor = tutor;
    }

    if (learner) {
      query.learner = learner;
    }

    if (dateFrom || dateTo) {
      query.scheduledDate = {};
      if (dateFrom) query.scheduledDate.$gte = new Date(dateFrom);
      if (dateTo) query.scheduledDate.$lte = new Date(dateTo);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const sessions = await Session.find(query)
      .populate("tutor", "name email avatar")
      .populate("learner", "name email avatar")
      .populate("skill", "name category difficulty")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalSessions = await Session.countDocuments(query);
    const totalPages = Math.ceil(totalSessions / limit);

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalSessions,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error("Get all sessions error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve sessions",
    });
  }
};

// Get session by ID
exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("tutor", "name email avatar teachingSkills reputation")
      .populate("learner", "name email avatar learningSkills reputation")
      .populate("skill", "name category difficulty learningPath");

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Check permission
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== session.tutor._id.toString() &&
      req.user._id.toString() !== session.learner._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    res.json({
      success: true,
      data: { session },
    });
  } catch (error) {
    logger.error("Get session by ID error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve session",
    });
  }
};

// Create new session
exports.createSession = async (req, res) => {
  try {
    const {
      tutorId,
      skillId,
      scheduledDate,
      duration,
      title,
      description,
      objectives,
      hourlyRate,
    } = req.body;

    // Validate tutor exists and teaches the skill
    const tutor = await User.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({
        success: false,
        error: "Tutor not found",
      });
    }

    const teachingSkill = tutor.teachingSkills.find(
      (ts) => ts.skillId.toString() === skillId
    );

    if (!teachingSkill) {
      return res.status(400).json({
        success: false,
        error: "Tutor does not teach this skill",
      });
    }

    // Validate skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: "Skill not found",
      });
    }

    // Check if session time is available
    const existingSession = await Session.findOne({
      tutor: tutorId,
      scheduledDate: {
        $gte: new Date(scheduledDate),
        $lt: new Date(new Date(scheduledDate).getTime() + duration * 60000),
      },
      status: { $in: ["scheduled", "in_progress"] },
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        error: "Tutor is not available at the requested time",
      });
    }

    // Create session
    const sessionData = {
      tutor: tutorId,
      learner: req.user._id,
      skill: skillId,
      title: title || `Learning ${skill.name}`,
      description,
      scheduledDate: new Date(scheduledDate),
      duration,
      timezone: req.user.timezone || "UTC",
      objectives: objectives || [],
      pricing: {
        hourlyRate: hourlyRate || teachingSkill.hourlyRate,
        totalAmount: ((hourlyRate || teachingSkill.hourlyRate) * duration) / 60,
        currency: "USD",
      },
    };

    const session = new Session(sessionData);
    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate("tutor", "name email avatar")
      .populate("learner", "name email avatar")
      .populate("skill", "name category difficulty");

    // Send notifications
    await sendNotification({
      recipient: tutorId,
      type: "booking_request",
      title: "New Session Booking",
      message: `${req.user.name} has booked a session with you for ${skill.name}`,
      relatedEntities: { session: session._id },
    });

    logger.info(`New session created: ${session._id} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: { session: populatedSession },
    });
  } catch (error) {
    logger.error("Create session error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create session",
    });
  }
};

// Update session
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Check permission
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== session.tutor.toString() &&
      req.user._id.toString() !== session.learner.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    // Remove immutable fields
    delete updates._id;
    delete updates.tutor;
    delete updates.learner;
    delete updates.createdAt;

    // Update session
    Object.assign(session, updates);
    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate("tutor", "name email avatar")
      .populate("learner", "name email avatar")
      .populate("skill", "name category difficulty");

    logger.info(`Session updated: ${session._id} by ${req.user.email}`);

    res.json({
      success: true,
      message: "Session updated successfully",
      data: { session: populatedSession },
    });
  } catch (error) {
    logger.error("Update session error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update session",
    });
  }
};

// Cancel session
exports.cancelSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const session = await Session.findById(id)
      .populate("tutor", "name email")
      .populate("learner", "name email");

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Check permission
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== session.tutor._id.toString() &&
      req.user._id.toString() !== session.learner._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    // Check if session can be cancelled
    if (!session.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        error: "Session cannot be cancelled (less than 24 hours notice)",
      });
    }

    // Update session status
    session.status = SESSION_STATUS.CANCELLED;
    session.cancellation = {
      cancelledBy: req.user._id,
      reason,
      cancelledAt: new Date(),
    };

    await session.save();

    // Handle refund if payment was made
    if (session.pricing.paymentStatus === "paid") {
      // Process refund logic here
      session.cancellation.refundAmount = session.pricing.totalAmount;
    }

    // Send notifications
    const otherParty =
      req.user._id.toString() === session.tutor._id.toString()
        ? session.learner
        : session.tutor;

    await sendNotification({
      recipient: otherParty._id,
      type: "session_cancelled",
      title: "Session Cancelled",
      message: `Your session has been cancelled by ${req.user.name}. Reason: ${reason}`,
      relatedEntities: { session: session._id },
    });

    logger.info(`Session cancelled: ${session._id} by ${req.user.email}`);

    res.json({
      success: true,
      message: "Session cancelled successfully",
      data: { session },
    });
  } catch (error) {
    logger.error("Cancel session error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to cancel session",
    });
  }
};

// Start session
exports.startSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Check permission (tutor only)
    if (req.user._id.toString() !== session.tutor.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only the tutor can start the session",
      });
    }

    // Check if session is scheduled
    if (session.status !== SESSION_STATUS.SCHEDULED) {
      return res.status(400).json({
        success: false,
        error: "Session is not in scheduled status",
      });
    }

    // Update session status
    session.status = SESSION_STATUS.IN_PROGRESS;
    session.actualStartTime = new Date();
    await session.save();

    logger.info(`Session started: ${session._id} by ${req.user.email}`);

    res.json({
      success: true,
      message: "Session started successfully",
      data: { session },
    });
  } catch (error) {
    logger.error("Start session error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to start session",
    });
  }
};

// Complete session
exports.completeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionNotes, learnerProgress } = req.body;

    const session = await Session.findById(id)
      .populate("tutor", "name email")
      .populate("learner", "name email")
      .populate("skill", "name");

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Check permission (tutor only)
    if (req.user._id.toString() !== session.tutor._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only the tutor can complete the session",
      });
    }

    // Check if session is in progress
    if (session.status !== SESSION_STATUS.IN_PROGRESS) {
      return res.status(400).json({
        success: false,
        error: "Session is not in progress",
      });
    }

    // Update session status
    session.status = SESSION_STATUS.COMPLETED;
    session.actualEndTime = new Date();
    session.actualDuration = Math.round(
      (session.actualEndTime - session.actualStartTime) / (1000 * 60)
    );

    // Add session notes
    if (sessionNotes) {
      session.sessionNotes.tutor = sessionNotes;
    }

    // Update learner progress
    if (learnerProgress) {
      session.learnerProgress = {
        ...session.learnerProgress,
        ...learnerProgress,
      };
    }

    await session.save();

    // Update user statistics
    await updateUserStats(session.tutor._id, session.learner._id, session);

    // Send completion notification
    await sendNotification({
      recipient: session.learner._id,
      type: "session_completed",
      title: "Session Completed",
      message: `Your session with ${session.tutor.name} has been completed`,
      relatedEntities: { session: session._id },
    });

    logger.info(`Session completed: ${session._id} by ${req.user.email}`);

    res.json({
      success: true,
      message: "Session completed successfully",
      data: { session },
    });
  } catch (error) {
    logger.error("Complete session error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to complete session",
    });
  }
};

// Add session feedback
exports.addFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const session = await Session.findById(id)
      .populate("tutor", "name")
      .populate("learner", "name");

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Check permission
    if (
      req.user._id.toString() !== session.tutor.toString() &&
      req.user._id.toString() !== session.learner.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    // Check if session is completed
    if (session.status !== SESSION_STATUS.COMPLETED) {
      return res.status(400).json({
        success: false,
        error: "Can only provide feedback for completed sessions",
      });
    }

    // Add feedback
    const isTutor = req.user._id.toString() === session.tutor.toString();
    const feedbackField = isTutor ? "tutor" : "learner";

    session.feedback[feedbackField] = {
      rating,
      comment,
      submittedAt: new Date(),
    };

    await session.save();

    // Update user ratings
    await updateUserRatings(session, isTutor);

    logger.info(
      `Feedback added to session: ${session._id} by ${req.user.email}`
    );

    res.json({
      success: true,
      message: "Feedback submitted successfully",
      data: { session },
    });
  } catch (error) {
    logger.error("Add feedback error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit feedback",
    });
  }
};

// Get upcoming sessions for user
exports.getUpcomingSessions = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const userId = req.user._id;

    const sessions = await Session.getUpcomingSessions(userId, parseInt(days));

    res.json({
      success: true,
      data: { sessions },
    });
  } catch (error) {
    logger.error("Get upcoming sessions error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve upcoming sessions",
    });
  }
};

// Get session statistics
exports.getSessionStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Session.getUserStats(userId);

    res.json({
      success: true,
      data: {
        stats: stats[0] || {
          totalSessions: 0,
          totalHours: 0,
          averageRating: 0,
        },
      },
    });
  } catch (error) {
    logger.error("Get session stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve session statistics",
    });
  }
};

// Helper function to update user statistics
async function updateUserStats(tutorId, learnerId, session) {
  try {
    // Update tutor stats
    await User.findByIdAndUpdate(tutorId, {
      $inc: {
        "reputation.teachingStats.totalSessions": 1,
        "reputation.teachingStats.totalHours": session.actualDuration / 60,
      },
    });

    // Update learner stats
    await User.findByIdAndUpdate(learnerId, {
      $inc: {
        "reputation.learningStats.totalSessions": 1,
        "reputation.learningStats.totalHours": session.actualDuration / 60,
      },
    });

    // Update skill stats
    await Skill.findByIdAndUpdate(session.skill, {
      $inc: {
        "stats.totalSessions": 1,
        "stats.averageSessionDuration": session.actualDuration,
      },
    });
  } catch (error) {
    logger.error("Update user stats error:", error);
  }
}

// Helper function to update user ratings
async function updateUserRatings(session, isTutor) {
  try {
    if (isTutor) {
      // Update learner's rating from tutor's feedback
      const tutorRating = session.feedback.tutor.rating;
      // Update learner rating logic here
    } else {
      // Update tutor's rating from learner's feedback
      const learnerRating = session.feedback.learner.rating;

      // Calculate new average rating for tutor
      const tutorSessions = await Session.find({
        tutor: session.tutor,
        status: SESSION_STATUS.COMPLETED,
        "feedback.learner.rating": { $exists: true },
      });

      const totalRating = tutorSessions.reduce(
        (sum, s) => sum + (s.feedback.learner.rating || 0),
        0
      );
      const averageRating = totalRating / tutorSessions.length;

      await User.findByIdAndUpdate(session.tutor, {
        "reputation.teachingStats.averageRating": averageRating,
      });
    }
  } catch (error) {
    logger.error("Update user ratings error:", error);
  }
}
