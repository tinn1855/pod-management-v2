import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, Search, X } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import { useDebounce } from '@/hooks/use-debounce';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPermissionName } from '@/lib/utils';
import type { PermissionResponse } from '@/types/role.types';

export function PermissionsPage() {
  const { getPermissions, isLoading } = usePermissions();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allPermissions, setAllPermissions] = useState<PermissionResponse[]>(
    []
  );
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || ''
  );
  const debouncedSearchQuery = useDebounce(searchInput, 500);
  const [roleCountFilter, setRoleCountFilter] = useState<string>(
    searchParams.get('roleCountFilter') || 'all'
  );
  const [roleNameFilter, setRoleNameFilter] = useState<string>(
    searchParams.get('roleFilter') || 'all'
  );
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Get page and limit from URL params
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const limitFromUrl = parseInt(searchParams.get('limit') || '20', 10);

  const loadAllPermissions = async () => {
    setIsInitialLoading(true);
    const allData: PermissionResponse[] = [];
    let currentPage = 1;
    const maxLimit = 100; // API limit
    let hasMore = true;

    // Load all permissions by paginating through all pages
    while (hasMore) {
      const response = await getPermissions({
        page: currentPage,
        limit: maxLimit,
      });
      if (response && response.data.length > 0) {
        allData.push(...response.data);
        // Check if there are more pages
        hasMore = currentPage < response.totalPages;
        currentPage++;
      } else {
        hasMore = false;
      }
    }

    setAllPermissions(allData);
    setIsInitialLoading(false);
  };

  const loadPermissions = async (page: number, limit: number) => {
    await loadAllPermissions();
  };

  // Get unique roles from all permissions
  const availableRoles = useMemo(() => {
    const roleMap = new Map<string, string>();
    allPermissions.forEach((permission) => {
      permission.roles?.forEach((role) => {
        if (!roleMap.has(role.id)) {
          roleMap.set(role.id, role.name);
        }
      });
    });
    return Array.from(roleMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allPermissions]);

  // Filter and search permissions
  const filteredPermissions = useMemo(() => {
    let filtered = [...allPermissions];

    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (permission) =>
          formatPermissionName(permission.name).toLowerCase().includes(query) ||
          permission.name.toLowerCase().includes(query)
      );
    }

    // Apply role count filter
    if (roleCountFilter !== 'all') {
      filtered = filtered.filter((permission) => {
        const count =
          permission.roleCount !== undefined
            ? permission.roleCount
            : permission.roles?.length || 0;
        switch (roleCountFilter) {
          case 'none':
            return count === 0;
          case 'has-roles':
            return count > 0;
          default:
            return true;
        }
      });
    }

    // Apply role name filter
    if (roleNameFilter !== 'all') {
      filtered = filtered.filter((permission) => {
        return permission.roles?.some((role) => role.id === roleNameFilter);
      });
    }

    return filtered;
  }, [allPermissions, debouncedSearchQuery, roleCountFilter, roleNameFilter]);

  // Paginate filtered results
  const paginatedPermissions = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredPermissions.slice(start, end);
  }, [filteredPermissions, pagination.page, pagination.limit]);

  // Update pagination when filtered results change
  useEffect(() => {
    const totalPages = Math.ceil(filteredPermissions.length / pagination.limit);
    setPagination((prev) => {
      const newPage = prev.page > totalPages && totalPages > 0 ? 1 : prev.page;
      return {
        ...prev,
        page: newPage,
        total: filteredPermissions.length,
        totalPages: totalPages || 1,
      };
    });
  }, [filteredPermissions.length, pagination.limit]);

  useEffect(() => {
    // Initialize from URL params
    setPagination((prev) => ({
      ...prev,
      page: pageFromUrl,
      limit: limitFromUrl,
    }));
    loadPermissions(pageFromUrl, limitFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update displayed permissions when pagination changes
  useEffect(() => {
    setPermissions(paginatedPermissions);
  }, [paginatedPermissions]);

  // Update URL params when debounced search or filters change
  useEffect(() => {
    const params: Record<string, string> = {
      page: '1', // Reset to page 1 when search/filters change
      limit: pagination.limit.toString(),
    };
    if (debouncedSearchQuery.trim()) {
      params.search = debouncedSearchQuery;
    }
    if (roleCountFilter !== 'all') {
      params.roleCountFilter = roleCountFilter;
    }
    if (roleNameFilter !== 'all') {
      params.roleFilter = roleNameFilter;
    }
    setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, roleCountFilter, roleNameFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      const params: Record<string, string> = {
        page: newPage.toString(),
        limit: pagination.limit.toString(),
      };
      if (debouncedSearchQuery) {
        params.search = debouncedSearchQuery;
      }
      if (roleCountFilter !== 'all') {
        params.roleCountFilter = roleCountFilter;
      }
      if (roleNameFilter !== 'all') {
        params.roleFilter = roleNameFilter;
      }
      setSearchParams(params);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    const limit = parseInt(newLimit, 10);
    setPagination((prev) => ({ ...prev, page: 1, limit }));
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRoleCountFilterChange = (value: string) => {
    setRoleCountFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRoleNameFilterChange = (value: string) => {
    setRoleNameFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearSearch = () => {
    setSearchInput('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const renderPaginationItems = () => {
    const items = [];
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;

    // Always show first page
    if (currentPage > 3) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Show pages around current page
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Always show last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Permissions Management
          </h1>
          <p className="text-muted-foreground">
            View all available permissions in the system
          </p>
        </div>
      </div>

      {/* Permissions List Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissions List
              </CardTitle>
              <CardDescription>
                {pagination.total} permission{pagination.total !== 1 ? 's' : ''}
                {debouncedSearchQuery && ` matching "${debouncedSearchQuery}"`}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search permissions..."
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchInput && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Select
              value={roleNameFilter}
              onValueChange={handleRoleNameFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {availableRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={roleCountFilter}
              onValueChange={handleRoleCountFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Permissions</SelectItem>
                <SelectItem value="has-roles">Has Roles</SelectItem>
                <SelectItem value="none">No Roles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isInitialLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission Name</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Role Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-8" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : permissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No permissions found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission Name</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Role Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">
                      {formatPermissionName(permission.name)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[400px]">
                        {permission.roles && permission.roles.length > 0 ? (
                          permission.roles.map((role) => (
                            <span
                              key={role.id}
                              className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-md"
                            >
                              {role.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No roles assigned
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {permission.roleCount !== undefined
                        ? permission.roleCount
                        : permission.roles?.length || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="w-[100px]">
                <Select
                  value={pagination.limit.toString()}
                  onValueChange={handleLimitChange}
                  disabled={isLoading}
                >
                  <SelectTrigger id="limit-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="min-w-[100px]">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page > 1 && !isLoading) {
                            handlePageChange(pagination.page - 1);
                          }
                        }}
                        className={
                          pagination.page === 1 || isLoading
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            pagination.page < pagination.totalPages &&
                            !isLoading
                          ) {
                            handlePageChange(pagination.page + 1);
                          }
                        }}
                        className={
                          pagination.page >= pagination.totalPages || isLoading
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
