const Notification = require("../models/Notification");
const logger = require("../utils/logger");
const { sendEmail } = require("./emailService");

// Send notification
const sendNotification = async ({
  recipient,
  sender,
  type,
  title,
  message,
  content,
  priority = "normal",
  category,
  channels,
  relatedEntities,
  metadata,
  scheduledFor,
}) => {
  try {
    // Create notification
    const notification = new Notification({
      recipient,
      sender,
      type,
      title,
      message,
      content,
      priority,
      category: category || getCategoryFromType(type),
      channels: {
        email: { enabled: channels?.email || false },
        sms: { enabled: channels?.sms || false },
        push: { enabled: channels?.push || false },
        inApp: { enabled: channels?.inApp !== false }, // Default to true
      },
      relatedEntities: relatedEntities || {},
      metadata: metadata || {},
      scheduling: scheduledFor
        ? {
            isScheduled: true,
            scheduledFor: new Date(scheduledFor),
          }
        : undefined,
    });

    await notification.save();

    // Send immediately if not scheduled
    if (!scheduledFor) {
      await processNotification(notification);
    }

    return notification;
  } catch (error) {
    logger.error("Send notification error:", error);
    throw error;
  }
};

// Process notification delivery
const processNotification = async (notification) => {
  try {
    const promises = [];

    // Send email if enabled
    if (notification.channels.email.enabled) {
      promises.push(sendEmailNotification(notification));
    }

    // Send SMS if enabled
    if (notification.channels.sms.enabled) {
      promises.push(sendSMSNotification(notification));
    }

    // Send push notification if enabled
    if (notification.channels.push.enabled) {
      promises.push(sendPushNotification(notification));
    }

    // Process all channels
    await Promise.allSettled(promises);

    // Update notification status
    notification.status = "sent";
    await notification.save();

    return notification;
  } catch (error) {
    logger.error("Process notification error:", error);
    notification.status = "failed";
    await notification.save();
    throw error;
  }
};

// Send email notification
const sendEmailNotification = async (notification) => {
  try {
    const recipient = await require("../models/User").findById(
      notification.recipient
    );

    if (!recipient || !recipient.notificationSettings.email.sessionReminders) {
      return;
    }

    await sendEmail({
      to: recipient.email,
      subject: notification.title,
      template: getEmailTemplate(notification.type),
      data: {
        recipientName: recipient.name,
        title: notification.title,
        message: notification.message,
        ...notification.metadata.context,
      },
    });

    notification.channels.email.sent = true;
    notification.channels.email.sentAt = new Date();
    notification.channels.email.deliveryStatus = "sent";

    await notification.save();
  } catch (error) {
    logger.error("Send email notification error:", error);
    notification.channels.email.deliveryStatus = "failed";
    await notification.save();
  }
};

// Send SMS notification (placeholder)
const sendSMSNotification = async (notification) => {
  try {
    // SMS service implementation would go here
    logger.info(`SMS would be sent for notification: ${notification._id}`);

    notification.channels.sms.sent = true;
    notification.channels.sms.sentAt = new Date();
    notification.channels.sms.deliveryStatus = "sent";

    await notification.save();
  } catch (error) {
    logger.error("Send SMS notification error:", error);
    notification.channels.sms.deliveryStatus = "failed";
    await notification.save();
  }
};

// Send push notification (placeholder)
const sendPushNotification = async (notification) => {
  try {
    // Push notification service implementation would go here
    logger.info(
      `Push notification would be sent for notification: ${notification._id}`
    );

    notification.channels.push.sent = true;
    notification.channels.push.sentAt = new Date();
    notification.channels.push.deliveryStatus = "sent";

    await notification.save();
  } catch (error) {
    logger.error("Send push notification error:", error);
    notification.channels.push.deliveryStatus = "failed";
    await notification.save();
  }
};

// Helper function to get category from type
const getCategoryFromType = (type) => {
  const categoryMap = {
    session_reminder: "session",
    session_cancelled: "session",
    session_completed: "session",
    payment_received: "payment",
    payment_failed: "payment",
    new_message: "message",
    skill_match: "system",
    profile_update: "system",
    system_announcement: "system",
    welcome: "system",
    email_verification: "security",
    password_reset: "security",
    tutor_application: "system",
    booking_request: "session",
    review_received: "achievement",
    achievement_unlocked: "achievement",
  };

  return categoryMap[type] || "system";
};

// Helper function to get email template
const getEmailTemplate = (type) => {
  const templateMap = {
    welcome: "welcome",
    password_reset: "password_reset",
    email_verification: "email_verification",
    session_reminder: "session_reminder",
    payment_received: "payment_confirmation",
  };

  return templateMap[type] || "default";
};

module.exports = {
  sendNotification,
  processNotification,
};
