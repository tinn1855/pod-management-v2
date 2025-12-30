import { STORAGE_KEYS } from '@/constants';
import type { User } from '@/types/auth.types';

// Helper to get storage based on rememberMe preference
function getStorage(rememberMe = true): Storage {
  return rememberMe ? localStorage : sessionStorage;
}

// Helper to get from either storage (check localStorage first, then sessionStorage)
function getFromStorage(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

// Helper to remove from both storages
function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

// Access token stored in memory only (not in storage)
let accessTokenInMemory: string | null = null;

// Note: RefreshToken is stored in httpOnly cookie, managed by browser
// We don't store it in memory or localStorage for security

export const authUtils = {
  getAccessToken: (): string | null => {
    // Access token stored in memory only
    return accessTokenInMemory;
  },

  getRefreshToken: (): string | null => {
    // RefreshToken is stored in httpOnly cookie, not accessible via JavaScript
    // This method is kept for backward compatibility but always returns null
    // The refreshToken is automatically sent by browser via cookies
    return null;
  },

  setAccessTokenInMemory: (token: string | null): void => {
    accessTokenInMemory = token;
  },

  getTempToken: (): string | null => {
    return getFromStorage(STORAGE_KEYS.TEMP_TOKEN);
  },

  getUser: (): User | null => {
    const userStr = getFromStorage(STORAGE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  setAuth: (
    accessToken: string,
    refreshToken: string | undefined,
    user: User,
    rememberMe = true
  ): void => {
    const storage = getStorage(rememberMe);
    
    // Clear from both storages first
    removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
    removeFromStorage(STORAGE_KEYS.USER);
    removeFromStorage(STORAGE_KEYS.TEMP_TOKEN);
    
    // Store accessToken in memory only (not in storage)
    accessTokenInMemory = accessToken;
    
    // Note: refreshToken is stored in httpOnly cookie by the server
    // We don't store it in localStorage/sessionStorage for security
    // The refreshToken parameter is kept for backward compatibility but ignored
    
    // Only store user and rememberMe preference in storage
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    storage.setItem(STORAGE_KEYS.REMEMBER_ME, JSON.stringify(rememberMe));
  },

  setTempToken: (tempToken: string, user: User, rememberMe = true): void => {
    const storage = getStorage(rememberMe);
    
    // Clear from both storages first
    removeFromStorage(STORAGE_KEYS.TEMP_TOKEN);
    removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeFromStorage(STORAGE_KEYS.USER);
    removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
    
    // Store tempToken in memory as accessToken
    accessTokenInMemory = tempToken;
    
    // Note: refreshToken is managed by browser via httpOnly cookie
    // No need to clear it manually
    
    // Store tempToken in storage for backward compatibility
    storage.setItem(STORAGE_KEYS.TEMP_TOKEN, tempToken);
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    storage.setItem(STORAGE_KEYS.REMEMBER_ME, JSON.stringify(rememberMe));
  },

  getRememberMe: (): boolean => {
    const rememberMeStr = getFromStorage(STORAGE_KEYS.REMEMBER_ME);
    if (!rememberMeStr) return true; // Default to true
    try {
      return JSON.parse(rememberMeStr) as boolean;
    } catch {
      return true;
    }
  },

  updateTokens: (
    accessToken: string,
    refreshToken?: string
  ): void => {
    // Update accessToken in memory only
    accessTokenInMemory = accessToken;
    
    // Note: refreshToken is stored in httpOnly cookie, managed by browser
    // The refreshToken parameter is kept for backward compatibility but ignored
    // Server automatically updates the refreshToken cookie when refreshing
  },

  clearAuth: (): void => {
    // Clear memory
    accessTokenInMemory = null;
    
    // Clear storage
    removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
    removeFromStorage(STORAGE_KEYS.TEMP_TOKEN);
    removeFromStorage(STORAGE_KEYS.USER);
    removeFromStorage(STORAGE_KEYS.REMEMBER_ME);
    
    // Note: refreshToken cookie is cleared by server on logout
    // No need to manually clear it from client side
  },

  isAuthenticated: (): boolean => {
    // Check if accessToken exists OR user exists in storage (which means logged in, just need to refresh)
    const accessToken = authUtils.getAccessToken();
    const user = authUtils.getUser();
    return !!accessToken || !!user;
  },
};

