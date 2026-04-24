// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Generate JWT Token with role
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name,
      employeeId: user.employeeId,
      designation: user.designation
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// @route POST /api/auth/register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('email').isEmail().withMessage('Please enter valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'admin'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, employeeId, designation, email, password, role } = req.body;

    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { employeeId }]
      }
    });
    
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email or employee ID' 
      });
    }

    const user = await User.create({
      name,
      employeeId,
      designation,
      email,
      password,
      role: role || 'user'
    });

    const token = generateToken(user);
    
    console.log('✅ User registered:', email, 'Role:', user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        employeeId: user.employeeId,
        designation: user.designation,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Please enter valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    
    console.log('📥 Login attempt:', email);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    
    console.log('✅ Login successful:', email, 'Role:', user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        employeeId: user.employeeId,
        designation: user.designation,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;