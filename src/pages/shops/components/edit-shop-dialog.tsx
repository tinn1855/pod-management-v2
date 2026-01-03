import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { usePlatforms } from '@/hooks/use-platforms';
import type { UpdateShopFormData } from '@/schemas/shop.schema';

interface EditShopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ReturnType<typeof useForm<UpdateShopFormData>>;
  isLoading: boolean;
  onSubmit: (data: UpdateShopFormData) => void;
}

export function EditShopDialog({
  open,
  onOpenChange,
  form,
  isLoading,
  onSubmit,
}: EditShopDialogProps) {
  const { data: platformsData } = usePlatforms({ limit: 100 });
  const platforms = platformsData?.data || [];
  const selectedPlatformIds = form.watch('platformIds') || [];

  const handleTogglePlatform = (platformId: string) => {
    const currentIds = selectedPlatformIds;
    const newIds = currentIds.includes(platformId)
      ? currentIds.filter((id) => id !== platformId)
      : [...currentIds, platformId];
    form.setValue('platformIds', newIds);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Shop</DialogTitle>
          <DialogDescription>Update shop information.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Main Store" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Shop description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g., shop@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Active" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="platformIds"
              render={() => (
                <FormItem>
                  <FormLabel>Platforms</FormLabel>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                    {platforms.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No platforms available
                      </p>
                    ) : (
                      platforms.map((platform) => (
                        <div
                          key={platform.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={platform.id}
                            checked={selectedPlatformIds.includes(platform.id)}
                            onCheckedChange={() =>
                              handleTogglePlatform(platform.id)
                            }
                          />
                          <Label
                            htmlFor={platform.id}
                            className="flex-1 cursor-pointer font-normal text-sm"
                          >
                            {platform.name} ({platform.code})
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Shop'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

