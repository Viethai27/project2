import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/1. AUTH/User.model.js';
import Doctor from './models/1. AUTH/Doctor.model.js';
import Employer from './models/1. AUTH/Employer.model.js';
import Department from './models/2. CATALOGUE_FACILYTY/Department.model.js';
import { connectDB } from './config/db.js';

dotenv.config();

const doctors = [
  {
    full_name: 'BS. Nguyễn Thị Hồng Nhung',
    email: 'nhung.nguyen@pamec.com',
    password: 'Doctor123',
    phone: '0901234567',
    specialty: 'Sản khoa',
    specialization: 'Sản khoa',
    gender: 'female',
    experience_years: 15,
    education: 'Bác sĩ chuyên khoa II - Đại học Y Hà Nội',
    description: 'Chuyên gia hàng đầu về sản khoa, có 15 năm kinh nghiệm trong điều trị các bệnh lý sản phụ khoa và theo dõi thai kỳ.'
  },
  {
    full_name: 'ThS.BS. Trần Minh Châu',
    email: 'chau.tran@pamec.com',
    password: 'Doctor123',
    phone: '0901234568',
    specialty: 'Sản khoa',
    specialization: 'Sản khoa',
    gender: 'female',
    experience_years: 12,
    education: 'Thạc sĩ Y học - Bác sĩ chuyên khoa I - Đại học Y Dược TP.HCM',
    description: 'Chuyên về thai nghén nguy cơ cao, sản khoa và chăm sóc sức khỏe sinh sản.'
  },
  {
    full_name: 'BS. Lê Thị Phương Anh',
    email: 'phuonganh.le@pamec.com',
    password: 'Doctor123',
    phone: '0901234569',
    specialty: 'Sản khoa',
    specialization: 'Sản khoa',
    gender: 'female',
    experience_years: 10,
    education: 'Bác sĩ chuyên khoa I - Đại học Y Hà Nội',
    description: 'Bác sĩ giàu kinh nghiệm trong lĩnh vực sản khoa, đặc biệt về khám thai và tư vấn dinh dưỡng cho bà bầu.'
  },
  {
    full_name: 'PGS.TS.BS. Hoàng Thị Mai',
    email: 'mai.hoang@pamec.com',
    password: 'Doctor123',
    phone: '0901234570',
    specialty: 'Sản khoa',
    specialization: 'Sản khoa',
    gender: 'female',
    experience_years: 20,
    education: 'Phó Giáo sư - Tiến sĩ Y học - Đại học Y Hà Nội',
    description: 'Chuyên gia đầu ngành về sản khoa, có nhiều công trình nghiên cứu về thai sản và sức khỏe sinh sản.'
  },
  {
    full_name: 'BS. Vũ Thị Lan Hương',
    email: 'lanhuong.vu@pamec.com',
    password: 'Doctor123',
    phone: '0901234571',
    specialty: 'Sản khoa',
    specialization: 'Sản khoa',
    gender: 'female',
    experience_years: 8,
    education: 'Bác sĩ đa khoa - Bác sĩ chuyên khoa I Sản - Đại học Y Dược TP.HCM',
    description: 'Bác sĩ trẻ tâm huyết, chuyên về chăm sóc thai sản và tư vấn sức khỏe phụ nữ.'
  }
];

async function seedDoctors() {
  try {
    await connectDB();
    
    console.log('🌱 Bắt đầu seed dữ liệu bác sĩ khoa sản...\n');

    // Find Sản khoa department
    const sanKhoa = await Department.findOne({ name: 'Sản khoa' });
    if (!sanKhoa) {
      console.error('❌ Không tìm thấy khoa Sản. Vui lòng chạy seedDepartments.js trước!');
      process.exit(1);
    }
    console.log(`📋 Found department: ${sanKhoa.name} (${sanKhoa._id})\n`);

    for (const doctorData of doctors) {
      // Check if user already exists
      let user = await User.findOne({ email: doctorData.email });
      
      if (user) {
        console.log(`⚠️  User ${doctorData.email} đã tồn tại, kiểm tra Doctor record...`);
        
        // Check if Doctor profile exists
        const existingDoctor = await Doctor.findOne({ user: user._id });
        if (existingDoctor) {
          console.log(`   ✅ Doctor profile đã tồn tại, bỏ qua...\n`);
          continue;
        }
        
        console.log(`   ⚡ Tạo Doctor profile cho user hiện có...`);
      } else {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(doctorData.password, salt);

        // Create User account
        user = await User.create({
          username: doctorData.full_name,
          email: doctorData.email,
          password_hash: password_hash,
          phone: doctorData.phone,
          status: 'active'
        });
        
        console.log(`✅ Đã tạo User: ${doctorData.email}`);
      }

      // Check if Employer record exists
      let employer = await Employer.findOne({ user: user._id });
      
      if (!employer) {
        // Create Employer record linking user to department
        employer = await Employer.create({
          user: user._id,
          department: sanKhoa._id,
          position: 'Bác sĩ'
        });
        console.log(`✅ Đã tạo Employer record cho ${user.email}`);
      } else {
        console.log(`⚠️  Employer record đã tồn tại`);
      }

      // Create Doctor profile
      const doctor = await Doctor.create({
        user: user._id,
        employer: employer._id,
        full_name: doctorData.full_name,
        specialty: doctorData.specialty,
        specialization: doctorData.specialization,
        gender: doctorData.gender,
        phone: doctorData.phone,
        email: doctorData.email,
        experience_years: doctorData.experience_years,
        education: doctorData.education,
        description: doctorData.description,
        status: 'active'
      });

      console.log(`✅ Đã tạo Doctor profile: ${doctorData.full_name}`);
      console.log(`   📧 Email: ${doctorData.email}`);
      console.log(`   🏥 Department: ${sanKhoa.name} (via Employer)`);
      console.log(`   💼 Employer ID: ${employer._id}`);
      console.log(`   🔑 Password: ${doctorData.password}\n`);
    }

    console.log('\n🎉 Hoàn thành seed dữ liệu!\n');
    console.log('📋 THÔNG TIN ĐĂNG NHẬP CÁC BÁC SĨ:');
    console.log('=====================================\n');
    
    doctors.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.full_name}`);
      console.log(`   Email: ${doc.email}`);
      console.log(`   Password: ${doc.password}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
}

seedDoctors();
