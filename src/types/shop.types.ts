export interface Shop {
  id: string;
  name: string;
  description?: string | null;
  email?: string | null;
  status?: string;
  platforms?: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShopDto {
  name: string;
  description?: string;
  email?: string;
  platformIds?: string[];
}

export interface UpdateShopDto {
  name?: string;
  description?: string;
  email?: string;
  status?: string;
  platformIds?: string[];
}

export interface ShopListResponse {
  data: Shop[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

