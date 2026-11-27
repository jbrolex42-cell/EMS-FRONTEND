
import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach the access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ems_token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry
    ) {
      original._retry = true;

      try {
        const refreshToken = localStorage.getItem('ems_refresh');

        if (!refreshToken) {
          throw new Error('Refresh token not found');
        }

        const { data } = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!data?.token) {
          throw new Error('Invalid refresh response');
        }

        localStorage.setItem('ems_token', data.token);

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.token}`;

        return api(original);
      } catch (refreshError) {
        localStorage.removeItem('ems_token');
        localStorage.removeItem('ems_refresh');

        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;