import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/1. AUTH_EMPLOYEE/User.model.js';
import Doctor from './models/1. AUTH_EMPLOYEE/Doctor.model.js';

dotenv.config();

async function fixDoctorRoles() {
  try {
    await connectDB();
    
    console.log('Finding all doctors...\n');
    
    // Get all doctor records
    const doctors = await Doctor.find({});
    console.log(`Found ${doctors.length} doctors\n`);
    
    let updatedCount = 0;
    
    for (const doctor of doctors) {
      const user = await User.findById(doctor.user);
      
      if (user) {
        console.log(`Checking: ${user.email} - Current role: ${user.role}`);
        
        if (user.role !== 'doctor') {
          user.role = 'doctor';
          await user.save();
          console.log(`  ✅ Updated to: doctor\n`);
          updatedCount++;
        } else {
          console.log(`  ✓ Already set to doctor\n`);
        }
      } else {
        console.log(`  ⚠️ No user found for doctor: ${doctor.full_name}\n`);
      }
    }
    
    console.log(`\n✅ Updated ${updatedCount} user(s) to doctor role`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDoctorRoles();
