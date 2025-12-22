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
import type { User } from '@/types/user.types';

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToDelete: string | null;
  users: User[];
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  userToDelete,
  users,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteUserDialogProps) {
  const user = userToDelete
    ? users.find((u) => u.id === userToDelete)
    : null;

  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if not loading and user clicks cancel or outside
    if (!newOpen && !isLoading) {
      onCancel();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            {user && <span className="font-semibold"> "{user.name}"</span>}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
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

