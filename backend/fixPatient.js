import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/1. AUTH/User.model.js';
import Patient from './models/3. PATIENT_INSURANCE/Patient.model.js';

dotenv.config();

const fixPatient = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    // Find user with phone 0393045204
    const user = await User.findOne({ phone: '0393045204' });
    console.log(`Found user: ${user.username}`);

    // Create patient record for this user
    const patient = await Patient.create({
      user: user._id,
      full_name: user.username,
      dob: new Date('1990-01-01'),
      gender: 'female',
    });

    console.log(`✅ Created patient record for ${patient.full_name}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixPatient();
