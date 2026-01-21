import express from 'express';
import {
  getAllBills,
  getBillById,
  searchBill,
  createBill,
  processPayment,
  getTransactionHistory
} from '../controllers/paymentController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all bills
router.get('/bills', getAllBills);

// Search bill
router.get('/bills/search', searchBill);

// Get bill by ID
router.get('/bills/:id', getBillById);

// Create bill
router.post('/bills', roleMiddleware(['receptionist', 'doctor']), createBill);

// Process payment
router.post('/transactions', roleMiddleware(['receptionist']), processPayment);

// Get transaction history
router.get('/transactions', getTransactionHistory);

export default router;
