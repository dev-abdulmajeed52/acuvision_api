const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    await createDefaultSuperadmin();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createDefaultSuperadmin = async () => {
  try {
    const superadminEmail = process.env.SUPERADMIN_EMAIL || 'admin@gmail.com';
    const superadminPassword = process.env.SUPERADMIN_PASSWORD || 'admin';
    const existingSuperadmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperadmin) {
      console.log('Superadmin already exists');
      return;
    }
    const superadmin = new User({
      email: superadminEmail,
      password: superadminPassword,
      role: 'superadmin',
    });

    await superadmin.save();
    console.log(`Default superadmin created with email: ${superadminEmail}`);
  } catch (error) {
    console.error('Error creating default superadmin:', error);
  }
};

module.exports = connectDB;