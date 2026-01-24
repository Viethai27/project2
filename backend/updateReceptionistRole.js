import mongoose from 'mongoose';
import User from './models/1. AUTH/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://viethaia11k59tt1:Ngothiviethai27032004@cluster0.hsjovcu.mongodb.net/phucanhospital?retryWrites=true&w=majority&appName=Cluster0';

async function updateReceptionistRole() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    const receptionistEmails = [
      'hoa.nguyen@pamec.com',
      'nam.tran@pamec.com',
      'lan.pham@pamec.com'
    ];

    for (const email of receptionistEmails) {
      const result = await User.updateOne(
        { email },
        { $set: { role: 'receptionist' } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✓ Updated role to receptionist for: ${email}`);
      } else {
        console.log(`✗ User not found: ${email}`);
      }
    }

    console.log('\n=== UPDATE COMPLETED ===');
    process.exit(0);
  } catch (error) {
    console.error('Error updating roles:', error);
    process.exit(1);
  }
}

updateReceptionistRole();
