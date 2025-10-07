const Session = require("../../../../shared/database/models/Session");
const { logger } = require("../../../../shared/logger");
const { v4: uuidv4 } = require("uuid");

// Create a new session
const createSession = async (req, res) => {
  try {
    const sessionData = {
      ...req.body,
      room: {
        videoRoomId: uuidv4(),
        videoProvider: "default",
        joinUrl: `${
          process.env.VIDEO_BASE_URL || "http://localhost:3005"
        }/room/${uuidv4()}`,
        password: Math.random().toString(36).substring(2, 15),
      },
      createdBy: req.user.id,
    };

    const session = new Session(sessionData);
    await session.save();

    await session.populate([
      { path: "participants.teacher", select: "name email profile" },
      { path: "participants.learner", select: "name email profile" },
      { path: "skill", select: "name category difficulty" },
    ]);

    res.status(201).json({
      message: "Session created successfully",
      session,
    });
  } catch (error) {
    logger.error("Error creating session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};

// Get session by ID
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("participants.teacher", "name email profile")
      .populate("participants.learner", "name email profile")
      .populate("skill", "name category difficulty");

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if user has access to this session
    const userId = req.user.id;
    const isParticipant =
      session.participants.teacher._id.toString() === userId ||
      session.participants.learner._id.toString() === userId;

    const isAdmin = req.user.role === "admin";

    if (!isParticipant && !isAdmin) {
      return res.status(403).json({ error: "Access denied to this session" });
    }

    res.json(session);
  } catch (error) {
    logger.error("Error fetching session:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
};

// Get all sessions (with filtering and pagination)
const getAllSessions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      skill,
      teacher,
      learner,
      startDate,
      endDate,
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (skill) query.skill = skill;
    if (teacher) query["participants.teacher"] = teacher;
    if (learner) query["participants.learner"] = learner;

    if (startDate || endDate) {
      query["schedule.startTime"] = {};
      if (startDate) query["schedule.startTime"].$gte = new Date(startDate);
      if (endDate) query["schedule.startTime"].$lte = new Date(endDate);
    }

    // Restrict access based on user role
    if (req.user.role !== "admin") {
      query.$or = [
        { "participants.teacher": req.user.id },
        { "participants.learner": req.user.id },
      ];
    }

    const sessions = await Session.find(query)
      .populate("participants.teacher", "name email")
      .populate("participants.learner", "name email")
      .populate("skill", "name category")
      .sort({ "schedule.startTime": -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    logger.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// Update session
const updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if user can update this session
    const userId = req.user.id;
    const canUpdate =
      session.participants.teacher.toString() === userId ||
      session.participants.learner.toString() === userId ||
      req.user.role === "admin";

    if (!canUpdate) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Prevent certain fields from being updated based on session status
    if (session.status === "completed" || session.status === "cancelled") {
      return res
        .status(400)
        .json({ error: "Cannot update completed or cancelled session" });
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: "participants.teacher", select: "name email" },
      { path: "participants.learner", select: "name email" },
      { path: "skill", select: "name category" },
    ]);

    res.json({
      message: "Session updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    logger.error("Error updating session:", error);
    res.status(500).json({ error: "Failed to update session" });
  }
};

// Delete session
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Only allow deletion if session is not started
    if (["started", "ongoing", "completed"].includes(session.status)) {
      return res
        .status(400)
        .json({ error: "Cannot delete active or completed session" });
    }

    await Session.findByIdAndDelete(req.params.id);

    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    logger.error("Error deleting session:", error);
    res.status(500).json({ error: "Failed to delete session" });
  }
};

// Join session
const joinSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const userId = req.user.id;
    const isParticipant =
      session.participants.teacher.toString() === userId ||
      session.participants.learner.toString() === userId;

    if (!isParticipant) {
      return res
        .status(403)
        .json({ error: "You are not a participant in this session" });
    }

    // Update session status based on participants
    let newStatus = session.status;
    if (session.status === "scheduled" || session.status === "confirmed") {
      newStatus = "started";
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      {
        status: newStatus,
        "activity.joinedAt": new Date(),
      },
      { new: true }
    );

    res.json({
      message: "Joined session successfully",
      session: updatedSession,
      roomInfo: {
        videoRoomId: session.room.videoRoomId,
        joinUrl: session.room.joinUrl,
      },
    });
  } catch (error) {
    logger.error("Error joining session:", error);
    res.status(500).json({ error: "Failed to join session" });
  }
};

// Leave session
const leaveSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ message: "Left session successfully" });
  } catch (error) {
    logger.error("Error leaving session:", error);
    res.status(500).json({ error: "Failed to leave session" });
  }
};

// Start session (teacher only)
const startSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      {
        status: "ongoing",
        "activity.actualStartTime": new Date(),
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({
      message: "Session started successfully",
      session,
    });
  } catch (error) {
    logger.error("Error starting session:", error);
    res.status(500).json({ error: "Failed to start session" });
  }
};

// End session (teacher only)
const endSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      {
        status: "completed",
        "activity.actualEndTime": new Date(),
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({
      message: "Session ended successfully",
      session,
    });
  } catch (error) {
    logger.error("Error ending session:", error);
    res.status(500).json({ error: "Failed to end session" });
  }
};

