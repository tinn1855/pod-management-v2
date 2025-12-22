import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatPermissionName } from '@/lib/utils';
import { formatDate } from '@/utils/date.utils';
import type { Role } from '@/types/role.types';

interface RoleDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}

export function RoleDetailDialog({
  open,
  onOpenChange,
  role,
}: RoleDetailDialogProps) {
  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Role Details - {role.name}</DialogTitle>
          <DialogDescription>
            View detailed information about this role
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
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Users
            </h3>
            <p className="text-base">
              {role.userCount !== undefined ? role.userCount : 0} user(s)
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

