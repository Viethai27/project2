import Patient from '../models/3. PATIENT_INSURANCE/Patient.model.js';
import User from '../models/1. AUTH/User.model.js';

class PatientService {
  // Search patient by phone, ID, or email
  async searchPatient(searchTerm) {
    const patient = await Patient.findOne({
      $or: [
        { phone: searchTerm },
        { id_card: searchTerm },
        { email: searchTerm },
      ],
    }).populate('user', 'username email');

    if (!patient) {
      throw new Error('Không tìm thấy bệnh nhân');
    }

    return patient;
  }

  // Create new patient
  async createPatient(patientData, userId) {
    const { full_name, dob, gender, phone, id_card, address, email } = patientData;

    // Check if patient already exists
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

    // Create patient
    const patient = await Patient.create({
      user: userId,
      full_name,
      dob,
      gender,
      phone,
      id_card,
      address,
      email,
    });

    await patient.populate('user', 'username email');

    return patient;
  }

  // Get patient by ID
  async getPatientById(patientId) {
    const patient = await Patient.findById(patientId).populate('user', 'username email');
    
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
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    return patients;
  }
}

export default new PatientService();
