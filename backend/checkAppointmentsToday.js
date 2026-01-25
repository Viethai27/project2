import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Appointment from './models/4. APPOINTMENT_VISIT/Appointment.model.js';
import Doctor from './models/1. AUTH_EMPLOYEE/Doctor.model.js';
import User from './models/1. AUTH_EMPLOYEE/User.model.js';

dotenv.config();

async function checkAppointmentsToday() {
  try {
    await connectDB();
    
    // Find Dr. Mai
    const userMai = await User.findOne({ email: 'mai.hoang@pamec.com' });
    if (!userMai) {
      console.log('Không tìm thấy bác sĩ Mai');
      process.exit(1);
    }
    
    const doctorMai = await Doctor.findOne({ user: userMai._id });
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    console.log('=== KIỂM TRA LỊCH HẸN HÔM NAY ===');
    console.log('Ngày:', today.toLocaleDateString('vi-VN'));
    console.log('Bác sĩ:', userMai.username);
    console.log('Doctor ID:', doctorMai._id);
    console.log('\n');
    
    // Get all appointments for today
    const appointments = await Appointment.find({
      doctor: doctorMai._id,
      appointment_date: {
        $gte: today,
        $lt: tomorrow
      }
    })
    .populate('patient')
    .sort({ time_slot: 1 });
    
    console.log(`Tổng số lịch hẹn: ${appointments.length}\n`);
    
    if (appointments.length > 0) {
      appointments.forEach((apt, index) => {
        console.log(`${index + 1}. ${apt.time_slot || 'N/A'} - ${apt.patient_name || apt.patient?.full_name || 'N/A'}`);
        console.log(`   Trạng thái: ${apt.status}`);
        console.log(`   Session: ${apt.session || 'N/A'}`);
        console.log(`   Ngày: ${apt.appointment_date}`);
        console.log('');
      });
    }
    
    // Also check all appointments for Dr. Mai (any date)
    const allAppointments = await Appointment.find({
      doctor: doctorMai._id
    })
    .sort({ appointment_date: -1 })
    .limit(5);
    
    console.log('\n=== 5 LỊCH HẸN GẦN NHẤT (BẤT KỲ NGÀY NÀO) ===\n');
    allAppointments.forEach((apt, index) => {
      console.log(`${index + 1}. ${new Date(apt.appointment_date).toLocaleDateString('vi-VN')} ${apt.time_slot || 'N/A'}`);
      console.log(`   Bệnh nhân: ${apt.patient_name || 'N/A'}`);
      console.log(`   Trạng thái: ${apt.status}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

checkAppointmentsToday();
