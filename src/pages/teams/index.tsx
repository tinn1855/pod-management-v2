import { Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { useTeamsPage } from './hooks/use-teams-page';
import { TeamsTable } from './components/teams-table';
import { CreateTeamDialog } from './components/create-team-dialog';
import { EditTeamDialog } from './components/edit-team-dialog';
import { TeamDetailDialog } from './components/team-detail-dialog';
import { DeleteTeamDialog } from './components/delete-team-dialog';

export function TeamsPage() {
  const {
    teams,
    pagination,
    selectedTeam,
    teamToDelete,
    isLoading,
    isInitialLoading,
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    setIsEditOpen,
    isDetailOpen,
    setIsDetailOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    createForm,
    updateForm,
    loadTeams,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDeleteClick,
    handleDeleteConfirm,
    handleViewDetail,
    setTeamToDelete,
  } = useTeamsPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading variant="h1">Teams Management</Heading>
          <p className="text-muted-foreground">
            Manage teams and their members
          </p>
        </div>
        <CreateTeamDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          form={createForm}
          isLoading={isLoading}
          onSubmit={handleCreate}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Teams List
          </CardTitle>
          <CardDescription>Total: {pagination.total} teams</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamsTable
            teams={teams}
            isLoading={isLoading}
            isInitialLoading={isInitialLoading}
            pagination={pagination}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onPageChange={loadTeams}
          />
        </CardContent>
      </Card>

      <EditTeamDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        form={updateForm}
        isLoading={isLoading}
        onSubmit={handleUpdate}
      />

      <TeamDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        team={selectedTeam}
      />

      <DeleteTeamDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        teamToDelete={teamToDelete}
        teams={teams}
        isLoading={isLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTeamToDelete(null)}
      />
    </div>
  );
}

