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
      const accessToken = authUtils.getAccessToken();

      // If already have access token, user is authenticated
      if (accessToken) {
        setIsAuthenticated(true);
        setIsChecking(false);
        return;
      }

      // If user exists in storage but no accessToken (page reload), try to refresh
      if (user) {
        try {
          // Try to refresh token using cookie
          // Skip interceptor by using axios directly (already done in authService.refreshToken)
          const response = await authService.refreshToken();
          authUtils.updateTokens(response.accessToken);
          setIsAuthenticated(true);
        } catch (error: any) {
          // Check if it's a network error or auth error
          const isAxiosError =
            error && typeof error === 'object' && 'isAxiosError' in error;
          const errorStatus = isAxiosError && error.response?.status;
          const errorMessage = isAxiosError && error.response?.data?.message;

          // Check if error is "Refresh token not found" - this means cookie is missing
          // This could happen if:
          // 1. Cookie was never set (login issue)
          // 2. Cookie expired
          // 3. Cookie domain/path mismatch
          if (errorStatus === 401 || errorStatus === 403) {
            // Check if it's specifically "Refresh token not found"
            if (
              errorMessage?.toLowerCase().includes('refresh token not found') ||
              errorMessage?.toLowerCase().includes('refresh token')
            ) {
              // Cookie is missing - user needs to login again
              // This is a legitimate auth failure
              authUtils.clearAuth();
              setIsAuthenticated(false);
            } else {
              // Other 401/403 errors - might be temporary, allow retry
              // User might still be logged in, just token refresh failed
              // The next API call will trigger interceptor to retry
              setIsAuthenticated(true);
            }
          } else {
            // Network error or other issue - still consider authenticated if user exists
            // The token refresh will be retried on next API call via interceptor
            // Allow user to stay on page - they might still be logged in
            setIsAuthenticated(true);
          }
        }
      } else {
        // No user and no token - definitely not authenticated
        setIsAuthenticated(false);
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
