import { Pencil, Trash2, Shield, Eye } from 'lucide-react';
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
import type { Role } from '@/types/role.types';

interface RolesTableProps {
  roles: Role[];
  isLoading: boolean;
  isInitialLoading: boolean;
  pagination: {
    page: number;
    totalPages: number;
  };
  onViewDetail: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
  onAssignPermissions: (role: Role) => void;
  onPageChange: (page: number) => void;
}

export function RolesTable({
  roles,
  isLoading,
  isInitialLoading,
  pagination,
  onViewDetail,
  onEdit,
  onDelete,
  onAssignPermissions,
  onPageChange,
}: RolesTableProps) {
  if (isInitialLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Users</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-8" />
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

  if (roles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No roles found. Create your first role!
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Users</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>
                {role.description || (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {role.userCount !== undefined ? role.userCount : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onViewDetail(role)}
                    title="View Details"
                  >
                    <Eye />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onAssignPermissions(role)}
                    title="Assign Permissions"
                  >
                    <Shield />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(role)}
                    title="Edit Role"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive"
                    size="icon"
                    onClick={() => onDelete(role.id)}
                    title="Delete Role"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

