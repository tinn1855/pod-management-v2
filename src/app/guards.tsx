import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authUtils } from '@/lib/auth';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = authUtils.getUser();
      const hasAccessToken = authUtils.isAuthenticated();

      // If user exists in storage but no accessToken (page reload), try to refresh
      if (user && !hasAccessToken) {
        try {
          // Try to refresh token using cookie
          const response = await authService.refreshToken();
          authUtils.updateTokens(response.accessToken);
          setIsAuthenticated(true);
        } catch (error) {
          // Refresh failed, user needs to login again
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(hasAccessToken);
      }

      setIsChecking(false);
    };

    checkAuth();
  }, []);

  // Show loading state while checking authentication
  if (isChecking) {
    return null; // or a loading spinner
  }

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
