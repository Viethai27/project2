import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Appointment from './models/4. APPOINTMENT_VISIT/Appointment.model.js';
import Patient from './models/3. PATIENT_INSURANCE/Patient.model.js';
import Doctor from './models/1. AUTH_EMPLOYEE/Doctor.model.js';
import User from './models/1. AUTH_EMPLOYEE/User.model.js';
import Department from './models/2. CATALOGUE_FACILYTY/Department.model.js';

dotenv.config();

async function recreateAppointmentForHa() {
  try {
    await connectDB();
    
    // Find patient
    const patient = await Patient.findOne({ phone: '098756780987' });
    if (!patient) {
      console.log('❌ Không tìm thấy bệnh nhân');
      process.exit(1);
    }
    
    console.log('✅ Tìm thấy bệnh nhân:', patient.full_name);
    
    // Find Dr. Mai
    const userMai = await User.findOne({ email: 'mai.hoang@pamec.com' });
    const doctorMai = await Doctor.findOne({ user: userMai._id });
    
    // Find department
    const dept = await Department.findOne({ name: 'Sản khoa' });
    
    // Check if appointment already exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existing = await Appointment.findOne({
      patient: patient._id,
      doctor: doctorMai._id,
      appointment_date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    if (existing) {
      console.log('✅ Lịch hẹn đã tồn tại:', existing.time_slot, existing.status);
      process.exit(0);
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctorMai._id,
      department: dept._id,
      appointment_date: today,
      time_slot: '13:30',
      reason: 'Khám thai định kỳ',
      status: 'confirmed',
      session: 'afternoon'
    });
    
    console.log('✅ Đã tạo lịch hẹn mới:');
    console.log('  - Ngày:', today.toLocaleDateString('vi-VN'));
    console.log('  - Giờ: 13:30');
    console.log('  - Trạng thái: confirmed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

recreateAppointmentForHa();
