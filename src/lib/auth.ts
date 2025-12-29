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

// Refresh token stored in storage (for 401 refresh flow)
let refreshTokenInMemory: string | null = null;

export const authUtils = {
  getAccessToken: (): string | null => {
    // Access token stored in memory only
    return accessTokenInMemory;
  },

  getRefreshToken: (): string | null => {
    // Refresh token stored in memory only (not in storage)
    return refreshTokenInMemory;
  },

  setAccessTokenInMemory: (token: string | null): void => {
    accessTokenInMemory = token;
  },

  setRefreshTokenInMemory: (token: string | null): void => {
    refreshTokenInMemory = token;
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
    
    // Store refreshToken in memory only (not in storage)
    if (refreshToken) {
      refreshTokenInMemory = refreshToken;
    } else {
      refreshTokenInMemory = null;
    }
    
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
    refreshTokenInMemory = null; // Clear refresh token when using temp token
    
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
    
    // Update refreshToken in memory only (don't store it)
    if (refreshToken !== undefined) {
      refreshTokenInMemory = refreshToken || null;
    }
  },

  clearAuth: (): void => {
    // Clear memory
    accessTokenInMemory = null;
    refreshTokenInMemory = null;
    
    // Clear storage
    removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
    removeFromStorage(STORAGE_KEYS.TEMP_TOKEN);
    removeFromStorage(STORAGE_KEYS.USER);
    removeFromStorage(STORAGE_KEYS.REMEMBER_ME);
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getAccessToken();
  },
};

