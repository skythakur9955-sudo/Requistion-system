const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

// @route GET /api/admin/users (View all users)
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route GET /api/admin/departments (View all departments)
router.get('/departments', protect, authorize('admin'), async (req, res) => {
  try {
    const departments = await User.findAll({
      attributes: ['department'],
      group: ['department'],
      raw: true
    });
    
    const departmentList = departments.map(d => d.department).filter(Boolean);
    
    // Get user count per department
    const departmentStats = await Promise.all(
      departmentList.map(async (dept) => {
        const count = await User.count({ where: { department: dept } });
        return { name: dept, userCount: count };
      })
    );
    
    res.json({
      success: true,
      data: departmentStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route PUT /api/admin/users/:id/role (Update user role)
router.put('/users/:id/role', protect, authorize('admin'), [
  body('role').isIn(['user', 'hod', 'admin']).withMessage('Invalid role')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = req.body.role;
    await user.save();

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route DELETE /api/admin/users/:id (Delete user)
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;