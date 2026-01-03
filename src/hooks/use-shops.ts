import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { shopService } from '@/services/shop.service';
import type {
  Shop,
  CreateShopDto,
  UpdateShopDto,
} from '@/types/shop.types';

export const shopKeys = {
  all: ['shops'] as const,
  lists: () => [...shopKeys.all, 'list'] as const,
  list: (params?: { page?: number; limit?: number; q?: string; platformId?: string }) =>
    [...shopKeys.lists(), params] as const,
  details: () => [...shopKeys.all, 'detail'] as const,
  detail: (id: string) => [...shopKeys.details(), id] as const,
};

export function useShops(params?: {
  page?: number;
  limit?: number;
  q?: string;
  platformId?: string;
}) {
  return useQuery({
    queryKey: shopKeys.list(params),
    queryFn: () => shopService.findAll(params),
  });
}

export function useShop(
  id: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: shopKeys.detail(id),
    queryFn: () => shopService.findOne(id),
    enabled: !!id && (options?.enabled !== false),
  });
}

export function useCreateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShopDto) => shopService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.lists() });
      toast.success('Shop created successfully!');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Failed to create shop. Please try again.';
      toast.error(errorMessage);
    },
  });
}

export function useUpdateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShopDto }) =>
      shopService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shopKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: shopKeys.detail(variables.id),
      });
      toast.success('Shop updated successfully!');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Failed to update shop. Please try again.';
      toast.error(errorMessage);
    },
  });
}

export function useDeleteShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shopService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.lists() });
      toast.success('Shop deleted successfully!');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Failed to delete shop. Please try again.';
      toast.error(errorMessage);
    },
  });
}

export function useDeleteShops() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => shopService.deleteMany(ids),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shopKeys.lists() });
      const count = variables.length;
      toast.success(
        `${count} shop${count > 1 ? 's' : ''} deleted successfully!`
      );
    },
    onError: (error: AxiosError | Error) => {
      const errorMessage =
        ((error as AxiosError).response?.data as any)?.message ||
        error.message ||
        'Failed to delete shops. Please try again.';
      toast.error(errorMessage);
    },
  });
}

