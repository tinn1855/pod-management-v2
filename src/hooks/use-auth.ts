import { useState, useEffect } from 'react';
import { authUtils } from '@/lib/auth';
import type { User } from '@/types/auth.types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authUtils.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authUtils.isAuthenticated()
  );

  useEffect(() => {
    // Listen for storage changes (e.g., logout from another tab)
    const handleStorageChange = () => {
      setUser(authUtils.getUser());
      setIsAuthenticated(authUtils.isAuthenticated());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    user,
    isAuthenticated,
    accessToken: authUtils.getAccessToken(),
    refreshToken: authUtils.getRefreshToken(),
  };
}

