import express from 'express';
import {
    getAllDepartments,
    getAllDoctors,
    getDoctorsBySpecialty,
    getDoctorById
} from '../controllers/department.controller.js';

const router = express.Router();

// Department routes
router.get('/departments', getAllDepartments);

// Doctor routes
router.get('/doctors', getAllDoctors);
router.get('/doctors/specialty/:specialty', getDoctorsBySpecialty);
router.get('/doctors/:id', getDoctorById);

export default router;
