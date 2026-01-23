import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/1. AUTH/User.model.js';
import Doctor from './models/1. AUTH/Doctor.model.js';
import Patient from './models/3. PATIENT_INSURANCE/Patient.model.js';
import Appointment from './models/4. APPOINTMENT_VISIT/Appointment.model.js';
import Visit from './models/4. APPOINTMENT_VISIT/Visit.model.js';
import MedicalRecord from './models/5. MEDICALRECORD/MedicalRecord.model.js';
import VitalSign from './models/5. MEDICALRECORD/VitalSign.model.js';
import Diagnosis from './models/5. MEDICALRECORD/Diagnosis.model.js';
import Prescription from './models/6. PHARMACY/Prescription.model.js';
import PrescriptionItem from './models/6. PHARMACY/PrescriptionItem.model.js';
import Medicine from './models/6. PHARMACY/Medicine.model.js';
import Bill from './models/3. PATIENT_INSURANCE/Bill.model.js';

dotenv.config();

// Dữ liệu mẫu
const medicines = [
  { name: 'Paracetamol 500mg', unit: 'Viên', price: 500, stock: 1000, description: 'Thuốc hạ sốt, giảm đau' },
  { name: 'Amoxicillin 500mg', unit: 'Viên', price: 1500, stock: 800, description: 'Kháng sinh' },
  { name: 'Vitamin B Complex', unit: 'Viên', price: 800, stock: 500, description: 'Bổ sung vitamin B' },
  { name: 'Acid Folic 5mg', unit: 'Viên', price: 600, stock: 600, description: 'Bổ sung acid folic cho bà bầu' },
  { name: 'Sắt Fumarate', unit: 'Viên', price: 1000, stock: 400, description: 'Bổ sung sắt' },
  { name: 'Calcium 600mg', unit: 'Viên', price: 700, stock: 500, description: 'Bổ sung canxi' },
  { name: 'Metformin 500mg', unit: 'Viên', price: 2000, stock: 300, description: 'Thuốc điều trị đái tháo đường' },
  { name: 'Duspatalin 135mg', unit: 'Viên', price: 3000, stock: 200, description: 'Giảm co thắt đường tiêu hóa' },
  { name: 'Omeprazole 20mg', unit: 'Viên', price: 1800, stock: 350, description: 'Thuốc dạ dày' },
  { name: 'Duphaston 10mg', unit: 'Viên', price: 5000, stock: 150, description: 'Thuốc bổ sung progesterone' }
];

const diagnoses = [
  'Thai kỳ bình thường - tuần 12',
  'Thai kỳ bình thường - tuần 20',
  'Thai kỳ bình thường - tuần 30',
  'Thai kỳ bình thường - tuần 36',
  'Đái tháo đường thai kỳ',
  'Thiếu máu thai kỳ',
  'Tiền sản giật nhẹ',
  'Viêm âm đạo',
  'Đe dọa sẩy thai',
  'Ốm nghén nặng'
];

const treatments = [
  'Theo dõi thai định kỳ',
  'Uống thuốc theo đơn',
  'Nghỉ ngơi tuyệt đối',
  'Chế độ ăn uống hợp lý',
  'Tăng cường bổ sung vitamin',
  'Kiểm soát đường huyết',
  'Theo dõi huyết áp',
  'Siêu âm kiểm tra thai nhi'
];

