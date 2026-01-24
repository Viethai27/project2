import Patient from '../models/3. PATIENT_INSURANCE/Patient.model.js';
import User from '../models/1. AUTH/User.model.js';

class PatientService {
  // Search patient by phone, ID, or email
  async searchPatient(searchTerm) {
    console.log('🔍 Searching for:', searchTerm);
    
    // Try to find patient by their direct fields first
    let patient = await Patient.findOne({
      $or: [
        { phone: searchTerm },
        { id_card: searchTerm },
        { email: searchTerm },
      ],
    }).populate('user', 'username email phone');

    console.log('🏥 Found patient (direct):', patient ? patient.full_name : 'Not found');

    // If not found, try to search by user's phone or email
    if (!patient) {
      const user = await User.findOne({
        $or: [
          { phone: searchTerm },
          { email: searchTerm },
        ],
      });

      console.log('👤 Found user:', user ? user.username : 'Not found');

      if (user) {
        patient = await Patient.findOne({ user: user._id })
          .populate('user', 'username email phone');
        
        console.log('🏥 Found patient (via user):', patient ? patient.full_name : 'Not found');
      }
    }

    if (!patient) {
      throw new Error('Không tìm thấy bệnh nhân');
    }

    // Convert to plain object and ensure all fields are accessible
    const patientObj = patient.toObject();
    
    // Merge user data into patient object for easier frontend access
    if (patientObj.user) {
      patientObj.phone = patientObj.phone || patientObj.user.phone;
      patientObj.email = patientObj.email || patientObj.user.email;
    }

    return patientObj;
  }

  // Create new patient
  async createPatient(patientData, userId = null) {
    const { full_name, dob, gender, phone, id_card, address, email } = patientData;

    console.log('📝 Creating patient with data:', { full_name, phone, email, id_card });

    // Check if patient already exists by phone or id_card
    if (phone) {
      const existingPatient = await Patient.findOne({ phone });
      if (existingPatient) {
        throw new Error('Số điện thoại đã được đăng ký');
      }
    }

    if (id_card) {
      const existingPatient = await Patient.findOne({ id_card });
      if (existingPatient) {
        throw new Error('CCCD đã được đăng ký');
      }
    }

    // If no userId provided, create a new user
    let userIdToUse = userId;
    if (!userIdToUse) {
      // Check if user with this email/phone exists
      let user = await User.findOne({
        $or: [
          { email: email },
          { phone: phone }
        ].filter(Boolean)
      });

      if (!user) {
        // Create new user
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.default.hash('Patient123', 10);
        
        user = await User.create({
          username: full_name,
          email: email || `patient_${Date.now()}@temp.com`,
          phone: phone,
          password_hash: hashedPassword,
          role: 'patient',
        });
        console.log('✅ Created new user:', user.username);
      }
      userIdToUse = user._id;
    }

    // Create patient
    const patient = await Patient.create({
      user: userIdToUse,
      full_name,
      dob,
      gender,
      phone,
      id_card,
      address,
      email,
    });

    console.log('✅ Created patient:', patient.full_name);

    await patient.populate('user', 'username email');

    return patient;
  }

  // Get patient by ID
  async getPatientById(patientId) {
    const patient = await Patient.findById(patientId).populate('user', 'username email phone');
    
    if (!patient) {
      throw new Error('Không tìm thấy bệnh nhân');
    }

    return patient;
  }

  // Update patient
  async updatePatient(patientId, updateData) {
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'username email');

    if (!patient) {
      throw new Error('Không tìm thấy bệnh nhân');
    }

    return patient;
  }

  // Get all patients
  async getAllPatients(filters = {}) {
    const patients = await Patient.find(filters)
      .populate('user', 'username email phone')
      .sort({ createdAt: -1 });

    return patients;
  }
}

export default new PatientService();
