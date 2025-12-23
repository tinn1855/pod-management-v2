import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PAGINATION } from '@/constants';

interface ItemsPerPageSelectProps {
  value: number;
  onChange: (value: string) => void;
  options?: number[];
  label?: string;
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pagesAround?: number;
}

/**
 * Items Per Page Select component
 * Reusable component for selecting items per page in pagination
 * @param value - Current limit value
 * @param onChange - Callback when limit changes
 * @param options - Array of limit options (default: [10, 20, 50, 100])
 * @param label - Label text (default: "Showing per page:")
 */
export function ItemsPerPageSelect({
  value,
  onChange,
  options = PAGINATION.LIMIT_OPTIONS,
  label = 'Showing per page:',
}: ItemsPerPageSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div>
        <Select value={value.toString()} onValueChange={onChange}>
          <SelectTrigger className="min-w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-[80px]">
            {options.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

/**
 * Get className for Previous button based on current page
 */
function getPreviousPageClassName(currentPage: number): string {
  if (currentPage === 1) {
    return 'pointer-events-none opacity-50';
  }
  return 'cursor-pointer';
}

/**
 * Get className for Next button based on current page and total pages
 */
function getNextPageClassName(currentPage: number, totalPages: number): string {
  if (currentPage >= totalPages) {
    return 'pointer-events-none opacity-50';
  }
  return 'cursor-pointer';
}

/**
 * Check if Previous button is disabled
 */
function isPreviousDisabled(currentPage: number): boolean {
  return currentPage === 1;
}

/**
 * Check if Next button is disabled
 */
function isNextDisabled(currentPage: number, totalPages: number): boolean {
  return currentPage >= totalPages;
}

/**
 * Handle Previous page click
 */
function handlePreviousPageClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  currentPage: number,
  onPageChange: (page: number) => void
): void {
  e.preventDefault();
  if (currentPage > 1) {
    onPageChange(currentPage - 1);
  }
}

/**
 * Handle Next page click
 */
function handleNextPageClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
): void {
  e.preventDefault();
  if (currentPage < totalPages) {
    onPageChange(currentPage + 1);
  }
}

/**
 * Handle first page click
 */
function handleFirstPageClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  onPageChange: (page: number) => void
): void {
  e.preventDefault();
  onPageChange(1);
}

/**
 * Handle page number click
 */
function handlePageNumberClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  page: number,
  onPageChange: (page: number) => void
): void {
  e.preventDefault();
  onPageChange(page);
}

/**
 * Handle last page click
 */
function handleLastPageClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  totalPages: number,
  onPageChange: (page: number) => void
): void {
  e.preventDefault();
  onPageChange(totalPages);
}

/**
 * Render pagination items (page numbers with ellipsis)
 */
function renderPaginationItems(
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void,
  pagesAround = 2
): React.ReactNode[] {
  const items: React.ReactNode[] = [];

  // Always show first page
  if (currentPage > pagesAround + 1) {
    items.push(
      <PaginationItem key={1}>
        <PaginationLink onClick={(e) => handleFirstPageClick(e, onPageChange)}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > pagesAround + 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
  }

  // Show pages around current page
  const startPage = Math.max(1, currentPage - pagesAround);
  const endPage = Math.min(totalPages, currentPage + pagesAround);

  for (let i = startPage; i <= endPage; i++) {
    items.push(
      <PaginationItem key={i}>
        <PaginationLink
          onClick={(e) => handlePageNumberClick(e, i, onPageChange)}
          isActive={i === currentPage}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  // Always show last page
  if (currentPage < totalPages - pagesAround - 1) {
    if (currentPage < totalPages - pagesAround - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key={totalPages}>
        <PaginationLink
          onClick={(e) => handleLastPageClick(e, totalPages, onPageChange)}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return items;
}

/**
 * Pagination Controls component
 * Reusable pagination component with Previous/Next buttons and page numbers
 * @param currentPage - Current active page (1-based)
 * @param totalPages - Total number of pages
 * @param onPageChange - Callback when page changes
 * @param pagesAround - Number of pages to show around current page (default: 2)
 */
export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  pagesAround = PAGINATION.PAGES_AROUND,
}: PaginationControlsProps) {
  // Don't render if only one page or less
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) =>
              handlePreviousPageClick(e, currentPage, onPageChange)
            }
            className={getPreviousPageClassName(currentPage)}
            aria-disabled={isPreviousDisabled(currentPage)}
          />
        </PaginationItem>
        {renderPaginationItems(
          currentPage,
          totalPages,
          onPageChange,
          pagesAround
        )}
        <PaginationItem>
          <PaginationNext
            onClick={(e) =>
              handleNextPageClick(e, currentPage, totalPages, onPageChange)
            }
            className={getNextPageClassName(currentPage, totalPages)}
            aria-disabled={isNextDisabled(currentPage, totalPages)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
