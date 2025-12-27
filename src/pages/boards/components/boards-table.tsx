import { Eye, Pencil, Trash2 } from 'lucide-react';
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
import { formatDate, formatDateTime } from '@/utils/date.utils';
import { PriorityBadge } from '@/utils/priority.utils';
import type { Board } from '@/types/board.types';

interface BoardsTableProps {
  boards: Board[];
  isLoading: boolean;
  canManage: boolean;
  onView: (board: Board) => void;
  onEdit: (board: Board) => void;
  onDelete: (id: string) => void;
}

export function BoardsTable({
  boards,
  isLoading,
  canManage,
  onView,
  onEdit,
  onDelete,
}: BoardsTableProps) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee Designer</TableHead>
            <TableHead>Updated At</TableHead>
            {canManage && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              {canManage && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No boards found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Assignee Designer</TableHead>
          <TableHead>Updated At</TableHead>
          {canManage && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {boards.map((board) => (
          <TableRow key={board.id}>
            <TableCell className="font-medium">{board.title}</TableCell>
            <TableCell>{formatDate(board.dueDate)}</TableCell>
            <TableCell>
              <PriorityBadge priority={board.priority} />
            </TableCell>
            <TableCell>
              {board.assigneeDesigner?.name || (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDateTime(board.updatedAt)}
            </TableCell>
            {canManage && (
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onView(board)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(board)}
                    title="Edit Board"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive"
                    size="icon"
                    onClick={() => onDelete(board.id)}
                    title="Delete Board"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

