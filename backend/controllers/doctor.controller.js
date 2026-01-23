import Doctor from '../models/1. AUTH/Doctor.model.js';
import Appointment from '../models/4. APPOINTMENT_VISIT/Appointment.model.js';

// @desc    Get doctor dashboard statistics
// @route   GET /api/doctor/dashboard/stats
// @access  Private (Doctor only)
export const getDashboardStats = async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    // Find doctor by user ID
    const doctor = await Doctor.findOne({ user: doctorId });
    if (!doctor) {
      return res.json({
        success: true,
        data: {
          todayPatients: 0,
          waitingPatients: 0,
          totalPatients: 0,
          checkedInToday: 0
        }
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's appointments count
    const todayAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      appointment_date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Get waiting appointments count (status: pending or confirmed)
    const waitingAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      status: { $in: ['pending', 'confirmed'] },
      appointment_date: {
        $gte: today
      }
    });

    // Get total patients (unique)
    const allAppointments = await Appointment.find({ doctor: doctor._id });
    const uniquePatients = new Set();
    allAppointments.forEach(apt => {
      if (apt.patient) {
        uniquePatients.add(apt.patient.toString());
      } else if (apt.patient_phone) {
        uniquePatients.add(apt.patient_phone);
      }
    });

    // Get checked-in today
    const checkedInToday = await Appointment.countDocuments({
      doctor: doctor._id,
      status: 'checked_in',
      appointment_date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    res.json({
      success: true,
      data: {
        todayPatients: todayAppointments,
        waitingPatients: waitingAppointments,
        totalPatients: uniquePatients.size,
        checkedInToday: checkedInToday
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thống kê dashboard'
    });
  }
};

// @desc    Get doctor's upcoming appointments
// @route   GET /api/doctor/dashboard/appointments
// @access  Private (Doctor only)
export const getUpcomingAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    // Find doctor by user ID
    const doctor = await Doctor.findOne({ user: doctorId });
    if (!doctor) {
      return res.json({
        success: true,
        data: []
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's appointments with populated patient data
    const appointments = await Appointment.find({
      doctor: doctor._id,
      appointment_date: {
        $gte: today
      },
      status: { $in: ['pending', 'confirmed', 'checked_in'] }
    })
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'fullName phone'
      }
    })
    .sort({ appointment_date: 1, time_slot: 1 })
    .limit(10);

    // Format appointments to match frontend expectations
    const formattedAppointments = appointments.map(apt => ({
      _id: apt._id,
      timeSlot: apt.time_slot || '00:00',
      reason: apt.reason || 'Khám bệnh',
      status: apt.status,
      appointmentDate: apt.appointment_date,
      patientId: apt.patient ? {
        userId: {
          fullName: apt.patient?.user?.fullName || apt.patient_name || 'Chưa có thông tin'
        }
      } : {
        userId: {
          fullName: apt.patient_name || 'Chưa có thông tin'
        }
      }
    }));

    res.json({
      success: true,
      data: formattedAppointments
    });
  } catch (error) {
    console.error('Error getting upcoming appointments:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách lịch hẹn'
    });
  }
};

// @desc    Get doctor's patients
// @route   GET /api/doctor/patients
// @access  Private (Doctor only)
export const getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    // Find doctor by user ID
    const doctor = await Doctor.findOne({ user: doctorId });
    if (!doctor) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Get all appointments of this doctor
    const appointments = await Appointment.find({
      doctor: doctor._id
    })
    .sort({ appointment_date: -1 });

    // Extract unique patients
    const patientsMap = new Map();
    
    for (const apt of appointments) {
      let patientKey;
      let patientData;
      
      if (apt.patient) {
        // Patient with account
        patientKey = apt.patient.toString();
      } else if (apt.patient_phone) {
        // Patient without account (walk-in)
        patientKey = apt.patient_phone;
      } else {
        continue;
      }

      if (!patientsMap.has(patientKey)) {
        // Calculate age from DOB
        let age = 'N/A';
        if (apt.patient_dob) {
          const dob = new Date(apt.patient_dob);
          age = new Date().getFullYear() - dob.getFullYear();
        }

        patientData = {
          _id: apt.patient || apt._id,
          patientName: apt.patient_name || 'Chưa có tên',
          age: age,
          gender: apt.patient_gender === 'female' ? 'Nữ' : apt.patient_gender === 'male' ? 'Nam' : 'Khác',
          phone: apt.patient_phone || 'Chưa có SĐT',
          type: 'Ngoại trú',
          lastVisit: apt.appointment_date,
          appointmentCount: 1
        };
        patientsMap.set(patientKey, patientData);
      } else {
        // Increment appointment count
        const existingPatient = patientsMap.get(patientKey);
        existingPatient.appointmentCount += 1;
        
        // Update last visit if this appointment is more recent
        if (apt.appointment_date > existingPatient.lastVisit) {
          existingPatient.lastVisit = apt.appointment_date;
        }
      }
    }

    const patients = Array.from(patientsMap.values());

    res.json({
      success: true,
      data: patients
    });
  } catch (error) {
    console.error('Error getting doctor patients:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách bệnh nhân'
    });
  }
};

// @desc    Get doctor appointments by date
// @route   GET /api/doctor/appointments/date/:date
// @access  Private (Doctor only)
export const getAppointmentsByDate = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { date } = req.params;
    
    // Find doctor by user ID
    const doctor = await Doctor.findOne({ user: doctorId });
    if (!doctor) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Parse the date
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get appointments for the selected date
    const appointments = await Appointment.find({
      doctor: doctor._id,
      appointment_date: {
        $gte: selectedDate,
        $lt: nextDay
      }
    }).sort({ time_slot: 1 });

    // Format appointments
    const formattedAppointments = appointments.map(apt => ({
      _id: apt._id,
      time: apt.time_slot || 'N/A',
      patientName: apt.patient_name || 'Chưa có tên',
      patientId: apt.patient_phone || 'N/A',
      type: apt.reason || 'Khám bệnh',
      status: apt.status === 'checked_in' ? 'Hoàn thành' : 
              apt.status === 'confirmed' ? 'Chờ khám' : 
              apt.status === 'pending' ? 'Chờ khám' :
              apt.status === 'cancelled' ? 'Đã hủy' : 'Chờ khám',
      room: 'Phòng Khám Sản',
      appointmentDate: apt.appointment_date
    }));

    res.json({
      success: true,
      data: formattedAppointments
    });
  } catch (error) {
    console.error('Error getting appointments by date:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách lịch hẹn'
    });
  }
};
