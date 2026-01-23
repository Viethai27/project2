import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/1. AUTH/User.model.js';
import Doctor from './models/1. AUTH/Doctor.model.js';
import { connectDB } from './config/db.js';

dotenv.config();

async function testLogin() {
  try {
    await connectDB();
    
    const email = 'mai.hoang@pamec.com';
    const password = 'Doctor123';
    
    console.log('🔍 Tìm kiếm user:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ Không tìm thấy user với email:', email);
      process.exit(1);
    }
    
    console.log('✅ Tìm thấy user:', {
      id: user._id,
      username: user.username,
      email: user.email,
      status: user.status,
      password_hash: user.password_hash ? '***' + user.password_hash.substring(user.password_hash.length - 10) : 'KHÔNG CÓ'
    });
    
    console.log('\n🔑 Kiểm tra mật khẩu...');
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log('Kết quả so sánh:', isMatch ? '✅ ĐÚNG' : '❌ SAI');
    
    console.log('\n👨‍⚕️ Kiểm tra Doctor record...');
    const doctor = await Doctor.findOne({ user: user._id });
    
    if (doctor) {
      console.log('✅ Tìm thấy Doctor:', {
        id: doctor._id,
        specialty: doctor.specialty,
        experience_years: doctor.experience_years
      });
    } else {
      console.log('❌ KHÔNG tìm thấy Doctor record cho user này!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

testLogin();
