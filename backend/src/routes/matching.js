const express = require("express");
const router = express.Router();
const matchingController = require("../controllers/matchingController");
const { authenticate } = require("../middleware/auth");

// Protected routes (authentication required)
router.use(authenticate);

// Matching endpoints
router.get("/tutors", matchingController.findTutors);
router.get("/learners", matchingController.findLearners);
router.get("/skills", matchingController.getSkillMatches);
router.get("/recommendations", matchingController.getRecommendedSkills);
router.get("/stats", matchingController.getMatchingStats);

module.exports = router;