// Pause session (teacher only)
const pauseSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: "paused" },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({
      message: "Session paused successfully",
      session,
    });
  } catch (error) {
    logger.error("Error pausing session:", error);
    res.status(500).json({ error: "Failed to pause session" });
  }
};

// Resume session (teacher only)
const resumeSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: "ongoing" },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({
      message: "Session resumed successfully",
      session,
    });
  } catch (error) {
    logger.error("Error resuming session:", error);
    res.status(500).json({ error: "Failed to resume session" });
  }
};

// Get user sessions
const getUserSessions = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {
      $or: [
        { "participants.teacher": req.user.id },
        { "participants.learner": req.user.id },
      ],
    };

    if (status) query.status = status;

    const sessions = await Session.find(query)
      .populate("participants.teacher", "name email")
      .populate("participants.learner", "name email")
      .populate("skill", "name category")
      .sort({ "schedule.startTime": -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    logger.error("Error fetching user sessions:", error);
    res.status(500).json({ error: "Failed to fetch user sessions" });
  }
};

// Get upcoming sessions
const getUpcomingSessions = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const query = {
      $or: [
        { "participants.teacher": req.user.id },
        { "participants.learner": req.user.id },
      ],
      "schedule.startTime": { $gte: new Date() },
      status: { $in: ["scheduled", "confirmed"] },
    };

    const sessions = await Session.find(query)
      .populate("participants.teacher", "name email")
      .populate("participants.learner", "name email")
      .populate("skill", "name category")
      .sort({ "schedule.startTime": 1 })
      .limit(parseInt(limit));

    res.json({ upcomingSessions: sessions });
  } catch (error) {
    logger.error("Error fetching upcoming sessions:", error);
    res.status(500).json({ error: "Failed to fetch upcoming sessions" });
  }
};

// Get session history
const getSessionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const query = {
      $or: [
        { "participants.teacher": req.user.id },
        { "participants.learner": req.user.id },
      ],
      status: { $in: ["completed", "cancelled"] },
    };

    const sessions = await Session.find(query)
      .populate("participants.teacher", "name email")
      .populate("participants.learner", "name email")
      .populate("skill", "name category")
      .sort({ "schedule.startTime": -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    logger.error("Error fetching session history:", error);
    res.status(500).json({ error: "Failed to fetch session history" });
  }
};

// Cancel session
const cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const userId = req.user.id;
    const canCancel =
      session.participants.teacher.toString() === userId ||
      session.participants.learner.toString() === userId ||
      req.user.role === "admin";

    if (!canCancel) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (["completed", "cancelled"].includes(session.status)) {
      return res
        .status(400)
        .json({ error: "Session is already completed or cancelled" });
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      {
        status: "cancelled",
        cancellation: {
          cancelledBy: req.user.id,
          cancelledAt: new Date(),
          reason: req.body.reason || "No reason provided",
        },
      },
      { new: true }
    );

    res.json({
      message: "Session cancelled successfully",
      session: updatedSession,
    });
  } catch (error) {
    logger.error("Error cancelling session:", error);
    res.status(500).json({ error: "Failed to cancel session" });
  }
};

// Reschedule session
const rescheduleSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const userId = req.user.id;
    const canReschedule =
      session.participants.teacher.toString() === userId ||
      session.participants.learner.toString() === userId ||
      req.user.role === "admin";

    if (!canReschedule) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (["completed", "cancelled", "ongoing"].includes(session.status)) {
      return res.status(400).json({ error: "Cannot reschedule this session" });
    }

    const { startTime, endTime, reason } = req.body;

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      {
        "schedule.startTime": startTime,
        "schedule.endTime": endTime,
        status: "scheduled",
        $push: {
          "activity.rescheduling": {
            rescheduledBy: req.user.id,
            rescheduledAt: new Date(),
            reason: reason || "Schedule conflict",
            oldSchedule: {
              startTime: session.schedule.startTime,
              endTime: session.schedule.endTime,
            },
          },
        },
      },
      { new: true }
    );

    res.json({
      message: "Session rescheduled successfully",
      session: updatedSession,
    });
  } catch (error) {
    logger.error("Error rescheduling session:", error);
    res.status(500).json({ error: "Failed to reschedule session" });
  }
};

// Get session statistics
const getSessionStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    let query = {};
    if (!isAdmin) {
      query = {
        $or: [
          { "participants.teacher": userId },
          { "participants.learner": userId },
        ],
      };
    }

    const totalSessions = await Session.countDocuments(query);

    const statusStats = await Session.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlyStats = await Session.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: "$schedule.startTime" },
            month: { $month: "$schedule.startTime" },
          },
          count: { $sum: 1 },
          avgDuration: { $avg: "$schedule.duration" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      totalSessions,
      statusDistribution: statusStats,
      monthlyTrend: monthlyStats,
    });
  } catch (error) {
    logger.error("Error fetching session statistics:", error);
    res.status(500).json({ error: "Failed to fetch session statistics" });
  }
};

module.exports = {
  createSession,
  getSessionById,
  getAllSessions,
  updateSession,
  deleteSession,
  joinSession,
  leaveSession,
  startSession,
  endSession,
  pauseSession,
  resumeSession,
  getUserSessions,
  getUpcomingSessions,
  getSessionHistory,
  cancelSession,
  rescheduleSession,
  getSessionStatistics,
};
