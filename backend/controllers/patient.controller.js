import patientService from '../services/patient.service.js';

// @desc    Search patient
// @route   GET /api/patients/search
// @access  Private
export const searchPatient = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập thông tin tìm kiếm',
      });
    }

    const patient = await patientService.searchPatient(q);
    
    res.json({
      success: true,
      patient,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private
export const createPatient = async (req, res) => {
  try {
    console.log('🔵 [CREATE PATIENT] Received request:', {
      body: req.body,
      userId: req.user?.id,
      userEmail: req.user?.email
    });

    // Always create a new user for the patient (don't use receptionist's userId)
    // The service will create a new User account for this patient
    const patient = await patientService.createPatient(req.body, null);

    res.status(201).json({
      success: true,
      message: 'Tạo hồ sơ bệnh nhân thành công',
      patient,
    });
  } catch (error) {
    console.error('❌ [CREATE PATIENT] Error:', error.message);
    console.error('❌ [CREATE PATIENT] Stack:', error.stack);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
export const getPatientById = async (req, res) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);

    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
export const updatePatient = async (req, res) => {
  try {
    const patient = await patientService.updatePatient(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Cập nhật thành công',
      patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
export const getAllPatients = async (req, res) => {
  try {
    console.log('🔵 [GET ALL PATIENTS] Fetching patients...');
    const patients = await patientService.getAllPatients(req.query);
    console.log(`✅ [GET ALL PATIENTS] Found ${patients.length} patients`);
    
    res.json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error('❌ [GET ALL PATIENTS] Error:', error.message);
    console.error('❌ [GET ALL PATIENTS] Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
