const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Requisition = sequelize.define('Requisition', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'employee_name'
  },
  employeeNo: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'employee_no'
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vehicleRequiredFor: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'vehicle_required_for'
  },
  fromStation: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'from_station'
  },
  toStation: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'to_station'
  },
  pnrNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'pnr_number'
  },
  ticketCopy: {
    type: DataTypes.STRING,
    defaultValue: null,
    field: 'ticket_copy'
  },
  journeyBy: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'journey_by'
  },
  vehicleRequiredDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'vehicle_required_date'
  },
  vehicleRequiredAt: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'vehicle_required_at'
  },
  expectedReturnTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expected_return_time'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  hodSignature: {
    type: DataTypes.STRING,
    defaultValue: null,
    field: 'hod_signature'
  },
  hodRemarks: {
    type: DataTypes.TEXT,
    defaultValue: null,
    field: 'hod_remarks'
  },
  approvedAt: {
    type: DataTypes.DATE,
    defaultValue: null,
    field: 'approved_at'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by',
    references: {
      model: User,
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'requisitions',
  timestamps: false
});

// Associations
User.hasMany(Requisition, { foreignKey: 'createdBy' });
Requisition.belongsTo(User, { foreignKey: 'createdBy', as: 'user' });

module.exports = Requisition;