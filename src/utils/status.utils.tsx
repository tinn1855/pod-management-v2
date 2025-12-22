import { Badge } from '@/components/ui/badge';

type UserStatus = 'ACTIVE' | 'INACTIVE';

interface StatusBadgeProps {
  status: string;
}

/**
 * Get badge variant based on status
 * @param status - User status
 * @returns Badge variant
 */
function getStatusBadgeVariant(status: string): 'default' | 'secondary' {
  const normalizedStatus = status.toUpperCase() as UserStatus;
  switch (normalizedStatus) {
    case 'ACTIVE':
      return 'default';
    case 'INACTIVE':
      return 'secondary';
    default:
      return 'secondary';
  }
}

/**
 * Status Badge component
 * @param status - User status
 * @returns Badge component with appropriate variant
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = getStatusBadgeVariant(status);
  return <Badge variant={variant}>{status}</Badge>;
}
