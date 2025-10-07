const express = require("express");
const {
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
} = require("../controllers/sessionController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/authorization");
const {
  validateSession,
  validateSessionUpdate,
} = require("../validators/sessionValidator");

const router = express.Router();

// Protected routes - all session operations require authentication
router.use(authenticate);

// Session CRUD operations
router.post("/", validateSession, createSession);
router.get("/", getAllSessions);
router.get("/my-sessions", getUserSessions);
router.get("/upcoming", getUpcomingSessions);
router.get("/history", getSessionHistory);
router.get("/statistics", getSessionStatistics);
router.get("/:id", getSessionById);
router.put("/:id", validateSessionUpdate, updateSession);
router.delete("/:id", authorize(["admin", "teacher"]), deleteSession);

// Session state management
router.post("/:id/join", joinSession);
router.post("/:id/leave", leaveSession);
router.post("/:id/start", authorize(["teacher"]), startSession);
router.post("/:id/end", authorize(["teacher"]), endSession);
router.post("/:id/pause", authorize(["teacher"]), pauseSession);
router.post("/:id/resume", authorize(["teacher"]), resumeSession);
router.post("/:id/cancel", cancelSession);
router.post("/:id/reschedule", validateSessionUpdate, rescheduleSession);

module.exports = router;
