const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const { sendOTPEmail, sendPasswordResetSuccessEmail } = require('../services/emailService');
const { Op } = require('sequelize');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @route POST /api/password-reset/forgot-password
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Please enter valid email')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this email address' 
      });
    }

    // Delete any existing reset requests for this email
    await PasswordReset.destroy({ where: { email, isUsed: false } });

    // Generate OTP and token
    const otp = generateOTP();
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save to database
    await PasswordReset.create({
      email,
      token,
      otp,
      expiresAt,
      isUsed: false
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, user.name);

    if (!emailSent) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP email. Please try again.' 
      });
    }

    res.json({
      success: true,
      message: 'OTP sent to your email address',
      token // Send token for verification
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route POST /api/password-reset/verify-otp
router.post('/verify-otp', [
  body('email').isEmail(),
  body('otp').isLength({ min: 6, max: 6 }),
  body('token').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, otp, token } = req.body;

    // Find reset request
    const resetRequest = await PasswordReset.findOne({
      where: {
        email,
        token,
        otp,
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!resetRequest) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP. Please request a new one.' 
      });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully',
      resetToken: token
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route POST /api/password-reset/reset-password
router.post('/reset-password', [
  body('email').isEmail(),
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, token, newPassword, confirmPassword } = req.body;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match' 
      });
    }

    // Find reset request
    const resetRequest = await PasswordReset.findOne({
      where: {
        email,
        token,
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!resetRequest) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset request' 
      });
    }

    // Update user password
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Hash new password
    
    
    user.password = newPassword;
    await user.save();

    // Mark reset request as used
    resetRequest.isUsed = true;
    await resetRequest.save();

    // Send success email
    await sendPasswordResetSuccessEmail(email, user.name);

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route POST /api/password-reset/resend-otp
router.post('/resend-otp', [
  body('email').isEmail()
], async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this email' 
      });
    }

    // Delete old requests
    await PasswordReset.destroy({ where: { email, isUsed: false } });

    // Generate new OTP
    const otp = generateOTP();
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PasswordReset.create({
      email,
      token,
      otp,
      expiresAt,
      isUsed: false
    });

    const emailSent = await sendOTPEmail(email, otp, user.name);

    if (!emailSent) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP' 
      });
    }

    res.json({
      success: true,
      message: 'New OTP sent to your email',
      token
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;