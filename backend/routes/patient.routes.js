import express from 'express';
import {
  searchPatient,
  createPatient,
  getPatientById,
  updatePatient,
  getAllPatients,
} from '../controllers/patient.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Search must come before /:id to avoid route conflict
router.get('/search', searchPatient);
router.get('/', getAllPatients);
router.post('/', createPatient);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);

export default router;
