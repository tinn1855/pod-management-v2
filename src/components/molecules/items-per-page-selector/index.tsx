import { useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PAGINATION } from '@/constants';

interface ItemsPerPageSelectorProps {
  total: number;
  currentLimit?: number;
  onLimitChange?: (limit: number) => void;
  options?: readonly number[];
  label?: string;
  className?: string;
}

/**
 * Items Per Page Selector component
 * Automatically syncs with URL params and manages limit state
 * Hides automatically when total is less than MIN_TOTAL_TO_SHOW_SELECTOR
 */
export function ItemsPerPageSelector({
  total,
  currentLimit,
  onLimitChange,
  options = PAGINATION.LIMIT_OPTIONS,
  label = 'Showing per page:',
  className,
}: ItemsPerPageSelectorProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get limit from URL or use currentLimit prop or default
  const limitFromUrl = parseInt(
    searchParams.get('limit') || String(currentLimit || PAGINATION.DEFAULT_LIMIT),
    10
  );
  const currentValue = currentLimit || limitFromUrl;

  const handleLimitChange = (value: string) => {
    const newLimit = parseInt(value, 10);
    
    // Update URL params
    const params: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      if (key !== 'limit' && key !== 'page') {
        params[key] = val;
      }
    });
    
    // Reset to page 1 when limit changes
    params.page = '1';
    params.limit = newLimit.toString();
    
    setSearchParams(params);
    
    // Notify parent component if callback provided
    if (onLimitChange) {
      onLimitChange(newLimit);
    }
  };

  // Hide if total is less than minimum
  if (total < PAGINATION.MIN_TOTAL_TO_SHOW_SELECTOR) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div>
        <Select
          value={currentValue.toString()}
          onValueChange={handleLimitChange}
        >
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

