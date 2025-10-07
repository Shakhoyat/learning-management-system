const express = require("express");
const {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsByCategory,
  searchSkills,
  getSkillTree,
  getPrerequisites,
  getSkillPath,
  getPopularSkills,
  getSkillStatistics,
} = require("../controllers/skillController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/authorization");
const {
  validateSkill,
  validateSkillUpdate,
} = require("../validators/skillValidator");

const router = express.Router();

// Public routes
router.get("/", getAllSkills);
router.get("/search", searchSkills);
router.get("/categories/:category", getSkillsByCategory);
router.get("/popular", getPopularSkills);
router.get("/statistics", getSkillStatistics);
router.get("/:id", getSkillById);
router.get("/:id/tree", getSkillTree);
router.get("/:id/prerequisites", getPrerequisites);
router.get("/:id/path", getSkillPath);

// Protected routes
router.post(
  "/",
  authenticate,
  authorize(["admin", "teacher"]),
  validateSkill,
  createSkill
);
router.put(
  "/:id",
  authenticate,
  authorize(["admin", "teacher"]),
  validateSkillUpdate,
  updateSkill
);
router.delete("/:id", authenticate, authorize(["admin"]), deleteSkill);

module.exports = router;
