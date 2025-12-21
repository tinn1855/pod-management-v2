import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTeams } from '@/hooks/use-teams';
import {
  createTeamSchema,
  updateTeamSchema,
  type CreateTeamFormData,
  type UpdateTeamFormData,
} from '@/lib/team.schema';
import type { Team } from '@/types/team.types';

export function useTeamsPage() {
  const {
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    isLoading,
  } = useTeams();

  const [teams, setTeams] = useState<Team[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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

  useEffect(() => {
    setIsInitialLoading(true);
    loadTeams();
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
  };

  return {
    // Data
    teams,
    pagination,
    selectedTeam,
    teamToDelete,
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
    loadTeams,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDeleteClick,
    handleDeleteConfirm,
    handleViewDetail,
    setTeamToDelete,
  };
}

