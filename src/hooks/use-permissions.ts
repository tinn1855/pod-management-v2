import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { permissionService } from '@/services/permission.service';
import type {
  PermissionListResponse,
  PermissionResponse,
} from '@/types/role.types';

export function usePermissions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPermissions = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
    }): Promise<PermissionListResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await permissionService.findAll(params);
        return response;
      } catch (err: unknown) {
        let errorMessage = 'Failed to fetch permissions. Please try again.';

        if (err instanceof AxiosError) {
          errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message || errorMessage;
        }

        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getPermission = useCallback(
    async (id: string): Promise<PermissionResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const permission = await permissionService.findOne(id);
        return permission;
      } catch (err: unknown) {
        let errorMessage = 'Failed to fetch permission. Please try again.';

        if (err instanceof AxiosError) {
          errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message || errorMessage;
        }

        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    getPermissions,
    getPermission,
    isLoading,
    error,
  };
}

