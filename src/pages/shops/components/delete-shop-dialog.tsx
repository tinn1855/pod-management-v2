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
import type { Shop } from '@/types/shop.types';

interface DeleteShopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopToDelete?: Shop | null;
  shopsToDelete?: string[];
  shops?: Shop[];
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteShopDialog({
  open,
  onOpenChange,
  shopToDelete,
  shopsToDelete,
  shops = [],
  isLoading,
  onConfirm,
  onCancel,
}: DeleteShopDialogProps) {
  const isBulkDelete = shopsToDelete && shopsToDelete.length > 0;
  const count = isBulkDelete ? shopsToDelete.length : 1;
  const shopNames = isBulkDelete
    ? shopsToDelete
        .map((id) => shops.find((s) => s.id === id)?.name)
        .filter(Boolean)
        .slice(0, 3)
    : shopToDelete
    ? [shopToDelete.name]
    : [];

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
            This action cannot be undone. This will permanently delete{' '}
            {count === 1 ? (
              <>
                the shop
                {shopToDelete && (
                  <span className="font-semibold"> "{shopToDelete.name}"</span>
                )}
              </>
            ) : (
              <>
                <span className="font-semibold">{count} shops</span>
                {shopNames.length > 0 && (
                  <>
                    {' '}
                    including{' '}
                    {shopNames.map((name, idx) => (
                      <span key={idx}>
                        <span className="font-semibold">"{name}"</span>
                        {idx < shopNames.length - 1 && ', '}
                      </span>
                    ))}
                    {count > shopNames.length && ` and ${count - shopNames.length} more`}
                  </>
                )}
              </>
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
            {isLoading ? 'Deleting...' : `Delete ${count > 1 ? `${count} shops` : 'shop'}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

