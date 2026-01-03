import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useUpdateShop, useShop } from '@/hooks/use-shops';
import { updateShopSchema, type UpdateShopFormData } from '@/schemas/shop.schema';
import { formatDate } from '@/utils/date.utils';
import type { Shop } from '@/types/shop.types';

interface ShopDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shop: Shop | null;
}

export function ShopDetailDialog({
  open,
  onOpenChange,
  shop,
}: ShopDetailDialogProps) {
  // All hooks must be called before any early returns
  const [isEditingPlatforms, setIsEditingPlatforms] = useState(false);
  const { data: platformsData, isLoading: isLoadingPlatforms } = usePlatforms({ limit: 100 });
  const platforms = platformsData?.data || [];
  const updateMutation = useUpdateShop();
  
  // Fetch latest shop data when dialog is open
  const { data: latestShopData, isLoading: isLoadingShop } = useShop(shop?.id || '', {
    enabled: !!shop?.id && open,
  });
  
  // Use latest shop data if available, otherwise fallback to prop
  const displayShop = latestShopData || shop;

  const form = useForm<UpdateShopFormData>({
    resolver: zodResolver(updateShopSchema),
    defaultValues: {
      platformIds: [],
    },
  });

  // Initialize form when shop changes
  useEffect(() => {
    if (displayShop) {
      const platformIds = displayShop.platforms?.map((p) => p.id) || [];
      form.reset({ platformIds });
      setIsEditingPlatforms(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayShop?.id, open]);

  // Don't render if dialog is closed or no shop (after all hooks are called)
  if (!open || !shop) return null;
  
  // Show loading state while fetching shop data
  if (isLoadingShop && !displayShop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Loading Shop Details...</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-muted-foreground">
            Loading...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Still show dialog even if shop data is loading (use prop shop as fallback)
  if (!displayShop) return null;

  const shopPlatformIds = displayShop.platforms?.map((p) => p.id) || [];
  const selectedPlatformIds = form.watch('platformIds') || [];

  const handleTogglePlatform = (platformId: string) => {
    const currentIds = form.getValues('platformIds') || [];
    const newIds = currentIds.includes(platformId)
      ? currentIds.filter((id) => id !== platformId)
      : [...currentIds, platformId];
    form.setValue('platformIds', newIds);
  };

  const handleSavePlatforms = async () => {
    if (!displayShop) return;
    try {
      const data = form.getValues();
      await updateMutation.mutateAsync({ id: displayShop.id, data });
      setIsEditingPlatforms(false);
      // Shop data will be refetched automatically via useShop hook
    } catch (error) {
      // Error is handled by mutation
    }
  };

  const handleCancelEdit = () => {
    const platformIds = displayShop.platforms?.map((p) => p.id) || [];
    form.reset({ platformIds });
    setIsEditingPlatforms(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shop Details - {displayShop.name}</DialogTitle>
          <DialogDescription>View shop information.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-sm mt-1">{displayShop.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Description
            </label>
            <p className="text-sm mt-1">
              {displayShop.description || (
                <span className="text-muted-foreground">No description</span>
              )}
            </p>
          </div>
          {displayShop.email && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="text-sm mt-1">{displayShop.email}</p>
            </div>
          )}
          {displayShop.status && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <p className="text-sm mt-1">{displayShop.status}</p>
            </div>
          )}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold">
                Connected Platforms
              </label>
              {!isEditingPlatforms && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditingPlatforms(true);
                    form.setValue('platformIds', shopPlatformIds);
                  }}
                  disabled={isLoadingPlatforms}
                >
                  {displayShop.platforms && displayShop.platforms.length > 0
                    ? 'Edit Platforms'
                    : 'Connect Platforms'}
                </Button>
              )}
            </div>
            {isEditingPlatforms ? (
              <Form {...form}>
                <form className="space-y-3">
                  <FormField
                    control={form.control}
                    name="platformIds"
                    render={() => (
                      <FormItem>
                        <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-3 bg-muted/30">
                          {isLoadingPlatforms ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              Loading platforms...
                            </p>
                          ) : platforms.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No platforms available
                            </p>
                          ) : (
                            platforms.map((platform) => (
                              <div
                                key={platform.id}
                                className="flex items-center space-x-2 py-1"
                              >
                                <Checkbox
                                  id={`platform-${platform.id}`}
                                  checked={selectedPlatformIds.includes(
                                    platform.id
                                  )}
                                  onCheckedChange={() =>
                                    handleTogglePlatform(platform.id)
                                  }
                                />
                                <Label
                                  htmlFor={`platform-${platform.id}`}
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
                  <div className="flex gap-2 justify-end pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={updateMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSavePlatforms}
                      disabled={updateMutation.isPending || isLoadingPlatforms}
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-2">
                {displayShop.platforms && displayShop.platforms.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {displayShop.platforms.map((platform) => (
                      <div
                        key={platform.id}
                        className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-md border border-primary/20"
                      >
                        <span className="text-sm font-medium">
                          {platform.name}
                        </span>
                        <span className="text-xs text-primary/70">
                          ({platform.code})
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed rounded-md bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-2">
                      No platforms connected
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click "Connect Platforms" to link this shop to platforms
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Created At
            </label>
            <p className="text-sm mt-1">{formatDate(displayShop.createdAt)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Updated At
            </label>
            <p className="text-sm mt-1">{formatDate(displayShop.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
