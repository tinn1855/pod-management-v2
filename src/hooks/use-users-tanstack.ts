import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: { page?: number; limit?: number }) =>
    [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useUsersList(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.findAll(params),
  });
}

