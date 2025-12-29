import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { boardService } from '@/services/board.service';
import type {
  Board,
  CreateBoardDto,
  UpdateBoardDto,
} from '@/types/board.types';

export const boardKeys = {
  all: ['boards'] as const,
  lists: () => [...boardKeys.all, 'list'] as const,
  list: (params?: { page?: number; limit?: number; q?: string }) =>
    [...boardKeys.lists(), params] as const,
  details: () => [...boardKeys.all, 'detail'] as const,
  detail: (id: string) => [...boardKeys.details(), id] as const,
};

export function useBoards(params?: {
  page?: number;
  limit?: number;
  q?: string;
}) {
  return useQuery({
    queryKey: boardKeys.list(params),
    queryFn: () => boardService.findAll(params),
  });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: boardKeys.detail(id),
    queryFn: () => boardService.findOne(id),
    enabled: !!id,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBoardDto) => boardService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
      toast.success('Board created successfully!');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Failed to create board. Please try again.';
      toast.error(errorMessage);
    },
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardDto }) =>
      boardService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: boardKeys.detail(variables.id),
      });
      toast.success('Board updated successfully!');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Failed to update board. Please try again.';
      toast.error(errorMessage);
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => boardService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
      toast.success('Board deleted successfully!');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message ||
        error.message ||
        'Failed to delete board. Please try again.';
      toast.error(errorMessage);
    },
  });
}

