import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { initSocket, disconnectSocket } from '../services/socketService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('ems_token'));

  useEffect(() => {
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

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('ems_token', data.token);
    localStorage.setItem('ems_refresh', data.refreshToken);
    setToken(data.token);
    setUser(data.user);
    initSocket();
    return data;
  };

  const register = async (userData) => {
    const { data } = await authService.register(userData);
    localStorage.setItem('ems_token', data.token);
    localStorage.setItem('ems_refresh', data.refreshToken);
    setToken(data.token);
    setUser(data.user);
    initSocket();
    return data;
  };

  const logout = async () => {
    try { await authService.logout(); } catch {}
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_refresh');
    setToken(null);
    setUser(null);
    disconnectSocket();
  };

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout, updateUser, isAuthenticated: !!user }}>
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
