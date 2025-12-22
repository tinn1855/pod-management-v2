import { User as UserIcon, Search, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ItemsPerPageSelect,
  PaginationControls,
} from '@/utils/pagination.utils';
import { useUsersPage } from './hooks/use-users-page';
import { UsersTable } from './components/users-table';
import { CreateUserDialog } from './components/create-user-dialog';
import { EditUserDialog } from './components/edit-user-dialog';
import { UserDetailDialog } from './components/user-detail-dialog';
import { DeleteUserDialog } from './components/delete-user-dialog';

export function UsersPage() {
  const {
    users,
    roles,
    teams,
    pagination,
    selectedUser,
    userToDelete,
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
  } = useUsersPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Users Management
          </h1>
          <p className="text-muted-foreground">Manage users and their roles</p>
        </div>
        <CreateUserDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          form={createForm}
          roles={roles}
          teams={teams}
          isLoading={isLoading}
          onSubmit={handleCreate}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Users List
              </CardTitle>
              <CardDescription>
                {pagination.total} user{pagination.total !== 1 ? 's' : ''}
                {debouncedSearchQuery && ` matching "${debouncedSearchQuery}"`}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4 ">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchInput && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={clearSearch}
                >
                  <X />
                </Button>
              )}
            </div>
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={teamFilter} onValueChange={handleTeamFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="no-team">No Team</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            isLoading={isLoading}
            isInitialLoading={isInitialLoading}
            pagination={pagination}
            selectedUserIds={selectedUserIds}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
          />
          <div className="mt-5 flex items-center justify-between">
            {pagination.total >= 10 && (
              <ItemsPerPageSelect
                value={pagination.limit}
                onChange={handleLimitChange}
              />
            )}
            <PaginationControls
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>

      <EditUserDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        form={updateForm}
        roles={roles}
        teams={teams}
        isLoading={isLoading}
        onSubmit={handleUpdate}
      />

      <UserDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        user={selectedUser}
      />

      <DeleteUserDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        userToDelete={userToDelete}
        users={users}
        isLoading={isLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
}
