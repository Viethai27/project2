import express from 'express';
import {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  getAvailableSlots,
  getAllAppointments,
  updateAppointmentStatus,
} from '../controllers/appointment.controller.js';
import { getDepartments, getDoctorsByDepartment } from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Meta endpoints (protected)
router.get('/meta/departments', protect, getDepartments);
router.get('/meta/doctors', protect, getDoctorsByDepartment);

// Public route for customer appointment booking
router.post('/', createAppointment);

// Protected routes
router.use(protect);

router.get('/my-appointments', getMyAppointments);
router.get('/available-slots', getAvailableSlots);
router.get('/all', getAllAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/status', updateAppointmentStatus);

export default router;
