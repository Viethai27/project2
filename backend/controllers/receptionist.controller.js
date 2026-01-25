import Appointment from '../models/4. APPOINTMENT_VISIT/Appointment.model.js';
import Department from '../models/2. CATALOGUE_FACILYTY/Department.model.js';

// @desc    Get pending appointments for receptionist dashboard
// @route   GET /api/receptionist/pending-appointments
// @access  Private (receptionist)
export const getPendingAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      status: 'pending',
      department: { $type: 'objectId' } // Only get appointments with ObjectId department
    })
      .populate('patient', 'full_name phone email dob gender')
      .populate('doctor', 'full_name specialty')
      .populate('department', 'name')
      .sort({ booked_at: -1 })
      .lean();

    console.log(`📋 Found ${appointments.length} pending appointments (with valid department)`);

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('❌ Get pending appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách chờ tiếp nhận'
    });
  }
};

// @desc    Get appointment details
// @route   GET /api/receptionist/appointments/:id
// @access  Private (receptionist)
export const getAppointmentDetails = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('department')
      .lean();

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('❌ Get appointment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin lịch hẹn'
    });
  }
};

// @desc    Get available time slots for a doctor on a specific date
// @route   GET /api/receptionist/available-slots
// @access  Private (receptionist)
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { doctorId, date, session } = req.query; // session: 'morning' or 'afternoon'

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp bác sĩ và ngày khám'
      });
    }

    // Define time slots
    const morningSlots = [
      '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', 
      '10:00', '10:30', '11:00', '11:30'
    ];
    
    const afternoonSlots = [
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30'
    ];

    let allSlots = session === 'morning' ? morningSlots : 
                   session === 'afternoon' ? afternoonSlots : 
                   [...morningSlots, ...afternoonSlots];

    // Parse the date and set time range for the whole day
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Find booked slots for this doctor on this date
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      appointment_date: {
        $gte: selectedDate,
        $lt: nextDay
      },
      status: { $in: ['pending', 'confirmed', 'booked', 'checked_in'] }
    }).select('time_slot').lean();

    const bookedSlots = bookedAppointments.map(apt => apt.time_slot);

    // Filter available slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      success: true,
      data: availableSlots.map(slot => ({
        value: slot,
        label: slot,
        available: true
      }))
    });
  } catch (error) {
    console.error('❌ Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách giờ trống'
    });
  }
};

// @desc    Confirm appointment with specific time
// @route   PUT /api/receptionist/appointments/:id/confirm
// @access  Private (receptionist)
export const confirmAppointment = async (req, res) => {
  try {
    const { time_slot, doctor, notes } = req.body;

    if (!time_slot || !doctor) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn giờ khám và bác sĩ'
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn'
      });
    }

    if (appointment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Lịch hẹn đã được xác nhận trước đó'
      });
    }

    // Update appointment
    appointment.time_slot = time_slot;
    appointment.doctor = doctor;
    appointment.status = 'confirmed';
    if (notes) appointment.notes = notes;
    appointment.confirmed_at = new Date();
    appointment.confirmed_by = req.user.id;

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient')
      .populate('doctor')
      .populate('department')
      .lean();

    console.log(`✅ Confirmed appointment ${appointment._id}`);

    res.json({
      success: true,
      message: 'Xác nhận lịch hẹn thành công',
      data: updatedAppointment
    });
  } catch (error) {
    console.error('❌ Confirm appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xác nhận lịch hẹn'
    });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/receptionist/appointments/:id/cancel
// @access  Private (receptionist)
export const cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn'
      });
    }

    appointment.status = 'cancelled';
    appointment.cancel_reason = reason;
    appointment.cancelled_at = new Date();
    appointment.cancelled_by = req.user.id;

    await appointment.save();

    console.log(`❌ Cancelled appointment ${appointment._id}`);

    res.json({
      success: true,
      message: 'Hủy lịch hẹn thành công'
    });
  } catch (error) {
    console.error('❌ Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hủy lịch hẹn'
    });
  }
};
