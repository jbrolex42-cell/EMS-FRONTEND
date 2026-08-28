import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import Home from '../pages/Home';
import Donate from '../pages/Donate';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import EmergencyRequest from '../pages/EmergencyRequest';
import Tracking from '../pages/Tracking';
import Membership from '../pages/Membership';
import Hospitals from '../pages/Hospitals';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';
import VerifyEmail from '../pages/VerifyEmail';

// Admin pages
import AdminDashboard from '../pages/AdminDashboard';
import AdminEmergencies from '../pages/admin/AdminEmergencies';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminFleet from '../pages/admin/AdminFleet';
import AdminHospitals from '../pages/admin/AdminHospitals';
import AdminMemberships from '../pages/admin/AdminMemberships';
import AdminManagement from '../pages/admin/AdminManagement';
import AdminUpdates from '../pages/admin/AdminUpdates';
import EMSUpdates from '../pages/EMSUpdates';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import KMPDCCompliance from '../pages/KMPDCCompliance';
import SHAIntegration from '../pages/SHAIntegration';

// EMT pages
import EMTDashboard from '../pages/EMTDashboard';
import EMTDispatch from '../pages/emt/EMTDispatch';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ─────────────────────────────── */}
      <Route path="/" element={<Home />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/membership" element={<Membership />} />
      <Route path="/hospitals" element={<Hospitals />} />
      <Route path="/updates" element={<EMSUpdates />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/kmpdc-compliance" element={<KMPDCCompliance />} />
      <Route path="/sha-integration" element={<SHAIntegration />} />

      {/* ── Patient Protected ───────────────────── */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/emergency" element={<ProtectedRoute><EmergencyRequest /></ProtectedRoute>} />
      <Route path="/tracking" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
      <Route path="/tracking/:id" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* ── EMT Protected ───────────────────────── */}
      <Route path="/emt" element={<ProtectedRoute roles={['emt']}><EMTDashboard /></ProtectedRoute>} />
      <Route path="/emt/dispatch" element={<ProtectedRoute roles={['emt']}><EMTDispatch /></ProtectedRoute>} />

      {/* ── Admin Protected ─────────────────────── */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin','superadmin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/emergencies" element={<ProtectedRoute roles={['admin','superadmin']}><AdminEmergencies /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin','superadmin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/fleet" element={<ProtectedRoute roles={['admin','superadmin']}><AdminFleet /></ProtectedRoute>} />
      <Route path="/admin/hospitals" element={<ProtectedRoute roles={['admin','superadmin']}><AdminHospitals /></ProtectedRoute>} />
      <Route path="/admin/memberships" element={<ProtectedRoute roles={['admin','superadmin']}><AdminMemberships /></ProtectedRoute>} />
      <Route path="/admin/manage-admins" element={<ProtectedRoute roles={['superadmin']}><AdminManagement /></ProtectedRoute>} />
      <Route path="/admin/updates" element={<ProtectedRoute roles={['admin','superadmin']}><AdminUpdates /></ProtectedRoute>} />

      {/* ── 404 ─────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
