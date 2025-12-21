import { httpClient } from '@/lib/http';
import type {
  PermissionListResponse,
  PermissionResponse,
} from '@/types/role.types';

export const permissionService = {
  findAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PermissionListResponse> => {
    const response = await httpClient.get<PermissionListResponse>(
      '/permissions',
      {
        params,
      }
    );
    return response.data;
  },

  findOne: async (id: string): Promise<PermissionResponse> => {
    const response = await httpClient.get<PermissionResponse>(
      `/permissions/${id}`
    );
    return response.data;
  },
};

