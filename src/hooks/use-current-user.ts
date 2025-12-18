import { useState, useEffect } from 'react';
import { authUtils } from '@/lib/auth';
import type { User } from '@/types/auth.types';

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(() => authUtils.getUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for storage changes (e.g., login/logout from another tab)
    const handleStorageChange = () => {
      setUser(authUtils.getUser());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { user, isLoading, error: null };
}

