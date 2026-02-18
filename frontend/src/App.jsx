import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import NurseDashboard from './pages/NurseDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientPortal from './pages/PatientPortal';
import ShiftSignOff from './pages/ShiftSignOff';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute roles={['Nurse']} />}>
            <Route path="/nurse" element={<NurseDashboard />} />
            <Route path="/handoff/:patientId" element={<ShiftSignOff />} />
          </Route>

          <Route element={<ProtectedRoute roles={['Doctor']} />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
          </Route>

          <Route element={<ProtectedRoute roles={['Patient']} />}>
            <Route path="/patient" element={<PatientPortal />} />
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}