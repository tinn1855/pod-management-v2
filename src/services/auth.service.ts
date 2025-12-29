import axios from 'axios';
import { httpClient } from '@/lib/http';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '@/types/auth.types';

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
  verifyEmail: async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    const response = await httpClient.post<VerifyEmailResponse>(
      '/auth/verify-email',
      data
    );
    return response.data;
  },
  resendVerificationEmail: async (): Promise<ResendVerificationEmailResponse> => {
    const response = await httpClient.post<ResendVerificationEmailResponse>(
      '/auth/resend-verification-email'
    );
    return response.data;
  },
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    // Use axios directly to avoid interceptor loop
    const response = await axios.post<RefreshTokenResponse>(
      `${import.meta.env.VITE_BASE_URL || 'https://pod-api-v2.onrender.com'}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
};
