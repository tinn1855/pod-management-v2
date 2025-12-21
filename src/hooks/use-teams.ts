import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { teamService } from '@/services/team.service';
import type {
  Team,
  CreateTeamDto,
  UpdateTeamDto,
  TeamListResponse,
} from '@/types/team.types';

export function useTeams() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTeams = useCallback(
    async (params?: { page?: number; limit?: number }): Promise<TeamListResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await teamService.findAll(params);
        return response;
      } catch (err: unknown) {
        let errorMessage = 'Failed to fetch teams. Please try again.';

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

  const getTeam = useCallback(async (id: string): Promise<Team | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const team = await teamService.findOne(id);
      return team;
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch team. Please try again.';

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

  const createTeam = useCallback(
    async (data: CreateTeamDto): Promise<Team | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const team = await teamService.create(data);
        toast.success('Team created successfully!');
        return team;
      } catch (err: unknown) {
        let errorMessage = 'Failed to create team. Please try again.';

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

  const updateTeam = useCallback(
    async (id: string, data: UpdateTeamDto): Promise<Team | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const team = await teamService.update(id, data);
        toast.success('Team updated successfully!');
        return team;
      } catch (err: unknown) {
        let errorMessage = 'Failed to update team. Please try again.';

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

  const deleteTeam = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await teamService.delete(id);
        toast.success('Team deleted successfully!');
        return true;
      } catch (err: unknown) {
        let errorMessage = 'Failed to delete team. Please try again.';

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
    getTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    isLoading,
    error,
  };
}

