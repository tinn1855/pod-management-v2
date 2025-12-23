import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTeams } from '@/hooks/use-teams';
import { useUsers } from '@/hooks/use-users';
import { PAGINATION } from '@/constants';
import {
  createTeamSchema,
  updateTeamSchema,
  type CreateTeamFormData,
  type UpdateTeamFormData,
} from '@/schemas/team.schema';
import type { Team } from '@/types/team.types';
import type { User } from '@/types/user.types';

export function useTeamsPage() {
  const {
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    isLoading,
  } = useTeams();
  const { getUsers, updateUser } = useUsers();

  const [teams, setTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);

  const createForm = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const updateForm = useForm<UpdateTeamFormData>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const loadTeams = async (page = 1) => {
    const response = await getTeams({ page, limit: pagination.limit });
    if (response) {
      setTeams(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    }
    setIsInitialLoading(false);
  };

  const loadAllTeams = async () => {
    const allData: Team[] = [];
    let currentPage = 1;
    const maxLimit = PAGINATION.API_MAX_LIMIT;
    let hasMore = true;

    while (hasMore) {
      const response = await getTeams({
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

    setAllTeams(allData);
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

  const handleUpdateUserTeam = async (userId: string, teamId: string | null) => {
    const user = await updateUser(userId, { teamId });
    if (user) {
      // Refresh users list
      await loadAllUsers();
      // Refresh teams list to update member counts
      loadTeams();
    }
  };

  useEffect(() => {
    setIsInitialLoading(true);
    loadTeams();
    loadAllTeams();
    loadAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (data: CreateTeamFormData) => {
    // Only send name, exclude description if empty
    const payload: { name: string } = {
      name: data.name,
    };
    const team = await createTeam(payload);
    if (team) {
      setIsCreateOpen(false);
      createForm.reset();
      loadTeams();
    }
  };

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    updateForm.reset({
      name: team.name,
      description: team.description || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (data: UpdateTeamFormData) => {
    if (!selectedTeam) return;
    const team = await updateTeam(selectedTeam.id, data);
    if (team) {
      setIsEditOpen(false);
      setSelectedTeam(null);
      updateForm.reset();
      loadTeams();
    }
  };

  const handleDeleteClick = (id: string) => {
    setTeamToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!teamToDelete) return;
    const success = await deleteTeam(teamToDelete);
    if (success) {
      setIsDeleteOpen(false);
      setTeamToDelete(null);
      loadTeams();
    }
  };

  const handleViewDetail = (team: Team) => {
    setSelectedTeam(team);
    setIsDetailOpen(true);
    loadAllUsers();
  };

  return {
    // Data
    teams,
    allTeams,
    allUsers,
    pagination,
    selectedTeam,
    teamToDelete,
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
    isDeleteOpen,
    setIsDeleteOpen,
    // Forms
    createForm,
    updateForm,
    // Handlers
    loadTeams,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDeleteClick,
    handleDeleteConfirm,
    handleViewDetail,
    handleUpdateUserTeam,
    setTeamToDelete,
  };
}

