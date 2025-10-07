// Database Models Index
// Centralized export of all database models

const User = require("./User");
const Skill = require("./Skill");
const Session = require("./Session");
const Payment = require("./Payment");
const Notification = require("./Notification");

// Export all models
module.exports = {
  User,
  Skill,
  Session,
  Payment,
  Notification,
};

// Also export individual models for backward compatibility
module.exports.User = User;
module.exports.Skill = Skill;
module.exports.Session = Session;
module.exports.Payment = Payment;
module.exports.Notification = Notification;
