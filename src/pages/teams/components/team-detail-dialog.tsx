import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate } from '@/utils/date.utils';
import type { Team } from '@/types/team.types';

interface TeamDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
}

export function TeamDetailDialog({
  open,
  onOpenChange,
  team,
}: TeamDetailDialogProps) {
  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Team Details - {team.name}</DialogTitle>
          <DialogDescription>
            View detailed information about this team
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 overflow-y-auto flex-1">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Name
            </h3>
            <p className="text-base font-semibold">{team.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Description
            </h3>
            <p className="text-base">
              {team.description || (
                <span className="text-muted-foreground">No description</span>
              )}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Members
            </h3>
            <p className="text-base">
              {team.memberCount !== undefined ? team.memberCount : 0} member(s)
            </p>
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground pt-2 border-t">
            <span>Created: {formatDate(team.createdAt)}</span>
            <span>•</span>
            <span>Updated: {formatDate(team.updatedAt)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

