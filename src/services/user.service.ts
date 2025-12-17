import { httpClient } from '@/lib/http';
import type { User } from '@/types/auth.types';

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await httpClient.get<User>('/users/me');
    return response.data;
  },
};

