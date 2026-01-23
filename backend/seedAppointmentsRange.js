import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Doctor from './models/1. AUTH/Doctor.model.js';
import Patient from './models/3. PATIENT_INSURANCE/Patient.model.js';
import Appointment from './models/4. APPOINTMENT_VISIT/Appointment.model.js';

dotenv.config();

async function seedAppointmentsRange() {
  try {
    await connectDB();
    
    console.log('🌱 Tạo dữ liệu lịch hẹn từ 17/01-31/01/2026...\n');

    const doctors = await Doctor.find();
    const patients = await Patient.find();

    if (doctors.length === 0 || patients.length === 0) {
      console.log('❌ Cần có dữ liệu bác sĩ và bệnh nhân!');
      process.exit(1);
    }

    // Xóa appointments cũ
    const deleteResult = await Appointment.deleteMany({});
    console.log(`🗑️  Đã xóa ${deleteResult.deletedCount} lịch hẹn cũ\n`);

    const appointments = [];
    const startDate = new Date('2026-01-17');
    const endDate = new Date('2026-01-31');
    const today = new Date('2026-01-23');
    today.setHours(0, 0, 0, 0);

    const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
    const reasons = [
      'Khám thai 12 tuần',
      'Khám thai 20 tuần',
      'Khám thai 30 tuần',
      'Khám thai 36 tuần',
      'Thai 30 tuần - Kiểm tra đường huyết',
      'Siêu âm thai nhi',
      'Xét nghiệm máu định kỳ',
      'Tái khám sau điều trị',
      'Khám sức khỏe định kỳ',
      'Tư vấn dinh dưỡng thai kỳ'
    ];

    // Tạo appointments cho mỗi ngày
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      // Skip Sunday
      if (date.getDay() === 0) continue;

      const isPast = date < today;
      const isToday = date.toDateString() === today.toDateString();
      
      // 4-7 appointments mỗi ngày
      const appointmentsPerDay = Math.floor(Math.random() * 4) + 4;

      for (let i = 0; i < appointmentsPerDay; i++) {
        const doctor = doctors[Math.floor(Math.random() * doctors.length)];
        const patient = patients[Math.floor(Math.random() * patients.length)];
        const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        const reason = reasons[Math.floor(Math.random() * reasons.length)];

        let status;
        if (isPast) {
          // Appointments trong quá khứ: 70% checked_in, 20% cancelled, 10% no_show
          const rand = Math.random();
          if (rand < 0.7) status = 'checked_in';
          else if (rand < 0.9) status = 'cancelled';
          else status = 'no_show';
        } else if (isToday) {
          // Hôm nay: 50% checked_in, 30% confirmed, 20% pending
          const rand = Math.random();
          if (rand < 0.5) status = 'checked_in';
          else if (rand < 0.8) status = 'confirmed';
          else status = 'pending';
        } else {
          // Tương lai: 60% confirmed, 40% pending
          status = Math.random() < 0.6 ? 'confirmed' : 'pending';
        }

        appointments.push({
          doctor: doctor._id,
          patient: patient._id,
          appointment_date: new Date(date),
          time_slot: timeSlot,
          reason: reason,
          status: status,
          notes: `Lịch hẹn ${reason}`,
          created_at: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000) // Tạo trước 7 ngày
        });
      }
    }

    const created = await Appointment.insertMany(appointments);
    
    // Thống kê
    const stats = {
      total: created.length,
      checked_in: created.filter(a => a.status === 'checked_in').length,
      confirmed: created.filter(a => a.status === 'confirmed').length,
      pending: created.filter(a => a.status === 'pending').length,
      cancelled: created.filter(a => a.status === 'cancelled').length,
      no_show: created.filter(a => a.status === 'no_show').length
    };

    console.log(`\n✅ Đã tạo ${created.length} lịch hẹn!\n`);
    console.log('📊 THỐNG KÊ THEO TRẠNG THÁI:');
    console.log('═══════════════════════════════');
    console.log(`✅ Đã check-in: ${stats.checked_in}`);
    console.log(`📋 Đã xác nhận: ${stats.confirmed}`);
    console.log(`⏳ Chờ xác nhận: ${stats.pending}`);
    console.log(`❌ Đã hủy: ${stats.cancelled}`);
    console.log(`⚠️  Không đến: ${stats.no_show}`);
    console.log('═══════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

seedAppointmentsRange();
