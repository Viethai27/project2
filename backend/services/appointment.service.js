import Appointment from '../models/4. APPOINTMENT_VISIT/Appointment.model.js';
import Patient from '../models/3. PATIENT_INSURANCE/Patient.model.js';
import Doctor from '../models/1. AUTH/Doctor.model.js';
import DoctorTimeSlot from '../models/4. APPOINTMENT_VISIT/DoctorTimeSlot.model.js';

class AppointmentService {
  // Create new appointment
  async createAppointment(appointmentData) {
    const { 
      fullName,
      name, 
      email, 
      phone,
      gender,
      dateOfBirth,
      reason,
      appointmentDate, 
      timeSlot, 
      department, 
      doctor: doctorName,
      patientId, 
      doctorId, 
      slotId,
      status = 'pending'
    } = appointmentData;

    // If we have fullName or name with email and phone - create simplified appointment (for public booking)
    const patientName = fullName || name;
    
    if (patientName && email && phone) {
      const appointment = await Appointment.create({
        patient_name: patientName,
        patient_email: email,
        patient_phone: phone,
        patient_gender: gender,
        patient_dob: dateOfBirth,
        reason: reason,
        appointment_date: appointmentDate,
        time_slot: timeSlot,
        department: department,
        doctor_name: doctorName,
        status: status,
      });

      return appointment;
    }

    // Otherwise use the old logic with patientId, doctorId, slotId
    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new Error('Không tìm thấy bệnh nhân');
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new Error('Không tìm thấy bác sĩ');
    }

    // Verify time slot exists and is available
    const slot = await DoctorTimeSlot.findById(slotId);
    if (!slot) {
      throw new Error('Không tìm thấy khung giờ');
    }

    if (!slot.is_available) {
      throw new Error('Khung giờ đã đầy');
    }

    // Get queue number
    const appointmentsInSlot = await Appointment.countDocuments({ slot: slotId });
    const queue_number = appointmentsInSlot + 1;

    // Create appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      slot: slotId,
      queue_number,
      status: 'booked',
    });

    await appointment.populate(['patient', 'doctor', 'slot']);

    return appointment;
  }

  // Get appointments by patient
  async getAppointmentsByPatient(patientId) {
    const appointments = await Appointment.find({ patient: patientId })
      .populate('doctor', 'full_name specialization')
      .populate('slot')
      .sort({ booked_at: -1 });

    return appointments;
  }

  // Get appointment by ID
  async getAppointmentById(appointmentId) {
    const appointment = await Appointment.findById(appointmentId)
      .populate('patient')
      .populate('doctor', 'full_name specialization')
      .populate('slot');

    if (!appointment) {
      throw new Error('Không tìm thấy lịch hẹn');
    }

    return appointment;
  }

  // Cancel appointment
  async cancelAppointment(appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      throw new Error('Không tìm thấy lịch hẹn');
    }

    if (appointment.status === 'cancelled') {
      throw new Error('Lịch hẹn đã được hủy trước đó');
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return appointment;
  }

  // Get available time slots
  async getAvailableSlots(doctorId, date) {
    const slots = await DoctorTimeSlot.find({
      doctor: doctorId,
      date: date,
      is_available: true,
    }).sort({ start_time: 1 });

    return slots;
  }

  // Get all appointments (for staff)
  async getAllAppointments(filters = {}) {
    const appointments = await Appointment.find(filters)
      .populate('patient', 'full_name phone')
      .populate('doctor', 'full_name specialization')
      .populate('slot')
      .sort({ booked_at: -1 });

    return appointments;
  }

  // Update appointment status
  async updateAppointmentStatus(appointmentId, status) {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true, runValidators: true }
    ).populate(['patient', 'doctor', 'slot']);

    if (!appointment) {
      throw new Error('Không tìm thấy lịch hẹn');
    }

    return appointment;
  }
}

export default new AppointmentService();
