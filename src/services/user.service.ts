import { httpClient } from '@/lib/http';
import type { User } from '@/types/auth.types';
import type {
  User as UserManagement,
  CreateUserDto,
  UpdateUserDto,
  UserListResponse,
} from '@/types/user.types';

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await httpClient.get<User>('/users/me');
    return response.data;
  },

  findAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<UserListResponse> => {
    const response = await httpClient.get<UserListResponse>('/users', {
      params,
    });
    return response.data;
  },

  findOne: async (id: string): Promise<UserManagement> => {
    const response = await httpClient.get<UserManagement>(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<UserManagement> => {
    const response = await httpClient.post<UserManagement>('/users', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<UserManagement> => {
    const response = await httpClient.patch<UserManagement>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/users/${id}`);
  },

  sendVerificationEmail: async (id: string): Promise<{ message: string }> => {
    const response = await httpClient.post<{ message: string }>(
      `/users/${id}/send-verification-email`
    );
    return response.data;
  },
};

