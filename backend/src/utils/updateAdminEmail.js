const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Find and delete old admin user
    const deleted = await User.deleteOne({ email: 'admin@jalapenobusiness.com' });
    console.log(`Deleted ${deleted.deletedCount} old admin user(s)`);

    // Create new admin user
    const admin = await User.create({
      name: 'Tyler Spaeth',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });

    console.log('New admin user created successfully');
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.name}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateAdmin();
