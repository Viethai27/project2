import express from 'express';
import {
  getAllPatients,
  getPatientById,
  searchPatient,
  createPatient,
  updatePatient,
  deletePatient
} from '../controllers/patientController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all patients
router.get('/', getAllPatients);

// Search patient
router.get('/search', searchPatient);

// Get patient by ID
router.get('/:id', getPatientById);

// Create patient
router.post('/', roleMiddleware(['receptionist', 'doctor']), createPatient);

// Update patient
router.put('/:id', roleMiddleware(['receptionist', 'doctor']), updatePatient);

// Delete patient
router.delete('/:id', roleMiddleware(['receptionist']), deletePatient);

export default router;
