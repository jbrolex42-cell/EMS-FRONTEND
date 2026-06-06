import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-ems-black flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role → redirect to their correct dashboard
  if (roles && !roles.includes(user.role)) {
    const roleHome = {
      admin:      '/admin',
      superadmin: '/admin',
      emt:        '/emt',
      patient:    '/dashboard'
    };
    return <Navigate to={roleHome[user.role] || '/dashboard'} replace />;
  }

  return children;
}
