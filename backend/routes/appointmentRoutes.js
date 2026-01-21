import express from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getDepartments,
  getDoctorsByDepartment
} from '../controllers/appointmentController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all appointments
router.get('/', getAllAppointments);

// Get appointment by ID
router.get('/:id', getAppointmentById);

// Create appointment
router.post('/', roleMiddleware(['receptionist', 'doctor']), createAppointment);

// Update appointment
router.put('/:id', roleMiddleware(['receptionist', 'doctor']), updateAppointment);

// Cancel appointment
router.put('/:id/cancel', roleMiddleware(['receptionist', 'doctor']), cancelAppointment);

// Get departments
router.get('/meta/departments', getDepartments);

// Get doctors by department
router.get('/meta/doctors', getDoctorsByDepartment);

export default router;
