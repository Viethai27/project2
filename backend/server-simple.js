import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Department from './models/2. CATALOGUE_FACILYTY/Department.model.js';
import Doctor from './models/1. AUTH/Doctor.model.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Server is working!' });
});

// Departments route
app.get('/api/departments', async (req, res) => {
  try {
    console.log('Fetching departments...');
    const departments = await Department.find({}).sort({ name: 1 });
    console.log(`Found ${departments.length} departments`);
    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Doctors route
app.get('/api/doctors', async (req, res) => {
  try {
    console.log('Fetching doctors...');
    const doctors = await Doctor.find({ status: 'active' })
      .select('full_name specialty specialization email phone experience_years education avatar')
      .sort({ full_name: 1 });
    console.log(`Found ${doctors.length} doctors`);
    res.json({ success: true, data: doctors });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
