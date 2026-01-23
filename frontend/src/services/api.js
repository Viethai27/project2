import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data) => api.post('/auth/change-password', data)
};

// Patient API
export const patientAPI = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  search: (query) => api.get('/patients/search', { params: { query } }),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`)
};

// Appointment API
export const appointmentAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  getDepartments: () => api.get('/appointments/meta/departments'),
  getDoctors: (departmentId) => api.get('/appointments/meta/doctors', { params: { departmentId } })
};

// Payment API
export const paymentAPI = {
  getAllBills: (params) => api.get('/payment/bills', { params }),
  getBillById: (id) => api.get(`/payment/bills/${id}`),
  searchBill: (query) => api.get('/payment/bills/search', { params: { query } }),
  createBill: (data) => api.post('/payment/bills', data),
  processPayment: (data) => api.post('/payment/transactions', data),
  getTransactionHistory: (params) => api.get('/payment/transactions', { params })
};

// Medical Record API
export const medicalRecordAPI = {
  getAll: (params) => api.get('/medical-records', { params }),
  getById: (id) => api.get(`/medical-records/${id}`),
  create: (data) => api.post('/medical-records', data),
  update: (id, data) => api.put(`/medical-records/${id}`, data),
  addVitalSigns: (id, data) => api.put(`/medical-records/${id}/vital-signs`, data),
  addDiagnosis: (id, data) => api.put(`/medical-records/${id}/diagnosis`, data),
  addPrescription: (id, data) => api.put(`/medical-records/${id}/prescription`, data),
  addClinicalTests: (id, data) => api.put(`/medical-records/${id}/clinical-tests`, data)
};

// Doctor API
export const doctorAPI = {
  getDashboardStats: () => api.get('/doctor/dashboard/stats'),
  getUpcomingAppointments: () => api.get('/doctor/dashboard/appointments'),
  getPatients: () => api.get('/doctor/patients'),
  getAppointmentsByDate: (date) => api.get(`/doctor/appointments/date/${date}`)
};

export default api;
