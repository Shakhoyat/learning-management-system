require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Import database connection and logger
const connectDB = require("./config/database");
const logger = require("./utils/logger");

// Import middleware
const errorHandler = require("./middleware/errorHandler");
const { authenticate } = require("./middleware/auth");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const skillRoutes = require("./routes/skills");
const matchingRoutes = require("./routes/matching");
const sessionRoutes = require("./routes/sessions");
const paymentRoutes = require("./routes/payments");
const notificationRoutes = require("./routes/notifications");
const analyticsRoutes = require("./routes/analytics");

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later",
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Logging
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Learning Management System Backend",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    services: {
      auth: "active",
      users: "active",
      skills: "active",
      matching: "active",
      sessions: "active",
      payments: "active",
      notifications: "active",
      analytics: "active",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware
app.use(errorHandler);

// Start server function
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info("✅ Connected to MongoDB successfully");

    // Start the server
    const server = app.listen(PORT, () => {
      logger.info(
        `🚀 Learning Management System Backend running on port ${PORT}`
      );
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
      logger.info(`⚡ Process ID: ${process.pid}`);

      // Log available endpoints
      logger.info("📋 Available endpoints:");
      logger.info("   - GET  /health");
      logger.info("   - POST /api/auth/*");
      logger.info("   - GET  /api/users/*");
      logger.info("   - GET  /api/skills/*");
      logger.info("   - POST /api/matching/*");
      logger.info("   - GET  /api/sessions/*");
      logger.info("   - POST /api/payments/*");
      logger.info("   - GET  /api/notifications/*");
      logger.info("   - GET  /api/analytics/*");
    });

    // Graceful shutdown handlers
    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received, starting graceful shutdown...`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          // Close database connection
          await require("mongoose").connection.close();
          logger.info("MongoDB connection closed");

          logger.info("Graceful shutdown completed");
          process.exit(0);
        } catch (error) {
          logger.error("Error during graceful shutdown:", error);
          process.exit(1);
        }
      });

      // Force close after 30 seconds
      setTimeout(() => {
        logger.error(
          "Could not close connections in time, forcefully shutting down"
        );
        process.exit(1);
      }, 30000);
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err, promise) => {
      logger.error("Unhandled Promise Rejection:", err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception:", err);
      server.close(() => {
        process.exit(1);
      });
    });

    return server;
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
