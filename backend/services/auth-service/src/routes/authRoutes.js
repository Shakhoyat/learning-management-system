const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResetPassword,
} = require("../validators/authValidators");

// Public routes
router.post("/login", validateLogin, authController.login);
router.post("/register", validateRegister, authController.register);
router.post(
  "/forgot-password",
  validateForgotPassword,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validateResetPassword,
  authController.resetPassword
);
router.post("/verify-email", authController.verifyEmail);
router.post("/refresh", authController.refreshToken);

// Protected routes
router.post("/logout", authMiddleware, authController.logout);
router.get("/me", authMiddleware, authController.getCurrentUser);
router.put("/profile", authMiddleware, authController.updateProfile);
router.put("/change-password", authMiddleware, authController.changePassword);

module.exports = router;
