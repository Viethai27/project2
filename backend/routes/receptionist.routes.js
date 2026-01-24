import express from 'express';
import {
  getPendingAppointments,
  getAppointmentDetails,
  getAvailableTimeSlots,
  confirmAppointment,
  cancelAppointment
} from '../controllers/receptionist.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get pending appointments
router.get('/pending-appointments', getPendingAppointments);

// Get appointment details
router.get('/appointments/:id', getAppointmentDetails);

// Get available time slots
router.get('/available-slots', getAvailableTimeSlots);

// Confirm appointment
router.put('/appointments/:id/confirm', confirmAppointment);

// Cancel appointment
router.put('/appointments/:id/cancel', cancelAppointment);

export default router;
