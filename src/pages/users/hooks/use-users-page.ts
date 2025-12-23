import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUsers } from '@/hooks/use-users';
import { useRoles } from '@/hooks/use-roles';
import { useTeams } from '@/hooks/use-teams';
import { useDebounce } from '@/hooks/use-debounce';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from '@/schemas/user.schema';
import {
  PAGINATION,
  FILTER_VALUES,
  DEBOUNCE,
  USER_STATUS,
} from '@/constants';
import type { User } from '@/types/user.types';
import type { Role } from '@/types/role.types';
import type { Team } from '@/types/team.types';

export function useUsersPage() {
  const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    isLoading,
  } = useUsers();
  const { getRoles } = useRoles();
  const { getTeams } = useTeams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || ''
  );
  const debouncedSearchQuery = useDebounce(
    searchInput,
    DEBOUNCE.SEARCH_DELAY
  );
  const [roleFilter, setRoleFilter] = useState<string>(
    searchParams.get('roleFilter') || FILTER_VALUES.ALL
  );
  const [teamFilter, setTeamFilter] = useState<string>(
    searchParams.get('teamFilter') || FILTER_VALUES.ALL
  );
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  // Get page and limit from URL params
  const pageFromUrl = parseInt(
    searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE),
    10
  );
  const limitFromUrl = parseInt(
    searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT),
    10
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const createForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: undefined,
      roleId: '',
      teamId: undefined,
    },
  });

  const updateForm = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: '',
      roleId: '',
      teamId: undefined,
      status: USER_STATUS.ACTIVE,
    },
  });

  const loadAllUsers = async () => {
    setIsInitialLoading(true);
    const allData: User[] = [];
    let currentPage = PAGINATION.DEFAULT_PAGE;
    const maxLimit = PAGINATION.API_MAX_LIMIT;
    let hasMore = true;

    // Load all users by paginating through all pages
    while (hasMore) {
      const response = await getUsers({
        page: currentPage,
        limit: maxLimit,
      });
      if (response && response.data.length > 0) {
        allData.push(...response.data);
        // Check if there are more pages
        hasMore = currentPage < response.totalPages;
        currentPage++;
      } else {
        hasMore = false;
      }
    }

    setAllUsers(allData);
    setIsInitialLoading(false);
  };

  const loadUsers = async (page: number, limit: number) => {
    await loadAllUsers();
  };

  const loadRoles = async () => {
    const response = await getRoles({ limit: 100 });
    if (response) {
      setRoles(response.data);
    }
  };

  const loadTeams = async () => {
    const response = await getTeams({ limit: 100 });
    if (response) {
      setTeams(response.data);
    }
  };

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let filtered = [...allUsers];

    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.name.toLowerCase().includes(query) ||
          (user.team?.name.toLowerCase().includes(query) ?? false)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role.id === roleFilter);
    }

    // Apply team filter
    if (teamFilter !== 'all') {
      if (teamFilter === 'no-team') {
        filtered = filtered.filter((user) => !user.team);
      } else {
        filtered = filtered.filter((user) => user.team?.id === teamFilter);
      }
    }

    return filtered;
  }, [allUsers, debouncedSearchQuery, roleFilter, teamFilter]);

  // Paginate filtered results
  const paginatedUsers = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, pagination.page, pagination.limit]);

  // Update pagination when filtered results change
  useEffect(() => {
    const totalPages = Math.ceil(filteredUsers.length / pagination.limit);
    setPagination((prev) => {
      const newPage = prev.page > totalPages && totalPages > 0 ? 1 : prev.page;
      return {
        ...prev,
        page: newPage,
        total: filteredUsers.length,
        totalPages: totalPages || 1,
      };
    });
  }, [filteredUsers.length, pagination.limit]);

  useEffect(() => {
    // Initialize from URL params
    setPagination((prev) => ({
      ...prev,
      page: pageFromUrl,
      limit: limitFromUrl,
    }));
    loadUsers(pageFromUrl, limitFromUrl);
    loadRoles();
    loadTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update displayed users when pagination changes
  useEffect(() => {
    setUsers(paginatedUsers);
  }, [paginatedUsers]);

  // Update URL params when debounced search or filters change
  useEffect(() => {
    const params: Record<string, string> = {
      page: '1', // Reset to page 1 when search/filters change
      limit: pagination.limit.toString(),
    };
    if (debouncedSearchQuery.trim()) {
      params.search = debouncedSearchQuery;
    }
    if (roleFilter !== 'all') {
      params.roleFilter = roleFilter;
    }
    if (teamFilter !== 'all') {
      params.teamFilter = teamFilter;
    }
    setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, roleFilter, teamFilter]);

  const handleCreate = async (data: CreateUserFormData) => {
    const payload: any = {
      name: data.name,
      email: data.email,
      roleId: data.roleId,
    };
    
    // Only include password if it's provided and not empty
    if (data.password && data.password.trim()) {
      payload.password = data.password;
    }
    
    // Only include teamId if it's provided and not empty
    if (data.teamId && data.teamId.trim()) {
      payload.teamId = data.teamId;
    }
    
    const user = await createUser(payload);
    if (user) {
      setIsCreateOpen(false);
      createForm.reset({
        name: '',
        email: '',
        password: undefined,
        roleId: '',
        teamId: undefined,
      });
      setSelectedUserIds(new Set());
      loadAllUsers();
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    updateForm.reset({
      name: user.name,
      roleId: user.role.id,
      teamId: user.team?.id || undefined,
      status: user.status || USER_STATUS.ACTIVE,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (data: UpdateUserFormData) => {
    if (!selectedUser) return;
    const payload: any = {};
    
    // Only include name if provided
    if (data.name !== undefined && data.name.trim()) {
      payload.name = data.name;
    }
    
    // Always include roleId if provided
    if (data.roleId) {
      payload.roleId = data.roleId;
    }
    
    // Handle teamId - can be empty string to remove team
    if (data.teamId !== undefined) {
      payload.teamId = data.teamId && data.teamId.trim() ? data.teamId : null;
    }
    
    // Always include status if provided
    if (data.status) {
      payload.status = data.status;
    }
    
    const user = await updateUser(selectedUser.id, payload);
    if (user) {
      setIsEditOpen(false);
      setSelectedUser(null);
      updateForm.reset();
      setSelectedUserIds(new Set());
      loadAllUsers();
    }
  };

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    const success = await deleteUser(userToDelete);
    if (success) {
      setIsDeleteOpen(false);
      setUserToDelete(null);
      setSelectedUserIds(new Set());
      loadAllUsers();
    }
  };

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      const params: Record<string, string> = {
        page: newPage.toString(),
        limit: pagination.limit.toString(),
      };
      if (debouncedSearchQuery) {
        params.search = debouncedSearchQuery;
      }
      if (roleFilter !== 'all') {
        params.roleFilter = roleFilter;
      }
      if (teamFilter !== 'all') {
        params.teamFilter = teamFilter;
      }
      setSearchParams(params);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    const limit = parseInt(newLimit, 10);
    setPagination((prev) => ({ ...prev, page: 1, limit }));
    const params: Record<string, string> = {
      page: '1',
      limit: limit.toString(),
    };
    if (debouncedSearchQuery) {
      params.search = debouncedSearchQuery;
    }
    if (roleFilter !== 'all') {
      params.roleFilter = roleFilter;
    }
    if (teamFilter !== 'all') {
      params.teamFilter = teamFilter;
    }
    setSearchParams(params);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleTeamFilterChange = (value: string) => {
    setTeamFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearSearch = () => {
    setSearchInput('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(new Set(users.map((user) => user.id)));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const isAllSelected = users.length > 0 && users.every((user) => selectedUserIds.has(user.id));
  const isSomeSelected = users.some((user) => selectedUserIds.has(user.id));

  return {
    // Data
    users,
    roles,
    teams,
    pagination,
    selectedUser,
    userToDelete,
    // Loading states
    isLoading,
    isInitialLoading,
    // Dialog states
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    setIsEditOpen,
    isDetailOpen,
    setIsDetailOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    // Forms
    createForm,
    updateForm,
    // Handlers
    loadUsers,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDeleteClick,
    handleDeleteConfirm,
    handleViewDetail,
    setUserToDelete,
    // Search and filter
    searchInput,
    debouncedSearchQuery,
    roleFilter,
    teamFilter,
    handleSearchInputChange,
    handleRoleFilterChange,
    handleTeamFilterChange,
    clearSearch,
    // Pagination
    handlePageChange,
    handleLimitChange,
    // Selection
    selectedUserIds,
    handleSelectUser,
    handleSelectAll,
    isAllSelected,
    isSomeSelected,
  };
}

