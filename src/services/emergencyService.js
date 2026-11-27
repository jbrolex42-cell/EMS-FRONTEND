import api from './api';

export const emergencyService = {
  // Create a new emergency
  create: (data) => api.post('/emergency', data),

  // Get a single emergency (patient endpoint)
  getById: (id) => api.get(`/emergency/${id}`),

  // Get emergencies belonging to the logged-in patient
  getMyEmergencies: (params) =>
    api.get('/emergency/my', { params }),

  // Update emergency status
  updateStatus: (id, data) =>
    api.put(`/emergency/${id}/status`, data),

  // Rate a completed emergency
  rate: (id, data) =>
    api.post(`/emergency/${id}/rate`, data),

  // Get all emergencies (admin endpoint)
  getAllAdminEmergencies: (params) =>
    api.get('/admin/emergencies', { params }),

  // Get one emergency by ID (admin endpoint)
  getAdminEmergency: (id) =>
    api.get(`/admin/emergencies/${id}`)
};