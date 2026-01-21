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

router.get('/search', searchPatient);
router.post('/', createPatient);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.get('/', getAllPatients);

export default router;
