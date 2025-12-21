export interface Permission {
  id: string;
  name: string;
}

export interface PermissionInRole {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  permissions: PermissionInRole[];
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface AssignPermissionsDto {
  permissionIds: string[];
}

export interface RoleListResponse {
  data: Role[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PermissionResponse {
  id: string;
  name: string;
  roles?: Array<{
    id: string;
    name: string;
  }>;
  roleCount?: number;
}

export interface PermissionListResponse {
  data: PermissionResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