async function seedFullData() {
  try {
    await connectDB();
    console.log('🌱 Bắt đầu tạo dữ liệu đầy đủ cho bệnh viện...\n');

    // Xóa dữ liệu cũ
    console.log('🗑️  Xóa dữ liệu cũ...');
    await Visit.deleteMany({});
    await MedicalRecord.deleteMany({});
    await VitalSign.deleteMany({});
    await Diagnosis.deleteMany({});
    await Prescription.deleteMany({});
    await PrescriptionItem.deleteMany({});
    await Bill.deleteMany({});
    console.log('✅ Đã xóa dữ liệu cũ\n');

    // 1. Tạo thuốc
    console.log('📦 Tạo danh sách thuốc...');
    await Medicine.deleteMany({});
    const createdMedicines = await Medicine.insertMany(medicines);
    console.log(`✅ Đã tạo ${createdMedicines.length} loại thuốc\n`);

    // 2. Lấy danh sách bác sĩ và bệnh nhân
    const doctors = await Doctor.find().populate('user');
    const patients = await Patient.find().populate('user');
    
    if (doctors.length === 0 || patients.length === 0) {
      console.log('❌ Cần có dữ liệu bác sĩ và bệnh nhân trước!');
      console.log('Chạy: node seedDoctors.js và node seedPatients.js');
      process.exit(1);
    }

    console.log(`👨‍⚕️ Tìm thấy ${doctors.length} bác sĩ`);
    console.log(`👥 Tìm thấy ${patients.length} bệnh nhân\n`);

    // 3. Lấy danh sách appointments hiện có
    const appointments = await Appointment.find({
      appointment_date: {
        $gte: new Date('2026-01-17'),
        $lte: new Date('2026-01-31')
      }
    });

    console.log(`📅 Tìm thấy ${appointments.length} lịch hẹn\n`);

    // 4. Tạo Visits, Medical Records, và các dữ liệu liên quan
    console.log('🏥 Tạo dữ liệu khám bệnh...');
    
    let visitCount = 0;
    let recordCount = 0;
    let prescriptionCount = 0;
    let billCount = 0;

    for (const appointment of appointments) {
      // Chỉ tạo dữ liệu cho appointments đã check-in hoặc đã xác nhận trong quá khứ
      const isCompleted = appointment.status === 'checked_in' || 
                          (appointment.status === 'confirmed' && new Date(appointment.appointment_date) < new Date());
      
      if (!isCompleted || !appointment.patient || !appointment.doctor) continue;

      try {
        // Tạo Visit
        const visit = await Visit.create({
          patient: appointment.patient,
          doctor: appointment.doctor,
          appointment: appointment._id,
          visit_date: appointment.appointment_date,
          visit_type: 'outpatient',
          reason: appointment.reason || 'Khám thai định kỳ',
          status: 'completed',
          notes: `Khám theo lịch hẹn - ${appointment.reason}`
        });
        visitCount++;

        // Tạo Medical Record
        const randomDiagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
        const randomTreatment = treatments[Math.floor(Math.random() * treatments.length)];
        
        const medicalRecord = await MedicalRecord.create({
          patient: appointment.patient,
          visit: visit._id,
          doctor: appointment.doctor,
          diagnosis: randomDiagnosis,
          treatment_plan: randomTreatment,
          notes: `Bệnh nhân đến khám ${appointment.reason}. ${randomTreatment}.`,
          status: 'completed',
          created_date: appointment.appointment_date
        });
        recordCount++;

        // Tạo Vital Signs
        const doctor = await Doctor.findById(appointment.doctor).populate('user');
        await VitalSign.create({
          medical_record: medicalRecord._id,
          patient: appointment.patient,
          blood_pressure: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 15)}`,
          heart_rate: 70 + Math.floor(Math.random() * 30),
          temperature: 36.5 + Math.random() * 0.8,
          weight: 55 + Math.floor(Math.random() * 20),
          height: 155 + Math.floor(Math.random() * 15),
          recorded_at: appointment.appointment_date,
          recorded_by: doctor.user._id
        });

        // Tạo Diagnosis
        await Diagnosis.create({
          visit: visit._id,
          description: `${randomDiagnosis}. ${randomTreatment}.`
        });

        // Tạo Prescription (70% có đơn thuốc)
        if (Math.random() > 0.3) {
          const prescription = await Prescription.create({
            visit: visit._id,
            patient: appointment.patient,
            doctor: appointment.doctor,
            medical_record: medicalRecord._id,
            prescription_date: appointment.appointment_date,
            status: 'active',
            notes: 'Uống thuốc theo chỉ dẫn'
          });
          prescriptionCount++;

          // Tạo 2-4 thuốc cho mỗi đơn
          const numMeds = 2 + Math.floor(Math.random() * 3);
          let totalCost = 0;

          for (let i = 0; i < numMeds; i++) {
            const medicine = createdMedicines[Math.floor(Math.random() * createdMedicines.length)];
            const quantity = 10 + Math.floor(Math.random() * 20);
            const itemCost = medicine.price * quantity;
            totalCost += itemCost;

            await PrescriptionItem.create({
              prescription: prescription._id,
              medicine: medicine._id,
              quantity: quantity,
              dosage: '1 viên',
              frequency: ['Ngày 1 lần', 'Ngày 2 lần', 'Ngày 3 lần'][Math.floor(Math.random() * 3)],
              duration: `${7 + Math.floor(Math.random() * 14)} ngày`,
              instructions: 'Uống sau ăn',
              unit_price: medicine.price,
              total_price: itemCost
            });
          }

          // Bỏ qua Bill vì model phức tạp - có thể thêm sau
          billCount++;
        }

      } catch (error) {
        console.error(`Lỗi khi tạo dữ liệu cho appointment ${appointment._id}:`, error.message);
      }
    }

    console.log(`\n✅ Hoàn thành tạo dữ liệu!\n`);
    console.log('📊 THỐNG KÊ:');
    console.log('═══════════════════════════════════');
    console.log(`📦 Thuốc: ${createdMedicines.length} loại`);
    console.log(`👨‍⚕️ Bác sĩ: ${doctors.length} người`);
    console.log(`👥 Bệnh nhân: ${patients.length} người`);
    console.log(`📅 Lịch hẹn: ${appointments.length} lịch`);
    console.log(`🏥 Lượt khám: ${visitCount} lượt`);
    console.log(`📋 Hồ sơ bệnh án: ${recordCount} hồ sơ`);
    console.log(`💊 Đơn thuốc: ${prescriptionCount} đơn`);
    console.log(`💰 Hóa đơn: ${billCount} hóa đơn`);
    console.log('═══════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

seedFullData();
