const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Role = require('../models/role.model');
const User = require('../models/user.model');

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bizneai_db');
    console.log('Connected to MongoDB');

    // Create admin role
    const adminRole = await Role.findOneAndUpdate(
      { name: 'admin' },
      {
        name: 'admin',
        permissions: [
          'create:user',
          'read:user',
          'update:user',
          'delete:user',
          'create:product',
          'read:product',
          'update:product',
          'delete:product',
          'create:sale',
          'read:sale',
          'update:sale',
          'delete:sale',
          'manage:roles'
        ],
        description: 'Administrator role with full access'
      },
      { upsert: true, new: true }
    );

    // Create user role
    const userRole = await Role.findOneAndUpdate(
      { name: 'user' },
      {
        name: 'user',
        permissions: [
          'read:product',
          'create:sale',
          'read:sale'
        ],
        description: 'Regular user role with limited access'
      },
      { upsert: true, new: true }
    );

    // Create admin user
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@bizneai.com' },
      {
        username: 'admin',
        email: 'admin@bizneai.com',
        password: await bcrypt.hash('admin123', 10),
        role: adminRole._id,
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log('Database initialized successfully!');
    console.log('Admin user created:');
    console.log('Email:', adminUser.email);
    console.log('Password: admin123');
    console.log('\nYou can now login with these credentials.');

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initializeDatabase(); 