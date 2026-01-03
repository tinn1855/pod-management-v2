import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { PAGINATION, DEBOUNCE, FILTER_VALUES } from '@/constants';
import {
  useShops,
  useCreateShop,
  useUpdateShop,
  useDeleteShop,
  useDeleteShops,
} from '@/hooks/use-shops';
import { usePlatforms } from '@/hooks/use-platforms';
import {
  createShopSchema,
  updateShopSchema,
  type CreateShopFormData,
  type UpdateShopFormData,
} from '@/schemas/shop.schema';
import type { Shop } from '@/types/shop.types';
import { ShopsTable } from './components/shops-table';
import { CreateShopDialog } from './components/create-shop-dialog';
import { EditShopDialog } from './components/edit-shop-dialog';
import { ShopDetailDialog } from './components/shop-detail-dialog';
import { DeleteShopDialog } from './components/delete-shop-dialog';

export function ShopsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [platformFilter, setPlatformFilter] = useState<string>(FILTER_VALUES.ALL);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [shopToDelete, setShopToDelete] = useState<Shop | null>(null);
  const [shopsToDelete, setShopsToDelete] = useState<string[]>([]);
  const [selectedShopIds, setSelectedShopIds] = useState<Set<string>>(new Set());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, DEBOUNCE.SEARCH_DELAY);

  // Fetch platforms for filter
  const { data: platformsData } = usePlatforms({ limit: 100 });
  const platforms = platformsData?.data || [];

  // Fetch shops with search query and platform filter
  const { data: shopsData, isLoading } = useShops({
    page,
    limit: PAGINATION.DEFAULT_LIMIT,
    q: debouncedSearch || undefined,
    platformId: platformFilter !== FILTER_VALUES.ALL ? platformFilter : undefined,
  });

  const createMutation = useCreateShop();
  const updateMutation = useUpdateShop();
  const deleteMutation = useDeleteShop();
  const deleteManyMutation = useDeleteShops();

  const shops = shopsData?.data || [];
  const pagination = shopsData
    ? {
        page: shopsData.page,
        total: shopsData.total,
        totalPages: shopsData.totalPages,
        limit: shopsData.limit,
      }
    : { page: 1, total: 0, totalPages: 0, limit: PAGINATION.DEFAULT_LIMIT };

  const createForm = useForm<CreateShopFormData>({
    resolver: zodResolver(createShopSchema),
    defaultValues: {
      name: '',
    },
  });

  const updateForm = useForm<UpdateShopFormData>({
    resolver: zodResolver(updateShopSchema),
    defaultValues: {
      name: '',
      description: '',
      email: '',
      status: '',
      platformIds: [],
    },
  });

  const handleCreate = async (data: CreateShopFormData) => {
    await createMutation.mutateAsync({ name: data.name });
    setIsCreateOpen(false);
    createForm.reset();
  };

  const handleEdit = (shop: Shop) => {
    setSelectedShop(shop);
    updateForm.reset({
      name: shop.name,
      description: shop.description || '',
      email: shop.email || '',
      status: shop.status || '',
      platformIds: shop.platforms?.map((p) => p.id) || [],
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (data: UpdateShopFormData) => {
    if (!selectedShop) return;
    await updateMutation.mutateAsync({ id: selectedShop.id, data });
    setIsEditOpen(false);
    setSelectedShop(null);
    updateForm.reset();
  };

  const handleDeleteClick = (id: string) => {
    const shop = shops.find((s) => s.id === id);
    if (shop) {
      setShopToDelete(shop);
      setIsDeleteOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!shopToDelete) return;
    try {
      await deleteMutation.mutateAsync(shopToDelete.id);
      // Only close modal and clear state after successful deletion
      setIsDeleteOpen(false);
      setShopToDelete(null);
      setSelectedShopIds(new Set());
    } catch {
      // Error is already handled in the mutation's onError callback
      // Modal stays open so user can try again or cancel
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedShopIds.size > 0) {
      setShopsToDelete(Array.from(selectedShopIds));
      setIsBulkDeleteOpen(true);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (shopsToDelete.length === 0) return;
    try {
      await deleteManyMutation.mutateAsync(shopsToDelete);
      setIsBulkDeleteOpen(false);
      setShopsToDelete([]);
      setSelectedShopIds(new Set());
    } catch {
      // Error is already handled in the mutation's onError callback
    }
  };

  const handleSelectShop = (shopId: string, checked: boolean) => {
    setSelectedShopIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(shopId);
      } else {
        newSet.delete(shopId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedShopIds(new Set(shops.map((shop) => shop.id)));
    } else {
      setSelectedShopIds(new Set());
    }
  };

  const isAllSelected = shops.length > 0 && shops.every((shop) => selectedShopIds.has(shop.id));
  const isSomeSelected = shops.some((shop) => selectedShopIds.has(shop.id));

  const handleViewDetail = (shop: Shop) => {
    setSelectedShop(shop);
    setIsDetailOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setPage(1);
  };

  const handlePlatformFilterChange = (value: string) => {
    setPlatformFilter(value);
    setPage(1);
  };

  const isLoadingData =
    isLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    deleteManyMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading variant="h1">Shops Management</Heading>
          <p className="text-muted-foreground">
            Manage shops and their information
          </p>
        </div>
        <CreateShopDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          form={createForm}
          isLoading={createMutation.isPending}
          onSubmit={handleCreate}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Shops List</CardTitle>
          <CardDescription>Total: {pagination.total} shops</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shops by name..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                className="pl-8"
              />
              {searchInput && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={handleSearchClear}
                >
                  <X />
                </Button>
              )}
            </div>
            <Select value={platformFilter} onValueChange={handlePlatformFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FILTER_VALUES.ALL}>All Platforms</SelectItem>
                {platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedShopIds.size > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDeleteClick}
                disabled={deleteManyMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedShopIds.size})
              </Button>
            )}
          </div>

          <ShopsTable
            shops={shops}
            isLoading={isLoadingData}
            isInitialLoading={isLoading && shops.length === 0}
            pagination={pagination}
            selectedShopIds={selectedShopIds}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onSelectShop={handleSelectShop}
            onSelectAll={handleSelectAll}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      <EditShopDialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setSelectedShop(null);
            updateForm.reset();
          }
        }}
        form={updateForm}
        isLoading={updateMutation.isPending}
        onSubmit={handleUpdate}
      />

      <ShopDetailDialog
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) {
            setSelectedShop(null);
          }
        }}
        shop={selectedShop}
      />

      <DeleteShopDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            setShopToDelete(null);
          }
        }}
        shopToDelete={shopToDelete}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!deleteMutation.isPending) {
            setIsDeleteOpen(false);
            setShopToDelete(null);
          }
        }}
      />

      <DeleteShopDialog
        open={isBulkDeleteOpen}
        onOpenChange={(open) => {
          setIsBulkDeleteOpen(open);
          if (!open) {
            setShopsToDelete([]);
          }
        }}
        shopsToDelete={shopsToDelete}
        shops={shops}
        isLoading={deleteManyMutation.isPending}
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => {
          if (!deleteManyMutation.isPending) {
            setIsBulkDeleteOpen(false);
            setShopsToDelete([]);
          }
        }}
      />
    </div>
  );
}

