import Patient from '../models/3. PATIENT_INSURANCE/Patient.model.js';
import User from '../models/1. AUTH/User.model.js';
import Appointment from '../models/4. APPOINTMENT_VISIT/Appointment.model.js';

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

    // Validate required fields
    if (!full_name) {
      throw new Error('Họ tên là bắt buộc');
    }

    if (!phone) {
      throw new Error('Số điện thoại là bắt buộc');
    }

    if (!gender) {
      throw new Error('Giới tính là bắt buộc');
    }

    // Check if patient already exists by phone or id_card (only if provided)
    if (phone && phone !== 'N/A' && phone !== 'Chưa có') {
      const existingPatient = await Patient.findOne({ phone });
      if (existingPatient) {
        throw new Error('Số điện thoại đã được đăng ký');
      }
    }

    if (id_card && id_card !== 'N/A' && id_card !== 'Chưa có') {
      const existingPatient = await Patient.findOne({ id_card });
      if (existingPatient) {
        throw new Error('CCCD đã được đăng ký');
      }
    }

    // If no userId provided, create a new user
    let userIdToUse = userId;
    if (!userIdToUse) {
      // For emergency patients with N/A phone, create unique user
      const isEmergencyPatient = phone === 'N/A' || id_card === 'N/A';
      
      let user;
      
      if (isEmergencyPatient) {
        // Always create new user for emergency patients (don't check existing)
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.default.hash('Patient123', 10);
        const timestamp = Date.now();
        
        user = await User.create({
          username: `${full_name}_${timestamp}`, // Unique username
          email: `emergency_${timestamp}@temp.com`, // Unique email
          phone: phone,
          password_hash: hashedPassword,
          role: 'patient',
        });
        console.log('✅ Created emergency user:', user.username);
      } else {
        // Check if user with this email/phone exists
        user = await User.findOne({
          $or: [
            { email: email },
            { phone: phone }
          ].filter(Boolean)
        });

        if (user) {
          // Check if this user already has a patient record
          const existingPatient = await Patient.findOne({ user: user._id });
          if (existingPatient) {
            throw new Error(`Email hoặc số điện thoại đã được đăng ký cho bệnh nhân: ${existingPatient.full_name}`);
          }
        }

        if (!user) {
          // Create new user
          const bcrypt = await import('bcryptjs');
          const hashedPassword = await bcrypt.default.hash('Patient123', 10);
          
          // Create unique username using phone number or timestamp
          const uniqueUsername = phone 
            ? `${full_name}_${phone.slice(-4)}` // Use last 4 digits of phone
            : `${full_name}_${Date.now()}`; // Use timestamp as fallback
          
          user = await User.create({
            username: uniqueUsername,
            email: email || `patient_${Date.now()}@temp.com`,
            phone: phone,
            password_hash: hashedPassword,
            role: 'patient',
          });
          console.log('✅ Created new user:', user.username);
        }
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
    const { phone, id_card } = updateData;
    
    // Check duplicate phone (nếu update phone mới, không phải N/A)
    if (phone && phone !== 'N/A' && phone !== 'Chưa có') {
      const existingPatient = await Patient.findOne({ 
        phone, 
        _id: { $ne: patientId } // Exclude current patient
      });
      
      if (existingPatient) {
        throw new Error('Số điện thoại đã được đăng ký bởi bệnh nhân khác');
      }
    }
    
    // Check duplicate id_card (nếu update CCCD mới, không phải N/A)
    if (id_card && id_card !== 'N/A' && id_card !== 'Chưa có') {
      const existingPatient = await Patient.findOne({ 
        id_card,
        _id: { $ne: patientId }
      });
      
      if (existingPatient) {
        throw new Error('CCCD đã được đăng ký bởi bệnh nhân khác');
      }
    }
    
    console.log('📝 Updating patient:', patientId, updateData);
    
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'username email phone');

    if (!patient) {
      throw new Error('Không tìm thấy bệnh nhân');
    }
    
    console.log('✅ Updated patient:', patient.full_name);

    return patient;
  }

  // Get all patients
  async getAllPatients(filters = {}) {
    try {
      console.log('📋 [SERVICE] Fetching patients from DB...');
      const patients = await Patient.find(filters)
        .populate('user', 'username email phone')
        .sort({ createdAt: -1 });
      
      console.log(`📋 [SERVICE] Found ${patients.length} patients`);

      // Enrich with latest visit/appointment info for each patient
      console.log('📋 [SERVICE] Enriching patient data with department info...');
      const enrichedPatients = await Promise.all(patients.map(async (patient) => {
        try {
          const patientObj = patient.toObject();
          
          // Find latest appointment to get department info
          const latestAppointment = await Appointment.findOne({ patient: patient._id })
            .populate({
              path: 'doctor',
              populate: {
                path: 'department',
                select: 'name'
              }
            })
            .sort({ createdAt: -1 })
            .limit(1);
          
          if (latestAppointment?.doctor?.department) {
            patientObj.department = latestAppointment.doctor.department;
            patientObj.status = latestAppointment.status || 'Hoàn thành';
          }
          
          return patientObj;
        } catch (err) {
          console.error(`❌ Error enriching patient ${patient._id}:`, err.message);
          // Return patient without enrichment on error
          return patient.toObject();
        }
      }));

      console.log('✅ [SERVICE] Patient enrichment complete');
      return enrichedPatients;
    } catch (error) {
      console.error('❌ [SERVICE] Error in getAllPatients:', error);
      throw error;
    }
  }
}

export default new PatientService();
