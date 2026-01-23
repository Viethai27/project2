import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Patient from './models/3. PATIENT_INSURANCE/Patient.model.js';
import Doctor from './models/1. AUTH/Doctor.model.js';
import Admission from './models/7. RESIDENT/Admission.model.js';

dotenv.config();

async function seedAdmissions() {
  try {
    await connectDB();
    
    console.log('🌱 Tạo dữ liệu bệnh nhân nội trú...\n');

    const doctors = await Doctor.find();
    const patients = await Patient.find();

    if (doctors.length === 0 || patients.length === 0) {
      console.log('❌ Cần có dữ liệu bác sĩ và bệnh nhân!');
      process.exit(1);
    }

    // Xóa admissions cũ
    await Admission.deleteMany({});

    const admissions = [];
    const today = new Date('2026-01-23');
    
    // Tạo 5-8 bệnh nhân nội trú
    const numAdmissions = 5 + Math.floor(Math.random() * 4);
    
    const reasons = [
      'Phẫu thuật sinh mổ',
      'Theo dõi thai kỳ nguy cơ cao',
      'Tiền sản giật nặng',
      'Đe dọa sinh non',
      'Sản giật',
      'Thai chậm phát triển',
      'Rau tiền đạo',
      'Đa thai - nguy cơ cao'
    ];

    for (let i = 0; i < numAdmissions; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      
      // Nhập viện từ 1-10 ngày trước
      const admissionDate = new Date(today);
      admissionDate.setDate(today.getDate() - Math.floor(Math.random() * 10) - 1);
      
      // 70% đang điều trị, 30% đã xuất viện
      const isActive = Math.random() < 0.7;
      
      const admission = {
        patient: patient._id,
        doctor: doctor._id,
        admission_date: admissionDate,
        reason: reason,
        status: isActive ? 'active' : 'discharged',
        bed_number: `B${Math.floor(Math.random() * 20) + 1}`,
        ward: 'Khoa Sản',
        notes: `Bệnh nhân nhập viện vì ${reason.toLowerCase()}`
      };
      
      if (!isActive) {
        // Xuất viện sau 3-7 ngày
        const dischargeDate = new Date(admissionDate);
        dischargeDate.setDate(admissionDate.getDate() + Math.floor(Math.random() * 5) + 3);
        admission.discharge_date = dischargeDate;
        admission.discharge_summary = `Đã điều trị ổn định, cho xuất viện`;
      }
      
      admissions.push(admission);
    }

    const created = await Admission.insertMany(admissions);
    
    const activeCount = created.filter(a => a.status === 'active').length;
    const dischargedCount = created.filter(a => a.status === 'discharged').length;
    
    console.log(`\n✅ Đã tạo ${created.length} bệnh nhân nội trú!\n`);
    console.log('📊 THỐNG KÊ:');
    console.log('═══════════════════════════════');
    console.log(`🏥 Đang điều trị: ${activeCount}`);
    console.log(`✅ Đã xuất viện: ${dischargedCount}`);
    console.log('═══════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

seedAdmissions();
