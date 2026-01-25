import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import patientService from './services/patient.service.js';

dotenv.config();

async function testSearch() {
  try {
    await connectDB();
    
    const searchTerm = '0934567890';
    console.log(`\nTesting search for: ${searchTerm}\n`);
    
    const result = await patientService.searchPatient(searchTerm);
    
    console.log('\n=== RESULT ===');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n=== KEY FIELDS ===');
    console.log('full_name:', result.full_name);
    console.log('dob:', result.dob);
    console.log('id_card:', result.id_card);
    console.log('phone:', result.phone);
    console.log('email:', result.email);
    console.log('address:', result.address);
    console.log('gender:', result.gender);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testSearch();
