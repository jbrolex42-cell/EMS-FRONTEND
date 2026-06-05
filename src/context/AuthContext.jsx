import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { initSocket, disconnectSocket } from '../services/socketService';

const AuthContext = createContext(null);

// Role-based redirect map — single source of truth
export const ROLE_HOME = {
  patient:    '/dashboard',
  emt:        '/emt',
  admin:      '/admin',
  superadmin: '/admin',
  hospital:   '/dashboard',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: if a token exists in localStorage, verify it with the server
  useEffect(() => {
    const token = localStorage.getItem('ems_token');
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async () => {
    try {
      const { data } = await authService.getMe();
      setUser(data.user);
      initSocket();
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  // Login — returns { user, token } so callers can read user.role for redirect
  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('ems_token', data.token);
    localStorage.setItem('ems_refresh', data.refreshToken);
    setUser(data.user);
    initSocket();
    return data;   // ← caller uses data.user.role to navigate
  };

  // Register
  const register = async (userData) => {
    const { data } = await authService.register(userData);
    localStorage.setItem('ems_token', data.token);
    localStorage.setItem('ems_refresh', data.refreshToken);
    setUser(data.user);
    initSocket();
    return data;
  };

  const logout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_refresh');
    setUser(null);
    disconnectSocket();
  };

  const updateUser = (updates) =>
    setUser(prev => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUser,
      isAuthenticated: !!user,
      // token still accessible from localStorage directly by api.js interceptor
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
