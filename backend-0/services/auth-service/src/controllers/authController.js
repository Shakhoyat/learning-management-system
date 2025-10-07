const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const User = require(path.join(
  __dirname,
  "../../../../shared/database/models/User"
));
const authService = require("../services/authService");

class AuthController {
  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({
        "personal.email": email.toLowerCase(),
      });
      if (!user) {
        return res.status(401).json({
          error: { message: "Invalid email or password" },
        });
      }

      // Check if account is locked
      if (user.auth.lockUntil && user.auth.lockUntil > Date.now()) {
        return res.status(423).json({
          error: {
            message:
              "Account temporarily locked due to too many failed login attempts",
          },
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(
        password,
        user.auth.passwordHash
      );
      if (!isValidPassword) {
        // Increment login attempts
        user.auth.loginAttempts = (user.auth.loginAttempts || 0) + 1;

        // Lock account if too many attempts
        if (user.auth.loginAttempts >= 5) {
          user.auth.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        }

        await user.save();
        return res.status(401).json({
          error: { message: "Invalid email or password" },
        });
      }

      // Reset login attempts on successful login
      user.auth.loginAttempts = 0;
      user.auth.lockUntil = undefined;
      user.auth.lastLogin = new Date();

      // Generate tokens
      const { accessToken, refreshToken } = authService.generateTokens(
        user._id
      );

      // Save refresh token
      user.auth.refreshTokens.push({
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      await user.save();

      // Prepare user data (exclude sensitive information)
      const userData = {
        id: user._id,
        personal: user.personal,
        preferences: user.preferences,
        status: user.status,
        createdAt: user.createdAt,
      };

      res.json({
        user: userData,
        token: accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        error: { message: "Internal server error" },
      });
    }
  }

  // Register new user
  async register(req, res) {
    try {
      const { name, email, password, timezone = "UTC" } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        "personal.email": email.toLowerCase(),
      });
      if (existingUser) {
        return res.status(409).json({
          error: { message: "User already exists with this email" },
        });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = new User({
        personal: {
          name: name.trim(),
          email: email.toLowerCase(),
          timezone,
        },
        auth: {
          passwordHash,
          emailVerified: false,
        },
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          privacy: {
            profileVisibility: "public",
            showEmail: false,
            showSkills: true,
          },
          learning: {
            sessionReminders: true,
            dailyGoals: true,
            weeklyReports: true,
          },
        },
        status: {
          isActive: true,
          isOnline: false,
          availability: "available",
        },
      });

      await newUser.save();

      // Generate email verification token
      const verificationToken = authService.generateEmailVerificationToken(
        newUser._id
      );

      // In a real application, you would send this token via email
      console.log(
        `Email verification token for ${email}: ${verificationToken}`
      );

      // Prepare user data (exclude sensitive information)
      const userData = {
        id: newUser._id,
        personal: newUser.personal,
        preferences: newUser.preferences,
        status: newUser.status,
        createdAt: newUser.createdAt,
      };

      res.status(201).json({
        user: userData,
        message:
          "Registration successful. Please check your email to verify your account.",
        verificationToken, // Remove this in production
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        error: { message: "Internal server error" },
      });
    }
  }

  // Logout user
  async logout(req, res) {
    try {
      const refreshToken = req.body.refreshToken;

      if (refreshToken) {
        // Remove the refresh token from user's tokens array
        await User.updateOne(
          { _id: req.user.id },
          { $pull: { "auth.refreshTokens": { token: refreshToken } } }
        );
      }

      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        error: { message: "Internal server error" },
      });
    }
  }

  // Refresh access token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          error: { message: "Refresh token required" },
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "refresh_secret"
      );

      // Find user and check if refresh token exists
      const user = await User.findOne({
        _id: decoded.userId,
        "auth.refreshTokens.token": refreshToken,
      });

      if (!user) {
        return res.status(401).json({
          error: { message: "Invalid refresh token" },
        });
      }

      // Check if refresh token is expired
      const tokenData = user.auth.refreshTokens.find(
        (t) => t.token === refreshToken
      );
      if (tokenData && tokenData.expiresAt < new Date()) {
        // Remove expired token
        await User.updateOne(
          { _id: user._id },
          { $pull: { "auth.refreshTokens": { token: refreshToken } } }
        );
        return res.status(401).json({
          error: { message: "Refresh token expired" },
        });
      }

      // Generate new access token
      const newAccessToken = authService.generateAccessToken(user._id);

      res.json({
        token: newAccessToken,
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(401).json({
        error: { message: "Invalid refresh token" },
      });
    }
  }

  // Get current user
  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id).select(
        "-auth.passwordHash -auth.refreshTokens"
      );

      if (!user) {
        return res.status(404).json({
          error: { message: "User not found" },
        });
      }

      res.json({ user });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({
        error: { message: "Internal server error" },
      });
    }
  }

  // Forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({
        "personal.email": email.toLowerCase(),
      });
      if (!user) {
        // Don't reveal that user doesn't exist
        return res.json({
          message:
            "If an account with that email exists, a password reset link has been sent.",
        });
      }

      // Generate reset token
      const resetToken = authService.generatePasswordResetToken(user._id);

      // In a real application, you would send this token via email
      console.log(`Password reset token for ${email}: ${resetToken}`);

      res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
        resetToken, // Remove this in production
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        error: { message: "Internal server error" },
      });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      // Verify reset token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(400).json({
          error: { message: "Invalid or expired reset token" },
        });
      }

      // Hash new password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Update password and clear refresh tokens
      user.auth.passwordHash = passwordHash;
      user.auth.refreshTokens = [];
      user.auth.loginAttempts = 0;
      user.auth.lockUntil = undefined;

      await user.save();

      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error);
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res.status(400).json({
          error: { message: "Invalid or expired reset token" },
        });
      }
      res.status(500).json({
        error: { message: "Internal server error" },
      });
    }
  }

  // Verify email
  async verifyEmail(req, res) {
    try {
      const { token } = req.body;

      // Verify email verification token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(400).json({
          error: { message: "Invalid or expired verification token" },
        });
      }

      if (user.auth.emailVerified) {
        return res.json({ message: "Email already verified" });
      }

      // Mark email as verified
      user.auth.emailVerified = true;
      await user.save();

      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res.status(400).json({
          error: { message: "Invalid or expired verification token" },
        });
      }
      res.status(500).json({
        error: { message: "Internal server error" },
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const allowedUpdates = [
        "personal.name",
        "personal.bio",
        "personal.timezone",
        "personal.languages",
      ];
      const updates = {};

      // Filter allowed updates
      for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          error: { message: "No valid updates provided" },
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-auth.passwordHash -auth.refreshTokens");

      res.json({ user });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        error: { message: "Internal server error" },
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          error: { message: "User not found" },
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.auth.passwordHash
      );
      if (!isValidPassword) {
        return res.status(400).json({
          error: { message: "Current password is incorrect" },
        });
      }

      // Hash new password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear refresh tokens
      user.auth.passwordHash = passwordHash;
      user.auth.refreshTokens = [];

      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        error: { message: "Internal server error" },
      });
    }
  }
}

module.exports = new AuthController();
