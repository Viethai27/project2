import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/customer/HomeCustomer.jsx'
import CustomerLayout from './layouts/customer/customerlayout.jsx'
import Appointment from './pages/customer/Appointment.jsx'
import AuthLayout from './layouts/auth/AuthLayout.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import DoctorLayout from './layouts/doctor/DoctorLayout.jsx'
import Dashboard from './pages/doctor/Dashboard.jsx'
import Schedule from './pages/doctor/Schedule.jsx'
import PatientList from './pages/doctor/PatientList.jsx'
import MedicalRecord from './pages/doctor/MedicalRecord.jsx'
import ClinicalTest from './pages/doctor/ClinicalTest.jsx'
import Prescription from './pages/doctor/Prescription.jsx'
import Inpatient from './pages/doctor/Inpatient.jsx'
import Profile from './pages/doctor/Profile.jsx'
import ReceptionistLayout from './layouts/receptionist/ReceptionistLayout.jsx'
import ReceptionistDashboard from './pages/receptionist/Dashboard.jsx'
import PatientRegistration from './pages/receptionist/PatientRegistration.jsx'
import AppointmentRegistration from './pages/receptionist/AppointmentRegistration.jsx'
import Admission from './pages/receptionist/Admission.jsx'
import ReceptionistPatientList from './pages/receptionist/PatientList.jsx'
import Payment from './pages/receptionist/Payment.jsx'
import Notifications from './pages/receptionist/Notifications.jsx'
import ReceptionistProfile from './pages/receptionist/Profile.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
     <Box minH={"100vh"}>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
                <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
                <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
                <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />

                {/* Customer Routes */}
                <Route path="/" element={
                    <CustomerLayout>
                      <Home />
                    </CustomerLayout>
                    }
                />
                <Route  path="/appointment" element={
                    <CustomerLayout>
                      <Appointment />
                    </CustomerLayout>
                  }     
                />

                {/* Doctor Routes */}
                <Route path="/doctor" element={<DoctorLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="patients" element={<PatientList />} />
                  <Route path="medical-records" element={<MedicalRecord />} />
                  <Route path="clinical-tests" element={<ClinicalTest />} />
                  <Route path="prescriptions" element={<Prescription />} />
                  <Route path="inpatient" element={<Inpatient />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* Receptionist Routes */}
                <Route path="/receptionist" element={<ReceptionistLayout />}>
                  <Route path="dashboard" element={<ReceptionistDashboard />} />
                  <Route path="patient-registration" element={<PatientRegistration />} />
                  <Route path="appointment-registration" element={<AppointmentRegistration />} />
                  <Route path="admission" element={<Admission />} />
                  <Route path="patients" element={<ReceptionistPatientList />} />
                  <Route path="payment" element={<Payment />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="profile" element={<ReceptionistProfile />} />
                </Route>
            </Routes>

        </Box>
  )
}

export default App
