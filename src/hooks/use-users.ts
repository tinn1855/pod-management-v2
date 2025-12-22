import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { userService } from '@/services/user.service';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserListResponse,
} from '@/types/user.types';

export function useUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = useCallback(
    async (params?: { page?: number; limit?: number }): Promise<UserListResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await userService.findAll(params);
        return response;
      } catch (err: unknown) {
        let errorMessage = 'Failed to fetch users. Please try again.';

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

  const getUser = useCallback(async (id: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await userService.findOne(id);
      return user;
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch user. Please try again.';

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

  const createUser = useCallback(
    async (data: CreateUserDto): Promise<User | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const user = await userService.create(data);
        toast.success('User created successfully!');
        return user;
      } catch (err: unknown) {
        let errorMessage = 'Failed to create user. Please try again.';

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

  const updateUser = useCallback(
    async (id: string, data: UpdateUserDto): Promise<User | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const user = await userService.update(id, data);
        toast.success('User updated successfully!');
        return user;
      } catch (err: unknown) {
        let errorMessage = 'Failed to update user. Please try again.';

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

  const deleteUser = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await userService.delete(id);
        toast.success('User deleted successfully!');
        return true;
      } catch (err: unknown) {
        let errorMessage = 'Failed to delete user. Please try again.';

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

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    isLoading,
    error,
  };
}

