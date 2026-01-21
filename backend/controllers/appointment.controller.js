import appointmentService from '../services/appointment.service.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
export const createAppointment = async (req, res) => {
  try {
    console.log('Received appointment data:', req.body);
    const appointment = await appointmentService.createAppointment(req.body);

    res.status(201).json({
      success: true,
      message: 'Đặt lịch thành công',
      appointment,
    });
  } catch (error) {
    console.error('Appointment creation error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my appointments
// @route   GET /api/appointments/my-appointments
// @access  Private
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointmentsByPatient(req.user.id);

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await appointmentService.getAppointmentById(req.params.id);

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.cancelAppointment(req.params.id);

    res.json({
      success: true,
      message: 'Hủy lịch hẹn thành công',
      appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get available time slots
// @route   GET /api/appointments/available-slots
// @access  Private
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    const slots = await appointmentService.getAvailableSlots(doctorId, date);

    res.json({
      success: true,
      slots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments/all
// @access  Private
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointments(req.query);
    
    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await appointmentService.updateAppointmentStatus(req.params.id, status);

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
