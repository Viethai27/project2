import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/1. AUTH/User.model.js';
import Patient from './models/3. PATIENT_INSURANCE/Patient.model.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedPatients = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Create test patients
    const testPatients = [
      {
        email: 'patient1@test.com',
        phone: '0393045204',
        username: 'Nguyễn Văn A',
        full_name: 'Nguyễn Văn A',
        dob: new Date('1990-01-15'),
        gender: 'male',
        id_card: '001234567890',
        address: '123 Lê Lợi, Quận 1, TP.HCM',
      },
      {
        email: 'patient2@test.com',
        phone: '0912345678',
        username: 'Trần Thị B',
        full_name: 'Trần Thị B',
        dob: new Date('1985-05-20'),
        gender: 'female',
        id_card: '001234567891',
        address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
      },
      {
        email: 'patient3@test.com',
        phone: '0987654321',
        username: 'Lê Văn C',
        full_name: 'Lê Văn C',
        dob: new Date('1995-08-10'),
        gender: 'male',
        id_card: '001234567892',
        address: '789 Hai Bà Trưng, Quận 3, TP.HCM',
      },
    ];

    for (const patientData of testPatients) {
      // Check if user already exists
      let user = await User.findOne({ email: patientData.email });
      
      if (!user) {
        const hashedPassword = await bcrypt.hash('Patient123', 10);
        user = await User.create({
          username: patientData.username,
          email: patientData.email,
          password_hash: hashedPassword,
          phone: patientData.phone,
          role: 'patient',
        });
        console.log(`✅ Created user: ${user.username}`);
      } else {
        console.log(`ℹ️  User already exists: ${user.username}`);
      }

      // Check if patient already exists
      let patient = await Patient.findOne({ user: user._id });
      
      if (!patient) {
        patient = await Patient.create({
          user: user._id,
          full_name: patientData.full_name,
          dob: patientData.dob,
          gender: patientData.gender,
          phone: patientData.phone,
          id_card: patientData.id_card,
          address: patientData.address,
          email: patientData.email,
        });
        console.log(`✅ Created patient: ${patient.full_name} - Phone: ${patient.phone}`);
      } else {
        console.log(`ℹ️  Patient already exists: ${patient.full_name}`);
      }
    }

    console.log('\n✅ All test patients seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding patients:', error);
    process.exit(1);
  }
};

seedPatients();
