import { httpClient } from '@/lib/http';
import type {
  Board,
  CreateBoardDto,
  UpdateBoardDto,
  BoardListResponse,
} from '@/types/board.types';

export const boardService = {
  findAll: async (params?: {
    page?: number;
    limit?: number;
    q?: string;
  }): Promise<BoardListResponse> => {
    const response = await httpClient.get<BoardListResponse>('/boards', {
      params,
    });
    return response.data;
  },

  findOne: async (id: string): Promise<Board> => {
    const response = await httpClient.get<Board>(`/boards/${id}`);
    return response.data;
  },

  create: async (data: CreateBoardDto): Promise<Board> => {
    const response = await httpClient.post<Board>('/boards', data);
    return response.data;
  },

  update: async (id: string, data: UpdateBoardDto): Promise<Board> => {
    const response = await httpClient.patch<Board>(`/boards/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/boards/${id}`);
  },
};

