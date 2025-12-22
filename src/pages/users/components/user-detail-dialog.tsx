import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDateLong } from '@/utils/date.utils';
import { StatusBadge } from '@/utils/status.utils';
import type { User } from '@/types/user.types';

interface UserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserDetailDialog({
  open,
  onOpenChange,
  user,
}: UserDetailDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>User Details - {user.name}</DialogTitle>
          <DialogDescription>
            View detailed information about this user
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 overflow-y-auto flex-1">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Name
            </h3>
            <p className="text-base font-semibold">{user.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Email
            </h3>
            <p className="text-base">{user.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Role
            </h3>
            <p className="text-base">{user.role.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Team
            </h3>
            <p className="text-base">
              {user.team?.name || (
                <span className="text-muted-foreground">No team assigned</span>
              )}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Status
            </h3>
            <StatusBadge status={user.status} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Must Change Password
            </h3>
            <p className="text-base">
              {user.mustChangePassword ? 'Yes' : 'No'}
            </p>
          </div>
          {user.createdAt && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Created At
              </h3>
              <p className="text-base">{formatDateLong(user.createdAt)}</p>
            </div>
          )}
          {user.updatedAt && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Updated At
              </h3>
              <p className="text-base">{formatDateLong(user.updatedAt)}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

