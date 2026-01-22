import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from './models/1. AUTH/Doctor.model.js';
import { connectDB } from './config/db.js';

dotenv.config();

const doctorEmails = [
  'nhung.nguyen@pamec.com',
  'chau.tran@pamec.com',
  'phuonganh.le@pamec.com',
  'mai.hoang@pamec.com',
  'lanhuong.vu@pamec.com'
];

async function updateDoctorSpecialty() {
  try {
    await connectDB();
    console.log('Cập nhật specialty của bác sĩ thành "Sản khoa"...\n');

    for (const email of doctorEmails) {
      const updated = await Doctor.findOneAndUpdate(
        { email: email },
        { 
          specialty: 'Sản khoa',
          specialization: 'Sản khoa'
        },
        { new: true }
      );

      if (updated) {
        console.log(`✅ ${updated.full_name} - Specialty: ${updated.specialty}`);
      } else {
        console.log(`❌ Không tìm thấy bác sĩ: ${email}`);
      }
    }

    console.log('\n✅ Hoàn thành!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

updateDoctorSpecialty();
