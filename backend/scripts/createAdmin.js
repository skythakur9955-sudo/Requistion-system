const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/database');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await connectDB();
    
    const adminExists = await User.findOne({ where: { email: 'admin@ntpc.com' } });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin HOD',
        employeeId: 'ADMIN001',
        designation: 'Head of Department',
        email: 'admin@ntpc.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created successfully!');
      console.log('Email: admin@ntpc.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();