// Fake medical records data
let medicalRecords = [
  {
    id: 'BA001',
    patientId: 'BN001',
    patientName: 'Nguyễn Văn A',
    visitDate: '2026-01-05',
    doctorId: 'DR001',
    doctor: 'BS. Nguyễn Văn B',
    department: 'Khoa Nội tổng quát',
    chiefComplaint: 'Đau đầu, chóng mặt',
    presentIllness: 'Bệnh nhân than đau đầu từ 3 ngày trước, kèm theo chóng mặt, buồn nôn',
    medicalHistory: 'Tiền sử cao huyết áp',
    allergies: 'Không có dị ứng thuốc',
    vitalSigns: {
      temperature: 37.2,
      bloodPressure: '140/90',
      pulse: 80,
      respiratory: 18,
      height: 170,
      weight: 70,
      bmi: 24.2
    },
    examination: {
      general: 'Thần trí tỉnh táo, da niêm mạc hồng',
      cardiovascular: 'Tim đều, không tiếng thổi',
      respiratory: 'Phổi rõ, không ran',
      abdomen: 'Bụng mềm, không đau ấn',
      neurological: 'Các phản xạ sinh lý bình thường'
    },
    diagnosis: [
      { code: 'I10', name: 'Tăng huyết áp nguyên phát', type: 'Chẩn đoán chính' },
      { code: 'R51', name: 'Đau đầu', type: 'Chẩn đoán kèm theo' }
    ],
    clinicalTests: [
      { name: 'Xét nghiệm máu', status: 'Đã thực hiện', result: 'Bình thường' },
      { name: 'Điện tâm đồ', status: 'Đã thực hiện', result: 'Nhịp xoang, bình thường' }
    ],
    prescriptions: [
      { 
        medicineId: 'MED001',
        medicineName: 'Amlodipine 5mg',
        dosage: '1 viên',
        frequency: 'Sáng',
        duration: '30 ngày',
        quantity: 30,
        instructions: 'Uống sau ăn'
      },
      {
        medicineId: 'MED002',
        medicineName: 'Vitamin B1',
        dosage: '1 viên',
        frequency: 'Sáng, trưa, tối',
        duration: '15 ngày',
        quantity: 45,
        instructions: 'Uống sau ăn'
      }
    ],
    procedures: [],
    notes: 'Tái khám sau 2 tuần, theo dõi huyết áp tại nhà',
    followUpDate: '2026-01-19',
    status: 'Hoàn thành',
    createdAt: '2026-01-05T10:00:00Z'
  }
];

export const getAllMedicalRecords = async (req, res) => {
  try {
    const { patientId, doctorId, fromDate, toDate } = req.query;

    let filteredRecords = [...medicalRecords];

    if (patientId) {
      filteredRecords = filteredRecords.filter(r => r.patientId === patientId);
    }

    if (doctorId) {
      filteredRecords = filteredRecords.filter(r => r.doctorId === doctorId);
    }

    if (fromDate) {
      filteredRecords = filteredRecords.filter(r => r.visitDate >= fromDate);
    }

    if (toDate) {
      filteredRecords = filteredRecords.filter(r => r.visitDate <= toDate);
    }

    res.json({
      records: filteredRecords,
      total: filteredRecords.length
    });
  } catch (error) {
    console.error('Get all medical records error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getMedicalRecordById = async (req, res) => {
  try {
    const record = medicalRecords.find(r => r.id === req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh án' });
    }

    res.json(record);
  } catch (error) {
    console.error('Get medical record by ID error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const createMedicalRecord = async (req, res) => {
  try {
    const { patientId, doctorId, chiefComplaint } = req.body;

    if (!patientId || !doctorId || !chiefComplaint) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const recordId = `BA${String(medicalRecords.length + 1).padStart(3, '0')}`;

    const newRecord = {
      id: recordId,
      ...req.body,
      status: 'Đang thực hiện',
      createdAt: new Date().toISOString()
    };

    medicalRecords.push(newRecord);

    res.status(201).json({
      message: 'Tạo bệnh án thành công',
      record: newRecord
    });
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateMedicalRecord = async (req, res) => {
  try {
    const recordIndex = medicalRecords.findIndex(r => r.id === req.params.id);
    
    if (recordIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh án' });
    }

    medicalRecords[recordIndex] = {
      ...medicalRecords[recordIndex],
      ...req.body,
      id: medicalRecords[recordIndex].id,
      createdAt: medicalRecords[recordIndex].createdAt,
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: 'Cập nhật bệnh án thành công',
      record: medicalRecords[recordIndex]
    });
  } catch (error) {
    console.error('Update medical record error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const addVitalSigns = async (req, res) => {
  try {
    const recordIndex = medicalRecords.findIndex(r => r.id === req.params.id);
    
    if (recordIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh án' });
    }

    medicalRecords[recordIndex].vitalSigns = req.body;

    res.json({
      message: 'Cập nhật sinh hiệu thành công',
      record: medicalRecords[recordIndex]
    });
  } catch (error) {
    console.error('Add vital signs error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const addDiagnosis = async (req, res) => {
  try {
    const recordIndex = medicalRecords.findIndex(r => r.id === req.params.id);
    
    if (recordIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh án' });
    }

    if (!medicalRecords[recordIndex].diagnosis) {
      medicalRecords[recordIndex].diagnosis = [];
    }

    medicalRecords[recordIndex].diagnosis = req.body;

    res.json({
      message: 'Cập nhật chẩn đoán thành công',
      record: medicalRecords[recordIndex]
    });
  } catch (error) {
    console.error('Add diagnosis error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const addPrescription = async (req, res) => {
  try {
    const recordIndex = medicalRecords.findIndex(r => r.id === req.params.id);
    
    if (recordIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh án' });
    }

    if (!medicalRecords[recordIndex].prescriptions) {
      medicalRecords[recordIndex].prescriptions = [];
    }

    medicalRecords[recordIndex].prescriptions = req.body;

    res.json({
      message: 'Cập nhật đơn thuốc thành công',
      record: medicalRecords[recordIndex]
    });
  } catch (error) {
    console.error('Add prescription error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const addClinicalTests = async (req, res) => {
  try {
    const recordIndex = medicalRecords.findIndex(r => r.id === req.params.id);
    
    if (recordIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh án' });
    }

    if (!medicalRecords[recordIndex].clinicalTests) {
      medicalRecords[recordIndex].clinicalTests = [];
    }

    medicalRecords[recordIndex].clinicalTests = req.body;

    res.json({
      message: 'Cập nhật xét nghiệm thành công',
      record: medicalRecords[recordIndex]
    });
  } catch (error) {
    console.error('Add clinical tests error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
