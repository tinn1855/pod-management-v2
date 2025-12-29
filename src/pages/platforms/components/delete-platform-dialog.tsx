import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Platform } from '@/types/platform.types';

interface DeletePlatformDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platformToDelete: Platform | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeletePlatformDialog({
  open,
  onOpenChange,
  platformToDelete,
  isLoading,
  onConfirm,
  onCancel,
}: DeletePlatformDialogProps) {
  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if not loading (prevents closing during deletion)
    if (!newOpen && !isLoading) {
      onCancel();
    }
  };

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            platform
            {platformToDelete && (
              <span className="font-semibold"> "{platformToDelete.name}"</span>
            )}
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
