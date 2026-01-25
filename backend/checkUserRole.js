import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/1. AUTH_EMPLOYEE/User.model.js';
import Doctor from './models/1. AUTH_EMPLOYEE/Doctor.model.js';

dotenv.config();

async function checkUserRole() {
  try {
    await connectDB();
    
    const email = 'mai.hoang@pamec.com';
    console.log(`\nChecking user role for: ${email}\n`);
    
    const user = await User.findOne({ email });
    console.log('User found:', {
      _id: user?._id,
      username: user?.username,
      email: user?.email,
      role: user?.role,  // CHECK THIS!
      status: user?.status
    });
    
    if (user) {
      const doctor = await Doctor.findOne({ user: user._id });
      console.log('\nDoctor record exists:', !!doctor);
      
      if (doctor && user.role !== 'doctor') {
        console.log('\n⚠️ PROBLEM: User has Doctor record but role is not "doctor"!');
        console.log('Current role:', user.role);
        console.log('Should be: doctor');
      } else if (doctor && user.role === 'doctor') {
        console.log('\n✅ Role is correctly set to "doctor"');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUserRole();
