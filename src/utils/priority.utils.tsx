import { Badge } from '@/components/ui/badge';
import type { Board } from '@/types/board.types';

type Priority = Board['priority'];

interface PriorityBadgeProps {
  priority: Priority;
}

/**
 * Get badge variant based on priority
 */
function getPriorityBadgeVariant(
  priority: Priority
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (priority) {
    case 'URGENT':
      return 'destructive';
    case 'HIGH':
      return 'default';
    case 'MEDIUM':
      return 'secondary';
    case 'LOW':
      return 'outline';
    default:
      return 'secondary';
  }
}

/**
 * Priority Badge component
 */
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const variant = getPriorityBadgeVariant(priority);
  return <Badge variant={variant}>{priority}</Badge>;
}
