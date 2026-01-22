import express from 'express'; 
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'; 
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patient.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import departmentRoutes from './routes/department.routes.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost ports
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
const PORT = process.env.PORT || 5000;

app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', departmentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Hospital Management System API' });
});

app.listen(PORT, async () => { 
    try {
        await connectDB(); 
        console.log(`Server started at http://localhost:${PORT}`);
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
    }
});