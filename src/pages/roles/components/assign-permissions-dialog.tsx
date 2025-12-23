import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { formatPermissionName } from '@/lib/utils';
import type { AssignPermissionsFormData } from '@/schemas/role.schema';
import type { PermissionResponse } from '@/types/role.types';

interface AssignPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ReturnType<typeof useForm<AssignPermissionsFormData>>;
  permissions: PermissionResponse[];
  selectedPermissionIds: string[];
  roleName?: string;
  isLoading: boolean;
  onSubmit: (data: AssignPermissionsFormData) => void;
  onTogglePermission: (permissionId: string) => void;
}

export function AssignPermissionsDialog({
  open,
  onOpenChange,
  form,
  permissions,
  selectedPermissionIds,
  roleName,
  isLoading,
  onSubmit,
  onTogglePermission,
}: AssignPermissionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Permissions - {roleName}</DialogTitle>
          <DialogDescription>
            Select permissions to assign to this role. Changes will replace
            existing permissions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col flex-1 min-h-0"
          >
            <div className="overflow-y-auto space-y-3 py-2 flex-1">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50"
                >
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissionIds.includes(permission.id)}
                    onCheckedChange={() => onTogglePermission(permission.id)}
                  />
                  <Label
                    htmlFor={permission.id}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    {formatPermissionName(permission.name)}
                  </Label>
                </div>
              ))}
            </div>
            <FormField
              control={form.control}
              name="permissionIds"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Permissions'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

