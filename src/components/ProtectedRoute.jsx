import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FullPageLoader } from './Loader';

// Role-based home pages — where each role lands when authenticated
const roleHome = {
  patient:    '/dashboard',
  emt:        '/emt',
  admin:      '/admin',
  superadmin: '/admin',
  hospital:   '/dashboard',
};

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Still verifying token / fetching user
  if (loading) return <FullPageLoader text="Verifying access..." />;

  // Not logged in → send to login, remember where they were going
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role → send them to their correct home
  if (roles.length > 0 && !roles.includes(user?.role)) {
    const home = roleHome[user?.role] || '/dashboard';
    return <Navigate to={home} replace />;
  }

  return children;
}
