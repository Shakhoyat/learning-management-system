const jwt = require("jsonwebtoken");

class AuthService {
  // Generate access token
  generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "secret", {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    });
  }

  // Generate refresh token
  generateRefreshToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET || "refresh_secret",
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );
  }

  // Generate both tokens
  generateTokens(userId) {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  }

  // Generate email verification token
  generateEmailVerificationToken(userId) {
    return jwt.sign(
      { userId, type: "email_verification" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );
  }

  // Generate password reset token
  generatePasswordResetToken(userId) {
    return jwt.sign(
      { userId, type: "password_reset" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
  }

  // Verify token
  verifyToken(token, secret = process.env.JWT_SECRET || "secret") {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  // Extract token from authorization header
  extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    return authHeader.substring(7);
  }
}

module.exports = new AuthService();
