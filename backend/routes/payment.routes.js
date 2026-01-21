import express from 'express';
import {
  getBill,
  processPayment,
  getPaymentHistory,
  createInvoice,
} from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/bill', getBill);
router.post('/process', processPayment);
router.get('/history/:patientId', getPaymentHistory);
router.post('/invoice', createInvoice);

export default router;
