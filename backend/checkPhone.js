import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/1. AUTH/User.model.js';
import Patient from './models/3. PATIENT_INSURANCE/Patient.model.js';

dotenv.config();

const checkPhone = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    const user = await User.findOne({ phone: '0393045204' });
    console.log('📱 User with phone 0393045204:');
    console.log('Username:', user?.username);
    console.log('Email:', user?.email);
    console.log('Role:', user?.role);
    console.log('ID:', user?._id);
    console.log('');

    if (user) {
      const patient = await Patient.findOne({ user: user._id });
      console.log('🏥 Associated Patient:');
      if (patient) {
        console.log('Full name:', patient.full_name);
        console.log('ID:', patient._id);
      } else {
        console.log('❌ NO PATIENT RECORD FOUND FOR THIS USER!');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkPhone();
