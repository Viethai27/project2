import express from 'express';
import {
  getAllMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  addVitalSigns,
  addDiagnosis,
  addPrescription,
  addClinicalTests
} from '../controllers/medicalRecordController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and doctor role
router.use(authMiddleware);

// Get all medical records
router.get('/', roleMiddleware(['doctor', 'receptionist']), getAllMedicalRecords);

// Get medical record by ID
router.get('/:id', roleMiddleware(['doctor', 'receptionist']), getMedicalRecordById);

// Create medical record
router.post('/', roleMiddleware(['doctor']), createMedicalRecord);

// Update medical record
router.put('/:id', roleMiddleware(['doctor']), updateMedicalRecord);

// Add vital signs
router.put('/:id/vital-signs', roleMiddleware(['doctor']), addVitalSigns);

// Add diagnosis
router.put('/:id/diagnosis', roleMiddleware(['doctor']), addDiagnosis);

// Add prescription
router.put('/:id/prescription', roleMiddleware(['doctor']), addPrescription);

// Add clinical tests
router.put('/:id/clinical-tests', roleMiddleware(['doctor']), addClinicalTests);

export default router;
