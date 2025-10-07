const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skillController");
const { authenticate, authorize } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");

// Public routes
router.get("/", skillController.getAllSkills);
router.get("/search", skillController.searchSkills);
router.get("/categories", skillController.getCategories);
router.get("/categories/:category", skillController.getSkillsByCategory);
router.get("/popular", skillController.getPopularSkills);
router.get("/trending", skillController.getTrendingSkills);
router.get("/statistics", skillController.getSkillStatistics);
router.get("/:id", skillController.getSkillById);
router.get("/:id/prerequisites", skillController.getSkillPrerequisites);
router.get("/:id/path", skillController.getSkillPath);

// Protected routes (admin only)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(schemas.createSkill),
  skillController.createSkill
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  skillController.updateSkill
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  skillController.deleteSkill
);

module.exports = router;
