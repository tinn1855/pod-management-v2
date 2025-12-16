import { Navigate, useLocation } from 'react-router-dom';
import { authUtils } from '@/lib/auth';
import { ROUTES } from '@/lib/constants';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthenticated = authUtils.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authUtils.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
