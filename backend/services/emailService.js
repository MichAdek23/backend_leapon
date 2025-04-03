import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports like 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // This should be your Gmail App Password
  }
});

// Generic function to send emails
export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

// Send verification email
export const sendVerificationEmail = async (email, verificationUrl) => {
  const subject = 'Verify Your Email';
  const message = `
    <p>Thank you for registering. Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
  `;

  // Use the sendEmail function to send the email
  await sendEmail({
    to: email,
    subject,
    html: message,
  });
};

export default transporter;