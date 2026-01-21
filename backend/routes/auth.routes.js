import express from 'express';
import {
  register,
  login,
  getProfile,
  changePassword,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

export default router;
