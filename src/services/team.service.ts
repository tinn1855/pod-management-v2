import { httpClient } from '@/lib/http';
import type {
  Team,
  CreateTeamDto,
  UpdateTeamDto,
  TeamListResponse,
} from '@/types/team.types';

export const teamService = {
  findAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<TeamListResponse> => {
    const response = await httpClient.get<TeamListResponse>('/teams', {
      params,
    });
    return response.data;
  },

  findOne: async (id: string): Promise<Team> => {
    const response = await httpClient.get<Team>(`/teams/${id}`);
    return response.data;
  },

  create: async (data: CreateTeamDto): Promise<Team> => {
    const response = await httpClient.post<Team>('/teams', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTeamDto): Promise<Team> => {
    const response = await httpClient.patch<Team>(`/teams/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/teams/${id}`);
  },
};

