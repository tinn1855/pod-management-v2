import { Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRolesPage } from './hooks/use-roles-page';
import { RolesTable } from './components/roles-table';
import { CreateRoleDialog } from './components/create-role-dialog';
import { EditRoleDialog } from './components/edit-role-dialog';
import { RoleDetailDialog } from './components/role-detail-dialog';
import { AssignPermissionsDialog } from './components/assign-permissions-dialog';
import { DeleteRoleDialog } from './components/delete-role-dialog';

export function RolesPage() {
  const {
    roles,
    permissions,
    pagination,
    selectedRole,
    roleToDelete,
    selectedPermissionIds,
    isLoading,
    isInitialLoading,
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
    createForm,
    updateForm,
    permissionsForm,
    loadRoles,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDeleteClick,
    handleDeleteConfirm,
    handleViewDetail,
    handleOpenPermissions,
    handleAssignPermissions,
    togglePermission,
    setRoleToDelete,
  } = useRolesPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Roles Management
          </h1>
          <p className="text-muted-foreground">
            Manage roles and their permissions
          </p>
        </div>
        <CreateRoleDialog
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
            Roles List
          </CardTitle>
          <CardDescription>Total: {pagination.total} roles</CardDescription>
        </CardHeader>
        <CardContent>
          <RolesTable
            roles={roles}
            isLoading={isLoading}
            isInitialLoading={isInitialLoading}
            pagination={pagination}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onAssignPermissions={handleOpenPermissions}
            onPageChange={loadRoles}
          />
        </CardContent>
      </Card>

      <EditRoleDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        form={updateForm}
        isLoading={isLoading}
        onSubmit={handleUpdate}
      />

      <AssignPermissionsDialog
        open={isPermissionsOpen}
        onOpenChange={setIsPermissionsOpen}
        form={permissionsForm}
        permissions={permissions}
        selectedPermissionIds={selectedPermissionIds}
        roleName={selectedRole?.name}
        isLoading={isLoading}
        onSubmit={handleAssignPermissions}
        onTogglePermission={togglePermission}
      />

      <RoleDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        role={selectedRole}
      />

      <DeleteRoleDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        roleToDelete={roleToDelete}
        roles={roles}
        isLoading={isLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setRoleToDelete(null)}
      />
    </div>
  );
}
