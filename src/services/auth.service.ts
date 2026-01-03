import axios from 'axios';
import { httpClient } from '@/lib/http';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '@/types/auth.types';

// Create a separate axios instance for refresh token to avoid interceptor loop
// and ensure withCredentials is properly configured
const refreshTokenClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'https://pod-api-v2.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CRITICAL: Must be true to send HttpOnly cookies
});

// Global flag to prevent multiple simultaneous refresh token calls
let isRefreshingToken = false;
let refreshTokenPromise: Promise<RefreshTokenResponse> | null = null;

export interface ChangePasswordRequest {
  newPassword: string;
}

export interface ChangePasswordResponse {
  requiresPasswordChange: boolean;
  tempToken: string;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    status: string;
    mustChangePassword: boolean;
    org: {
      id: string;
      name: string;
    };
    role: {
      id: string;
      name: string;
    };
    team: {
      id: string;
      name: string;
    } | null;
  };
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ResendVerificationEmailResponse {
  message: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await httpClient.post('/auth/logout');
  },
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> => {
    const response = await httpClient.post<ChangePasswordResponse>(
      '/auth/change-password',
      data
    );
    return response.data;
  },
  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<VerifyEmailResponse> => {
    const response = await httpClient.post<VerifyEmailResponse>(
      '/auth/verify-email',
      data
    );
    return response.data;
  },
  resendVerificationEmail:
    async (): Promise<ResendVerificationEmailResponse> => {
      const response = await httpClient.post<ResendVerificationEmailResponse>(
        '/auth/resend-verification-email'
      );
      return response.data;
    },
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    // If already refreshing, return the existing promise to avoid duplicate calls
    if (isRefreshingToken && refreshTokenPromise) {
      return refreshTokenPromise;
    }

    // Set flag and create promise
    isRefreshingToken = true;

    // Create the refresh promise
    refreshTokenPromise = refreshTokenClient
      .post<RefreshTokenResponse>('/auth/refresh', {}) // Empty body - refresh token is in cookie
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        // Reset on error so it can be retried
        refreshTokenPromise = null;
        throw error;
      })
      .finally(() => {
        isRefreshingToken = false;
      });

    try {
      return await refreshTokenPromise;
    } catch (error: unknown) {
      // Log error for debugging
      if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as import('axios').AxiosError;
        const errorData = axiosError.response?.data as
          | { message?: string }
          | undefined;

        console.error('❌ Refresh token failed:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          message: errorData?.message || axiosError.message,
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          headers: {
            'Content-Type': axiosError.config?.headers?.['Content-Type'],
            withCredentials: axiosError.config?.withCredentials,
          },
        });

        // If cookie not found, it's likely a SameSite issue
        if (axiosError.response?.status === 401) {
          const errorMessage = errorData?.message?.toLowerCase() || '';
          if (errorMessage.includes('refresh token not found')) {
            console.error('');
            console.error('⚠️ CRITICAL: Cookie not being sent to server!');
            console.error('');
            console.error('🔍 Root Cause:');
            console.error(
              '   Cookie has SameSite=Lax which blocks cross-origin POST requests'
            );
            console.error('   Frontend:', window.location.origin);
            console.error(
              '   Backend:',
              new URL(refreshTokenClient.defaults.baseURL || '').origin
            );
            console.error('   These are different origins (cross-origin)');
            console.error('');
            console.error('📋 Verification Steps:');
            console.error('   1. Open DevTools > Network tab');
            console.error('   2. Find the /auth/refresh request');
            console.error('   3. Check Request Headers section');
            console.error('   4. Look for "Cookie" header');
            console.error(
              '   → If Cookie header is MISSING, SameSite=Lax is blocking it'
            );
            console.error('');
            console.error('🔧 SOLUTION (Backend must fix):');
            console.error('   Backend needs to set cookie with:');
            console.error('   - SameSite=None (allows cross-origin)');
            console.error('   - Secure=true (required when SameSite=None)');
            console.error('');
            console.error('   Example backend code:');
            console.error('   res.cookie("refresh_token", token, {');
            console.error('     httpOnly: true,');
            console.error('     secure: true,');
            console.error('     sameSite: "none",');
            console.error('     domain: "pod-api-v2.onrender.com",');
            console.error('     path: "/",');
            console.error('     maxAge: 7 * 24 * 60 * 60 * 1000');
            console.error('   });');
            console.error('');
            console.error(
              '⚠️ Note: Frontend code is correct. This is a backend cookie configuration issue.'
            );
          }
        }
      }

      throw error;
    }
  },
};
