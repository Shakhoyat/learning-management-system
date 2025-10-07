const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT } = require("../config/constants");
const logger = require("../utils/logger");

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, JWT.SECRET);
    const user = await User.findById(decoded.userId).select(
      "-auth.passwordHash"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid token. User not found.",
      });
    }

    if (!user.auth.isActive) {
      return res.status(401).json({
        success: false,
        error: "Account is deactivated.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      error: "Invalid token.",
    });
  }
};

// Authorization middleware - check user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(token, JWT.SECRET);
      const user = await User.findById(decoded.userId).select(
        "-auth.passwordHash"
      );

      if (user && user.auth.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
