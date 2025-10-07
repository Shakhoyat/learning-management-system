const jwt = require("jsonwebtoken");
const path = require("path");
const User = require(path.join(
  __dirname,
  "../../../../shared/database/models/User"
));

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: { message: "Access denied. No token provided." },
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

      // Check if user still exists
      const user = await User.findById(decoded.userId).select(
        "-auth.passwordHash -auth.refreshTokens"
      );
      if (!user) {
        return res.status(401).json({
          error: { message: "Token is not valid. User not found." },
        });
      }

      // Check if user is active
      if (!user.status.isActive) {
        return res.status(401).json({
          error: { message: "Account is deactivated." },
        });
      }

      req.user = {
        id: user._id,
        email: user.personal.email,
        name: user.personal.name,
      };

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: { message: "Token expired." },
        });
      }
      return res.status(401).json({
        error: { message: "Token is not valid." },
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      error: { message: "Internal server error" },
    });
  }
};

module.exports = authMiddleware;
