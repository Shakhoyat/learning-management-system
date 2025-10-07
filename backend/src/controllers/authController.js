const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { JWT } = require("../config/constants");
const logger = require("../utils/logger");
const { sendEmail } = require("../services/emailService");

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT.SECRET, {
    expiresIn: JWT.EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ userId }, JWT.REFRESH_SECRET, {
    expiresIn: JWT.REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "learner",
      timezone = "UTC",
      languages,
      bio,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists with this email",
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const user = new User({
      name,
      email,
      bio,
      timezone,
      languages: languages || [],
      role,
      auth: {
        passwordHash,
        emailVerificationToken,
        emailVerified: false,
        isActive: true,
      },
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Add refresh token to user
    user.auth.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    await user.save();

    // Send verification email (optional - don't block registration)
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Learning Management System",
        template: "welcome",
        data: {
          name,
          verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`,
        },
      });
    } catch (emailError) {
      logger.error("Failed to send welcome email:", emailError);
    }

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.auth.emailVerified,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select("+auth.passwordHash");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.auth.isActive) {
      return res.status(401).json({
        success: false,
        error: "Account is deactivated",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      password,
      user.auth.passwordHash
    );
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Add refresh token to user
    user.auth.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Update last login
    user.auth.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.auth.emailVerified,
          avatar: user.avatar,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    const userId = req.user._id;
    const refreshToken = req.body.refreshToken;

    if (refreshToken) {
      // Remove specific refresh token
      await User.updateOne(
        { _id: userId },
        { $pull: { "auth.refreshTokens": { token: refreshToken } } }
      );
    } else {
      // Remove all refresh tokens (logout from all devices)
      await User.updateOne(
        { _id: userId },
        { $set: { "auth.refreshTokens": [] } }
      );
    }

    logger.info(`User logged out: ${req.user.email}`);

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    logger.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Logout failed",
    });
  }
};

// Refresh access token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.auth.isActive) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
    }

    // Check if refresh token exists and is not expired
    const tokenRecord = user.auth.refreshTokens.find(
      (t) => t.token === refreshToken && t.expiresAt > new Date()
    );

    if (!tokenRecord) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired refresh token",
      });
    }

    // Generate new access token
    const { accessToken } = generateTokens(user._id);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    logger.error("Token refresh error:", error);
    res.status(401).json({
      success: false,
      error: "Invalid refresh token",
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("teachingSkills.skillId", "name category difficulty")
      .populate("learningSkills.skillId", "name category difficulty");

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user data",
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.auth;
    delete updates.role;
    delete updates._id;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    })
      .populate("teachingSkills.skillId", "name category difficulty")
      .populate("learningSkills.skillId", "name category difficulty");

    logger.info(`User profile updated: ${user.email}`);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    logger.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update profile",
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Get user with password hash
    const user = await User.findById(userId).select("+auth.passwordHash");

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.auth.passwordHash
    );
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and invalidate all refresh tokens
    user.auth.passwordHash = newPasswordHash;
    user.auth.refreshTokens = [];
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error("Change password error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to change password",
    });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that user doesn't exist
      return res.json({
        success: true,
        message: "If the email exists, a password reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.auth.passwordResetToken = resetToken;
    user.auth.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email
    try {
      await sendEmail({
        to: email,
        subject: "Password Reset Request",
        template: "password_reset",
        data: {
          name: user.name,
          resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        },
      });
    } catch (emailError) {
      logger.error("Failed to send password reset email:", emailError);
      return res.status(500).json({
        success: false,
        error: "Failed to send password reset email",
      });
    }

    logger.info(`Password reset requested for: ${email}`);

    res.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    logger.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process password reset request",
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      "auth.passwordResetToken": token,
      "auth.passwordResetExpires": { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    user.auth.passwordHash = passwordHash;
    user.auth.passwordResetToken = undefined;
    user.auth.passwordResetExpires = undefined;
    user.auth.refreshTokens = []; // Invalidate all sessions
    await user.save();

    logger.info(`Password reset completed for: ${user.email}`);

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    logger.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reset password",
    });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      "auth.emailVerificationToken": token,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid verification token",
      });
    }

    // Mark email as verified
    user.auth.emailVerified = true;
    user.auth.emailVerificationToken = undefined;
    await user.save();

    logger.info(`Email verified for: ${user.email}`);

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    logger.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to verify email",
    });
  }
};
