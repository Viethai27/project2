import express from 'express';
import {
  getDashboardStats,
  getUpcomingAppointments,
  getDoctorPatients,
  getAppointmentsByDate
} from '../controllers/doctor.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected (doctor only)
router.get('/dashboard/stats', protect, getDashboardStats);
router.get('/dashboard/appointments', protect, getUpcomingAppointments);
router.get('/patients', protect, getDoctorPatients);
router.get('/appointments/date/:date', protect, getAppointmentsByDate);

export default router;
