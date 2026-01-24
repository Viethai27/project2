import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/1. AUTH/User.model.js';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    const users = await User.find({ role: 'patient' }).select('username email phone');
    
    console.log('📋 Patient Users:');
    users.forEach(user => {
      console.log(`- ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Phone: ${user.phone || 'NOT SET'}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUsers();
