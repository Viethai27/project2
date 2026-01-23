import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Appointment from './models/4. APPOINTMENT_VISIT/Appointment.model.js';
import Patient from './models/3. PATIENT_INSURANCE/Patient.model.js';
import User from './models/1. AUTH/User.model.js';

dotenv.config();

const checkPatients = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://phucanhospital:phucan123@phucanhospital.ywmot.mongodb.net/phucanhospital?retryWrites=true&w=majority&appName=phucanhospital';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check appointments
    const appointments = await Appointment.find()
      .populate({
        path: 'patient',
        populate: {
          path: 'user',
          select: 'username phone'
        }
      })
      .limit(3);

    console.log('\n=== APPOINTMENTS ===');
    console.log('Total appointments:', await Appointment.countDocuments());
    console.log('With patient field:', await Appointment.countDocuments({ patient: { $exists: true, $ne: null } }));
    
    console.log('\n=== SAMPLE APPOINTMENT ===');
    if (appointments.length > 0) {
      const apt = appointments[0];
      console.log('Appointment ID:', apt._id);
      console.log('Patient field exists:', !!apt.patient);
      console.log('Patient:', apt.patient);
      
      if (apt.patient) {
        console.log('\nPatient details:');
        console.log('- _id:', apt.patient._id);
        console.log('- full_name:', apt.patient.full_name);
        console.log('- dob:', apt.patient.dob);
        console.log('- gender:', apt.patient.gender);
        console.log('- user field exists:', !!apt.patient.user);
        
        if (apt.patient.user) {
          console.log('\nUser details:');
          console.log('- _id:', apt.patient.user._id);
          console.log('- username:', apt.patient.user.username);
          console.log('- phone:', apt.patient.user.phone);
        }
      }
    }

    // Check patients directly
    console.log('\n=== PATIENTS ===');
    const patients = await Patient.find().populate('user', 'username phone').limit(3);
    console.log('Total patients:', await Patient.countDocuments());
    
    if (patients.length > 0) {
      console.log('\nSample patient:');
      const p = patients[0];
      console.log('- _id:', p._id);
      console.log('- full_name:', p.full_name);
      console.log('- dob:', p.dob);
      console.log('- gender:', p.gender);
      console.log('- user:', p.user);
    }

    // Check users
    console.log('\n=== USERS ===');
    const users = await User.find().limit(3);
    console.log('Total users:', await User.countDocuments());
    
    if (users.length > 0) {
      console.log('\nSample user:');
      const u = users[0];
      console.log('- _id:', u._id);
      console.log('- username:', u.username);
      console.log('- phone:', u.phone);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
  }
};

checkPatients();
