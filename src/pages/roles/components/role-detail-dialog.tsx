import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPermissionName } from '@/lib/utils';
import { formatDate } from '@/utils/date.utils';
import type { Role } from '@/types/role.types';
import type { User } from '@/types/user.types';

interface RoleDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  users: User[];
  allRoles: Role[];
  isLoadingUsers: boolean;
  onUpdateUserRole: (userId: string, roleId: string) => Promise<void>;
}

export function RoleDetailDialog({
  open,
  onOpenChange,
  role,
  users,
  allRoles,
  isLoadingUsers,
  onUpdateUserRole,
}: RoleDetailDialogProps) {
  if (!role) return null;

  // Filter users that belong to this role
  const roleUsers = users.filter((user) => user.role.id === role.id);

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    await onUpdateUserRole(userId, newRoleId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Role Details - {role.name}</DialogTitle>
          <DialogDescription>
            View detailed information about this role and manage user roles
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 overflow-y-auto flex-1">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Name
            </h3>
            <p className="text-base font-semibold">{role.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Description
            </h3>
            <p className="text-base">
              {role.description || (
                <span className="text-muted-foreground">No description</span>
              )}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Permissions ({role.permissions.length})
            </h3>
            {role.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission.id}
                    className="text-sm px-3 py-1.5 bg-primary/10 text-primary rounded-md border border-primary/20"
                  >
                    {formatPermissionName(permission.name)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No permissions assigned
              </p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Users with this Role ({roleUsers.length})
            </h3>
            {isLoadingUsers ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : roleUsers.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Current Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roleUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role.id}
                            onValueChange={(newRoleId) =>
                              handleRoleChange(user.id, newRoleId)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {allRoles.map((r) => (
                                <SelectItem key={r.id} value={r.id}>
                                  {r.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No users with this role
              </p>
            )}
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground pt-2 border-t">
            <span>Created: {formatDate(role.createdAt)}</span>
            <span>•</span>
            <span>Updated: {formatDate(role.updatedAt)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

