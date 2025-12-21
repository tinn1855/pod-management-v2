import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { roleService } from '@/services/role.service';
import type {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  AssignPermissionsDto,
  RoleListResponse,
} from '@/types/role.types';

export function useRoles() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRoles = useCallback(
    async (params?: { page?: number; limit?: number }): Promise<RoleListResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await roleService.findAll(params);
        return response;
      } catch (err: unknown) {
        let errorMessage = 'Failed to fetch roles. Please try again.';

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

  const getRole = useCallback(async (id: string): Promise<Role | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const role = await roleService.findOne(id);
      return role;
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch role. Please try again.';

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
  }, []);

  const createRole = useCallback(
    async (data: CreateRoleDto): Promise<Role | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const role = await roleService.create(data);
        toast.success('Role created successfully!');
        return role;
      } catch (err: unknown) {
        let errorMessage = 'Failed to create role. Please try again.';

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

  const updateRole = useCallback(
    async (id: string, data: UpdateRoleDto): Promise<Role | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const role = await roleService.update(id, data);
        toast.success('Role updated successfully!');
        return role;
      } catch (err: unknown) {
        let errorMessage = 'Failed to update role. Please try again.';

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

  const deleteRole = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await roleService.delete(id);
        toast.success('Role deleted successfully!');
        return true;
      } catch (err: unknown) {
        let errorMessage = 'Failed to delete role. Please try again.';

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
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const assignPermissions = useCallback(
    async (id: string, data: AssignPermissionsDto): Promise<Role | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const role = await roleService.assignPermissions(id, data);
        toast.success('Permissions assigned successfully!');
        return role;
      } catch (err: unknown) {
        let errorMessage = 'Failed to assign permissions. Please try again.';

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
    getRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
    isLoading,
    error,
  };
}

