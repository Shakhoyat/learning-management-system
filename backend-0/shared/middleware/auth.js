const jwt = require("jsonwebtoken");
const { logger } = require("../logger");

/**
 * Middleware to authenticate users via JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      error: "Invalid token.",
    });
  }
};

/**
 * Middleware to authorize users based on roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Access denied. User not authenticated.",
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

/**
 * Middleware to check if user is admin
 */
const requireAdmin = authorize("admin");

/**
 * Middleware to check if user is teacher or admin
 */
const requireTeacher = authorize("teacher", "admin");

/**
 * Middleware to check if user is student, teacher, or admin
 */
const requireStudent = authorize("student", "teacher", "admin");

module.exports = {
  authenticate,
  authorize,
  requireAdmin,
  requireTeacher,
  requireStudent,
};
