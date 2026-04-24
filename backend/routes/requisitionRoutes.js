const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Requisition = require('../models/Requisition');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

// @route POST /api/requisitions
router.post('/', protect, authorize('user'), [
  body('employeeName').notEmpty().withMessage('Employee name is required'),
  body('employeeNo').notEmpty().withMessage('Employee number is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('vehicleRequiredFor').notEmpty().withMessage('Purpose is required'),
  body('fromStation').notEmpty().withMessage('From station is required'),
  body('toStation').notEmpty().withMessage('To station is required'),
  body('pnrNumber').notEmpty().withMessage('PNR number is required'),
  body('journeyBy').notEmpty().withMessage('Journey by is required'),
  body('vehicleRequiredDate').isISO8601().withMessage('Valid date is required'),
  body('vehicleRequiredAt').notEmpty().withMessage('Address is required'),
  body('expectedReturnTime').isISO8601().withMessage('Valid return time is required')
], upload.single('ticketCopy'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const requisitionData = {
      ...req.body,
      createdBy: req.user.id,
      ticketCopy: req.file ? `/uploads/${req.file.filename}` : null
    };

    const requisition = await Requisition.create(requisitionData);
    
    res.status(201).json({
      success: true,
      data: requisition
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route GET /api/requisitions/my-requisitions
router.get('/my-requisitions', protect, authorize('user'), async (req, res) => {
  try {
    const requisitions = await Requisition.findAll({
      where: { createdBy: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: requisitions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route GET /api/requisitions/all (Admin only)
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const requisitions = await Requisition.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'employeeId']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: requisitions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route PUT /api/requisitions/:id/approve (Admin only)
router.put('/:id/approve', protect, authorize('admin'), upload.single('hodSignature'), [
  body('hodRemarks').optional()
], async (req, res) => {
  try {
    const requisition = await Requisition.findByPk(req.params.id);
    
    if (!requisition) {
      return res.status(404).json({ success: false, message: 'Requisition not found' });
    }

    requisition.status = 'approved';
    requisition.hodRemarks = req.body.hodRemarks || null;
    requisition.approvedAt = new Date();
    
    if (req.file) {
      requisition.hodSignature = `/uploads/${req.file.filename}`;
    }

    await requisition.save();

    res.json({
      success: true,
      data: requisition
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route PUT /api/requisitions/:id/reject (Admin only)
router.put('/:id/reject', protect, authorize('admin'), [
  body('hodRemarks').notEmpty().withMessage('Remarks are required for rejection')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const requisition = await Requisition.findByPk(req.params.id);
    
    if (!requisition) {
      return res.status(404).json({ success: false, message: 'Requisition not found' });
    }

    requisition.status = 'rejected';
    requisition.hodRemarks = req.body.hodRemarks;
    requisition.approvedAt = new Date();

    await requisition.save();

    res.json({
      success: true,
      data: requisition
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route PUT /api/requisitions/:id (Update requisition - User can edit pending requests)
router.put('/:id', protect, authorize('user'), [
  body('employeeName').notEmpty().withMessage('Employee name is required'),
  body('employeeNo').notEmpty().withMessage('Employee number is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('vehicleRequiredFor').notEmpty().withMessage('Purpose is required'),
  body('fromStation').notEmpty().withMessage('From station is required'),
  body('toStation').notEmpty().withMessage('To station is required'),
  body('pnrNumber').notEmpty().withMessage('PNR number is required'),
  body('journeyBy').notEmpty().withMessage('Journey by is required'),
  body('vehicleRequiredDate').isISO8601().withMessage('Valid date is required'),
  body('vehicleRequiredAt').notEmpty().withMessage('Address is required'),
  body('expectedReturnTime').isISO8601().withMessage('Valid return time is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let requisition = await Requisition.findByPk(req.params.id);
    
    if (!requisition) {
      return res.status(404).json({ success: false, message: 'Requisition not found' });
    }

    // Check if user owns this requisition
    if (requisition.createdBy !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Only allow editing if status is pending
    if (requisition.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Cannot edit approved/rejected requisition' });
    }

    await requisition.update(req.body);

    res.json({
      success: true,
      data: requisition
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route DELETE /api/requisitions/:id (Delete only if pending)
router.delete('/:id', protect, authorize('user'), async (req, res) => {
  try {
    const requisition = await Requisition.findByPk(req.params.id);
    
    if (!requisition) {
      return res.status(404).json({ success: false, message: 'Requisition not found' });
    }

    if (requisition.createdBy !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (requisition.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Cannot delete approved/rejected requisition' });
    }

    await requisition.destroy();

    res.json({
      success: true,
      message: 'Requisition deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;