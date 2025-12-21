export interface Team {
  id: string;
  name: string;
  description?: string | null;
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamDto {
  name: string;
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
}

export interface TeamListResponse {
  data: Team[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

