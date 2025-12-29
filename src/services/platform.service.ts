import { httpClient } from '@/lib/http';
import type {
  Platform,
  CreatePlatformDto,
  UpdatePlatformDto,
  PlatformListResponse,
} from '@/types/platform.types';

export const platformService = {
  findAll: async (params?: {
    page?: number;
    limit?: number;
    q?: string;
  }): Promise<PlatformListResponse> => {
    const response = await httpClient.get<PlatformListResponse>('/platforms', {
      params,
    });
    return response.data;
  },

  findOne: async (id: string): Promise<Platform> => {
    const response = await httpClient.get<Platform>(`/platforms/${id}`);
    return response.data;
  },

  create: async (data: CreatePlatformDto): Promise<Platform> => {
    const response = await httpClient.post<Platform>('/platforms', data);
    return response.data;
  },

  update: async (id: string, data: UpdatePlatformDto): Promise<Platform> => {
    const response = await httpClient.patch<Platform>(`/platforms/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/platforms/${id}`);
  },
};

