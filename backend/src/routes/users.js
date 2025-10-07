const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/auth");

// Public routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.get("/:id/stats", userController.getUserStats);

// Protected routes
router.put("/:id", authenticate, userController.updateUser);
router.delete("/:id", authenticate, userController.deleteUser);

// Teaching skills management
router.post(
  "/:id/teaching-skills",
  authenticate,
  userController.addTeachingSkill
);
router.delete(
  "/:id/teaching-skills/:skillId",
  authenticate,
  userController.removeTeachingSkill
);

// Learning skills management
router.post(
  "/:id/learning-skills",
  authenticate,
  userController.addLearningSkill
);
router.delete(
  "/:id/learning-skills/:skillId",
  authenticate,
  userController.removeLearningSkill
);

module.exports = router;
