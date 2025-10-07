const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Access denied. Insufficient permissions.",
        required: roles,
        current: req.user.role,
      });
    }

    next();
  };
};

module.exports = { authorize };
