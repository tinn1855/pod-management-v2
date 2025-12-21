import { httpClient } from '@/lib/http';
import type {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  AssignPermissionsDto,
  RoleListResponse,
} from '@/types/role.types';

export const roleService = {
  findAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<RoleListResponse> => {
    const response = await httpClient.get<RoleListResponse>('/roles', {
      params,
    });
    return response.data;
  },

  findOne: async (id: string): Promise<Role> => {
    const response = await httpClient.get<Role>(`/roles/${id}`);
    return response.data;
  },

  create: async (data: CreateRoleDto): Promise<Role> => {
    const response = await httpClient.post<Role>('/roles', data);
    return response.data;
  },

  update: async (id: string, data: UpdateRoleDto): Promise<Role> => {
    const response = await httpClient.patch<Role>(`/roles/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/roles/${id}`);
  },

  assignPermissions: async (
    id: string,
    data: AssignPermissionsDto
  ): Promise<Role> => {
    const response = await httpClient.patch<Role>(
      `/roles/${id}/permissions`,
      data
    );
    return response.data;
  },
};

