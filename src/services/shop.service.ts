import { httpClient } from '@/lib/http';
import type {
  Shop,
  CreateShopDto,
  UpdateShopDto,
  ShopListResponse,
} from '@/types/shop.types';

export const shopService = {
  findAll: async (params?: {
    page?: number;
    limit?: number;
    q?: string;
    platformId?: string;
  }): Promise<ShopListResponse> => {
    const response = await httpClient.get<ShopListResponse>('/shops', {
      params,
    });
    return response.data;
  },

  findOne: async (id: string): Promise<Shop> => {
    const response = await httpClient.get<Shop>(`/shops/${id}`);
    return response.data;
  },

  create: async (data: CreateShopDto): Promise<Shop> => {
    const response = await httpClient.post<Shop>('/shops', data);
    return response.data;
  },

  update: async (id: string, data: UpdateShopDto): Promise<Shop> => {
    const response = await httpClient.patch<Shop>(`/shops/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/shops/${id}`);
  },

  deleteMany: async (ids: string[]): Promise<void> => {
    // Since API only supports single delete, we'll delete each shop sequentially
    // Using Promise.allSettled to handle partial failures gracefully
    const results = await Promise.allSettled(
      ids.map((id) => shopService.delete(id))
    );
    
    // Check if all deletions succeeded
    const failures = results.filter((result) => result.status === 'rejected');
    if (failures.length > 0) {
      const error = failures[0] as PromiseRejectedResult;
      throw new Error(
        error.reason?.response?.data?.message ||
          error.reason?.message ||
          `Failed to delete ${failures.length} of ${ids.length} shops`
      );
    }
  },
};

