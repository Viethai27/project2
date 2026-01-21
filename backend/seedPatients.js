import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/1. AUTH/User.model.js';
import Patient from './models/3. PATIENT_INSURANCE/Patient.model.js';
import Doctor from './models/1. AUTH/Doctor.model.js';
import { connectDB } from './config/db.js';

dotenv.config();

const patients = [
  {
    full_name: 'Nguyễn Thị Mai Anh',
    email: 'maianh.nguyen@gmail.com',
    password: 'Patient123',
    phone: '0912345678',
    dob: new Date('1995-03-15'),
    gender: 'female',
    address: '123 Lê Văn Việt, Q.9, TP.HCM',
    diagnosis: 'Thai 12 tuần',
    lastVisit: new Date('2025-12-20')
  },
  {
    full_name: 'Trần Thị Hương',
    email: 'huong.tran@gmail.com',
    password: 'Patient123',
    phone: '0923456789',
    dob: new Date('1990-07-22'),
    gender: 'female',
    address: '456 Nguyễn Văn Linh, Q.7, TP.HCM',
    diagnosis: 'Thai 28 tuần - Tiền sản giật',
    lastVisit: new Date('2025-12-18')
  },
  {
    full_name: 'Lê Thị Phương',
    email: 'phuong.le@gmail.com',
    password: 'Patient123',
    phone: '0934567890',
    dob: new Date('1988-11-10'),
    gender: 'female',
    address: '789 Võ Văn Kiệt, Q.1, TP.HCM',
    diagnosis: 'Thai 35 tuần - Đái tháo đường thai kỳ',
    lastVisit: new Date('2025-12-22')
  },
  {
    full_name: 'Phạm Thị Lan',
    email: 'lan.pham@gmail.com',
    password: 'Patient123',
    phone: '0945678901',
    dob: new Date('1992-05-18'),
    gender: 'female',
    address: '321 Phan Văn Trị, Gò Vấp, TP.HCM',
    diagnosis: 'Thai 20 tuần - Thai đôi',
    lastVisit: new Date('2025-12-15')
  },
  {
    full_name: 'Hoàng Thị Thu',
    email: 'thu.hoang@gmail.com',
    password: 'Patient123',
    phone: '0956789012',
    dob: new Date('1993-09-25'),
    gender: 'female',
    address: '654 Hoàng Văn Thụ, Tân Bình, TP.HCM',
    diagnosis: 'Sau sinh 2 tuần - Kiểm tra sức khỏe',
    lastVisit: new Date('2025-12-25')
  },
  {
    full_name: 'Vũ Thị Hoa',
    email: 'hoa.vu@gmail.com',
    password: 'Patient123',
    phone: '0967890123',
    dob: new Date('1996-01-30'),
    gender: 'female',
    address: '987 Lê Hồng Phong, Q.10, TP.HCM',
    diagnosis: 'Thai 8 tuần - Khám thai định kỳ',
    lastVisit: new Date('2025-12-19')
  },
  {
    full_name: 'Đỗ Thị Ngọc',
    email: 'ngoc.do@gmail.com',
    password: 'Patient123',
    phone: '0978901234',
    dob: new Date('1991-12-05'),
    gender: 'female',
    address: '147 Cách Mạng Tháng 8, Q.3, TP.HCM',
    diagnosis: 'Thai 32 tuần - Ngôi ngược',
    lastVisit: new Date('2025-12-21')
  },
  {
    full_name: 'Bùi Thị Thanh',
    email: 'thanh.bui@gmail.com',
    password: 'Patient123',
    phone: '0989012345',
    dob: new Date('1994-04-12'),
    gender: 'female',
    address: '258 Trần Hưng Đạo, Q.5, TP.HCM',
    diagnosis: 'Thai 16 tuần - Sàng lọc NIPT',
    lastVisit: new Date('2025-12-17')
  }
];

async function seedPatients() {
  try {
    await connectDB();
    
    console.log('🌱 Bắt đầu seed dữ liệu bệnh nhân khoa sản...\n');

    // Tìm bác sĩ BS. Nguyễn Thị Hồng Nhung
    const doctor = await Doctor.findOne({ full_name: 'BS. Nguyễn Thị Hồng Nhung' });
    
    if (!doctor) {
      console.log('⚠️  Không tìm thấy bác sĩ. Vui lòng chạy seedDoctors.js trước!');
      process.exit(1);
    }

    console.log(`✅ Tìm thấy bác sĩ: ${doctor.full_name}\n`);

    for (const patientData of patients) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: patientData.email });
      
      if (existingUser) {
        console.log(`⚠️  Email ${patientData.email} đã tồn tại, bỏ qua...`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(patientData.password, salt);

      // Create User account
      const user = await User.create({
        username: patientData.full_name,
        email: patientData.email,
        password_hash: password_hash,
        phone: patientData.phone,
        status: 'active'
      });

      // Create Patient profile
      const patient = await Patient.create({
        user: user._id,
        full_name: patientData.full_name,
        dob: patientData.dob,
        gender: patientData.gender
      });

      console.log(`✅ Đã tạo bệnh nhân: ${patientData.full_name}`);
      console.log(`   - Email: ${patientData.email}`);
      console.log(`   - Chẩn đoán: ${patientData.diagnosis}`);
      console.log(`   - Lần khám gần nhất: ${patientData.lastVisit.toLocaleDateString('vi-VN')}\n`);
    }

    console.log('✅ Seed dữ liệu bệnh nhân hoàn tất!');
    console.log('\nThông tin đăng nhập:');
    console.log('Email: [email của bệnh nhân]');
    console.log('Mật khẩu: Patient123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
}

seedPatients();
