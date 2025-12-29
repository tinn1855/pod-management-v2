export interface Platform {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  accountCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlatformDto {
  name: string;
}

export interface UpdatePlatformDto {
  name?: string;
}

export interface PlatformListResponse {
  data: Platform[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

