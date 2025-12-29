export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  mustChangePassword: boolean;
  org: {
    id: string;
    name: string;
  };
  role: {
    id: string;
    name: string;
  };
  team: {
    id: string;
    name: string;
  } | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  tempToken?: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

