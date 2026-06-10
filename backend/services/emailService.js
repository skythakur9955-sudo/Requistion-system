const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP Email
const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `"NTPC Vehicle Requisition" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP - NTPC Vehicle Requisition System',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007DC5; color: white; padding: 20px; text-align: center; }
          .otp-code { font-size: 32px; font-weight: bold; color: #007DC5; text-align: center; padding: 20px; letter-spacing: 5px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .button { background: #007DC5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>NTPC Limited</h2>
            <p>Vehicle Requisition System</p>
          </div>
          <div style="padding: 20px;">
            <h3>Dear ${name},</h3>
            <p>We received a request to reset your password for your NTPC Vehicle Requisition System account.</p>
            <p>Your OTP for password reset is:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="margin: 20px 0;">
            <p style="font-size: 14px;">For security reasons, never share this OTP with anyone.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; 2024 NTPC Limited. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

// Send Password Reset Success Email
const sendPasswordResetSuccessEmail = async (email, name) => {
  const mailOptions = {
    from: `"NTPC Vehicle Requisition" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Changed Successfully - NTPC Vehicle Requisition System',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007DC5; color: white; padding: 20px; text-align: center; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>NTPC Limited</h2>
            <p>Vehicle Requisition System</p>
          </div>
          <div style="padding: 20px;">
            <h3>Dear ${name},</h3>
            <p>Your password has been successfully changed.</p>
            <p>If you did not make this change, please contact support immediately.</p>
            <p>You can now login with your new password.</p>
            <br>
            <a href="${process.env.FRONTEND_URL}/login" style="background: #007DC5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>
          </div>
          <div class="footer">
            <p>&copy; 2024 NTPC Limited. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset success email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};





module.exports = { sendOTPEmail, sendPasswordResetSuccessEmail };