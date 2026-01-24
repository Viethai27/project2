import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/1. AUTH/User.model.js';
import Doctor from './models/1. AUTH/Doctor.model.js';
import Employer from './models/1. AUTH/Employer.model.js';
import Department from './models/2. CATALOGUE_FACILYTY/Department.model.js';
import { connectDB } from './config/db.js';

dotenv.config();

async function updateDoctors() {
  try {
    await connectDB();
    
    console.log('🔄 Bắt đầu cập nhật doctors với employer...\n');

    // Find Sản khoa department
    const sanKhoa = await Department.findOne({ name: 'Sản khoa' });
    if (!sanKhoa) {
      console.error('❌ Không tìm thấy khoa Sản!');
      process.exit(1);
    }
    console.log(`📋 Found department: ${sanKhoa.name} (${sanKhoa._id})\n`);

    // Find all doctors without employer
    const doctors = await Doctor.find({ employer: { $exists: false } }).populate('user');
    console.log(`Found ${doctors.length} doctors without employer\n`);

    for (const doctor of doctors) {
      if (!doctor.user) {
        console.log(`⚠️  Doctor ${doctor.full_name} has no user, skipping...`);
        continue;
      }

      // Check if employer exists
      let employer = await Employer.findOne({ user: doctor.user._id });
      
      if (!employer) {
        // Create employer
        employer = await Employer.create({
          user: doctor.user._id,
          department: sanKhoa._id,
          position: 'Bác sĩ'
        });
        console.log(`✅ Created Employer for ${doctor.full_name}`);
      }

      // Update doctor with employer
      doctor.employer = employer._id;
      await doctor.save();
      console.log(`✅ Updated Doctor ${doctor.full_name} with employer ${employer._id}\n`);
    }

    console.log('\n🎉 Hoàn thành cập nhật!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

updateDoctors();
