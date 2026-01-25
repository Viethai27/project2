import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Appointment from './models/4. APPOINTMENT_VISIT/Appointment.model.js';
import Patient from './models/3. PATIENT_INSURANCE/Patient.model.js';

dotenv.config();

async function checkPatientAppointment() {
  try {
    await connectDB();
    
    // Find patient by phone
    const patient = await Patient.findOne({ phone: '098756780987' })
      .populate('user');
    
    if (!patient) {
      console.log('❌ Không tìm thấy bệnh nhân với SĐT 098756780987');
      process.exit(1);
    }
    
    console.log('✅ Tìm thấy bệnh nhân:');
    console.log('  - Tên:', patient.full_name);
    console.log('  - SĐT:', patient.phone);
    console.log('  - Patient ID:', patient._id);
    console.log('');
    
    // Find appointments for this patient
    const appointments = await Appointment.find({ patient: patient._id })
      .populate('doctor')
      .populate('department')
      .sort({ appointment_date: -1 });
    
    console.log(`Tìm thấy ${appointments.length} lịch hẹn:\n`);
    
    appointments.forEach((apt, index) => {
      console.log(`${index + 1}. Ngày: ${new Date(apt.appointment_date).toLocaleDateString('vi-VN')}`);
      console.log(`   Giờ: ${apt.time_slot}`);
      console.log(`   Bác sĩ: ${apt.doctor?.full_name || 'N/A'}`);
      console.log(`   Khoa: ${apt.department?.name || 'N/A'}`);
      console.log(`   Trạng thái: ${apt.status}`);
      console.log('');
    });
    
    // Check today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = await Appointment.find({
      patient: patient._id,
      appointment_date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    console.log(`Lịch hẹn hôm nay (${today.toLocaleDateString('vi-VN')}): ${todayAppointments.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

checkPatientAppointment();
