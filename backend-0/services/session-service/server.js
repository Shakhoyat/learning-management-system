require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const CollaborationService = require("./src/services/CollaborationService");
const sessionRoutes = require("./src/routes");
const { errorHandler } = require("../../shared/middleware/errorHandler");
const connectDB = require("../../shared/database/connection");
const logger = require("../../shared/logger");

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "ws:", "wss:"],
      },
    },
  })
);

// CORS configuration for WebSocket
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Body parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Compression
app.use(compression());

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
    success: true,
    message: "Session service with WebSocket is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    websocket: "enabled",
  });
});

// API routes
app.use("/api/sessions", sessionRoutes);

// WebSocket status endpoint
app.get("/api/sessions/websocket/status", (req, res) => {
  try {
    const stats = {
      connectedClients: collaborationService
        ? collaborationService.io.engine.clientsCount
        : 0,
      namespaces: {
        video: collaborationService
          ? collaborationService.videoNamespace.sockets.size
          : 0,
        whiteboard: collaborationService
          ? collaborationService.whiteboardNamespace.sockets.size
          : 0,
        code: collaborationService
          ? collaborationService.codeNamespace.sockets.size
          : 0,
        chat: collaborationService
          ? collaborationService.chatNamespace.sockets.size
          : 0,
      },
      activeSessions: collaborationService
        ? collaborationService.activeSessions.size
        : 0,
      serverTime: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving WebSocket status",
      error: error.message,
    });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use(errorHandler);

// Initialize collaboration service
let collaborationService;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info("Connected to MongoDB successfully");

    // Initialize WebSocket collaboration service
    collaborationService = new CollaborationService(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        credentials: true,
      },
    });
    logger.info("WebSocket collaboration service initialized");

    const PORT = process.env.SESSION_SERVICE_PORT || 3005;

    // Start the server
    const serverInstance = server.listen(PORT, () => {
      logger.info(`Session service with WebSocket running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(`Process ID: ${process.pid}`);
      logger.info("WebSocket namespaces: /video, /whiteboard, /code, /chat");
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received, starting graceful shutdown...`);

      // Stop accepting new connections
      serverInstance.close(async () => {
        logger.info("HTTP server closed");

        try {
          // Shutdown collaboration service
          if (collaborationService) {
            await collaborationService.shutdown();
          }

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

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    return serverInstance;
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Unhandled promise rejection handler
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  if (collaborationService) {
    collaborationService.shutdown();
  }
  process.exit(1);
});

// Uncaught exception handler
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  if (collaborationService) {
    collaborationService.shutdown();
  }
  process.exit(1);
});

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { startServer, app, server };
