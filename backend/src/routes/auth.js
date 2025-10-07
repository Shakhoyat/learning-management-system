const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");

// Public routes
router.post("/register", validate(schemas.register), authController.register);
router.post("/login", validate(schemas.login), authController.login);
router.post("/refresh", authController.refreshToken);
router.post(
  "/forgot-password",
  validate(schemas.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(schemas.resetPassword),
  authController.resetPassword
);
router.post("/verify-email", authController.verifyEmail);

// Protected routes
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getCurrentUser);
router.put("/profile", authenticate, authController.updateProfile);
router.put("/change-password", authenticate, authController.changePassword);

module.exports = router;
