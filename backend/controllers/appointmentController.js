// Fake appointment data
let appointments = [
  {
    id: 'APT001',
    patientId: 'BN001',
    patientName: 'Nguyễn Văn A',
    department: 'Khoa Nội tổng quát',
    doctor: 'BS. Nguyễn Văn B',
    doctorId: 'DR001',
    date: '2026-01-06',
    time: '09:00',
    type: 'Khám thường',
    status: 'Đã đặt',
    number: 'A001',
    room: 'Phòng 101',
    reason: 'Đau đầu, chóng mặt',
    createdAt: '2026-01-05T08:00:00Z'
  },
  {
    id: 'APT002',
    patientId: 'BN002',
    patientName: 'Trần Thị B',
    department: 'Khoa Sản',
    doctor: 'BS. Võ Thị F',
    doctorId: 'DR005',
    date: '2026-01-06',
    time: '10:00',
    type: 'Khám BHYT',
    status: 'Đã đặt',
    number: 'A002',
    room: 'Phòng 201',
    reason: 'Khám thai định kỳ',
    createdAt: '2026-01-05T09:00:00Z'
  }
];

// Fake departments and doctors
const departments = [
  { id: 'DEPT001', name: 'Khoa Nội tổng quát' },
  { id: 'DEPT002', name: 'Khoa Ngoại' },
  { id: 'DEPT003', name: 'Khoa Sản' },
  { id: 'DEPT004', name: 'Khoa Nhi' },
  { id: 'DEPT005', name: 'Khoa Tai Mũi Họng' }
];

const doctors = [
  { id: 'DR001', name: 'BS. Nguyễn Văn B', department: 'Khoa Nội tổng quát', departmentId: 'DEPT001' },
  { id: 'DR002', name: 'BS. Trần Thị C', department: 'Khoa Nội tổng quát', departmentId: 'DEPT001' },
  { id: 'DR003', name: 'BS. Phạm Văn D', department: 'Khoa Ngoại', departmentId: 'DEPT002' },
  { id: 'DR004', name: 'BS. Hoàng Thị E', department: 'Khoa Ngoại', departmentId: 'DEPT002' },
  { id: 'DR005', name: 'BS. Võ Thị F', department: 'Khoa Sản', departmentId: 'DEPT003' }
];

export const getAllAppointments = async (req, res) => {
  try {
    const { patientId, doctorId, date, status } = req.query;

    let filteredAppointments = [...appointments];

    if (patientId) {
      filteredAppointments = filteredAppointments.filter(a => a.patientId === patientId);
    }

    if (doctorId) {
      filteredAppointments = filteredAppointments.filter(a => a.doctorId === doctorId);
    }

    if (date) {
      filteredAppointments = filteredAppointments.filter(a => a.date === date);
    }

    if (status && status !== 'all') {
      filteredAppointments = filteredAppointments.filter(a => a.status === status);
    }

    res.json({
      appointments: filteredAppointments,
      total: filteredAppointments.length
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = appointments.find(a => a.id === req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { patientId, patientName, department, doctorId, doctor, date, time, type, reason } = req.body;

    // Validate required fields
    if (!patientId || !department || !doctorId || !date || !time) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    // Generate appointment ID and number
    const appointmentId = `APT${String(appointments.length + 1).padStart(3, '0')}`;
    const appointmentNumber = `A${String(appointments.length + 1).padStart(3, '0')}`;

    const newAppointment = {
      id: appointmentId,
      patientId,
      patientName,
      department,
      doctor,
      doctorId,
      date,
      time,
      type: type || 'Khám thường',
      status: 'Đã đặt',
      number: appointmentNumber,
      room: 'Phòng 101', // Auto assign room
      reason: reason || '',
      createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);

    res.status(201).json({
      message: 'Đăng ký khám thành công',
      appointment: newAppointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointmentIndex = appointments.findIndex(a => a.id === req.params.id);
    
    if (appointmentIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
    }

    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...req.body,
      id: appointments[appointmentIndex].id,
      createdAt: appointments[appointmentIndex].createdAt
    };

    res.json({
      message: 'Cập nhật lịch hẹn thành công',
      appointment: appointments[appointmentIndex]
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointmentIndex = appointments.findIndex(a => a.id === req.params.id);
    
    if (appointmentIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
    }

    appointments[appointmentIndex].status = 'Đã hủy';

    res.json({
      message: 'Hủy lịch hẹn thành công',
      appointment: appointments[appointmentIndex]
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getDepartments = async (req, res) => {
  try {
    res.json({ departments });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getDoctorsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.query;

    let filteredDoctors = doctors;
    if (departmentId) {
      filteredDoctors = doctors.filter(d => d.departmentId === departmentId);
    }

    res.json({ doctors: filteredDoctors });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
