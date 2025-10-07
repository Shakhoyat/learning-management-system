const mongoose = require("mongoose");
const logger = require("./logger");

class Database {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect(uri = process.env.MONGODB_URI) {
    try {
      if (this.isConnected) {
        logger.info("Database already connected");
        return this.connection;
      }

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        bufferCommands: false,
      };

      this.connection = await mongoose.connect(uri, options);
      this.isConnected = true;

      logger.info("Database connected successfully");

      // Handle connection events
      mongoose.connection.on("connected", () => {
        logger.info("Mongoose connected to DB");
      });

      mongoose.connection.on("error", (err) => {
        logger.error("Mongoose connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("Mongoose disconnected");
        this.isConnected = false;
      });

      // Handle process termination
      process.on("SIGINT", this.gracefulClose.bind(this));
      process.on("SIGTERM", this.gracefulClose.bind(this));

      return this.connection;
    } catch (error) {
      logger.error("Database connection error:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.connection.close();
        this.isConnected = false;
        logger.info("Database disconnected successfully");
      }
    } catch (error) {
      logger.error("Error disconnecting from database:", error);
      throw error;
    }
  }

  async gracefulClose() {
    logger.info("Closing database connection gracefully...");
    await this.disconnect();
    process.exit(0);
  }

  getConnection() {
    return this.connection;
  }

  isDBConnected() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  async healthCheck() {
    try {
      if (!this.isDBConnected()) {
        throw new Error("Database not connected");
      }

      // Simple ping to test connection
      await mongoose.connection.db.admin().ping();

      return {
        status: "healthy",
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name,
      };
    } catch (error) {
      logger.error("Database health check failed:", error);
      return {
        status: "unhealthy",
        error: error.message,
      };
    }
  }

  async createIndexes() {
    try {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();

      for (const collection of collections) {
        const model =
          mongoose.models[
            collection.name.charAt(0).toUpperCase() +
              collection.name.slice(1, -1)
          ];
        if (model) {
          await model.createIndexes();
          logger.info(`Indexes created for ${collection.name}`);
        }
      }
    } catch (error) {
      logger.error("Error creating indexes:", error);
      throw error;
    }
  }

  async dropDatabase() {
    try {
      if (!this.isDBConnected()) {
        throw new Error("Database not connected");
      }

      await mongoose.connection.db.dropDatabase();
      logger.info("Database dropped successfully");
    } catch (error) {
      logger.error("Error dropping database:", error);
      throw error;
    }
  }

  async getStats() {
    try {
      if (!this.isDBConnected()) {
        throw new Error("Database not connected");
      }

      const stats = await mongoose.connection.db.stats();
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();

      const collectionStats = {};
      for (const collection of collections) {
        const collStats = await mongoose.connection.db
          .collection(collection.name)
          .stats();
        collectionStats[collection.name] = {
          documents: collStats.count,
          size: collStats.size,
          avgDocSize: collStats.avgObjSize,
          indexes: collStats.nindexes,
        };
      }

      return {
        database: {
          name: stats.db,
          collections: stats.collections,
          documents: stats.objects,
          dataSize: stats.dataSize,
          storageSize: stats.storageSize,
          indexes: stats.indexes,
          indexSize: stats.indexSize,
        },
        collections: collectionStats,
      };
    } catch (error) {
      logger.error("Error getting database stats:", error);
      throw error;
    }
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;
