import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/1. AUTH/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://viethaia11k59tt1:Ngothiviethai27032004@cluster0.hsjovcu.mongodb.net/phucanhospital?retryWrites=true&w=majority&appName=Cluster0';

const receptionists = [
  {
    username: 'Lê Tân Nguyễn Thị Hoa',
    email: 'hoa.nguyen@pamec.com',
    phone: '0901234567',
    password: 'Receptionist123',
    role: 'receptionist'
  },
  {
    username: 'Lê Tân Trần Văn Nam',
    email: 'nam.tran@pamec.com',
    phone: '0902234567',
    password: 'Receptionist123',
    role: 'receptionist'
  },
  {
    username: 'Lê Tân Phạm Thị Lan',
    email: 'lan.pham@pamec.com',
    phone: '0903234567',
    password: 'Receptionist123',
    role: 'receptionist'
  }
];

async function seedReceptionists() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Delete existing receptionists
    const deleteResult = await User.deleteMany({ role: 'receptionist' });
    console.log(`Deleted ${deleteResult.deletedCount} existing receptionists`);

    // Create new receptionists
    const createdReceptionists = [];
    
    for (const receptionistData of receptionists) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(receptionistData.password, salt);

      const receptionist = await User.create({
        username: receptionistData.username,
        email: receptionistData.email,
        phone: receptionistData.phone,
        password_hash,
        role: receptionistData.role,
        is_active: true
      });

      createdReceptionists.push(receptionist);
      console.log(`Created receptionist: ${receptionist.username} (${receptionist.email})`);
    }

    console.log('\n=== SEED COMPLETED ===');
    console.log(`Total receptionists created: ${createdReceptionists.length}`);
    console.log('\n=== LOGIN CREDENTIALS ===');
    receptionists.forEach(r => {
      console.log(`Email: ${r.email}`);
      console.log(`Password: ${r.password}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding receptionists:', error);
    process.exit(1);
  }
}

seedReceptionists();
