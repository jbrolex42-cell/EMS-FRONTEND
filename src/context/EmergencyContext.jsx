import { createContext, useContext, useState } from 'react';
import { emergencyService } from '../services/emergencyService';

const EmergencyContext = createContext(null);

export const EmergencyProvider = ({ children }) => {
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(false);

  const createEmergency = async (data) => {
    setLoading(true);
    try {
      const { data: res } = await emergencyService.create(data);
      setActiveEmergency(res.emergency);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const fetchEmergency = async (id) => {
    const { data } = await emergencyService.getById(id);
    setActiveEmergency(data.emergency);
    return data.emergency;
  };

  const fetchMyEmergencies = async (params) => {
    const { data } = await emergencyService.getMyEmergencies(params);
    setEmergencies(data.emergencies);
    return data;
  };

  const clearActive = () => setActiveEmergency(null);

  return (
    <EmergencyContext.Provider value={{ activeEmergency, emergencies, loading, createEmergency, fetchEmergency, fetchMyEmergencies, clearActive, setActiveEmergency }}>
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const ctx = useContext(EmergencyContext);
  if (!ctx) throw new Error('useEmergency must be used within EmergencyProvider');
  return ctx;
};

export default EmergencyContext;
