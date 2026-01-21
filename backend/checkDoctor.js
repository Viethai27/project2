import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/1. AUTH/User.model.js';
import Doctor from './models/1. AUTH/Doctor.model.js';

dotenv.config();

async function checkDoctor() {
  try {
    await connectDB();
    
    const email = 'mai.hoang@pamec.com';
    console.log(`\nChecking doctor: ${email}\n`);
    
    const user = await User.findOne({ email });
    console.log('User found:', {
      _id: user?._id,
      username: user?.username,
      email: user?.email
    });
    
    if (user) {
      const doctor = await Doctor.findOne({ user: user._id });
      console.log('\nDoctor record:', doctor);
      
      if (!doctor) {
        console.log('\n❌ NO DOCTOR RECORD FOUND! User exists but no Doctor profile.');
      } else {
        console.log('\n✅ Doctor record exists!');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDoctor();
