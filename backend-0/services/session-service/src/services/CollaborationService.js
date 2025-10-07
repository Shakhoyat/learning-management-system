const socketIO = require("socket.io");
const Redis = require("ioredis");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../../../shared/logger");
const { Session, User } = require("../../../../shared/database");

/**
 * Real-time Collaboration Service
 * Handles WebSocket connections for video calls, whiteboard, and code sharing
 */
class CollaborationService {
  constructor(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Redis cluster for scalability
    this.redis = new Redis.Cluster(
      [
        { host: process.env.REDIS_NODE_1 || "localhost", port: 6379 },
        { host: process.env.REDIS_NODE_2 || "localhost", port: 6380 },
      ],
      {
        enableOfflineQueue: false,
        redisOptions: {
          password: process.env.REDIS_PASSWORD,
        },
      }
    );

    // Active sessions and participants tracking
    this.activeSessions = new Map();
    this.userSockets = new Map();

    this.setupNamespaces();
    this.setupEventHandlers();

    logger.info("Collaboration service initialized with WebSocket support");
  }

  setupNamespaces() {
    // Video room namespace for WebRTC signaling
    this.videoNamespace = this.io.of("/video");
    this.videoNamespace.on("connection", (socket) =>
      this.handleVideoConnection(socket)
    );

    // Collaborative whiteboard namespace
    this.whiteboardNamespace = this.io.of("/whiteboard");
    this.whiteboardNamespace.on("connection", (socket) =>
      this.handleWhiteboardConnection(socket)
    );

    // Code collaboration namespace
    this.codeNamespace = this.io.of("/code");
    this.codeNamespace.on("connection", (socket) =>
      this.handleCodeConnection(socket)
    );

    // Chat and general communication
    this.chatNamespace = this.io.of("/chat");
    this.chatNamespace.on("connection", (socket) =>
      this.handleChatConnection(socket)
    );
  }

  setupEventHandlers() {
    // Handle Redis pub/sub for cross-server communication
    this.redis.on("message", (channel, message) => {
      try {
        const data = JSON.parse(message);
        this.handleRedisMessage(channel, data);
      } catch (error) {
        logger.error("Failed to parse Redis message:", error);
      }
    });

    // Subscribe to collaboration channels
    this.redis.subscribe(
      "collaboration:whiteboard",
      "collaboration:code",
      "collaboration:video"
    );
  }

