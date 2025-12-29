import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate, formatDateTime } from '@/utils/date.utils';
import { PriorityBadge } from '@/utils/priority.utils';
import type { Board } from '@/types/board.types';

interface BoardDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  board: Board | null;
}

export function BoardDetailDialog({
  open,
  onOpenChange,
  board,
}: BoardDetailDialogProps) {
  if (!board) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Board Details - {board.title}</DialogTitle>
          <DialogDescription>
            View detailed information about this board
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 overflow-y-auto flex-1">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Title
            </h3>
            <p className="text-base font-semibold">{board.title}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Due Date
            </h3>
            <p className="text-base">{formatDate(board.dueDate)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Priority
            </h3>
            <div className="text-base">
              <PriorityBadge priority={board.priority} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Assignee Designer
            </h3>
            <p className="text-base">
              {board.assigneeDesigner ? (
                <>
                  <span className="font-medium">
                    {board.assigneeDesigner.name}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    ({board.assigneeDesigner.email})
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">No assignee</span>
              )}
            </p>
          </div>
          {board.createdAt && (
            <div className="flex gap-2 text-xs text-muted-foreground pt-2 border-t">
              <span>Created: {formatDateTime(board.createdAt)}</span>
              <span>•</span>
              <span>Updated: {formatDateTime(board.updatedAt)}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

