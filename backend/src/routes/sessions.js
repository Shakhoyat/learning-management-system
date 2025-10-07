const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const { authenticate, authorize } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");

// Protected routes (authentication required for all session operations)
router.use(authenticate);

// Session management
router.get("/", sessionController.getAllSessions);
router.get("/upcoming", sessionController.getUpcomingSessions);
router.get("/stats", sessionController.getSessionStats);
router.get("/:id", sessionController.getSessionById);
router.post(
  "/",
  validate(schemas.createSession),
  sessionController.createSession
);
router.put("/:id", sessionController.updateSession);
router.delete("/:id", sessionController.cancelSession);

// Session state management
router.post("/:id/start", sessionController.startSession);
router.post("/:id/complete", sessionController.completeSession);
router.post("/:id/feedback", sessionController.addFeedback);

module.exports = router;