  /**
   * Video Connection Handler - WebRTC Signaling
   */
  handleVideoConnection(socket) {
    logger.info(`Video client connected: ${socket.id}`);

    socket.on("join-room", async (data) => {
      try {
        const { sessionId, userId, userInfo } = data;

        // Validate session and user
        const session = await this.validateSessionAccess(sessionId, userId);
        if (!session) {
          socket.emit("error", { message: "Invalid session or access denied" });
          return;
        }

        // Join room
        socket.join(sessionId);
        socket.sessionId = sessionId;
        socket.userId = userId;

        // Track user connection
        this.userSockets.set(userId, socket.id);

        // Get existing participants
        const participants = await this.getSessionParticipants(sessionId);

        // Notify existing participants about new user
        socket.to(sessionId).emit("user-joined", {
          userId,
          userInfo,
          socketId: socket.id,
        });

        // Send existing participants to new user
        socket.emit("existing-participants", participants);

        // Update session status
        await this.updateSessionStatus(sessionId, "active");

        logger.info(`User ${userId} joined video session ${sessionId}`);
      } catch (error) {
        logger.error("Error joining video room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // WebRTC signaling events
    socket.on("offer", (data) => {
      socket.to(data.target).emit("offer", {
        offer: data.offer,
        sender: socket.id,
      });
    });

    socket.on("answer", (data) => {
      socket.to(data.target).emit("answer", {
        answer: data.answer,
        sender: socket.id,
      });
    });

    socket.on("ice-candidate", (data) => {
      socket.to(data.target).emit("ice-candidate", {
        candidate: data.candidate,
        sender: socket.id,
      });
    });

    // Media control events
    socket.on("toggle-video", (data) => {
      socket.to(socket.sessionId).emit("user-video-toggle", {
        userId: socket.userId,
        enabled: data.enabled,
      });
    });

    socket.on("toggle-audio", (data) => {
      socket.to(socket.sessionId).emit("user-audio-toggle", {
        userId: socket.userId,
        enabled: data.enabled,
      });
    });

    // Screen sharing
    socket.on("start-screen-share", () => {
      socket.to(socket.sessionId).emit("user-screen-share", {
        userId: socket.userId,
        action: "started",
      });
    });

    socket.on("stop-screen-share", () => {
      socket.to(socket.sessionId).emit("user-screen-share", {
        userId: socket.userId,
        action: "stopped",
      });
    });

    socket.on("disconnect", () => this.handleVideoDisconnection(socket));
  }

  /**
   * Whiteboard Connection Handler
   */
  handleWhiteboardConnection(socket) {
    logger.info(`Whiteboard client connected: ${socket.id}`);

    socket.on("join-whiteboard", async (data) => {
      try {
        const { sessionId, userId } = data;

        // Validate access
        const session = await this.validateSessionAccess(sessionId, userId);
        if (!session) {
          socket.emit("error", { message: "Invalid session access" });
          return;
        }

        socket.join(sessionId);
        socket.sessionId = sessionId;
        socket.userId = userId;

        // Load existing whiteboard state
        const whiteboardState = await this.loadWhiteboardState(sessionId);
        socket.emit("whiteboard-state", whiteboardState);

        // Notify others
        socket.to(sessionId).emit("user-joined-whiteboard", { userId });
      } catch (error) {
        logger.error("Error joining whiteboard:", error);
        socket.emit("error", { message: "Failed to join whiteboard" });
      }
    });

    socket.on("draw", async (data) => {
      try {
        const drawData = {
          ...data,
          userId: socket.userId,
          timestamp: Date.now(),
          id: uuidv4(),
        };

        // Store drawing operation in Redis for persistence and replay
        await this.redis.lpush(
          `whiteboard:${socket.sessionId}`,
          JSON.stringify(drawData)
        );

        // Set expiration for cleanup (24 hours)
        await this.redis.expire(`whiteboard:${socket.sessionId}`, 86400);

        // Broadcast to all participants except sender
        socket.to(socket.sessionId).emit("draw", drawData);

        // AI analysis for automatic note generation
        if (data.type === "text" || data.type === "diagram") {
          this.analyzeWhiteboardContent(drawData);
        }

        // Publish to Redis for cross-server sync
        await this.redis.publish(
          "collaboration:whiteboard",
          JSON.stringify({
            type: "draw",
            sessionId: socket.sessionId,
            data: drawData,
          })
        );
      } catch (error) {
        logger.error("Error handling draw event:", error);
      }
    });

    socket.on("erase", async (data) => {
      try {
        const eraseData = {
          ...data,
          userId: socket.userId,
          timestamp: Date.now(),
        };

        // Store erase operation
        await this.redis.lpush(
          `whiteboard:${socket.sessionId}`,
          JSON.stringify({ type: "erase", ...eraseData })
        );

        // Broadcast erase event
        socket.to(socket.sessionId).emit("erase", eraseData);
      } catch (error) {
        logger.error("Error handling erase event:", error);
      }
    });

    socket.on("clear-board", async () => {
      try {
        // Clear whiteboard state
        await this.redis.del(`whiteboard:${socket.sessionId}`);

        // Broadcast clear event
        socket.to(socket.sessionId).emit("board-cleared", {
          userId: socket.userId,
          timestamp: Date.now(),
        });
      } catch (error) {
        logger.error("Error clearing whiteboard:", error);
      }
    });

    socket.on("disconnect", () => this.handleWhiteboardDisconnection(socket));
  }

  /**
   * Code Collaboration Handler
   */
  handleCodeConnection(socket) {
    logger.info(`Code client connected: ${socket.id}`);

    socket.on("join-code-session", async (data) => {
      try {
        const { sessionId, userId, fileId } = data;

        // Validate access
        const session = await this.validateSessionAccess(sessionId, userId);
        if (!session) {
          socket.emit("error", { message: "Invalid session access" });
          return;
        }

        const roomId = `${sessionId}:${fileId}`;
        socket.join(roomId);
        socket.sessionId = sessionId;
        socket.userId = userId;
        socket.fileId = fileId;
        socket.roomId = roomId;

        // Load current file content
        const fileContent = await this.loadCodeFileContent(sessionId, fileId);
        socket.emit("file-content", fileContent);

        // Load active cursors
        const activeCursors = await this.getActiveCursors(roomId);
        socket.emit("active-cursors", activeCursors);

        // Notify others about new collaborator
        socket.to(roomId).emit("collaborator-joined", {
          userId,
          socketId: socket.id,
        });
      } catch (error) {
        logger.error("Error joining code session:", error);
        socket.emit("error", { message: "Failed to join code session" });
      }
    });

    socket.on("code-change", async (data) => {
      try {
        const changeData = {
          ...data,
          userId: socket.userId,
          timestamp: Date.now(),
          changeId: uuidv4(),
        };

        // Apply operational transformation for conflict resolution
        const transformedChange = await this.applyOperationalTransform(
          socket.roomId,
          changeData
        );

        // Store change in Redis for history and conflict resolution
        await this.redis.lpush(
          `code-changes:${socket.roomId}`,
          JSON.stringify(transformedChange)
        );

        // Broadcast to other collaborators
        socket.to(socket.roomId).emit("code-change", transformedChange);

        // Auto-save every few changes
        await this.autoSaveCodeFile(
          socket.sessionId,
          socket.fileId,
          transformedChange
        );

        // Publish for cross-server sync
        await this.redis.publish(
          "collaboration:code",
          JSON.stringify({
            type: "code-change",
            roomId: socket.roomId,
            data: transformedChange,
          })
        );
      } catch (error) {
        logger.error("Error handling code change:", error);
      }
    });

    socket.on("cursor-position", async (data) => {
      try {
        const cursorData = {
          userId: socket.userId,
          position: data.position,
          selection: data.selection,
          timestamp: Date.now(),
        };

        // Store cursor position
        await this.redis.setex(
          `cursor:${socket.roomId}:${socket.userId}`,
          30, // 30 seconds expiration
          JSON.stringify(cursorData)
        );

        // Broadcast cursor position
        socket.to(socket.roomId).emit("cursor-update", cursorData);
      } catch (error) {
        logger.error("Error handling cursor position:", error);
      }
    });

    socket.on("execute-code", async (data) => {
      try {
        // Execute code in sandboxed environment
        const result = await this.executeCodeSafely(data.code, data.language);

        // Broadcast execution result to all collaborators
        this.codeNamespace.to(socket.roomId).emit("code-execution-result", {
          executedBy: socket.userId,
          result,
          timestamp: Date.now(),
        });
      } catch (error) {
        logger.error("Error executing code:", error);
        socket.emit("code-execution-error", { message: error.message });
      }
    });

    socket.on("disconnect", () => this.handleCodeDisconnection(socket));
  }

  /**
   * Chat Connection Handler
   */
  handleChatConnection(socket) {
    logger.info(`Chat client connected: ${socket.id}`);

    socket.on("join-chat", async (data) => {
      try {
        const { sessionId, userId } = data;

        const session = await this.validateSessionAccess(sessionId, userId);
        if (!session) {
          socket.emit("error", { message: "Invalid session access" });
          return;
        }

        socket.join(sessionId);
        socket.sessionId = sessionId;
        socket.userId = userId;

        // Load recent chat history
        const chatHistory = await this.loadChatHistory(sessionId);
        socket.emit("chat-history", chatHistory);
      } catch (error) {
        logger.error("Error joining chat:", error);
      }
    });

    socket.on("send-message", async (data) => {
      try {
        const message = {
          id: uuidv4(),
          userId: socket.userId,
          content: data.content,
          type: data.type || "text",
          timestamp: Date.now(),
        };

        // Store message
        await this.redis.lpush(
          `chat:${socket.sessionId}`,
          JSON.stringify(message)
        );

        // Keep only last 100 messages
        await this.redis.ltrim(`chat:${socket.sessionId}`, 0, 99);

        // Broadcast message
        this.chatNamespace.to(socket.sessionId).emit("new-message", message);

        // AI-powered features
        if (data.content.includes("@ai")) {
          this.handleAIAssistant(socket.sessionId, message);
        }
      } catch (error) {
        logger.error("Error sending message:", error);
      }
    });

    socket.on("disconnect", () => this.handleChatDisconnection(socket));
  }

  /**
   * Helper Methods
   */
  async validateSessionAccess(sessionId, userId) {
    try {
      const session = await Session.findById(sessionId).populate(
        "participants.userId",
        "personal.name account.role"
      );

      if (!session) return null;

      // Check if user is a participant
      const isParticipant = session.participants.some(
        (p) => p.userId._id.toString() === userId
      );

      return isParticipant ? session : null;
    } catch (error) {
      logger.error("Error validating session access:", error);
      return null;
    }
  }

  async getSessionParticipants(sessionId) {
    try {
      const participants = [];
      const sockets = await this.videoNamespace.in(sessionId).fetchSockets();

      for (const socket of sockets) {
        if (socket.userId) {
          participants.push({
            userId: socket.userId,
            socketId: socket.id,
            joinedAt: socket.joinedAt || Date.now(),
          });
        }
      }

      return participants;
    } catch (error) {
      logger.error("Error getting session participants:", error);
      return [];
    }
  }

  async loadWhiteboardState(sessionId) {
    try {
      const operations = await this.redis.lrange(
        `whiteboard:${sessionId}`,
        0,
        -1
      );
      return operations.map((op) => JSON.parse(op)).reverse();
    } catch (error) {
      logger.error("Error loading whiteboard state:", error);
      return [];
    }
  }

  async loadCodeFileContent(sessionId, fileId) {
    try {
      // Load from database or file system
      const content = await this.redis.get(`code-file:${sessionId}:${fileId}`);
      return content
        ? JSON.parse(content)
        : { content: "", language: "javascript" };
    } catch (error) {
      logger.error("Error loading code file:", error);
      return { content: "", language: "javascript" };
    }
  }

  async getActiveCursors(roomId) {
    try {
      const keys = await this.redis.keys(`cursor:${roomId}:*`);
      const cursors = [];

      for (const key of keys) {
        const cursorData = await this.redis.get(key);
        if (cursorData) {
          cursors.push(JSON.parse(cursorData));
        }
      }

      return cursors;
    } catch (error) {
      logger.error("Error getting active cursors:", error);
      return [];
    }
  }

  async applyOperationalTransform(roomId, change) {
    // Simplified operational transformation
    // In production, use libraries like ShareJS or Yjs
    return {
      ...change,
      transformed: true,
      vector_clock: await this.getVectorClock(roomId),
    };
  }

  async getVectorClock(roomId) {
    const clock = await this.redis.get(`vector-clock:${roomId}`);
    const currentClock = clock ? JSON.parse(clock) : {};
    currentClock.timestamp = Date.now();
    await this.redis.setex(
      `vector-clock:${roomId}`,
      3600,
      JSON.stringify(currentClock)
    );
    return currentClock;
  }

  async autoSaveCodeFile(sessionId, fileId, change) {
    // Auto-save logic with debouncing
    const key = `auto-save:${sessionId}:${fileId}`;
    await this.redis.setex(key, 300, JSON.stringify(change)); // 5 minutes
  }

  async executeCodeSafely(code, language) {
    // Implement sandboxed code execution
    // This is a placeholder - use Docker containers or VM for actual execution
    return {
      output: `Executed ${language} code: ${code.substring(0, 50)}...`,
      error: null,
      executionTime: Math.random() * 1000,
    };
  }

  async loadChatHistory(sessionId) {
    try {
      const messages = await this.redis.lrange(`chat:${sessionId}`, 0, 49);
      return messages.map((msg) => JSON.parse(msg)).reverse();
    } catch (error) {
      logger.error("Error loading chat history:", error);
      return [];
    }
  }

  async analyzeWhiteboardContent(drawData) {
    // AI analysis for automatic note generation
    try {
      if (drawData.type === "text") {
        // Analyze text for key concepts
        const concepts = await this.extractConcepts(drawData.content);

        // Generate automatic notes
        await this.generateAutomaticNotes(drawData.sessionId, concepts);
      }
    } catch (error) {
      logger.error("Error analyzing whiteboard content:", error);
    }
  }

  async extractConcepts(text) {
    // Placeholder for AI-powered concept extraction
    return text.split(" ").filter((word) => word.length > 3);
  }

  async generateAutomaticNotes(sessionId, concepts) {
    // Generate and store automatic notes
    const notes = {
      sessionId,
      concepts,
      generatedAt: Date.now(),
      type: "auto-generated",
    };

    await this.redis.lpush(`auto-notes:${sessionId}`, JSON.stringify(notes));
  }

  async handleAIAssistant(sessionId, message) {
    // AI assistant integration
    try {
      const response = await this.getAIResponse(message.content);

      const aiMessage = {
        id: uuidv4(),
        userId: "ai-assistant",
        content: response,
        type: "ai-response",
        timestamp: Date.now(),
      };

      this.chatNamespace.to(sessionId).emit("new-message", aiMessage);
    } catch (error) {
      logger.error("Error handling AI assistant:", error);
    }
  }

  async getAIResponse(content) {
    // Placeholder for AI integration
    return `AI Assistant: I understand you mentioned "${content}". How can I help you with this topic?`;
  }

  async updateSessionStatus(sessionId, status) {
    try {
      await Session.findByIdAndUpdate(sessionId, {
        "status.current": status,
        "status.lastUpdated": Date.now(),
      });
    } catch (error) {
      logger.error("Error updating session status:", error);
    }
  }

  /**
   * Disconnection Handlers
   */
  handleVideoDisconnection(socket) {
    if (socket.sessionId && socket.userId) {
      socket.to(socket.sessionId).emit("user-left", {
        userId: socket.userId,
        socketId: socket.id,
      });

      this.userSockets.delete(socket.userId);
      logger.info(
        `User ${socket.userId} left video session ${socket.sessionId}`
      );
    }
  }

  handleWhiteboardDisconnection(socket) {
    if (socket.sessionId && socket.userId) {
      socket.to(socket.sessionId).emit("user-left-whiteboard", {
        userId: socket.userId,
      });
    }
  }

  handleCodeDisconnection(socket) {
    if (socket.roomId && socket.userId) {
      // Remove cursor
      this.redis.del(`cursor:${socket.roomId}:${socket.userId}`);

      socket.to(socket.roomId).emit("collaborator-left", {
        userId: socket.userId,
      });
    }
  }

  handleChatDisconnection(socket) {
    if (socket.sessionId && socket.userId) {
      // Clean up any temporary data
      logger.info(
        `User ${socket.userId} left chat in session ${socket.sessionId}`
      );
    }
  }

  handleRedisMessage(channel, data) {
    // Handle cross-server messages
    switch (channel) {
      case "collaboration:whiteboard":
        if (data.type === "draw") {
          this.whiteboardNamespace.to(data.sessionId).emit("draw", data.data);
        }
        break;
      case "collaboration:code":
        if (data.type === "code-change") {
          this.codeNamespace.to(data.roomId).emit("code-change", data.data);
        }
        break;
      default:
        logger.warn(`Unknown Redis channel: ${channel}`);
    }
  }

  /**
   * Cleanup and Shutdown
   */
  async shutdown() {
    try {
      logger.info("Shutting down collaboration service...");

      // Close all socket connections
      this.io.close();

      // Disconnect from Redis
      await this.redis.disconnect();

      logger.info("Collaboration service shutdown complete");
    } catch (error) {
      logger.error("Error during collaboration service shutdown:", error);
    }
  }
}

module.exports = CollaborationService;
