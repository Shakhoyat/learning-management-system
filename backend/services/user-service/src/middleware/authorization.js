const { AppError } = require("../utils/appError");

// Authorization middleware for role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    // Get user role from the authenticated user
    const userRole = req.user?.role || "user";

    if (!roles.includes(userRole)) {
      return next(new AppError("Insufficient permissions", 403));
    }

    next();
  };
};

// Check if user owns the resource or is admin
const authorizeOwnerOrAdmin = (req, res, next) => {
  const requestedUserId = req.params.userId;
  const currentUserId = req.user.id;
  const userRole = req.user?.role || "user";

  if (requestedUserId !== currentUserId && userRole !== "admin") {
    return next(new AppError("You can only access your own resources", 403));
  }

  next();
};

// Check if user is active
const requireActiveUser = (req, res, next) => {
  if (req.user.status !== "active") {
    return next(new AppError("Account is not active", 403));
  }

  next();
};

module.exports = {
  authorize,
  authorizeOwnerOrAdmin,
  requireActiveUser,
};
