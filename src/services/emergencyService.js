import api from './api';

export const emergencyService = {
  create: (data) => api.post('/emergency', data),
  getById: (id) => api.get(`/emergency/${id}`),
  getMyEmergencies: (params) => api.get('/emergency/my', { params }),
  updateStatus: (id, data) => api.put(`/emergency/${id}/status`, data),
  rate: (id, data) => api.post(`/emergency/${id}/rate`, data)
};
