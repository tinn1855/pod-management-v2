import axios from 'axios';
import { authUtils } from './auth';
import { ROUTES } from './constants';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'https://pod-api-v2.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = authUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Chỉ redirect nếu không đang ở trang login
      if (currentPath !== ROUTES.LOGIN) {
        authUtils.clearAuth();
        // Use window.location for hard redirect to clear any React state
        window.location.href = ROUTES.LOGIN;
      }
    }
    return Promise.reject(error);
  }
);
