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
import { formatDate } from '@/utils/date.utils';
import type { Team } from '@/types/team.types';
import type { User } from '@/types/user.types';

interface TeamDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
  users: User[];
  allTeams: Team[];
  isLoadingUsers: boolean;
  onUpdateUserTeam: (userId: string, teamId: string | null) => Promise<void>;
}

export function TeamDetailDialog({
  open,
  onOpenChange,
  team,
  users,
  allTeams,
  isLoadingUsers,
  onUpdateUserTeam,
}: TeamDetailDialogProps) {
  if (!team) return null;

  // Filter users that belong to this team
  const teamUsers = users.filter((user) => user.team?.id === team.id);

  const handleTeamChange = async (userId: string, newTeamId: string | null) => {
    await onUpdateUserTeam(userId, newTeamId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Team Details - {team.name}</DialogTitle>
          <DialogDescription>
            View detailed information about this team and manage team members
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
              {teamUsers.length} member(s)
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Members List
            </h3>
            {isLoadingUsers ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : teamUsers.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Current Team</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role.name}</TableCell>
                        <TableCell>
                          <Select
                            value={user.team?.id || 'none'}
                            onValueChange={(value) =>
                              handleTeamChange(user.id, value === 'none' ? null : value)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Team</SelectItem>
                              {allTeams.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                  {t.name}
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
                No members in this team
              </p>
            )}
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

