import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/1. AUTH/User.model.js';
import Patient from './models/3. PATIENT_INSURANCE/Patient.model.js';
import Appointment from './models/4. APPOINTMENT_VISIT/Appointment.model.js';

dotenv.config();

async function checkAppointmentStructure() {
  try {
    await connectDB();
    
    console.log('🔍 Kiểm tra cấu trúc appointments...\n');
    
    // Lấy 1 appointment
    const appointment = await Appointment.findOne().populate({
      path: 'patient',
      populate: {
        path: 'user'
      }
    });
    
    if (!appointment) {
      console.log('❌ Không tìm thấy appointment nào!');
      process.exit(1);
    }
    
    console.log('📋 Appointment sample:');
    console.log('ID:', appointment._id);
    console.log('Date:', appointment.appointment_date);
    console.log('Time:', appointment.time_slot);
    console.log('Status:', appointment.status);
    console.log('Patient field:', appointment.patient ? 'CÓ' : 'KHÔNG');
    
    if (appointment.patient) {
      console.log('\n👤 Patient info:');
      console.log('Patient ID:', appointment.patient._id);
      console.log('Patient User:', appointment.patient.user ? 'CÓ' : 'KHÔNG');
      
      if (appointment.patient.user) {
        console.log('User ID:', appointment.patient.user._id);
        console.log('Full Name:', appointment.patient.user.fullName);
        console.log('Username:', appointment.patient.user.username);
      }
    }
    
    // Đếm appointments theo ngày
    console.log('\n📊 Thống kê appointments theo ngày:');
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$appointment_date' }
          },
          count: { $sum: 1 },
          statuses: { $push: '$status' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    stats.forEach(s => {
      console.log(`${s._id}: ${s.count} appointments - ${s.statuses.join(', ')}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

checkAppointmentStructure();
