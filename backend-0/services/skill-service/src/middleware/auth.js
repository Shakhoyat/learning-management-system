const jwt = require("jsonwebtoken");
const { logger } = require("../../../../shared/logger");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    return res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = { authenticate };
