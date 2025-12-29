import type { User } from '@/types/auth.types';

export function canManageBoards(user: User | null): boolean {
  if (!user?.role?.name) return false;
  const roleName = user.role.name.toUpperCase();
  return roleName === 'ADMIN' || roleName === 'SUPER_ADMIN';
}

export function canViewBoards(user: User | null): boolean {
  if (!user?.role?.name) return false;
  const roleName = user.role.name.toUpperCase();
  return ['ADMIN', 'SUPER_ADMIN', 'DESIGN', 'CONTENT', 'SUPPLIER'].includes(
    roleName
  );
}
