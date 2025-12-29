import { Eye, Pencil, Trash2, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatDateTime } from '@/utils/date.utils';
import { PriorityBadge } from '@/utils/priority.utils';
import type { Board } from '@/types/board.types';

interface BoardsGridProps {
  boards: Board[];
  isLoading: boolean;
  canManage: boolean;
  onView: (board: Board) => void;
  onEdit: (board: Board) => void;
  onDelete: (id: string) => void;
}

export function BoardsGrid({
  boards,
  isLoading,
  canManage,
  onView,
  onEdit,
  onDelete,
}: BoardsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {boards.map((board) => (
        <Card key={board.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-2">
                {board.title}
              </CardTitle>
              {canManage && (
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onView(board)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(board)}
                    title="Edit Board"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onDelete(board.id)}
                    title="Delete Board"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Due: {formatDate(board.dueDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={board.priority} />
            </div>
            {board.assigneeDesigner && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {board.assigneeDesigner.name}
                </span>
              </div>
            )}
            <div className="text-xs text-muted-foreground pt-2 border-t">
              Updated: {formatDateTime(board.updatedAt)}
            </div>
            {!canManage && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onView(board)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

