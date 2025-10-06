// Export all database models
const User = require("./models/User");
const Skill = require("./models/Skill");
const Session = require("./models/Session");
const {
  Transaction,
  Review,
  Notification,
} = require("./models/SupportingModels");
const connectDB = require("./connection");

module.exports = {
  // Database connection
  connectDB,

  // Models
  User,
  Skill,
  Session,
  Transaction,
  Review,
  Notification,
};
