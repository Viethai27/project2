// Fake patient data - replace with database queries
let patients = [
  {
    id: 'BN001',
    name: 'Nguyễn Văn A',
    dob: '1980-05-15',
    gender: 'Nam',
    idCard: '012345678901',
    phone: '0912345678',
    email: 'nguyenvana@email.com',
    address: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
    insurance: 'DN4500123456789',
    insuranceExpiry: '2026-12-31',
    emergencyContact: {
      name: 'Nguyễn Thị B',
      relationship: 'Vợ',
      phone: '0987654321'
    },
    status: 'active',
    type: 'Ngoại trú',
    createdAt: '2025-01-01T08:00:00Z'
  },
  {
    id: 'BN002',
    name: 'Trần Thị B',
    dob: '1992-08-22',
    gender: 'Nữ',
    idCard: '012345678902',
    phone: '0987654321',
    email: 'tranthib@email.com',
    address: '456 Lê Văn Việt, Q.9, TP.HCM',
    insurance: 'DN4500123456790',
    insuranceExpiry: '2026-06-30',
    emergencyContact: {
      name: 'Trần Văn C',
      relationship: 'Chồng',
      phone: '0912345678'
    },
    status: 'active',
    type: 'Nội trú',
    createdAt: '2025-01-02T09:00:00Z'
  }
];

export const getAllPatients = async (req, res) => {
  try {
    const { search, type, status, page = 1, limit = 10 } = req.query;

    let filteredPatients = [...patients];

    // Search filter
    if (search) {
      filteredPatients = filteredPatients.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search)
      );
    }

    // Type filter
    if (type && type !== 'all') {
      filteredPatients = filteredPatients.filter(p => p.type === type);
    }

    // Status filter
    if (status && status !== 'all') {
      filteredPatients = filteredPatients.filter(p => p.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

    res.json({
      patients: paginatedPatients,
      total: filteredPatients.length,
      page: parseInt(page),
      totalPages: Math.ceil(filteredPatients.length / limit)
    });
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = patients.find(p => p.id === req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Get patient by ID error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const searchPatient = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Vui lòng nhập thông tin tìm kiếm' });
    }

    const patient = patients.find(p => 
      p.id === query || 
      p.phone === query || 
      p.idCard === query
    );

    if (!patient) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Search patient error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const createPatient = async (req, res) => {
  try {
    const { name, dob, gender, idCard, phone, email, address, insurance, insuranceExpiry, emergencyContact } = req.body;

    // Validate required fields
    if (!name || !dob || !gender || !phone) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc' });
    }

    // Generate patient ID
    const patientId = `BN${String(patients.length + 1).padStart(3, '0')}`;

    const newPatient = {
      id: patientId,
      name,
      dob,
      gender,
      idCard: idCard || '',
      phone,
      email: email || '',
      address: address || '',
      insurance: insurance || '',
      insuranceExpiry: insuranceExpiry || null,
      emergencyContact: emergencyContact || {},
      status: 'active',
      type: 'Ngoại trú',
      createdAt: new Date().toISOString()
    };

    patients.push(newPatient);

    res.status(201).json({
      message: 'Tạo hồ sơ bệnh nhân thành công',
      patient: newPatient
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patientIndex = patients.findIndex(p => p.id === req.params.id);
    
    if (patientIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    }

    patients[patientIndex] = {
      ...patients[patientIndex],
      ...req.body,
      id: patients[patientIndex].id,
      createdAt: patients[patientIndex].createdAt
    };

    res.json({
      message: 'Cập nhật thông tin bệnh nhân thành công',
      patient: patients[patientIndex]
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patientIndex = patients.findIndex(p => p.id === req.params.id);
    
    if (patientIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    }

    patients.splice(patientIndex, 1);

    res.json({ message: 'Xóa bệnh nhân thành công' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
