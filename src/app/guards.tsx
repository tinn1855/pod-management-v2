import { Navigate, useLocation } from 'react-router-dom';
import { authUtils } from '@/lib/auth';
import { ROUTES } from '@/lib/constants';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthenticated = authUtils.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Redirect to change password if mustChangePassword is true and not already on change-password page
  const user = authUtils.getUser();
  if (
    user?.mustChangePassword === true &&
    location.pathname !== ROUTES.CHANGE_PASSWORD
  ) {
    return <Navigate to={ROUTES.CHANGE_PASSWORD} replace />;
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authUtils.isAuthenticated();

  if (isAuthenticated) {
    // If user must change password, redirect to change-password page
    const user = authUtils.getUser();
    if (user?.mustChangePassword) {
      return <Navigate to={ROUTES.CHANGE_PASSWORD} replace />;
    }
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
