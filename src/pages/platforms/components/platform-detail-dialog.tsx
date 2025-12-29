import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate } from '@/utils/date.utils';
import type { Platform } from '@/types/platform.types';

interface PlatformDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: Platform | null;
}

export function PlatformDetailDialog({
  open,
  onOpenChange,
  platform,
}: PlatformDetailDialogProps) {
  if (!platform) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Platform Details - {platform.name}</DialogTitle>
          <DialogDescription>View platform information.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-sm mt-1">{platform.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Description
            </label>
            <p className="text-sm mt-1">
              {platform.description || (
                <span className="text-muted-foreground">No description</span>
              )}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Created At
            </label>
            <p className="text-sm mt-1">{formatDate(platform.createdAt)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Updated At
            </label>
            <p className="text-sm mt-1">{formatDate(platform.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

