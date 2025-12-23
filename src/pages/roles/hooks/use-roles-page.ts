import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRoles } from '@/hooks/use-roles';
import { usePermissions } from '@/hooks/use-permissions';
import { useUsers } from '@/hooks/use-users';
import { PAGINATION } from '@/constants';
import {
  createRoleSchema,
  updateRoleSchema,
  assignPermissionsSchema,
  type CreateRoleFormData,
  type UpdateRoleFormData,
  type AssignPermissionsFormData,
} from '@/schemas/role.schema';
import type { Role, PermissionResponse } from '@/types/role.types';
import type { User } from '@/types/user.types';

export function useRolesPage() {
  const {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
    isLoading,
  } = useRoles();
  const { getPermissions } = usePermissions();
  const { getUsers, updateUser } = useUsers();

  const [roles, setRoles] = useState<Role[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    []
  );

  const createForm = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const updateForm = useForm<UpdateRoleFormData>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const permissionsForm = useForm<AssignPermissionsFormData>({
    resolver: zodResolver(assignPermissionsSchema),
    defaultValues: {
      permissionIds: [],
    },
  });

  const loadRoles = async (page = 1) => {
    const response = await getRoles({ page, limit: pagination.limit });
    if (response) {
      setRoles(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    }
    setIsInitialLoading(false);
  };

  const loadPermissions = async () => {
    const response = await getPermissions({ limit: 100 });
    if (response) {
      setPermissions(response.data);
    }
  };

  const loadAllRoles = async () => {
    const allData: Role[] = [];
    let currentPage = 1;
    const maxLimit = PAGINATION.API_MAX_LIMIT;
    let hasMore = true;

    while (hasMore) {
      const response = await getRoles({
        page: currentPage,
        limit: maxLimit,
      });
      if (response && response.data.length > 0) {
        allData.push(...response.data);
        hasMore = currentPage < response.totalPages;
        currentPage++;
      } else {
        hasMore = false;
      }
    }

    setAllRoles(allData);
  };

  const loadAllUsers = async () => {
    setIsLoadingUsers(true);
    const allData: User[] = [];
    let currentPage = 1;
    const maxLimit = PAGINATION.API_MAX_LIMIT;
    let hasMore = true;

    while (hasMore) {
      const response = await getUsers({
        page: currentPage,
        limit: maxLimit,
      });
      if (response && response.data.length > 0) {
        allData.push(...response.data);
        hasMore = currentPage < response.totalPages;
        currentPage++;
      } else {
        hasMore = false;
      }
    }

    setAllUsers(allData);
    setIsLoadingUsers(false);
  };

  const handleUpdateUserRole = async (userId: string, roleId: string) => {
    const user = await updateUser(userId, { roleId });
    if (user) {
      // Refresh users list
      await loadAllUsers();
      // Refresh roles list to update user counts
      loadRoles();
    }
  };

  useEffect(() => {
    setIsInitialLoading(true);
    loadRoles();
    loadPermissions();
    loadAllRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (data: CreateRoleFormData) => {
    const role = await createRole(data);
    if (role) {
      setIsCreateOpen(false);
      createForm.reset();
      loadRoles();
    }
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    updateForm.reset({
      name: role.name,
      description: role.description || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (data: UpdateRoleFormData) => {
    if (!selectedRole) return;
    const role = await updateRole(selectedRole.id, data);
    if (role) {
      setIsEditOpen(false);
      setSelectedRole(null);
      updateForm.reset();
      loadRoles();
    }
  };

  const handleDeleteClick = (id: string) => {
    setRoleToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;
    const success = await deleteRole(roleToDelete);
    if (success) {
      setIsDeleteOpen(false);
      setRoleToDelete(null);
      loadRoles();
    }
  };

  const handleViewDetail = (role: Role) => {
    setSelectedRole(role);
    setIsDetailOpen(true);
    loadAllUsers();
  };

  const handleOpenPermissions = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissionIds(role.permissions.map((p) => p.id));
    permissionsForm.reset({
      permissionIds: role.permissions.map((p) => p.id),
    });
    setIsPermissionsOpen(true);
  };

  const handleAssignPermissions = async (data: AssignPermissionsFormData) => {
    if (!selectedRole) return;
    const role = await assignPermissions(selectedRole.id, data);
    if (role) {
      setIsPermissionsOpen(false);
      setSelectedRole(null);
      loadRoles();
    }
  };

  const togglePermission = (permissionId: string) => {
    const newIds = selectedPermissionIds.includes(permissionId)
      ? selectedPermissionIds.filter((id) => id !== permissionId)
      : [...selectedPermissionIds, permissionId];
    setSelectedPermissionIds(newIds);
    permissionsForm.setValue('permissionIds', newIds);
  };

  return {
    // Data
    roles,
    allRoles,
    allUsers,
    permissions,
    pagination,
    selectedRole,
    roleToDelete,
    selectedPermissionIds,
    // Loading states
    isLoading,
    isInitialLoading,
    isLoadingUsers,
    // Dialog states
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    setIsEditOpen,
    isDetailOpen,
    setIsDetailOpen,
    isPermissionsOpen,
    setIsPermissionsOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    // Forms
    createForm,
    updateForm,
    permissionsForm,
    // Handlers
    loadRoles,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDeleteClick,
    handleDeleteConfirm,
    handleViewDetail,
    handleOpenPermissions,
    handleAssignPermissions,
    handleUpdateUserRole,
    togglePermission,
    setRoleToDelete,
  };
}

