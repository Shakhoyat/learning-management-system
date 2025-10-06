require('dotenv').config();
const app = require('./src/app');
const connectDB = require('../shared/database/connection');
const logger = require('../shared/logger');
const redis = require('../shared/cache/redis');

const PORT = process.env.MATCHING_SERVICE_PORT || 3006;
const SERVICE_NAME = 'matching-service';

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB successfully');

    // Initialize Redis connection
    await redis.connect();
    logger.info('Connected to Redis successfully');

    // Start the server
    const server = app.listen(PORT, () => {
      logger.info(`${SERVICE_NAME} running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Process ID: ${process.pid}`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received, starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          // Close database connection
          await require('mongoose').connection.close();
          logger.info('MongoDB connection closed');
          
          // Close Redis connection
          await redis.disconnect();
          logger.info('Redis connection closed');
          
          logger.info('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown:', error);
          process.exit(1);
        }
      });
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { startServer };