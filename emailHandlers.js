// Import the required packages
import nodemailer from 'nodemailer';
import {
  createCommentNotificationEmailTemplate,
  createConnectionAcceptedEmailTemplate,
  createWelcomeEmailTemplate,
} from "./emailTemplates.js";

// Set up your email transporter (here using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail's SMTP service (you can replace it with any other service)
  auth: {
    user: 'your-email@gmail.com', // Your Gmail address
    pass: 'your-email-password', // Your Gmail password (use App Password if you have 2FA enabled)
  },
});

// Send Welcome Email
export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipient = [{ email }];

  try {
    const info = await transporter.sendMail({
      from: 'your-email@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Welcome to UnLinked", // Subject line
      html: createWelcomeEmailTemplate(name, profileUrl), // HTML body content
    });

    console.log("Welcome Email sent successfully", info);
  } catch (error) {
    console.error("Error sending Welcome Email:", error);
    throw error;
  }
};

// Send Comment Notification Email
export const sendCommentNotificationEmail = async (
  recipientEmail,
  recipientName,
  commenterName,
  postUrl,
  commentContent
) => {
  try {
    const info = await transporter.sendMail({
      from: 'your-email@gmail.com', // sender address
      to: recipientEmail, // recipient email address
      subject: "New Comment on Your Post", // Subject line
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent
      ), // HTML body content
    });
    console.log("Comment Notification Email sent successfully", info);
  } catch (error) {
    console.error("Error sending Comment Notification Email:", error);
    throw error;
  }
};

// Send Connection Accepted Email
export const sendConnectionAcceptedEmail = async (senderEmail, senderName, recipientName, profileUrl) => {
  try {
    const info = await transporter.sendMail({
      from: 'your-email@gmail.com', // sender address
      to: senderEmail, // sender email address
      subject: `${recipientName} accepted your connection request`, // Subject line
      html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl), // HTML body content
    });
    console.log("Connection Accepted Email sent successfully", info);
  } catch (error) {
    console.error("Error sending Connection Accepted Email:", error);
    throw error;
  }
};
console.log('emailHandlers script is running...');


