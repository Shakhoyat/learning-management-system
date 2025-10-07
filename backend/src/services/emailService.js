const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

class EmailService {
  constructor() {
    this.transporter = null;
    this.init();
  }

  init() {
    try {
      if (process.env.EMAIL_PROVIDER === "gmail") {
        this.transporter = nodemailer.createTransporter({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
      } else if (process.env.EMAIL_PROVIDER === "smtp") {
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
      } else {
        // Development/testing mode - just log emails
        logger.info("Email service running in development mode");
      }

      logger.info("Email service initialized");
    } catch (error) {
      logger.error("Failed to initialize email service:", error);
    }
  }

  async sendEmail({ to, subject, text, html, attachments }) {
    try {
      if (!this.transporter) {
        // Development mode - just log
        logger.info(`[DEV MODE] Email would be sent to: ${to}`);
        logger.info(`[DEV MODE] Subject: ${subject}`);
        logger.info(`[DEV MODE] Content: ${text || html}`);
        return {
          success: true,
          messageId: `dev_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        };
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || "noreply@learningplatform.com",
        to,
        subject,
        text,
        html,
        attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const subject = "Welcome to Learning Platform!";
    const html = `
      <h1>Welcome ${user.firstName}!</h1>
      <p>Thank you for joining our learning platform. We're excited to have you on board!</p>
      <p>You can now:</p>
      <ul>
        <li>Browse available skills and courses</li>
        <li>Book sessions with expert tutors</li>
        <li>Track your learning progress</li>
        <li>Connect with other learners</li>
      </ul>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Happy learning!</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  async sendEmailVerification(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const subject = "Verify Your Email Address";
    const html = `
      <h1>Email Verification</h1>
      <p>Hi ${user.firstName},</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you can't click the button, copy and paste this URL into your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  async sendPasswordReset(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = "Password Reset Request";
    const html = `
      <h1>Password Reset</h1>
      <p>Hi ${user.firstName},</p>
      <p>You requested to reset your password. Click the link below to set a new password:</p>
      <a href="${resetUrl}" style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you can't click the button, copy and paste this URL into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  async sendSessionConfirmation(session, tutor, learner) {
    const subject = "Session Booking Confirmation";
    const sessionDate = new Date(session.scheduledAt).toLocaleDateString();
    const sessionTime = new Date(session.scheduledAt).toLocaleTimeString();

    // Email to learner
    const learnerHtml = `
      <h1>Session Booked Successfully!</h1>
      <p>Hi ${learner.firstName},</p>
      <p>Your session has been confirmed with the following details:</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Tutor:</strong> ${tutor.firstName} ${tutor.lastName}</p>
        <p><strong>Skill:</strong> ${session.skill.name}</p>
        <p><strong>Date:</strong> ${sessionDate}</p>
        <p><strong>Time:</strong> ${sessionTime}</p>
        <p><strong>Duration:</strong> ${session.duration} minutes</p>
        <p><strong>Format:</strong> ${session.format}</p>
        ${
          session.location
            ? `<p><strong>Location:</strong> ${session.location}</p>`
            : ""
        }
        ${
          session.meetingLink
            ? `<p><strong>Meeting Link:</strong> <a href="${session.meetingLink}">${session.meetingLink}</a></p>`
            : ""
        }
      </div>
      <p>We'll send you a reminder before the session starts.</p>
    `;

    // Email to tutor
    const tutorHtml = `
      <h1>New Session Booking</h1>
      <p>Hi ${tutor.firstName},</p>
      <p>You have a new session booking:</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Student:</strong> ${learner.firstName} ${
      learner.lastName
    }</p>
        <p><strong>Skill:</strong> ${session.skill.name}</p>
        <p><strong>Date:</strong> ${sessionDate}</p>
        <p><strong>Time:</strong> ${sessionTime}</p>
        <p><strong>Duration:</strong> ${session.duration} minutes</p>
        <p><strong>Format:</strong> ${session.format}</p>
        ${
          session.location
            ? `<p><strong>Location:</strong> ${session.location}</p>`
            : ""
        }
      </div>
      <p>Please prepare for the session and be available at the scheduled time.</p>
    `;

    return Promise.all([
      this.sendEmail({
        to: learner.email,
        subject,
        html: learnerHtml,
      }),
      this.sendEmail({
        to: tutor.email,
        subject,
        html: tutorHtml,
      }),
    ]);
  }

  async sendSessionReminder(session, user) {
    const subject = "Session Reminder";
    const sessionDate = new Date(session.scheduledAt).toLocaleDateString();
    const sessionTime = new Date(session.scheduledAt).toLocaleTimeString();

    const html = `
      <h1>Session Reminder</h1>
      <p>Hi ${user.firstName},</p>
      <p>This is a reminder that you have a session starting soon:</p>
      <div style="background: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Skill:</strong> ${session.skill.name}</p>
        <p><strong>Date:</strong> ${sessionDate}</p>
        <p><strong>Time:</strong> ${sessionTime}</p>
        <p><strong>Duration:</strong> ${session.duration} minutes</p>
        ${
          session.meetingLink
            ? `<p><strong>Meeting Link:</strong> <a href="${session.meetingLink}">${session.meetingLink}</a></p>`
            : ""
        }
        ${
          session.location
            ? `<p><strong>Location:</strong> ${session.location}</p>`
            : ""
        }
      </div>
      <p>Please be ready 5 minutes before the session starts.</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  async sendPaymentConfirmation(payment, user) {
    const subject = "Payment Confirmation";
    const html = `
      <h1>Payment Received</h1>
      <p>Hi ${user.firstName},</p>
      <p>We have successfully received your payment:</p>
      <div style="background: #d4edda; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Amount:</strong> $${payment.amount}</p>
        <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
        <p><strong>Date:</strong> ${payment.createdAt.toLocaleDateString()}</p>
        <p><strong>Method:</strong> ${payment.paymentMethod}</p>
      </div>
      <p>Thank you for your payment!</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;
