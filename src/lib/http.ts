import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authUtils } from './auth';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'https://pod-api-v2.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
// Queue to store failed requests during token refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only handle 401 errors
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const currentPath = window.location.pathname;

      // Skip refresh on login/change password pages
      if (
        currentPath === ROUTES.LOGIN ||
        currentPath === ROUTES.CHANGE_PASSWORD
      ) {
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return httpClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Mark request as retried
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = authUtils.getRefreshToken();

      // If no refresh token, redirect to login
      if (!refreshToken) {
        isRefreshing = false;
        processQueue(new Error('No refresh token available'), null);
        authUtils.clearAuth();
        if (currentPath !== ROUTES.LOGIN) {
          window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        const response = await authService.refreshToken(refreshToken);

        // Update access token in memory
        authUtils.updateTokens(response.accessToken, refreshToken);

        // Update Authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
        }

        // Process queued requests
        processQueue(null, response.accessToken);
        isRefreshing = false;

        // Retry original request
        return httpClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        isRefreshing = false;
        processQueue(refreshError as Error, null);
        authUtils.clearAuth();

        if (currentPath !== ROUTES.LOGIN) {
          window.location.href = ROUTES.LOGIN;
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
