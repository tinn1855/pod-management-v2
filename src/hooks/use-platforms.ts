import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { platformService } from '@/services/platform.service';
import type {
  Platform,
  CreatePlatformDto,
  UpdatePlatformDto,
} from '@/types/platform.types';

export const platformKeys = {
  all: ['platforms'] as const,
  lists: () => [...platformKeys.all, 'list'] as const,
  list: (params?: { page?: number; limit?: number; q?: string }) =>
    [...platformKeys.lists(), params] as const,
  details: () => [...platformKeys.all, 'detail'] as const,
  detail: (id: string) => [...platformKeys.details(), id] as const,
};

export function usePlatforms(params?: {
  page?: number;
  limit?: number;
  q?: string;
}) {
  return useQuery({
    queryKey: platformKeys.list(params),
    queryFn: () => platformService.findAll(params),
  });
}

export function usePlatform(id: string) {
  return useQuery({
    queryKey: platformKeys.detail(id),
    queryFn: () => platformService.findOne(id),
    enabled: !!id,
  });
}

export function useCreatePlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlatformDto) => platformService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformKeys.lists() });
      toast.success('Platform created successfully!');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Failed to create platform. Please try again.';
      toast.error(errorMessage);
    },
  });
}

export function useUpdatePlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlatformDto }) =>
      platformService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: platformKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: platformKeys.detail(variables.id),
      });
      toast.success('Platform updated successfully!');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Failed to update platform. Please try again.';
      toast.error(errorMessage);
    },
  });
}

export function useDeletePlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => platformService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformKeys.lists() });
      toast.success('Platform deleted successfully!');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Failed to delete platform. Please try again.';
      toast.error(errorMessage);
    },
  });
}

