import { useState, useMemo } from 'react';
import { Search, LayoutGrid, Table2 } from 'lucide-react';
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
import { useBoards, useCreateBoard, useUpdateBoard, useDeleteBoard } from '@/hooks/use-boards';
import { useUsersList } from '@/hooks/use-users-tanstack';
import { useCurrentUser } from '@/hooks/use-current-user';
import { canManageBoards } from '@/utils/rbac.utils';
import { DEBOUNCE, PAGINATION } from '@/constants';
import { BoardsTable } from './components/boards-table';
import { BoardsGrid } from './components/boards-grid';
import { CreateBoardDialog } from './components/create-board-dialog';
import { EditBoardDialog } from './components/edit-board-dialog';
import { DeleteBoardDialog } from './components/delete-board-dialog';
import { BoardDetailDialog } from './components/board-detail-dialog';
import type { Board } from '@/types/board.types';
import type { CreateBoardFormData, UpdateBoardFormData } from '@/schemas/board.schema';

export function BoardsPage() {
  const { user } = useCurrentUser();
  const canManage = canManageBoards(user);
  
  const [searchInput, setSearchInput] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [page, setPage] = useState(1);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, DEBOUNCE.SEARCH_DELAY);

  // Fetch boards with search query
  const { data: boardsData, isLoading } = useBoards({
    page,
    limit: PAGINATION.DEFAULT_LIMIT,
    q: debouncedSearch || undefined,
  });

  // Fetch all users for designers dropdown
  const { data: usersData } = useUsersList({ limit: PAGINATION.API_MAX_LIMIT });
  const designers = useMemo(() => {
    if (!usersData?.data) return [];
    // Filter users with role DESIGN or include all if needed
    return usersData.data;
  }, [usersData]);

  const createMutation = useCreateBoard();
  const updateMutation = useUpdateBoard();
  const deleteMutation = useDeleteBoard();

  const boards = boardsData?.data || [];
  const pagination = boardsData
    ? {
        page: boardsData.page,
        total: boardsData.total,
        totalPages: boardsData.totalPages,
        limit: boardsData.limit,
      }
    : { page: 1, total: 0, totalPages: 0, limit: PAGINATION.DEFAULT_LIMIT };

  const handleCreate = async (data: CreateBoardFormData) => {
    await createMutation.mutateAsync(data);
    setIsCreateOpen(false);
  };

  const handleEdit = (board: Board) => {
    setSelectedBoard(board);
    setIsEditOpen(true);
  };

  const handleUpdate = async (data: UpdateBoardFormData) => {
    if (!selectedBoard) return;
    await updateMutation.mutateAsync({ id: selectedBoard.id, data });
    setIsEditOpen(false);
    setSelectedBoard(null);
  };

  const handleDeleteClick = (id: string) => {
    const board = boards.find((b) => b.id === id);
    if (board) {
      setBoardToDelete(board);
      setIsDeleteOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!boardToDelete) return;
    await deleteMutation.mutateAsync(boardToDelete.id);
    setIsDeleteOpen(false);
    setBoardToDelete(null);
  };

  const handleView = (board: Board) => {
    setSelectedBoard(board);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading variant="h1">Boards</Heading>
          <p className="text-muted-foreground">Manage design boards and tasks</p>
        </div>
        {canManage && (
          <CreateBoardDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            designers={designers}
            isLoading={createMutation.isPending}
            onSubmit={handleCreate}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Boards List</CardTitle>
              <CardDescription>
                Total: {pagination.total} board(s)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search boards..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('table')}
                  className="rounded-r-none"
                >
                  <Table2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-l-none"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <BoardsTable
              boards={boards}
              isLoading={isLoading}
              canManage={canManage}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ) : (
            <BoardsGrid
              boards={boards}
              isLoading={isLoading}
              canManage={canManage}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page === 1 || isLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {canManage && (
        <>
          <EditBoardDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            board={selectedBoard}
            designers={designers}
            isLoading={updateMutation.isPending}
            onSubmit={handleUpdate}
          />

          <DeleteBoardDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            board={boardToDelete}
            isLoading={deleteMutation.isPending}
            onConfirm={handleDeleteConfirm}
            onCancel={() => {
              setIsDeleteOpen(false);
              setBoardToDelete(null);
            }}
          />
        </>
      )}

      <BoardDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        board={selectedBoard}
      />
    </div>
  );
}

