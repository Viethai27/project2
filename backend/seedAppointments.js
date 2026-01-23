import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Appointment from './models/4. APPOINTMENT_VISIT/Appointment.model.js';
import Doctor from './models/1. AUTH/Doctor.model.js';
import Department from './models/2. CATALOGUE_FACILYTY/Department.model.js';

dotenv.config();

const seedAppointments = async () => {
  try {
    await connectDB();
    
    // Clear existing appointments
    await Appointment.deleteMany({});
    console.log('Cleared existing appointments');

    // Get Sản khoa department
    const sanKhoaDept = await Department.findOne({ name: 'Sản khoa' });
    if (!sanKhoaDept) {
      console.log('Không tìm thấy khoa Sản khoa');
      process.exit(1);
    }

    // Get all doctors in Sản khoa
    const doctors = await Doctor.find({ specialty: 'Sản khoa' });
    if (doctors.length === 0) {
      console.log('Không tìm thấy bác sĩ nào');
      process.exit(1);
    }

    console.log(`Tìm thấy ${doctors.length} bác sĩ khoa Sản`);

    // Patient names for variety
    const patientNames = [
      { name: 'Nguyễn Thị Mai Anh', phone: '0912345001', gender: 'female', dob: '1992-03-15', reason: 'Khám thai 12 tuần' },
      { name: 'Trần Thị Hương', phone: '0923456002', gender: 'female', dob: '1988-07-20', reason: 'Thai 28 tuần - Tiền sản giật' },
      { name: 'Lê Thị Phương', phone: '0934567003', gender: 'female', dob: '1986-11-30', reason: 'Thai 35 tuần - ĐTĐ thai kỳ' },
      { name: 'Phạm Thị Lan', phone: '0945678004', gender: 'female', dob: '1990-05-12', reason: 'Thai 20 tuần - Thai đôi' },
      { name: 'Hoàng Thị Thu', phone: '0956789005', gender: 'female', dob: '1991-09-08', reason: 'Sau sinh 2 tuần - Kiểm tra' },
      { name: 'Vũ Thị Hoa', phone: '0967890006', gender: 'female', dob: '1994-02-25', reason: 'Thai 8 tuần - Khám định kỳ' },
      { name: 'Đỗ Thị Ngọc', phone: '0978901007', gender: 'female', dob: '1989-12-18', reason: 'Thai 32 tuần - Ngôi ngược' },
      { name: 'Bùi Thị Thanh', phone: '0989012008', gender: 'female', dob: '1993-06-22', reason: 'Thai 16 tuần - Sàng lọc NIPT' },
      { name: 'Ngô Thị Linh', phone: '0990123009', gender: 'female', dob: '1987-04-10', reason: 'Thai 24 tuần - Siêu âm tim thai' },
      { name: 'Phan Thị Quỳnh', phone: '0901234010', gender: 'female', dob: '1995-08-14', reason: 'Khám tiền hôn nhân' },
      { name: 'Đinh Thị Hồng', phone: '0912340011', gender: 'female', dob: '1992-01-05', reason: 'Thai 18 tuần - Siêu âm hình thái' },
      { name: 'Lý Thị Tuyết', phone: '0923450012', gender: 'female', dob: '1990-10-20', reason: 'Thai 30 tuần - Kiểm tra đường huyết' },
      { name: 'Võ Thị Ánh', phone: '0934560013', gender: 'female', dob: '1988-03-28', reason: 'Thai 6 tuần - Xác nhận thai' },
      { name: 'Trương Thị Bích', phone: '0945670014', gender: 'female', dob: '1991-07-16', reason: 'Thai 22 tuần - Khám định kỳ' },
      { name: 'Dương Thị Cẩm', phone: '0956780015', gender: 'female', dob: '1993-11-09', reason: 'Thai 14 tuần - Double test' },
    ];

    const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

    const appointments = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create appointments for 7 days before and 7 days after today
    for (let dayOffset = -7; dayOffset <= 7; dayOffset++) {
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() + dayOffset);
      
      // Skip Sundays (day 0)
      if (appointmentDate.getDay() === 0) continue;

      // Create 3-6 appointments per day
      const appointmentsPerDay = Math.floor(Math.random() * 4) + 3;
      
      for (let i = 0; i < appointmentsPerDay; i++) {
        const patient = patientNames[Math.floor(Math.random() * patientNames.length)];
        const doctor = doctors[Math.floor(Math.random() * doctors.length)];
        const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        
        // Set status based on date
        // Valid statuses: booked, checked_in, cancelled, no_show, pending, confirmed
        let status;
        if (dayOffset < 0) {
          // Past appointments - checked_in, cancelled, or no_show
          const rand = Math.random();
          if (rand > 0.8) status = 'cancelled';
          else if (rand > 0.9) status = 'no_show';
          else status = 'checked_in';
        } else if (dayOffset === 0) {
          // Today - confirmed, checked_in, or pending
          const rand = Math.random();
          if (rand > 0.7) status = 'confirmed';
          else if (rand > 0.4) status = 'checked_in';
          else status = 'pending';
        } else {
          // Future - confirmed or pending
          status = Math.random() > 0.4 ? 'confirmed' : 'pending';
        }

        appointments.push({
          doctor: doctor._id,
          patient_name: patient.name,
          patient_phone: patient.phone,
          patient_email: `${patient.phone}@example.com`,
          patient_gender: patient.gender,
          patient_dob: patient.dob,
          reason: patient.reason,
          appointment_date: appointmentDate,
          time_slot: timeSlot,
          status: status,
          created_at: new Date(appointmentDate.getTime() - 2 * 24 * 60 * 60 * 1000), // Created 2 days before appointment
        });
      }
    }

    // Insert all appointments
    await Appointment.insertMany(appointments);
    console.log(`✅ Đã tạo ${appointments.length} lịch hẹn cho ${doctors.length} bác sĩ`);
    console.log(`📅 Từ ${new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')} đến ${new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}`);

    // Show statistics
    const todayCount = await Appointment.countDocuments({
      appointment_date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    const confirmedCount = await Appointment.countDocuments({ status: 'confirmed' });
    const pendingCount = await Appointment.countDocuments({ status: 'pending' });
    const checkedInCount = await Appointment.countDocuments({ status: 'checked_in' });

    console.log(`\n📊 Thống kê:`);
    console.log(`  - Hôm nay: ${todayCount} lịch hẹn`);
    console.log(`  - Đã xác nhận: ${confirmedCount}`);
    console.log(`  - Chờ xác nhận: ${pendingCount}`);
    console.log(`  - Đã check-in: ${checkedInCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

seedAppointments();
