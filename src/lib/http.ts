import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authUtils } from './auth';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'https://pod-api-v2.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies (including refreshToken cookie)
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

      try {
        // Attempt to refresh token
        // Browser will automatically send refreshToken cookie
        const response = await authService.refreshToken();

        // Update access token in memory
        // RefreshToken is stored in httpOnly cookie, so we don't need to manage it
        authUtils.updateTokens(response.accessToken);

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
        isRefreshing = false;
        
        // Check if it's an axios error with response (API error)
        const isAxiosError = refreshError && typeof refreshError === 'object' && 'isAxiosError' in refreshError;
        const errorStatus = isAxiosError && (refreshError as AxiosError).response?.status;
        
        // Only logout on authentication errors (401, 403), not on network errors
        // Network errors or temporary issues should not logout the user
        if (errorStatus === 401 || errorStatus === 403) {
          // Refresh token is invalid/expired, logout
          processQueue(refreshError as Error, null);
          authUtils.clearAuth();

          if (currentPath !== ROUTES.LOGIN) {
            window.location.href = ROUTES.LOGIN;
          }
        } else {
          // Network error or other temporary issue, don't logout
          // Just reject the request so it can be retried
          processQueue(refreshError as Error, null);
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
