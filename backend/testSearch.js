import mongoose from 'mongoose';
import dotenv from 'dotenv';
import patientService from './services/patient.service.js';

dotenv.config();

const testSearch = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    console.log('Testing search with phone: 0393045204');
    const result = await patientService.searchPatient('0393045204');
    console.log('\n✅ Search result:', result);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

testSearch();
