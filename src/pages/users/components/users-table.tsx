import { Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateTime } from '@/utils/date.utils';
import { StatusBadge } from '@/utils/status.utils';
import type { User } from '@/types/user.types';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  isInitialLoading: boolean;
  pagination: {
    page: number;
    totalPages: number;
  };
  selectedUserIds: Set<string>;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onViewDetail: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onSelectUser: (userId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

export function UsersTable({
  users,
  isLoading,
  isInitialLoading,
  pagination,
  selectedUserIds,
  isAllSelected,
  isSomeSelected,
  onViewDetail,
  onEdit,
  onDelete,
  onSelectUser,
  onSelectAll,
}: UsersTableProps) {
  const handleSelectAllChange = (checked: boolean) => {
    onSelectAll(checked);
  };

  const handleSelectUserChange = (userId: string, checked: boolean) => {
    onSelectUser(userId, checked);
  };

  const handleViewDetailClick = (user: User) => {
    onViewDetail(user);
  };

  const handleEditClick = (user: User) => {
    onEdit(user);
  };

  const handleDeleteClick = (userId: string) => {
    onDelete(userId);
  };
  if (isInitialLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users found. Create your first user!
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={
                isAllSelected ? true : isSomeSelected ? 'indeterminate' : false
              }
              onCheckedChange={(checked) =>
                handleSelectAllChange(checked === true)
              }
              aria-label="Select all users"
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const handleUserSelectChange = (checked: boolean | string) => {
            handleSelectUserChange(user.id, checked === true);
          };

          const handleUserViewDetail = () => {
            handleViewDetailClick(user);
          };

          const handleUserEdit = () => {
            handleEditClick(user);
          };

          const handleUserDelete = () => {
            handleDeleteClick(user.id);
          };

          return (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUserIds.has(user.id)}
                  onCheckedChange={handleUserSelectChange}
                  aria-label={`Select ${user.name}`}
                />
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role.name}</TableCell>
              <TableCell>
                {user.team?.name || (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(user.createdAt)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(user.updatedAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleUserViewDetail}
                    title="View Details"
                  >
                    <Eye />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleUserEdit}
                    title="Edit User"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive"
                    size="icon"
                    onClick={handleUserDelete}
                    title="Delete User"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
