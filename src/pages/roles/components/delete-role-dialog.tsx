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
import type { Role } from '@/types/role.types';

interface DeleteRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleToDelete: string | null;
  roles: Role[];
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteRoleDialog({
  open,
  onOpenChange,
  roleToDelete,
  roles,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteRoleDialogProps) {
  const role = roleToDelete
    ? roles.find((r) => r.id === roleToDelete)
    : null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the role
            {role && <span className="font-semibold"> "{role.name}"</span>}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
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

