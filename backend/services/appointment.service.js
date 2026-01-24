import Appointment from '../models/4. APPOINTMENT_VISIT/Appointment.model.js';
import Patient from '../models/3. PATIENT_INSURANCE/Patient.model.js';
import Doctor from '../models/1. AUTH/Doctor.model.js';
import DoctorTimeSlot from '../models/4. APPOINTMENT_VISIT/DoctorTimeSlot.model.js';
import Department from '../models/2. CATALOGUE_FACILYTY/Department.model.js';
import mongoose from 'mongoose';

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
      appointment_date,
      timeSlot,
      time_slot,
      department, 
      doctor,
      patient: patientRef,
      patientId, 
      doctorId, 
      slotId,
      status = 'pending'
    } = appointmentData;

    // Support both camelCase and snake_case
    const finalAppointmentDate = appointmentDate || appointment_date;
    const finalTimeSlot = timeSlot || time_slot;
    const finalPatientId = patientRef || patientId;
    const finalDoctorId = doctor || doctorId;

    // Convert department name to ObjectId if needed
    let finalDepartmentId = department;
    if (department && !mongoose.Types.ObjectId.isValid(department)) {
      // Department is a name, need to find the ObjectId
      const deptDoc = await Department.findOne({ name: department });
      if (!deptDoc) {
        throw new Error(`Không tìm thấy khoa: ${department}`);
      }
      finalDepartmentId = deptDoc._id;
      console.log(`🏥 Converted department "${department}" to ID: ${finalDepartmentId}`);
    }

    console.log('📋 Creating appointment with:', {
      patient: finalPatientId,
      doctor: finalDoctorId,
      date: finalAppointmentDate,
      time: finalTimeSlot,
      department: finalDepartmentId,
      publicBooking: !!(fullName || name)
    });

    // If we have patient ID and doctor ID (receptionist booking)
    if (finalPatientId && finalDoctorId && finalAppointmentDate && finalTimeSlot) {
      // Verify patient exists
      const patient = await Patient.findById(finalPatientId);
      if (!patient) {
        throw new Error('Không tìm thấy bệnh nhân');
      }

      // Verify doctor exists
      const doctor = await Doctor.findById(finalDoctorId);
      if (!doctor) {
        throw new Error('Không tìm thấy bác sĩ');
      }

      // Create appointment with patient and doctor references
      const appointment = await Appointment.create({
        patient: finalPatientId,
        doctor: finalDoctorId,
        appointment_date: finalAppointmentDate,
        time_slot: finalTimeSlot,
        department: finalDepartmentId,
        reason: reason || 'Khám bệnh',
        status: status,
      });

      await appointment.populate(['patient', 'doctor']);
      
      console.log('✅ Appointment created:', appointment._id);
      return appointment;
    }

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
        appointment_date: finalAppointmentDate,
        time_slot: finalTimeSlot,
        department: finalDepartmentId,
        doctor: finalDoctorId, // Save doctor ID instead of name
        status: status,
      });

      console.log('✅ Public appointment created:', appointment._id);
      return appointment;
    }

    // Old logic with slotId
    if (!slotId) {
      throw new Error('Thiếu thông tin đặt lịch. Vui lòng chọn bệnh nhân, bác sĩ, ngày và giờ khám.');
    }

    // Verify patient exists
    const patientDoc = await Patient.findById(finalPatientId);
    if (!patientDoc) {
      throw new Error('Không tìm thấy bệnh nhân');
    }

    // Verify doctor exists
    const doctorDoc = await Doctor.findById(finalDoctorId);
    if (!doctorDoc) {
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
      patient: finalPatientId,
      doctor: finalDoctorId,
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
