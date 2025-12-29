import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
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
import { useDebounce } from '@/hooks/use-debounce';
import { PAGINATION, DEBOUNCE } from '@/constants';
import {
  usePlatforms,
  useCreatePlatform,
  useUpdatePlatform,
  useDeletePlatform,
} from '@/hooks/use-platforms';
import {
  createPlatformSchema,
  updatePlatformSchema,
  type CreatePlatformFormData,
  type UpdatePlatformFormData,
} from '@/schemas/platform.schema';
import type { Platform } from '@/types/platform.types';
import { PlatformsTable } from './components/platforms-table';
import { CreatePlatformDialog } from './components/create-platform-dialog';
import { EditPlatformDialog } from './components/edit-platform-dialog';
import { PlatformDetailDialog } from './components/platform-detail-dialog';
import { DeletePlatformDialog } from './components/delete-platform-dialog';

export function PlatformsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );
  const [platformToDelete, setPlatformToDelete] = useState<Platform | null>(
    null
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, DEBOUNCE.SEARCH_DELAY);

  // Fetch platforms with search query
  const { data: platformsData, isLoading } = usePlatforms({
    page,
    limit: PAGINATION.DEFAULT_LIMIT,
    q: debouncedSearch || undefined,
  });

  const createMutation = useCreatePlatform();
  const updateMutation = useUpdatePlatform();
  const deleteMutation = useDeletePlatform();

  const platforms = platformsData?.data || [];
  const pagination = platformsData
    ? {
        page: platformsData.page,
        total: platformsData.total,
        totalPages: platformsData.totalPages,
        limit: platformsData.limit,
      }
    : { page: 1, total: 0, totalPages: 0, limit: PAGINATION.DEFAULT_LIMIT };

  const createForm = useForm<CreatePlatformFormData>({
    resolver: zodResolver(createPlatformSchema),
    defaultValues: {
      name: '',
    },
  });

  const updateForm = useForm<UpdatePlatformFormData>({
    resolver: zodResolver(updatePlatformSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleCreate = async (data: CreatePlatformFormData) => {
    await createMutation.mutateAsync(data);
    setIsCreateOpen(false);
    createForm.reset();
  };

  const handleEdit = (platform: Platform) => {
    setSelectedPlatform(platform);
    updateForm.reset({
      name: platform.name,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (data: UpdatePlatformFormData) => {
    if (!selectedPlatform) return;
    await updateMutation.mutateAsync({ id: selectedPlatform.id, data });
    setIsEditOpen(false);
    setSelectedPlatform(null);
    updateForm.reset();
  };

  const handleDeleteClick = (id: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (platform) {
      setPlatformToDelete(platform);
      setIsDeleteOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!platformToDelete) return;
    try {
      await deleteMutation.mutateAsync(platformToDelete.id);
      // Only close modal and clear state after successful deletion
      setIsDeleteOpen(false);
      setPlatformToDelete(null);
    } catch {
      // Error is already handled in the mutation's onError callback
      // Modal stays open so user can try again or cancel
    }
  };

  const handleViewDetail = (platform: Platform) => {
    setSelectedPlatform(platform);
    setIsDetailOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setPage(1);
  };

  const isLoadingData =
    isLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading variant="h1">Platforms Management</Heading>
          <p className="text-muted-foreground">
            Manage platforms and their configurations
          </p>
        </div>
        <CreatePlatformDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          form={createForm}
          isLoading={createMutation.isPending}
          onSubmit={handleCreate}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Platforms List
          </CardTitle>
          <CardDescription>Total: {pagination.total} platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search platforms..."
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
          </div>

          <PlatformsTable
            platforms={platforms}
            isLoading={isLoadingData}
            isInitialLoading={isLoading && platforms.length === 0}
            pagination={pagination}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      <EditPlatformDialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setSelectedPlatform(null);
            updateForm.reset();
          }
        }}
        form={updateForm}
        isLoading={updateMutation.isPending}
        onSubmit={handleUpdate}
      />

      <PlatformDetailDialog
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) {
            setSelectedPlatform(null);
          }
        }}
        platform={selectedPlatform}
      />

      <DeletePlatformDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            setPlatformToDelete(null);
          }
        }}
        platformToDelete={platformToDelete}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!deleteMutation.isPending) {
            setIsDeleteOpen(false);
            setPlatformToDelete(null);
          }
        }}
      />
    </div>
  );
}
