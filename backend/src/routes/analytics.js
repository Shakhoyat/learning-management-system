const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const { authenticate } = require("../middleware/auth");

/**
 * @route   GET /api/analytics/teaching
 * @desc    Get detailed teaching analytics for tutors
 * @access  Private (Tutors only)
 */
router.get("/teaching", authenticate, analyticsController.getTeachingAnalytics);

/**
 * @route   GET /api/analytics/learning
 * @desc    Get detailed learning analytics for learners
 * @access  Private
 */
router.get("/learning", authenticate, analyticsController.getLearningAnalytics);

/**
 * @route   GET /api/analytics/overview
 * @desc    Get analytics overview (auto-detects role)
 * @access  Private
 */
router.get("/overview", authenticate, analyticsController.getAnalyticsOverview);

/**
 * @route   GET /api/analytics/history
 * @desc    Get analytics history for multiple periods
 * @access  Private
 */
router.get("/history", authenticate, analyticsController.getAnalyticsHistory);

/**
 * @route   GET /api/analytics/assessments
 * @desc    Get assessment analytics
 * @access  Private
 */
router.get(
  "/assessments",
  authenticate,
  analyticsController.getAssessmentAnalytics
);

/**
 * @route   POST /api/analytics/reports
 * @desc    Generate a new analytics report
 * @access  Private
 */
router.post("/reports", authenticate, analyticsController.generateReport);

/**
 * @route   GET /api/analytics/reports
 * @desc    Get user's reports
 * @access  Private
 */
router.get("/reports", authenticate, analyticsController.getReports);

/**
 * @route   GET /api/analytics/reports/:reportId
 * @desc    Get a specific report by ID
 * @access  Private
 */
router.get(
  "/reports/:reportId",
  authenticate,
  analyticsController.getReportById
);

module.exports = router;
