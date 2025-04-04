import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (to, subject, html) => {
  try {
    // Log environment variables for debugging
    console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '******' : 'NOT SET'); // Mask the password

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message); // Log the error message
    console.error('Error details:', error); // Log the full error object for debugging
    throw new Error('Failed to send email');
  }
};

// Send verification email
export const sendVerificationEmail = async (email, verificationUrl) => {
  const subject = 'Verify Your Email';
  const message = `
    <p>Thank you for registering. Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
  `;

  // Use the sendEmail function to send the email
  await sendEmail(email, subject, message);
};