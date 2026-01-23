import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/1. AUTH/User.model.js';
import Doctor from './models/1. AUTH/Doctor.model.js';
import { connectDB } from './config/db.js';

dotenv.config();

async function resetDoctorPassword() {
  try {
    await connectDB();
    
    const doctorEmails = [
      'nhung.nguyen@pamec.com',
      'chau.tran@pamec.com',
      'phuonganh.le@pamec.com',
      'mai.hoang@pamec.com',
      'lanhuong.vu@pamec.com'
    ];
    const newPassword = 'Doctor123';
    
    console.log('🔄 Reset mật khẩu cho tất cả bác sĩ...\n');
    
    for (const email of doctorEmails) {
      console.log(`🔍 Tìm user: ${email}`);
      const user = await User.findOne({ email });
      
      if (!user) {
        console.log(`❌ Không tìm thấy user ${email}\n`);
        continue;
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(newPassword, salt);
      
      // Update password
      user.password_hash = password_hash;
      await user.save();
      
      // Verify
      const isMatch = await bcrypt.compare(newPassword, user.password_hash);
      console.log(`✅ Đã cập nhật: ${email} - ${isMatch ? 'OK' : 'FAILED'}\n`);
    }
    
    console.log('🎉 Hoàn thành reset mật khẩu cho tất cả bác sĩ!');
    console.log('Email: <tên_bác_sĩ>@pamec.com');
    console.log('Password: Doctor123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

resetDoctorPassword();
