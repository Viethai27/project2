import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Appointment from './models/4. APPOINTMENT_VISIT/Appointment.model.js';
import Doctor from './models/1. AUTH_EMPLOYEE/Doctor.model.js';
import User from './models/1. AUTH_EMPLOYEE/User.model.js';
import Department from './models/2. CATALOGUE_FACILYTY/Department.model.js';

dotenv.config();

// Constants
const DOCTOR_EMAIL = 'mai.hoang@pamec.com';
const DEPARTMENT_NAME = 'Sản khoa';

// Patient appointment data
const PATIENT_APPOINTMENTS = [
  { 
    name: 'Nguyễn Thị Lan Anh', 
    phone: '0912345678', 
    gender: 'female', 
    dob: '1990-05-15', 
    reason: 'Thai 12 tuần - Khám định kỳ',
    time: '08:00',
    status: 'confirmed'
  },
  { 
    name: 'Trần Thị Bích Ngọc', 
    phone: '0923456789', 
    gender: 'female', 
    dob: '1988-08-22', 
    reason: 'Thai 28 tuần - Siêu âm 4D',
    time: '08:30',
    status: 'confirmed'
  },
  { 
    name: 'Lê Thị Mai Phương', 
    phone: '0934567890', 
    gender: 'female', 
    dob: '1992-03-10', 
    reason: 'Thai 20 tuần - Siêu âm hình thái',
    time: '09:00',
    status: 'checked_in'
  },
  { 
    name: 'Phạm Thị Thu Hà', 
    phone: '0945678901', 
    gender: 'female', 
    dob: '1991-11-30', 
    reason: 'Thai 16 tuần - Sàng lọc NIPT',
    time: '09:30',
    status: 'pending'
  },
  { 
    name: 'Hoàng Thị Diệu Linh', 
    phone: '0956789012', 
    gender: 'female', 
    dob: '1989-07-18', 
    reason: 'Thai 32 tuần - Kiểm tra đường huyết',
    time: '10:00',
    status: 'pending'
  },
  { 
    name: 'Vũ Thị Kim Oanh', 
    phone: '0967890123', 
    gender: 'female', 
    dob: '1993-12-25', 
    reason: 'Thai 8 tuần - Xác nhận thai',
    time: '10:30',
    status: 'confirmed'
  },
  { 
    name: 'Đỗ Thị Thanh Hương', 
    phone: '0978901234', 
    gender: 'female', 
    dob: '1994-04-08', 
    reason: 'Thai 24 tuần - Siêu âm tim thai',
    time: '11:00',
    status: 'pending'
  },
  { 
    name: 'Bùi Thị Quỳnh Anh', 
    phone: '0989012345', 
    gender: 'female', 
    dob: '1987-09-14', 
    reason: 'Thai 35 tuần - Khám trước sinh',
    time: '14:00',
    status: 'confirmed'
  },
  { 
    name: 'Ngô Thị Hồng Nhung', 
    phone: '0990123456', 
    gender: 'female', 
    dob: '1995-06-20', 
    reason: 'Sau sinh 2 tuần - Kiểm tra',
    time: '14:30',
    status: 'pending'
  },
  { 
    name: 'Phan Thị Minh Tâm', 
    phone: '0901234567', 
    gender: 'female', 
    dob: '1986-02-28', 
    reason: 'Thai 18 tuần - Double test',
    time: '15:00',
    status: 'confirmed'
  }
];

/**
 * Get today's date at midnight
 */
const getTodayMidnight = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Get tomorrow's date at midnight
 */
const getTomorrowMidnight = () => {
  const today = getTodayMidnight();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

/**
 * Find doctor by email
 */
const findDoctor = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`Không tìm thấy user với email: ${email}`);
  }

  const doctor = await Doctor.findOne({ user: user._id });
  if (!doctor) {
    throw new Error(`Không tìm thấy bác sĩ cho user: ${user.fullName}`);
  }

  return { user, doctor };
};

/**
 * Find department by name
 */
const findDepartment = async (name) => {
  const department = await Department.findOne({ name });
  if (!department) {
    throw new Error(`Không tìm thấy khoa: ${name}`);
  }
  return department;
};

/**
 * Delete old walk-in appointments for today
 */
const deleteOldWalkInAppointments = async (doctorId) => {
  const today = getTodayMidnight();
  const tomorrow = getTomorrowMidnight();
  
  const deleteResult = await Appointment.deleteMany({ 
    doctor: doctorId,
    patient_name: { $exists: true },
    patient: { $exists: false }, // Only delete appointments without patient ID
    appointment_date: {
      $gte: today,
      $lt: tomorrow
    }
  });
  
  console.log(`Đã xóa ${deleteResult.deletedCount} lịch hẹn walk-in cũ (không có patient ID)`);
  return deleteResult.deletedCount;
};

/**
 * Create appointment object
 */
const createAppointment = (patientData, doctorId, departmentId, appointmentDate) => {
  return new Appointment({
    doctor: doctorId,
    department: departmentId,
    patient_name: patientData.name,
    patient_phone: patientData.phone,
    patient_gender: patientData.gender,
    patient_dob: patientData.dob,
    reason: patientData.reason,
    appointment_date: appointmentDate,
    time_slot: patientData.time,
    status: patientData.status,
    session: patientData.time < '12:00' ? 'morning' : 'afternoon'
  });
};

/**
 * Create appointments for today
 */
const createTodayAppointments = async (doctorId, departmentId) => {
  const today = getTodayMidnight();
  
  const appointments = PATIENT_APPOINTMENTS.map(patientData => 
    createAppointment(patientData, doctorId, departmentId, today)
  );

  await Appointment.insertMany(appointments);
  return appointments;
};

/**
 * Log appointment details
 */
const logAppointmentDetails = (appointments, doctorName, date) => {
  console.log(`✅ Đã tạo ${appointments.length} lịch hẹn cho bác sĩ ${doctorName} vào hôm nay`);
  console.log(`📅 Ngày: ${date.toLocaleDateString('vi-VN')}`);
  console.log('\nChi tiết lịch hẹn:');
  
  appointments.forEach((apt, index) => {
    console.log(`${index + 1}. ${apt.time_slot} - ${apt.patient_name} - ${apt.status}`);
  });
};

/**
 * Main seed function
 */
const seedDoctorMaiAppointments = async () => {
  try {
    await connectDB();
    
    // Find doctor and department
    const { user, doctor } = await findDoctor(DOCTOR_EMAIL);
    const department = await findDepartment(DEPARTMENT_NAME);

    console.log(`Tìm thấy bác sĩ: ${user.fullName}`);
    console.log(`Khoa: ${department.name}`);

    // Delete old walk-in appointments
    await deleteOldWalkInAppointments(doctor._id);

    // Create new appointments
    const appointments = await createTodayAppointments(doctor._id, department._id);
    
    // Log results
    logAppointmentDetails(appointments, user.fullName, getTodayMidnight());

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

seedDoctorMaiAppointments();
