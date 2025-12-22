export interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  mustChangePassword: boolean;
  role: {
    id: string;
    name: string;
  };
  team: {
    id: string;
    name: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password?: string;
  roleId: string;
  teamId?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
  teamId?: string;
  status?: string;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

