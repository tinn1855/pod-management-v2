import { Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { PaginationControls } from '@/utils/pagination.utils';
import { formatDate } from '@/utils/date.utils';
import type { Shop } from '@/types/shop.types';
import { Checkbox } from '@/components/ui/checkbox';

interface ShopsTableProps {
  shops: Shop[];
  isLoading: boolean;
  isInitialLoading: boolean;
  pagination: {
    page: number;
    totalPages: number;
  };
  selectedShopIds?: Set<string>;
  isAllSelected?: boolean;
  isSomeSelected?: boolean;
  onViewDetail: (shop: Shop) => void;
  onEdit: (shop: Shop) => void;
  onDelete: (id: string) => void;
  onSelectShop?: (shopId: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onPageChange: (page: number) => void;
}

export function ShopsTable({
  shops,
  isLoading,
  isInitialLoading,
  pagination,
  selectedShopIds = new Set(),
  isAllSelected = false,
  isSomeSelected = false,
  onViewDetail,
  onEdit,
  onDelete,
  onSelectShop,
  onSelectAll,
  onPageChange,
}: ShopsTableProps) {
  if (isInitialLoading) {
    return (
      <Table className="border-border border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-24 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No shops found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              {onSelectAll && (
                <Checkbox
                  checked={
                    isAllSelected ? true : isSomeSelected ? 'indeterminate' : false
                  }
                  onCheckedChange={(checked) =>
                    onSelectAll(checked === true)
                  }
                  aria-label="Select all shops"
                />
              )}
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shops.map((shop) => (
            <TableRow key={shop.id}>
              <TableCell>
                {onSelectShop && (
                  <Checkbox
                    checked={selectedShopIds.has(shop.id)}
                    onCheckedChange={(checked) =>
                      onSelectShop(shop.id, checked === true)
                    }
                    aria-label={`Select ${shop.name}`}
                  />
                )}
              </TableCell>
              <TableCell className="font-medium">{shop.name}</TableCell>
              <TableCell>
                {shop.platforms && shop.platforms.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {shop.platforms.map((platform) => (
                      <span
                        key={platform.id}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                      >
                        {platform.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>{shop.email || '-'}</TableCell>
              <TableCell>
                <span className="text-sm">{shop.status || 'Active'}</span>
              </TableCell>
              <TableCell>{formatDate(shop.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetail(shop)}
                  >
                    <Eye />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(shop)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => onDelete(shop.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination.totalPages > 1 && (
        <PaginationControls
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
