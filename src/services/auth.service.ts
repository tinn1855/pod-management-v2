import { httpClient } from '@/lib/http';
import type { LoginRequest, LoginResponse } from '@/types/auth.types';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await httpClient.post('/auth/logout');
  },
};
